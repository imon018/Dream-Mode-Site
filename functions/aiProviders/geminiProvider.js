// =================================================
// GEMINI PROVIDER (ফ্রি tier)
// মডেলের নাম সময়ের সাথে পাল্টাতে পারে — Google AI Studio-তে গিয়ে
// সর্বশেষ ফ্রি Flash মডেলের নাম চেক করে নিচের MODEL আপডেট করবেন।
// =================================================

const MODEL = "gemini-2.5-flash-lite";

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
          parts.push({
            inlineData: { mimeType: p.mimeType, data: p.data },
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

module.exports = { sendTurn, name: "gemini" };
