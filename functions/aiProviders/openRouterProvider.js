// =================================================
// OPENROUTER — ফ্রি ব্যাকআপ চেইন
//
// ⚠️ আপডেট (আগস্ট ২০২৬): Qwen/Llama/Mistral/DeepSeek-এর ফ্রি
// tier এখন বেশিরভাগই বন্ধ হয়ে গেছে (OpenRouter এগুলো paid-এ
// সরিয়ে নিয়েছে) — এটা আসল প্রোডাকশন লগে ধরা পড়েছে (DeepSeek:
// "This model is unavailable for free")। তাই সেগুলোর বদলে:
//
//   1. openai/gpt-oss-20b:free   — এই মুহূর্তে নিশ্চিতভাবে ফ্রি,
//      tool-calling ভালোভাবে সাপোর্ট করে
//   2. openai/gpt-oss-120b:free  — বড়, আরেকটু ভালো quality
//
// ⚠️ "openrouter/free" (auto-router) ইচ্ছাকৃতভাবে বাদ দেওয়া
// হয়েছে। এটা নিয়ন্ত্রণহীনভাবে যেকোনো ফ্রি মডেল বেছে নিতো —
// প্রোডাকশনে এর ফলে কখনো কখনো বাংলা ঠিকমতো লিখতে না পারা এমন
// দুর্বল মডেল চলে আসতো (উত্তরে একাধিক ভাষা এলোমেলোভাবে মিশে
// যাওয়া, ভুল প্রোডাক্ট নাম বানিয়ে বলা), এবং সেসব মডেল অনেক সময়
// tool ঠিকমতো কল না করেই ভুয়া "অর্ডার কনফার্ম" টেক্সট লিখে
// দিতো — ফলে কাস্টমার ভাবতো অর্ডার হয়ে গেছে, কিন্তু Firestore-এ/
// admin panel-এ কোনো অর্ডারই তৈরি হতো না। tool-calling নির্ভুলতা
// ও ভাষার মান — দুটোই এখানে গতির চেয়ে বেশি জরুরি, তাই শুধু
// যাচাই করা, নির্ভরযোগ্য মডেল দুটোই রাখা হলো।
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
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
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
