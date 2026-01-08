"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Cross AI. Ask a Bible question or explore Scripture with context and references."
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

    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });

      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error contacting Cross AI." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Cross AI</h1>
      <div
        ref={listRef}
        style={{
          border: "1px solid #ddd",
          padding: 12,
          height: "60vh",
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Cross AI"}:</strong>{" "}
            {m.content}
          </p>
        ))}
        {loading && <p>Thinking…</p>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Ask about Scripture…"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
    </div>
  );
}
