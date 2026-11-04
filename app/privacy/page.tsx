import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="wrap page" style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 className="h-page">Your entries stay <em>in your browser</em>.</h1>
      <p className="lead">Olfia has no accounts in this release. Everything you capture or build is stored only in this browser, on this device.</p>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0 }}><strong>What is stored:</strong> your Capture entries, Rooms, and stars, under one local key. Nothing is sent to a server.</p>
        <p style={{ margin: 0 }}><strong>Analytics:</strong> anonymous usage events (for example, that a Scent Card was saved) help improve the site. They contain no entry text.</p>
        <p style={{ margin: 0 }}><strong>Removing it:</strong> clear this browser from your account page, or clear site data in your browser settings.</p>
      </div>
      <p className="muted">TODO(Tiffany): review this note before launch.</p>
    </div>
  );
}
