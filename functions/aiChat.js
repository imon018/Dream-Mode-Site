// =================================================
// AI CHAT — MAIN AGENT
//
// Fallback ক্রম (একটা fail করলে/rate-limit হলে পরেরটা try করবে):
//
//   1. Gemini (ফ্রি, প্রধান)
//   2. OpenRouter: Qwen        (ফ্রি)
//   3. OpenRouter: Llama       (ফ্রি)
//   4. OpenRouter: Mistral     (ফ্রি)
//   5. OpenRouter: DeepSeek    (ফ্রি)
//
// (OpenAI/ChatGPT ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে — পুরো সিস্টেম
// এখন সম্পূর্ণ ফ্রি প্রোভাইডারের উপর নির্ভরশীল।)
//
// frontend থেকে { provider: "gemini" } ইত্যাদি পাঠিয়ে জোর করে
// একটা নির্দিষ্ট ধাপ থেকে শুরু করানোও যাবে (ডিবাগের জন্য কাজে
// লাগবে), না দিলে ডিফল্ট পুরো চেইন উপর থেকে try হবে।
// =================================================

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const {
  searchProducts,
  checkStock,
  getOrderStatus,
  getOrdersByPhone,
  getAdminContact,
  createOrderViaChat,
  generateInvoiceText,
} = require("./aiChatTools");

const geminiProvider = require("./aiProviders/geminiProvider");
const { openRouterAttempts } = require("./aiProviders/openRouterProvider");

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const openRouterApiKey = defineSecret("OPENROUTER_API_KEY");

