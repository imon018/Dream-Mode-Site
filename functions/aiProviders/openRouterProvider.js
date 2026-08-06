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
//   3. openrouter/free           — OpenRouter-এর নিজস্ব
//      "auto-router": এই মুহূর্তে যে ফ্রি মডেল কাজ করছে এবং
//      tool-calling সাপোর্ট করে, সেটা নিজে থেকেই বেছে নেয় —
//      তাই ভবিষ্যতে কোনো নির্দিষ্ট মডেল delist হয়ে গেলেও এই
//      ধাপটা ভাঙবে না।
//
// তারপরও, https://openrouter.ai/models?fmt=cards&q=free এ
// মাঝে মাঝে চেক করে উপরের ১ ও ২ নম্বর মডেল এখনো ফ্রি আছে কিনা
// দেখে নেবেন — ৩ নম্বর (auto-router) সবসময় কাজ করার কথা।
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
  "openrouter/free",
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
