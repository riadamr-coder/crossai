"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Cross AI. Ask a Bible question or share what you’re going through. If you’re in immediate danger, contact local emergency services."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const next = [...messages, { role: "user", content: userMessage }];

    // Update UI immediately
    setMessages(next);
    setInput("");
    setLoading(true);

    // Add an empty assistant message that we will fill as chunks arrive
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // IMPORTANT: streaming endpoint returns plain text stream
      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Update the last assistant message live
        setMessages((m) => {
          const copy = [...m];
          const lastIndex = copy.length - 1;
          copy[lastIndex] = { ...copy[lastIndex], content: fullText };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        const lastIndex = copy.length - 1;
        copy[lastIndex] = {
          role: "assistant",
          content: "Error contacting Cross AI."
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header className="nav">
        <Link className="btn secondary" href="/">← Home</Link>
        <div className="badge">Chat</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn secondary" href="/privacy">Privacy</Link>
          <Link className="btn secondary" href="/terms">Terms</Link>
        </div>
      </header>

      <div className="card small" style={{ marginBottom: 12 }}>
        Cross AI is not a licensed therapist and is not a substitute for professional care. If you are in immediate danger,
        contact your local emergency number.
      </div>

      <div
        ref={listRef}
        className="card"
        style={{ height: "62vh", overflowY: "auto", padding: 14 }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="small" style={{ marginBottom: 4 }}>
              <strong>{m.role === "user" ? "You" : "Cross AI"}</strong>
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="small">Thinking…</div>}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about Scripture…"
        />
        <button className="btn" onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

