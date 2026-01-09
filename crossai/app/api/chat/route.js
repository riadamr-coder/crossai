import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Cross AI: a Bible-focused assistant with a supportive, careful tone.

Rules:
- Do not invent Bible verses. If unsure, say so.
- When quoting or referencing Scripture, cite Book Chapter:Verse.
- Keep answers concise by default (under ~150-250 words) unless the user asks for depth.
- Not therapy. For imminent self-harm/danger: advise contacting local emergency services.
`;

export async function POST(req) {
  const { messages } = await req.json();

  // Create a streaming response from OpenAI (stream: true).
  const aiStream = await client.responses.create({
    model: "gpt-5-mini",
    instructions: SYSTEM_PROMPT,
    input: messages,
    stream: true,
    max_output_tokens: 300, // lower = faster + cheaper; raise later if needed
  });

  // Convert OpenAI streaming events into a plain text stream to the browser.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of aiStream) {
          // Text arrives in delta events
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta || ""));
          }

          // Stop cleanly when done
          if (event.type === "response.completed") {
            break;
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode("\n\n[Error: streaming failed. Please try again.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
