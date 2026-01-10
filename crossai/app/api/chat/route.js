export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Cross AI, a Bible-focused assistant.
- Do not invent Bible verses. If unsure, say so.
- Cite Book Chapter:Verse when referencing Scripture.
- Keep answers concise by default (120–200 words).
- This is not therapy. For imminent danger, advise contacting local emergency services.
`.trim();

function extractTextFromResponsesAPI(responseJson) {
  // Some responses include output_text; use if present
  if (typeof responseJson?.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  // Canonical: output[] -> message -> content[] -> output_text
  const output = responseJson?.output;
  if (!Array.isArray(output)) return "";

  const chunks = [];
  for (const item of output) {
    if (item?.type === "message" && Array.isArray(item.content)) {
      for (const c of item.content) {
        if ((c?.type === "output_text" || c?.type === "text") && typeof c.text === "string") {
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

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: SYSTEM_PROMPT,
        input: messages,
        max_output_tokens: 250,
      }),
    });

    const json = await r.json().catch(() => null);

    if (!r.ok) {
      const msg =
        json?.error?.message ||
        `OpenAI API error (HTTP ${r.status}).`;
      return Response.json({ reply: msg }, { status: 500 });
    }

    const text = extractTextFromResponsesAPI(json);

    return Response.json({
      reply: text || "I received an empty response. Please try again.",
    });
  } catch (e) {
    return Response.json(
      { reply: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
