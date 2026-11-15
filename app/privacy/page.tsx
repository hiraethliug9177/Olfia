import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="wrap page" style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 className="h-page">Your entries stay <em>in your browser</em>.</h1>
      <p className="lead">Olfia has no accounts in this release. Everything you capture or build is stored only in this browser, on this device.</p>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0 }}><strong>What is stored:</strong> your Capture entries, Rooms, and stars, under one local key. None of it is sent to a server.</p>
        <p style={{ margin: 0 }}><strong>Analytics:</strong> Olfia uses Google Analytics to count visits and a few actions, such as finishing the quiz, saving a Scent Card or opening a product link. Google Analytics sets cookies to tell visits apart. The events carry codes such as a scent family, never what you type.</p>
        <p style={{ margin: 0 }}><strong>Without cookies:</strong> for visitors in the EU, the UK and Switzerland, and for browsers that send Global Privacy Control or Do Not Track, analytics cookies stay off and Google receives only cookieless signals. Advertising features are off for everyone.</p>
        <p style={{ margin: 0 }}><strong>Google&apos;s part:</strong> <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from sites that use its services</a>. To opt out on every site, use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>.</p>
        <p style={{ margin: 0 }}><strong>Removing it:</strong> clear this browser from your account page, or clear site data in your browser settings.</p>
      </div>
      <p className="muted">TODO(Tiffany): review this note before launch.</p>
    </div>
  );
}
