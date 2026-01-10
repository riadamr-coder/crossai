import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Cross AI, a Bible-focused assistant.
- Do not invent Bible verses. If unsure, say so.
- Cite Book Chapter:Verse when referencing Scripture.
- Keep answers concise by default (around 120–200 words).
- This is not therapy. For imminent danger, advise contacting local emergency services.
`.trim();

function extractTextOrRefusal(response) {
  // 1) If the SDK provides output_text, use it.
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return { text: response.output_text.trim(), isRefusal: false };
  }

  // 2) Otherwise parse the canonical Responses API "output" array
  const output = response?.output;
  if (!Array.isArray(output)) return { text: "", isRefusal: false };

  let textChunks = [];
  let refusalChunks = [];

  for (const item of output) {
    // Most common: item.type === "message" and item.content is an array
    if (Array.isArray(item?.content)) {
      for (const c of item.content) {
        // Normal text
        if ((c?.type === "output_text" || c?.type === "text") && typeof c.text === "string") {
          textChunks.push(c.text);
        }
        // Refusal text (so you see it instead of blank)
        if (c?.type === "refusal" && typeof c.refusal === "string") {
          refusalChunks.push(c.refusal);
        }
      }
    }

    // Some variants may place text directly on the item
    if (typeof item?.text === "string") {
      textChunks.push(item.text);
    }
  }

  const text = textChunks.join("").trim();
  if (text) return { text, isRefusal: false };

  const refusal = refusalChunks.join("\n").trim();
  if (refusal) return { text: refusal, isRefusal: true };

  return { text: "", isRefusal: false };
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 300,
    });

    const { text, isRefusal } = extractTextOrRefusal(response);

    if (!text) {
      // If nothing was extractable, return a clearer diagnostic message
      return Response.json({
        reply:
          "I received an empty response from the model. Please try again. If this repeats, we likely need to update the OpenAI SDK version in package.json.",
      });
    }

    // If it was a refusal, still show it (so you know what happened)
    return Response.json({
      reply: isRefusal ? `I can’t help with that request:\n${text}` : text,
    });
  } catch (error) {
    return Response.json(
      { reply: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