const SYSTEM_PROMPT = `
আপনি Dream Mode-এর কাস্টমার সাপোর্ট ও অর্ডার সহকারী AI।

ভাষা ও কথা বলার ধরন:
- কাস্টমার বাংলায় লিখলে বাংলায়, ইংরেজিতে লিখলে ইংরেজিতে জবাব দিন।
  মিশিয়ে (বাংলিশ) লিখলে স্বাভাবিকভাবে সেভাবেই জবাব দিতে পারেন।
- একদম মানুষের মতো, স্বাভাবিক, বন্ধুত্বপূর্ণভাবে কথা বলুন — রোবটিক,
  অতিরিক্ত ফরমাল বা কপি-পেস্ট করা মেসেজের মতো শোনাবেন না।
- ছোট, স্বাভাবিক বাক্যে কথা বলুন, দরকার ছাড়া লম্বা লিস্ট/বুলেট
  পয়েন্ট ব্যবহার করবেন না — যেন সত্যিকারের একজন সহকারীর সাথে চ্যাট
  করছেন এমন মনে হয়।
- কখনো markdown টেবিল (| | | এভাবে) ব্যবহার করবেন না — এটা চ্যাটে
  ভেঙে-ভেঙে/অগোছালো দেখায়। একাধিক প্রোডাক্ট দেখাতে হলে সহজ ভাষায়,
  ছোট ছোট লাইনে লিখুন (যেমন: "Dubai Gold Bowl Jewellery — অফার
  দামে ৳৫৫০ (আগে ৳৯৯৯), স্টকে ২০টা আছে")।
- প্রোডাক্টের internal ID (যেমন ডাটাবেস ডকুমেন্ট আইডি) কখনো
  কাস্টমারকে টেক্সটে লিখে দেখাবেন না — এটা কাস্টমারের কোনো কাজে
  লাগে না, শুধু নাম, দাম, স্টক এসব বলুন। (প্রোডাক্ট কার্ড আলাদাভাবে,
  স্বয়ংক্রিয়ভাবে UI-তে দেখানো হয় — এটা নিয়ে আপনাকে কিছু করতে হবে
  না, নিচে বিস্তারিত আছে।)
- আপনি ঠিক যেভাবে একজন দক্ষ, মনোযোগী মানুষ সাপোর্ট এজেন্ট কথা
  বলে, বুঝে, এবং প্রয়োজনে নিজে থেকে পরবর্তী ধাপ এগিয়ে নেয় —
  ঠিক সেভাবেই কাজ করুন। কাস্টমার একটা কথা বললে তার আসল উদ্দেশ্য
  বুঝে সেই অনুযায়ী সঠিক tool কল করুন, শুধু কথার আক্ষরিক অর্থ ধরে
  বসে থাকবেন না।

প্রোডাক্ট দেখানো (কার্ড):
- কাস্টমার কোনো প্রোডাক্ট খুঁজতে/দেখতে চাইলে search_products বা
  check_stock কল করুন — এগুলোর রেজাল্ট থেকে UI নিজে থেকেই প্রোডাক্ট
  কার্ড (ছবি, নাম, দাম, স্টক) দেখিয়ে দেবে। তাই আপনার টেক্সট
  রিপ্লাইতে প্রতিটা প্রোডাক্টের সব ডিটেইল আবার লম্বাভাবে লিখে
  দেওয়ার দরকার নেই — একটা ছোট, স্বাভাবিক বাক্যে বলুন (যেমন: "এই
  কয়েকটা পেয়েছি, নিচে দেখে নিন 👇" বা "হ্যাঁ, স্টকে আছে, দাম আর
  ছবি নিচে দেখুন")। প্রোডাক্ট না পেলে সেটা বলুন এবং বিকল্প কিছু
  সাজেস্ট করুন বা admin-এর সাথে কথা বলার অপশন দিন।

অর্ডার স্ট্যাটাস (কাস্টমার Order ID না জানলেও):
- কাস্টমার "আমার প্রোডাক্টের কি অবস্থা/আমার অর্ডার কই" এই ধরনের
  কিছু জিজ্ঞেস করলে প্রথমেই Order ID চাইবেন না — বেশিরভাগ কাস্টমার
  এটা মনে রাখে না। বরং:
  1) কাস্টমার লগইন করা থাকলে (uid থাকলে) সরাসরি get_orders_by_phone
     কল করুন (phone ছাড়াই, লগইন তথ্য দিয়েই কাজ হয়ে যাবে)।
  2) লগইন করা না থাকলে কাস্টমারের কাছে শুধু ফোন নাম্বার (যেটা
     দিয়ে অর্ডার করেছিল) চান, তারপর get_orders_by_phone কল করুন।
  3) একাধিক অর্ডার পেলে সংক্ষেপে লিস্ট দেখান (স্ট্যাটাস সহ) এবং
     কোনটার বিস্তারিত/ইনভয়েস লাগবে জিজ্ঞেস করুন। একটাই অর্ডার
     পেলে সরাসরি তার অবস্থা জানিয়ে দিন।
  4) কাস্টমার নিজে থেকেই Order ID বলে দিলে সরাসরি get_order_status
     ব্যবহার করুন।

Admin/মানুষের সাথে কথা বলা:
- কাস্টমার Admin/মানুষ/সাপোর্ট এজেন্টের সাথে সরাসরি কথা বলতে চাইলে,
  আপনি সমাধান করতে না পারলে, বা কাস্টমার নিজে থেকে অনুরোধ করলে —
  get_admin_contact কল করে WhatsApp নাম্বার/লিংক বের করে সেটা
  স্বাভাবিকভাবে দিয়ে দিন (যেমন: "নিশ্চয়ই, এই WhatsApp নাম্বারে
  সরাসরি যোগাযোগ করতে পারেন: [নাম্বার]")। কখনো নিজে থেকে কোনো
  নাম্বার অনুমান করে বলবেন না — সবসময় tool কল করেই আসল নাম্বার
  নিন।

নিয়মাবলী:
- প্রোডাক্টের দাম/স্টক নিয়ে কখনো নিজে থেকে অনুমান করবেন না —
  সবসময় tool কল করে আসল তথ্য নিয়ে বলুন।
- search_products কল করার সময় কাস্টমার ঠিক যে ভাষায়/বানানে
  শব্দ লিখেছে (বাংলা হলে বাংলা, ইংরেজি হলে ইংরেজি) হুবহু সেটাই
  query/category প্যারামিটারে দিন — নিজে থেকে ইংরেজিতে অনুবাদ
  করবেন না। অনুবাদ করলে আসল ডাটাবেসের (যেটা বাংলায় লেখা) সাথে
  না মিলে ভুলভাবে "প্রোডাক্ট নেই" দেখাতে পারে।
- অর্ডার নেওয়ার আগে অবশ্যই কাস্টমারের নাম, ফোন নাম্বার, পূর্ণ
  ঠিকানা এবং কোন প্রোডাক্ট কয়টা লাগবে — এই তথ্যগুলো নিশ্চিত করে
  নিন। কোনো তথ্য অস্পষ্ট থাকলে অর্ডার কনফার্ম না করে জিজ্ঞেস করুন।
- অর্ডার করার আগে একবার সংক্ষেপে সারমর্ম (প্রোডাক্ট, দাম, ঠিকানা,
  মোট) দেখিয়ে কাস্টমারের কাছে নিশ্চিত হয়ে নিন, তারপর create_order
  কল করুন।
- এখন শুধু Cash on Delivery সাপোর্ট করা হচ্ছে।
- অর্ডার স্ট্যাটাস/ইনভয়েস দেখানোর আগে ফোন নাম্বার দিয়ে যাচাই
  করে নিন, যদি কাস্টমার লগইন করা না থাকে।
- স্টক/দাম পরিবর্তনের মতো কাজ আপনি করতে পারবেন না — এটা শুধু
  Admin-রাই করতে পারেন, এমন অনুরোধ এলে বিনয়ের সাথে জানিয়ে দিন,
  এবং প্রয়োজনে get_admin_contact দিয়ে WhatsApp নাম্বার দিন।
- কোনো tool থেকে error এলে সেটা কাস্টমারকে সহজ ভাষায়, বিনয়ের
  সাথে জানান এবং পরবর্তী করণীয় (আবার চেষ্টা/সঠিক তথ্য দেওয়া/
  admin-এর সাথে কথা বলা) বলে দিন — কখনো raw error টেক্সট দেখাবেন
  না।
`.trim();

