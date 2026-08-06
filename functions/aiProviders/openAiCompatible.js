// =================================================
// OPENAI-COMPATIBLE PROVIDER FACTORY
// OpenAI নিজে এবং OpenRouter — দুটোই একই "Chat Completions" API
// শেপ ব্যবহার করে, তাই কোড দুইবার না লিখে একটা factory ফাংশন
// বানানো হলো। এখান থেকে createProvider({baseUrl, model, headers})
// কল করলেই একটা ব্যবহারযোগ্য provider পাওয়া যাবে।
// =================================================

function toTool(t) {

  return {
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  };

}

function encodeMessages(systemPrompt, genericMessages) {

  const messages = [{ role: "system", content: systemPrompt }];

  for (const msg of genericMessages) {

    if (msg.role === "user") {

      const textParts = msg.parts.filter((p) => p.type === "text");
      const toolResultParts = msg.parts.filter((p) => p.type === "tool_result");

      if (textParts.length) {

        messages.push({
          role: "user",
          content: textParts.map((p) => p.text).join("\n"),
        });

      }

      for (const tr of toolResultParts) {

        messages.push({
          role: "tool",
          tool_call_id: tr.id,
          content:
            typeof tr.output === "string"
              ? tr.output
              : JSON.stringify(tr.output),
        });

      }

    } else if (msg.role === "assistant") {

      const textParts = msg.parts.filter((p) => p.type === "text");
      const toolUseParts = msg.parts.filter((p) => p.type === "tool_use");

      const assistantMsg = {
        role: "assistant",
        content: textParts.length
          ? textParts.map((p) => p.text).join("\n")
          : null,
      };

      if (toolUseParts.length) {

        assistantMsg.tool_calls = toolUseParts.map((p) => ({
          id: p.id,
          type: "function",
          function: {
            name: p.name,
            arguments: JSON.stringify(p.input || {}),
          },
        }));

      }

      messages.push(assistantMsg);

    }

  }

  return messages;

}

function createProvider({ baseUrl, model, extraHeaders = {} }) {

  async function sendTurn({ apiKey, systemPrompt, tools, genericMessages }) {

    const body = {
      model,
      messages: encodeMessages(systemPrompt, genericMessages),
      tools: tools.map(toTool),
    };

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {

      const errText = await res.text();
      const err = new Error(
        `[${model}] API error (${res.status}): ${errText}`
      );
      err.status = res.status;
      throw err;

    }

    const data = await res.json();
    const message = data.choices?.[0]?.message || {};

    const assistantParts = [];
    const toolCalls = [];

    if (message.content) {
      assistantParts.push({ type: "text", text: message.content });
    }

    for (const tc of message.tool_calls || []) {

      let input = {};

      try {
        input = JSON.parse(tc.function.arguments || "{}");
      } catch (e) {
        input = {};
      }

      assistantParts.push({
        type: "tool_use",
        id: tc.id,
        name: tc.function.name,
        input,
      });

      toolCalls.push({ id: tc.id, name: tc.function.name, input });

    }

    return {
      assistantParts,
      toolCalls,
      textReply: toolCalls.length ? null : message.content || "",
    };

  }

  return { sendTurn, name: model };

}

module.exports = { createProvider };
