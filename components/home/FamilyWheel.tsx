"use client";

import Link from "next/link";
import { useState } from "react";
import { FAMILIES, texture } from "@/lib/catalog";

export function FamilyWheel() {
  const [k, setK] = useState(3);
  const n = FAMILIES.length;
  const sel = FAMILIES[k];
  const prev = FAMILIES[(k + n - 1) % n];
  const next = FAMILIES[(k + 1) % n];

  return (
    <div className="wheel-wrap">
      <div className="wheel" role="radiogroup" aria-label="Scent families">
        <div className="wheel__ring" aria-hidden="true" />
        <div className="wheel__glow" aria-hidden="true" style={{ background: `radial-gradient(circle, ${sel.glow} 0%, rgba(255,255,255,0) 70%)` }} />
        {FAMILIES.map((f, j) => {
          const a = -Math.PI / 2 + (j * 2 * Math.PI) / n;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={j === k}
              aria-label={f.label}
              className="wheel__btn"
              onClick={() => setK(j)}
              style={{
                left: 230 + 170 * Math.cos(a) - 48,
                top: 230 + 170 * Math.sin(a) - 48,
                background: texture(f.materials[0].colors.map((c, idx) => (idx === 0 ? f.hex : c)) as [string, string, string]),
              }}
            />
          );
        })}
        <span className="wheel__name">{sel.label}</span>
      </div>

      <div className="card" style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: sel.hex }} />
          <h3 style={{ fontSize: 36 }}>{sel.label}</h3>
        </div>
        <span className="mono muted" style={{ fontSize: 15 }}>{sel.hex} · {sel.notes}</span>
        <div key={sel.id} style={{ display: "flex", flexWrap: "wrap", gap: 22, padding: "6px 0" }}>
          {sel.materials.map((m, i) => (
            <div key={m.id} className="anim-rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animationDelay: `${i * 0.1}s` }}>
              <div className="window" style={{ width: 84, height: 84, background: texture(m.colors) }} />
              <span className="hand" style={{ fontSize: 22 }}>{m.label}</span>
            </div>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 17 }}>Blends well with {prev.label} and {next.label}.</span>
        <Link href={`/library#${sel.id}`} style={{ alignSelf: "flex-start", fontSize: 17, fontWeight: 600 }}>Read its story in the Scent Library →</Link>
      </div>
    </div>
  );
}
