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

function extractOutputText(response) {
  // Newer SDKs may provide response.output_text; keep it if available.
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  // Otherwise, extract from the output array (Responses API canonical format).
  const output = response?.output;
  if (!Array.isArray(output)) return "";

  const chunks = [];
  for (const item of output) {
    if (item?.type === "message" && Array.isArray(item.content)) {
      for (const c of item.content) {
        if (c?.type === "output_text" && typeof c.text === "string") {
          chunks.push(c.text);
        }
      }
    }
  }
  return chunks.join("").trim();
}

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 250,
    });

    const text = extractOutputText(response);

    return Response.json({
      reply: text || "I couldn’t generate a reply. Please try again.",
    });
  } catch (error) {
    return Response.json(
      { reply: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
