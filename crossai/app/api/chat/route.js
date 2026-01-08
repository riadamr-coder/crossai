import OpenAI from "openai";

export const runtime = "nodejs";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Cross AI, an advanced Bible study assistant.

Rules:
- Answer only using Scripture-based reasoning.
- Cite verses by Book Chapter:Verse (KJV).
- Never invent verses.
- If unsure, say so clearly.
`;

export async function POST(req) {
  const { messages } = await req.json();

  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions: SYSTEM_PROMPT,
    input: messages
  });

  return Response.json({ reply: response.output_text });
}
