import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <header className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="badge">Cross AI</div>
          <div className="small">Bible companion + safe support</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn secondary" href="/privacy">Privacy</Link>
          <Link className="btn secondary" href="/terms">Terms</Link>
          <Link className="btn" href="/chat">Open Chat</Link>
        </div>
      </header>

      <section className="card" style={{ padding: 22 }}>
        <div className="badge">Live • crossai.co</div>
        <h1 className="h1" style={{ marginTop: 10 }}>
          Scripture-first answers, with clarity and care.
        </h1>
        <p className="p" style={{ marginTop: 10, maxWidth: 820 }}>
          Cross AI helps you explore the Bible with structured, grounded responses. It is designed to be supportive,
          but it is not a substitute for licensed therapy, medical care, or emergency services.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <Link className="btn" href="/chat">Try Cross AI</Link>
          <Link className="btn secondary" href="/terms">Read disclaimers</Link>
        </div>

        <p className="small" style={{ marginTop: 14 }}>
          If you are in immediate danger or considering self-harm, contact your local emergency number right now.
        </p>
      </section>

      <section style={{ marginTop: 16 }} className="grid cols3">
        <div className="card">
          <div className="h2">Citations & structure</div>
          <div className="p">Responses are guided to cite verses and avoid inventing Scripture.</div>
        </div>
        <div className="card">
          <div className="h2">Safe, supportive tone</div>
          <div className="p">Designed to be respectful and careful, especially for sensitive topics.</div>
        </div>
        <div className="card">
          <div className="h2">Built for real usage</div>
          <div className="p">Hosted on Vercel, with server-side API keys and production deployment.</div>
        </div>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()} Cross AI</div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/chat">Chat</Link>
        </div>
      </footer>
    </div>
  );
}
