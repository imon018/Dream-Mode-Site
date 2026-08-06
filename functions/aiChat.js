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

নিয়মাবলী:
- প্রোডাক্টের দাম/স্টক নিয়ে কখনো নিজে থেকে অনুমান করবেন না —
  সবসময় tool কল করে আসল তথ্য নিয়ে বলুন।
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
  Admin-রাই করতে পারেন, এমন অনুরোধ এলে বিনয়ের সাথে জানিয়ে দিন।
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

    case "create_order":
      return createOrderViaChat({ ...input, uid: context.uid });

    case "generate_invoice":
      return generateInvoiceText({ ...input, uid: context.uid });

    default:
      return { error: `Unknown tool: ${name}` };

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
      return result.textReply || "";
    }

    const toolResultParts = [];

    for (const call of result.toolCalls) {

      const output = await runTool(call.name, call.input, { uid });

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

  return (
    "দুঃখিত, এই মুহূর্তে অনুরোধটা প্রসেস করতে পারছি না। " +
    "আবার চেষ্টা করুন বা সরাসরি WhatsApp-এ যোগাযোগ করুন।"
  );

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

          const reply = await runConversation({
            attempt,
            genericMessages,
            uid,
          });

          return { reply, providerUsed: attempt.key };

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
