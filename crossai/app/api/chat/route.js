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
  } catch (error) {
    return Response.json(
      { reply: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