const TOOLS = [
  {
    name: "search_products",
    description: "নাম/ক্যাটাগরি/বর্ণনা দিয়ে প্রোডাক্ট খুঁজুন।",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "সার্চ টেক্সট" },
        category: { type: "string", description: "ক্যাটাগরি (ঐচ্ছিক)" },
      },
    },
  },
  {
    name: "check_stock",
    description: "নির্দিষ্ট প্রোডাক্টের বর্তমান স্টক ও দাম চেক করুন।",
    input_schema: {
      type: "object",
      properties: {
        productId: { type: "string" },
      },
      required: ["productId"],
    },
  },
  {
    name: "get_order_status",
    description: "একটা অর্ডারের বর্তমান অবস্থা দেখুন।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        phone: {
          type: "string",
          description: "যাচাইয়ের জন্য কাস্টমারের ফোন নাম্বার (যদি লগইন করা না থাকে)",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "get_orders_by_phone",
    description:
      "কাস্টমার Order ID না জানলে, তার ফোন নাম্বার (বা লগইন থাকলে " +
      "একাউন্ট) দিয়ে সাম্প্রতিক অর্ডারগুলো খুঁজে বের করুন।",
    input_schema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description:
            "কাস্টমারের ফোন নাম্বার (যদি লগইন করা না থাকে — লগইন " +
            "থাকলে খালি রাখা যাবে)",
        },
      },
    },
  },
  {
    name: "get_admin_contact",
    description:
      "Admin/মানুষের সাথে সরাসরি কথা বলার জন্য WhatsApp নাম্বার/লিংক " +
      "বের করুন।",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_order",
    description:
      "কাস্টমারের তথ্য কনফার্ম হওয়ার পর নতুন অর্ডার তৈরি করুন (শুধু Cash on Delivery)।",
    input_schema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        thana: { type: "string" },
        district: { type: "string" },
        notes: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              productId: { type: "string" },
              qty: { type: "number" },
            },
            required: ["productId", "qty"],
          },
        },
      },
      required: ["customerName", "phone", "address", "items"],
    },
  },
  {
    name: "generate_invoice",
    description: "একটা অর্ডারের জন্য টেক্সট ইনভয়েস বানান।",
    input_schema: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        phone: { type: "string" },
      },
      required: ["orderId"],
    },
  },
];

async function runTool(name, input, context) {

  switch (name) {

    case "search_products":
      return searchProducts(input);

    case "check_stock":
      return checkStock(input);

    case "get_order_status":
      return getOrderStatus({ ...input, uid: context.uid });

    case "get_orders_by_phone":
      return getOrdersByPhone({ ...input, uid: context.uid });

    case "get_admin_contact":
      return getAdminContact();

    case "create_order":
      return createOrderViaChat({ ...input, uid: context.uid });

    case "generate_invoice":
      return generateInvoiceText({ ...input, uid: context.uid });

    default:
      return { error: `Unknown tool: ${name}` };

  }

}

