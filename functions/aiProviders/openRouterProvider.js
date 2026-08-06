// =================================================
// OPENROUTER — ফ্রি ব্যাকআপ চেইন (Qwen → Llama → Mistral → DeepSeek)
//
// ⚠️ গুরুত্বপূর্ণ: OpenRouter-এর ফ্রি মডেল লিস্ট ঘন ঘন বদলায় —
// কোনো মডেল কয়েক সপ্তাহ পর delist/paid হয়ে যেতে পারে। নিচের
// slug-গুলো এই মুহূর্তে সঠিক বলে জানা যাচ্ছে, কিন্তু মাঝে মাঝে
// https://openrouter.ai/models?fmt=cards&q=free এ গিয়ে চেক করে
// প্রয়োজনে নিচের OPENROUTER_MODELS array আপডেট করবেন (নতুন slug
// বসিয়ে দিলেই হবে, কোড আর কোথাও বদলাতে হবে না)।
//
// আরেকটা বাস্তব বিষয়: ছোট/ফ্রি ওপেন-সোর্স মডেলগুলো (Qwen/Llama/
// Mistral/DeepSeek-এর ফ্রি ভ্যারিয়েন্ট) tool-calling-এ Gemini/
// OpenAI-এর মতো নির্ভরযোগ্য না — মাঝে মাঝে সঠিকভাবে tool কল না
// করে নিজে থেকে উত্তর বানিয়ে দিতে পারে। তাই এগুলো শুধু ব্যাকআপ,
// প্রধান provider না।
// =================================================

const { createProvider } = require("./openAiCompatible");

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter চায় (ঐচ্ছিক কিন্তু ভালো অভ্যাস) কোন সাইট থেকে কল
// আসছে সেটা হেডারে জানাতে — চাইলে আপনার আসল ডোমেইন দিন।
const EXTRA_HEADERS = {
  "HTTP-Referer": "https://dream-mode.shop",
  "X-Title": "Dream Mode AI Chat",
};

const OPENROUTER_MODELS = [
  "qwen/qwen-2.5-7b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "deepseek/deepseek-r1-distill-llama-70b:free",
];

// প্রতিটা মডেলের জন্য একটা করে { key, provider } — orchestrator
// (aiChat.js) এগুলো ক্রমানুসারে try করবে।
const openRouterAttempts = OPENROUTER_MODELS.map((model) => ({
  key: `openrouter:${model}`,
  provider: createProvider({
    baseUrl: OPENROUTER_BASE_URL,
    model,
    extraHeaders: EXTRA_HEADERS,
  }),
}));

module.exports = { openRouterAttempts };
