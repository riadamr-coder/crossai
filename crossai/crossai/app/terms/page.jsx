import Link from "next/link";

export default function Terms() {
  return (
    <div className="container">
      <header className="nav">
        <Link className="btn secondary" href="/">← Home</Link>
        <div className="badge">Terms</div>
        <Link className="btn secondary" href="/chat">Chat</Link>
      </header>

      <div className="card">
        <h1 className="h2">Terms & Disclaimers (Starter)</h1>

        <p className="p">
          Cross AI provides information and supportive conversation, but it is not professional advice.
        </p>

        <div className="p">
          <ul>
            <li><strong>Not therapy:</strong> Cross AI is not a licensed therapist and is not a substitute for mental health care.</li>
            <li><strong>Not medical/legal advice:</strong> content is informational only.</li>
            <li><strong>Emergency:</strong> if you are in immediate danger, contact local emergency services.</li>
            <li><strong>Scripture citations:</strong> responses may cite Scripture but can still be imperfect; verify passages.</li>
            <li><strong>Acceptable use:</strong> do not use the service to harm yourself or others.</li>
          </ul>
        </div>

        <p className="small">
          This is a starter terms page. Before wider public use, we should formalize terms, privacy, and moderation policy.
        </p>
      </div>
    </div>
  );
}
