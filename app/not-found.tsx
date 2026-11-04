import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page" style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start", minHeight: "50vh" }}>
      <span className="label-mono">404</span>
      <h1 className="h-page">This room doesn’t exist <em>(yet)</em>.</h1>
      <p className="lead">Try Rooms to imagine one, or Capture to keep a real one.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/rooms" className="btn btn--primary">Rooms</Link>
        <Link href="/capture" className="btn btn--ghost">Capture</Link>
      </div>
    </div>
  );
}
