import type { Metadata } from "next";
import Link from "next/link";
import { FAMILIES, texture } from "@/lib/catalog";

export const metadata: Metadata = { title: "Scent Library" };

export default function LibraryPage() {
  return (
    <div className="wrap page">
      <h1 className="h-page" style={{ marginBottom: 14 }}>Scent Library</h1>
      <p className="lead" style={{ marginBottom: 40, maxWidth: "36em" }}>Seven families, in the order they sit on the fragrance wheel. Neighbors blend well.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {FAMILIES.map((f) => (
          <section key={f.id} id={f.id} className="card" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start", scrollMarginTop: 110 }}>
            <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 140 }}>
              <span aria-hidden="true" style={{ width: 120, height: 120, borderRadius: "50%", background: f.hex, boxShadow: `0 0 0 6px #fff, 0 0 48px ${f.glow}` }} />
              
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 className="h-section" style={{ fontSize: 34 }}>{f.label}</h2>
              <p style={{ margin: 0 }}>{f.what}</p>
              <span className="muted" style={{ fontSize: 15 }}>{f.notes}</span>
              <p style={{ margin: 0 }}><strong>At home:</strong> {f.home}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
                {f.materials.map((m) => (
                  <span key={m.id} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15 }}>
                    <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: "50%", background: texture(m.colors), boxShadow: "0 0 0 2.5px #fff, 0 2px 6px rgba(41,42,49,0.2)" }} />
                    {m.label}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 8, padding: "14px 18px", borderRadius: 16, background: "var(--ivory)" }}>
                <span className="hand" style={{ fontSize: 22, color: "var(--deep)" }}>a little story</span>
                <p className="muted" style={{ margin: "4px 0 0" }}>TODO(Tiffany): short researched story with its source.</p>
              </div>
            </div>
          </section>
        ))}
      </div>
      <p style={{ marginTop: 36 }}><Link href="/rooms" className="hero__link">Try a family in Rooms</Link></p>
    </div>
  );
}
