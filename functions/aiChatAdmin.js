// =================================================
// AI CHAT — ADMIN ASSISTANT (Phase 2)
//
// এটা customer-facing aiChat.js থেকে সম্পূর্ণ আলাদা, নিজস্ব
// callable function। কেন আলাদা রাখা হয়েছে:
//
// - Customer চ্যাটে stock/price/order-status বদলানোর মতো কোনো
//   ক্ষমতা নেই — এই ফাংশনটাই শুধু সেই ক্ষমতা রাখে।
// - প্রতিটা রিকোয়েস্টে সবার আগে caller-এর Firebase Auth uid
//   Firestore users/{uid} ডকুমেন্টে গিয়ে role === "admin"
//   কিনা যাচাই করা হয় — এটা fail করলে কোনো tool চালানো তো দূরের
//   কথা, provider (Gemini/Groq)-কেও কল করা হয় না।
// - এভাবে customer chat এবং admin chat কখনো একই কোড path শেয়ার
//   করে না, যাতে ভুলবশত কোনো bug-এর কারণে admin ক্ষমতা customer
//   চ্যাটে leak না করে।
// =================================================

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

const {
  getDeliveryInfo,
  searchProducts,
  checkStock,
  _getOrderStatus,
  _getAdminContact,
  _generateInvoiceText,
  _generateInvoicePdf,
} = require("./aiChatTools");

const {
  VALID_ORDER_STATUSES,
  updateProductStock,
  updateProductPrice,
  updateOrderStatus,
  listRecentOrders,
  getTrafficAnalytics,
} = require("./aiChatAdminTools");

const geminiProvider = require("./aiProviders/geminiProvider");
const groqProvider = require("./aiProviders/groqProvider");

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const groqApiKey = defineSecret("GROQ_API_KEY");

const SYSTEM_PROMPT = `
আপনি Dream Mode-এর Admin Assistant — শুধুমাত্র দোকানের Admin-এর
জন্য, এটা কাস্টমার-ফেসিং চ্যাট না।

ভাষা ও কথার ধরন:
- Admin বাংলায় লিখলে বাংলায়, ইংরেজিতে লিখলে ইংরেজিতে জবাব দিন।
- সংক্ষিপ্ত, পেশাদার, কাজের কথা — অতিরিক্ত ভূমিকা/সৌজন্যতা ছাড়াই
  সরাসরি কাজ করে দিন, যেন একজন দক্ষ অ্যাসিস্ট্যান্ট ম্যানেজার কথা
  বলছে।

আপনি যা করতে পারেন:
- স্টক আপডেট করা (update_product_stock)
- দাম/অফার দাম আপডেট করা (update_product_price)
- অর্ডারের status বদলানো (update_order_status) — শুধু এই
  status-গুলোর একটা হতে পারে: ${VALID_ORDER_STATUSES.join(", ")}
- সাম্প্রতিক অর্ডার/নির্দিষ্ট status-এর অর্ডার লিস্ট দেখা
  (list_recent_orders)
- ওয়েবসাইট ট্রাফিক/ভিজিটর দেখা — মোট পেজভিউ, ইউনিক ভিজিটর,
  এখন লাইভ কতজন আছে, কোন পেজ কতবার দেখা হয়েছে ও গড়ে কতক্ষণ ধরে
  দেখা হয়েছে (get_traffic_analytics)
- প্রোডাক্ট খোঁজা, স্টক চেক করা, অর্ডার status/ইনভয়েস (টেক্সট ও
  PDF) দেখা — এগুলো read-only, ঝুঁকিহীন

গুরুত্বপূর্ণ নিয়ম:
- যেকোনো ধ্বংসাত্মক/অপরিবর্তনীয় action (স্টক ০ করা, অর্ডার
  Cancelled করা, বড় দাম পরিবর্তন) করার আগে Admin-কে একবার
  সংক্ষেপে নিশ্চিত করে নিন ("Confirm করছেন?") — যদি Admin-এর
  বার্তায় already স্পষ্ট নির্দেশ/নিশ্চয়তা না থাকে।
- productId/orderId নিজে থেকে অনুমান করবেন না — আগে
  search_products/list_recent_orders দিয়ে সঠিক আইটেম খুঁজে বের
  করুন, তারপর সেই ফলাফলের আসল id দিয়ে update tool কল করুন।
- কোনো update সফল হলে সংক্ষেপে নিশ্চিত করুন (আগের মান → নতুন মান)।
- markdown টেবিল ব্যবহার করবেন না, স্বাভাবিক ভাষায় লিখুন।
`.trim();