// -------------------------------------------------
// tool রেজাল্ট থেকে UI-এর জন্য গুরুত্বপূর্ণ structured ডেটা
// (প্রোডাক্ট কার্ড, অর্ডার লিস্ট, admin contact) আলাদাভাবে জমা
// করা — যাতে টেক্সট রিপ্লাইয়ের পাশাপাশি frontend সেগুলো কার্ড/
// বাটন হিসেবে সুন্দরভাবে দেখাতে পারে। AI নিজে থেকে এসব টেক্সটে
// বিস্তারিত না লিখলেও (system prompt-এ বলা আছে সংক্ষেপে লিখতে),
// কাস্টমার আসল ডেটা (ছবি, দাম, WhatsApp বাটন) ঠিকই দেখতে পাবে।
// -------------------------------------------------
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

  } else if (toolName === "get_orders_by_phone" && Array.isArray(output.orders)) {

    for (const o of output.orders) {
      if (o && o.id && !collected.orders.some((x) => x.id === o.id)) {
        collected.orders.push(o);
      }
    }

  } else if (toolName === "get_order_status" && output.id) {

    if (!collected.orders.some((x) => x.id === output.id)) {
      collected.orders.push(output);
    }

  } else if (toolName === "get_admin_contact" && output.whatsapp) {

    collected.adminContact = output;

  }

}

// -------------------------------------------------
// একটা নির্দিষ্ট provider attempt দিয়ে পুরো tool-use loop চালানো
// -------------------------------------------------
async function runConversation({ attempt, genericMessages, uid }) {

  if (!attempt.apiKey) {

    const err = new Error(`${attempt.key} — API key সেট করা নেই।`);
    err.status = 401;
    throw err;

  }

  let conversation = genericMessages;

  const collected = { products: [], orders: [], adminContact: null };

  for (let i = 0; i < 5; i++) {

    const result = await attempt.provider.sendTurn({
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

      const output = await runTool(call.name, call.input, { uid });

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
    text:
      "দুঃখিত, এই মুহূর্তে অনুরোধটা প্রসেস করতে পারছি না। " +
      "আবার চেষ্টা করুন বা সরাসরি WhatsApp-এ যোগাযোগ করুন।",
    ...collected,
  };

}

exports.aiChat = onCall(
  { secrets: [geminiApiKey, openRouterApiKey] },
  async (request) => {

    try {

      const { messages, provider } = request.data || {};

      if (!messages || !Array.isArray(messages) || !messages.length) {

        throw new HttpsError(
          "invalid-argument",
          "Missing chat messages."
        );

      }

      const uid = request.auth?.uid || null;

      const genericMessages = messages.map((m) => ({
        role: m.role,
        parts: [{ type: "text", text: m.content }],
      }));

      const openRouterKeyValue = openRouterApiKey.value();

      // পুরো fallback চেইন — উপর থেকে নিচে ক্রমানুসারে try হবে
      const fullChain = [
        { key: "gemini", provider: geminiProvider, apiKey: geminiApiKey.value() },
        ...openRouterAttempts.map((a) => ({
          key: a.key,
          provider: a.provider,
          apiKey: openRouterKeyValue,
        })),
      ];

      // frontend থেকে নির্দিষ্ট provider চাইলে (ডিবাগের জন্য) শুধু
      // ওই একটা key-match করা ধাপগুলো নিয়ে চেইন বানানো হচ্ছে।
      const chain = provider
        ? fullChain.filter((a) => a.key.startsWith(provider))
        : fullChain;

      let lastError = null;

      for (const attempt of chain) {

        try {

          const result = await runConversation({
            attempt,
            genericMessages,
            uid,
          });

          return {
            reply: result.text,
            providerUsed: attempt.key,
            products: result.products,
            orders: result.orders,
            adminContact: result.adminContact,
          };

        } catch (err) {

          console.log(`AI CHAT — "${attempt.key}" failed:`, err.message);
          lastError = err;
          continue; // পরের provider/মডেল চেষ্টা করবে

        }

      }

      throw lastError || new Error("সব provider ব্যর্থ হয়েছে।");

    } catch (error) {

      console.log("AI CHAT ERROR:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        `AI_CHAT_ERROR: ${error.message || error}`
      );

    }

  }
);
