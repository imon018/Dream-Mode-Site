// =================================================
// GROQ — ফ্রি fallback (Gemini fail করলে/rate-limit হলে এটা try হবে)
//
// কেন Groq + Llama 3.3 70B?
//   - সম্পূর্ণ ফ্রি, কোনো কার্ড লাগে না (console.groq.com)
//   - OpenAI-compatible API, tool/function calling ভালোভাবে
//     সাপোর্ট করে
//   - আগে এই প্রজেক্টে OpenRouter-এর ছোট ফ্রি মডেল (gpt-oss-20b)
//     ব্যবহার করে টেক্সট এলোমেলো হয়ে যাওয়া ও ভুয়া অর্ডার-কনফার্ম
//     করার সমস্যা হয়েছিল — Llama 3.3 70B অনেক বড় ও বেশি স্থিতিশীল
//     মডেল, তাই সেই ঝুঁকি অনেক কম (তবে ১০০% গ্যারান্টি নেই, যেহেতু
//     এটা এখনো ফ্রি/ছোট মডেল, Gemini-র মতো নির্ভরযোগ্য না)।
//
// ফ্রি লিমিট (Groq, প্রতি মডেল, org-লেভেলে): 30 রিকোয়েস্ট/মিনিট,
// ~১২,০০০ টোকেন/মিনিট, ১,০০০ রিকোয়েস্ট/দিন — ছোট দোকানের জন্য
// সাধারণত যথেষ্ট।
//
// ⚠️ ভিশন (ছবি দেখা) সাপোর্ট করে না — কাস্টমার ছবি পাঠালে এই
// fallback ব্যবহার হলে AI ছবিটা দেখতে পারবে না (openAiCompatible.js
// নিজে থেকেই এটা সামলে নেয়, কোনো কোড পরিবর্তন লাগে না)।
// =================================================

const { createProvider } = require("./openAiCompatible");

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const groqProvider = createProvider({
  baseUrl: GROQ_BASE_URL,
  model: GROQ_MODEL,
});

module.exports = groqProvider;