const TOOLS = [
  {
    name: "search_products",
    description: "নাম/ক্যাটাগরি দিয়ে প্রোডাক্ট খুঁজুন (এখান থেকে productId পাবেন)।",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string" },
      },
    },
  },
  {
    name: "check_stock",
    description: "নির্দিষ্ট প্রোডাক্টের বর্তমান স্টক ও দাম চেক করুন।",
    input_schema: {
      type: "object",
      properties: { productId: { type: "string" } },
      required: ["productId"],
    },
  },
  {
    name: "update_product_stock",
    description: "একটা প্রোডাক্টের স্টক সংখ্যা আপডেট করুন।",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        stock: { type: "number" },
      },
      required: ["productId", "stock"],
    },
  },
  {
    name: "update_product_price",
    description: "একটা প্রোডাক্টের দাম এবং/অথবা অফার দাম আপডেট করুন।",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        price: { type: "number" },
        offerPrice: { type: "number" },
      },
      required: ["productId"],
    },
  },
  {
    name: "list_recent_orders",
    description: "সাম্প্রতিক অর্ডার লিস্ট দেখুন, চাইলে status দিয়ে filter করে।",
    input_schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: `একটা হতে হবে: ${VALID_ORDER_STATUSES.join(", ")}`,
        },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "get_order_status",
    description: "একটা নির্দিষ্ট অর্ডারের বিস্তারিত দেখুন।",
    input_schema: {
      type: "object",
      properties: { orderId: { type: "string" } },
      required: ["orderId"],
    },
  },
  {
    name: "update_order_status",
    description: "একটা অর্ডারের status বদলান।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        status: {
          type: "string",
          description: `একটা হতে হবে: ${VALID_ORDER_STATUSES.join(", ")}`,
        },
      },
      required: ["orderId", "status"],
    },
  },
  {
    name: "generate_invoice_pdf",
    description: "একটা অর্ডারের জন্য PDF ইনভয়েস বানান।",
    input_schema: {
      type: "object",
      properties: { orderId: { type: "string" } },
      required: ["orderId"],
    },
  },
  {
    name: "get_delivery_info",
    description: "ডেলিভারি চার্জের নিয়ম দেখুন।",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_traffic_analytics",
    description:
      "ওয়েবসাইট ট্রাফিক/ভিজিটর অ্যানালিটিক্স দেখুন — মোট পেজভিউ, ইউনিক " +
      "ভিজিটর সংখ্যা, এখন লাইভ কতজন আছে, কোন পেজ সবচেয়ে বেশি দেখা " +
      "হয়েছে এবং প্রতিটা পেজে ভিজিটররা গড়ে কতক্ষণ সময় কাটিয়েছে।",
    input_schema: {
      type: "object",
      properties: {
        hours: {
          type: "number",
          description:
            "কত ঘণ্টার ডেটা দেখতে চান (ডিফল্ট ২৪ ঘণ্টা, সর্বোচ্চ ৭২০ অর্থাৎ ৩০ দিন)।",
        },
      },
    },
  },
];

async function runTool(name, input) {

  switch (name) {

    case "search_products":
      return searchProducts(input);

    case "check_stock":
      return checkStock(input);

    case "update_product_stock":
      return updateProductStock(input);

    case "update_product_price":
      return updateProductPrice(input);

    case "list_recent_orders":
      return listRecentOrders(input);

    case "get_order_status":
      // Admin-এর জন্য uid/phone ম্যাচ লাগবে না — কিন্তু
      // getOrderStatus নিজে সেই চেক করে, তাই এখানে caller-এর
      // uid না পাঠিয়ে Admin bypass দেওয়া হচ্ছে সরাসরি Firestore
      // থেকে, ownership চেক এড়িয়ে (নিচের adminGetOrder দেখুন)।
      return adminGetOrder(input.orderId);

    case "update_order_status":
      return updateOrderStatus(input);

    case "generate_invoice_pdf": {

      const order = await adminGetOrder(input.orderId, true);

      if (order.error) return order;

      const { generateInvoicePdfForOrder } = require("./pdfInvoice");
      const { pdfUrl } = await generateInvoicePdfForOrder({
        order: order.raw,
        orderId: input.orderId,
      });

      return { pdfUrl, orderId: input.orderId };

    }

    case "get_delivery_info":
      return getDeliveryInfo(input);

    case "get_traffic_analytics":
      return getTrafficAnalytics(input);

    default:
      return { error: `Unknown tool: ${name}` };

  }

}

// Admin-এর জন্য যেকোনো অর্ডার দেখার আলাদা হেল্পার (customer-facing
// getOrderStatus-এর uid/phone ownership চেক এখানে প্রযোজ্য না,
// কারণ caller আগেই admin হিসেবে verified)।
async function adminGetOrder(orderId, includeRaw = false) {

  if (!orderId) return { error: "orderId প্রয়োজন।" };

  const snap = await admin.firestore().collection("orders").doc(orderId).get();

  if (!snap.exists) return { error: "এই অর্ডারটা খুঁজে পাওয়া যায়নি।" };

  const order = snap.data();

  const result = {
    id: snap.id,
    status: order.status || "Pending",
    paymentStatus: order.paymentStatus || "Pending",
    customerName: order.customerName || "",
    phone: order.phone || "",
    total: order.total || 0,
    items: (order.items || []).map((i) => ({
      name: i.name || i.title || "Item",
      qty: i.qty || i.quantity || 1,
      price: i.price || 0,
    })),
    createdAt: order.createdAt || "",
  };

  if (includeRaw) result.raw = order;

  return result;

}

