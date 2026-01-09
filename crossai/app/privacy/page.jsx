import Link from "next/link";

export default function Privacy() {
  return (
    <div className="container">
      <header className="nav">
        <Link className="btn secondary" href="/">← Home</Link>
        <div className="badge">Privacy</div>
        <Link className="btn secondary" href="/chat">Chat</Link>
      </header>

      <div className="card">
        <h1 className="h2">Privacy Policy (Starter)</h1>
        <p className="p">
          Cross AI processes messages you submit to generate responses. Do not submit sensitive personal information.
        </p>

        <div className="p">
          <ul>
            <li><strong>Data you provide:</strong> your chat messages.</li>
            <li><strong>How it’s used:</strong> to generate responses and improve reliability and safety.</li>
            <li><strong>Storage:</strong> this starter version may not permanently store chats, but logs may exist for debugging and abuse prevention.</li>
            <li><strong>Third parties:</strong> requests are sent to our AI provider to generate responses.</li>
          </ul>
        </div>

        <p className="small">
          This is a starter policy. Before a public launch, we should finalize a proper policy aligned to your logging, analytics, and jurisdiction.
        </p>
      </div>
    </div>
  );
}
