// =================================================
// GEMINI PROVIDER — Gemini 2.5 Flash-Lite
//
// এই একই provider module দুইবার ব্যবহার হয় (aiChat.js-এ):
//   ১) একটা ফ্রি প্রজেক্টের API key দিয়ে (billing off — দিনে
//      ~১০০০-১৫০০ রিকোয়েস্ট পর্যন্ত সম্পূর্ণ ফ্রি)
//   ২) একটা পেইড প্রজেক্টের API key দিয়ে, শুধু fallback হিসেবে —
//      ফ্রি প্রজেক্টে rate-limit (429) বা অন্য এরর হলেই এটা ব্যবহার
//      হবে, নাহলে কখনো টাকা কাটবে না।
//
// ⚠️ একই Google একাউন্টে একাধিক ফ্রি প্রজেক্ট বানিয়ে ঘুরিয়ে-ফিরিয়ে
// ব্যবহার করাটা Google-এর ToS অনুযায়ী ঝুঁকিপূর্ণ (quota-bypass
// হিসেবে গণ্য হতে পারে) — তাই ইচ্ছাকৃতভাবে এখানে শুধু ২টা attempt
// (১ ফ্রি + ১ পেইড) রাখা হয়েছে, বেশি না।
//
// মডেলের নাম সময়ের সাথে পাল্টাতে পারে — Google AI Studio-তে গিয়ে
// সর্বশেষ ফ্রি Flash-Lite মডেলের নাম চেক করে নিচের MODEL আপডেট
// করবেন।
// =================================================

const MODEL = "gemini-flash-lite-latest";

function toGeminiSchema(schema) {

  if (!schema || typeof schema !== "object") return schema;

  const out = {};

  for (const [key, value] of Object.entries(schema)) {

    if (key === "type" && typeof value === "string") {
      out.type = value.toUpperCase();
    } else if (key === "properties" && typeof value === "object") {
      out.properties = {};
      for (const [pk, pv] of Object.entries(value)) {
        out.properties[pk] = toGeminiSchema(pv);
      }
    } else if (key === "items") {
      out.items = toGeminiSchema(value);
    } else {
      out[key] = value;
    }

  }

  return out;

}

function encodeContents(genericMessages) {

  const contents = [];

  for (const msg of genericMessages) {

    if (msg.role === "user") {

      const parts = [];

      for (const p of msg.parts) {

        if (p.type === "text") {

          parts.push({ text: p.text });

        } else if (p.type === "image") {

          // Gemini সরাসরি ছবি দেখতে পারে (vision) — inline_data
          // হিসেবে base64 পাঠালেই মডেল ছবিটা বিশ্লেষণ করতে পারবে।
          parts.push({
            inline_data: {
              mime_type: p.mimeType || "image/jpeg",
              data: p.data,
            },
          });

        } else if (p.type === "tool_result") {

          parts.push({
            functionResponse: {
              name: p.name,
              response: { result: p.output },
            },
          });

        }

      }

      if (parts.length) contents.push({ role: "user", parts });

    } else if (msg.role === "assistant") {

      const parts = [];

      for (const p of msg.parts) {

        if (p.type === "text" && p.text) {
          parts.push({ text: p.text });
        } else if (p.type === "tool_use") {
          parts.push({
            functionCall: { name: p.name, args: p.input || {} },
          });
        }

      }

      if (parts.length) contents.push({ role: "model", parts });

    }

  }

  return contents;

}

async function sendTurn({ apiKey, systemPrompt, tools, genericMessages }) {

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: encodeContents(genericMessages),
    tools: [
      {
        functionDeclarations: tools.map((t) => ({
          name: t.name,
          description: t.description,
          parameters: toGeminiSchema(t.input_schema),
        })),
      },
    ],
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {

    const errText = await res.text();
    const err = new Error(`Gemini API error (${res.status}): ${errText}`);
    err.status = res.status;
    throw err;

  }

  const data = await res.json();

  const responseParts = data.candidates?.[0]?.content?.parts || [];

  const assistantParts = [];
  const toolCalls = [];
  let textReply = "";
  let callIndex = 0;

  for (const part of responseParts) {

    if (part.text) {

      assistantParts.push({ type: "text", text: part.text });
      textReply += part.text;

    } else if (part.functionCall) {

      const id = `${part.functionCall.name}_${callIndex++}`;

      assistantParts.push({
        type: "tool_use",
        id,
        name: part.functionCall.name,
        input: part.functionCall.args || {},
      });

      toolCalls.push({
        id,
        name: part.functionCall.name,
        input: part.functionCall.args || {},
      });

    }

  }

  return {
    assistantParts,
    toolCalls,
    textReply: toolCalls.length ? null : textReply,
  };

}

module.exports = { sendTurn, name: MODEL };