function collectUiData(collected, toolName, output) {

  if (!output || output.error) return;

  if (toolName === "search_products" && Array.isArray(output)) {

    for (const p of output) {
      if (p && p.id && !collected.products.some((x) => x.id === p.id)) {
        collected.products.push(p);
      }
    }

  } else if (toolName === "check_stock" && output.id) {

    if (!collected.products.some((x) => x.id === output.id)) {
      collected.products.push(output);
    }

  } else if (toolName === "list_recent_orders" && Array.isArray(output.orders)) {

    for (const o of output.orders) {
      if (o && o.id && !collected.orders.some((x) => x.id === o.id)) {
        collected.orders.push(o);
      }
    }

  } else if (toolName === "get_order_status" && output.id) {

    if (!collected.orders.some((x) => x.id === output.id)) {
      collected.orders.push(output);
    }

  } else if (toolName === "generate_invoice_pdf" && output.pdfUrl) {

    collected.invoice = { orderId: output.orderId, pdfUrl: output.pdfUrl };

  }

}

async function sendTurnWithRetry(attempt, args) {

  try {

    return await attempt.provider.sendTurn(args);

  } catch (err) {

    if (err.status === 429) {

      console.error(`AI CHAT ADMIN — "${attempt.key}" rate-limited, retrying once...`);
      await new Promise((r) => setTimeout(r, 1500));
      return await attempt.provider.sendTurn(args);

    }

    throw err;

  }

}

async function runConversation({ attempt, genericMessages }) {

  if (!attempt.apiKey) {

    const err = new Error(`${attempt.key} — API key সেট করা নেই।`);
    err.status = 401;
    throw err;

  }

  let conversation = genericMessages;

  const collected = { products: [], orders: [], invoice: null };

  for (let i = 0; i < 6; i++) {

    const result = await sendTurnWithRetry(attempt, {
      apiKey: attempt.apiKey,
      systemPrompt: SYSTEM_PROMPT,
      tools: TOOLS,
      genericMessages: conversation,
    });

    conversation = [
      ...conversation,
      { role: "assistant", parts: result.assistantParts },
    ];

    if (!result.toolCalls.length) {
      return { text: result.textReply || "", ...collected };
    }

    const toolResultParts = [];

    for (const call of result.toolCalls) {

      const output = await runTool(call.name, call.input);

      collectUiData(collected, call.name, output);

      toolResultParts.push({
        type: "tool_result",
        id: call.id,
        name: call.name,
        output,
      });

    }

    conversation = [
      ...conversation,
      { role: "user", parts: toolResultParts },
    ];

  }

  return {
    text: "দুঃখিত, এই মুহূর্তে অনুরোধটা প্রসেস করতে পারছি না। আবার চেষ্টা করুন।",
    ...collected,
  };

}

exports.aiChatAdmin = onCall(
  { secrets: [geminiApiKey, groqApiKey] },
  async (request) => {

    try {

      // ==========================================================
      // ⚠️ সবার আগে, প্রতিটা রিকোয়েস্টে — Admin verification।
      // এটা fail করলে কোনো tool তো দূরের কথা, কোনো AI provider-কেও
      // কল করা হয় না। এটাই এই পুরো ফাইলের নিরাপত্তার ভিত্তি।
      // ==========================================================

      if (!request.auth) {

        throw new HttpsError(
          "unauthenticated",
          "Admin হিসেবে Login করা প্রয়োজন।"
        );

      }

      const uid = request.auth.uid;

      const userSnap = await admin.firestore().collection("users").doc(uid).get();

      const role = (userSnap.exists && userSnap.data().role) || "user";

      if (role !== "admin") {

        console.error(`AI CHAT ADMIN — unauthorized access attempt by uid: ${uid}`);

        throw new HttpsError(
          "permission-denied",
          "এই ফিচারটা শুধুমাত্র Admin-দের জন্য।"
        );

      }

      // ==========================================================

      const { messages } = request.data || {};

      if (!messages || !Array.isArray(messages) || !messages.length) {

        throw new HttpsError("invalid-argument", "Missing chat messages.");

      }

      const MAX_HISTORY_MESSAGES = 16;
      const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);

      const genericMessages = trimmedMessages.map((m) => ({
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      }));

      const fullChain = [
        { key: "gemini", provider: geminiProvider, apiKey: geminiApiKey.value() },
        { key: "groq-llama-3.3-70b", provider: groqProvider, apiKey: groqApiKey.value() },
      ];

      let lastError = null;

      for (const attempt of fullChain) {

        try {

          const result = await runConversation({ attempt, genericMessages });

          return {
            reply: result.text,
            providerUsed: attempt.key,
            products: result.products,
            orders: result.orders,
            invoice: result.invoice,
          };

        } catch (err) {

          console.error(`AI CHAT ADMIN — "${attempt.key}" failed:`, err.message);
          lastError = err;
          continue;

        }

      }

      throw lastError || new Error("সব provider ব্যর্থ হয়েছে।");

    } catch (error) {

      if (error instanceof HttpsError) throw error;

      console.error("AI CHAT ADMIN ERROR:", error);

      throw new HttpsError(
        "internal",
        `AI_CHAT_ADMIN_ERROR: ${error.message || error}`
      );

    }

  }
);
