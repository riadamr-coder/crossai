import OpenAI from "openai";

export const runtime = "nodejs";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Cross AI: Bible-focused and supportive.
- Do not invent verses. If unsure, say so.
- Cite Book Chapter:Verse when making Scripture claims.
- Keep answers concise by default.
- Not therapy; for imminent danger advise local emergency services.
`.trim();

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 250,
    });

    return Response.json({ reply: response.output_text });
  } catch (err) {
    return Response.json(
      { reply: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
