import OpenAI from "openai";

export const runtime = "nodejs";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Very simple in-memory limiter (works fine for small early testing).
// For serious scale, move this to Upstash/Redis.
const hits = new Map();
function rateLimit(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = hits.get(ip) || [];
  const recent = bucket.filter((t) => now - t < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

const SYSTEM_PROMPT = `
You are Cross AI: a Bible-focused assistant with a supportive, careful tone.

Rules:
- Do not invent Bible verses. If you are unsure, say so.
- When making Scripture claims, cite Book Chapter:Verse (KJV) when possible.
- Be respectful and calm. Ask clarifying questions when needed.
- This is not therapy. For self-harm or imminent danger, advise contacting local emergency services.
- Avoid diagnosing. Encourage professional help when appropriate.
`;

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!rateLimit(ip)) {
    return Response.json(
      { reply: "Rate limit reached. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const { messages } = await req.json();

  const response = await client.responses.create({
    model: "gpt-5-mini",
    instructions: SYSTEM_PROMPT,
    input: messages,
    // Small safety valve: cap output length to control spend
    max_output_tokens: 600
  });

  return Response.json({ reply: response.output_text });
}
