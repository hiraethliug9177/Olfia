"use client";

import Link from "next/link";
import { useState } from "react";
import { FAMILIES } from "@/lib/catalog";
import { ItemArt } from "@/components/scene/Cutout";
import { Atmosphere } from "@/components/scene/Atmosphere";

/**
 * Seven families as a dial (11/9 feedback 03): seven plain colour circles on a ring.
 * Picking one turns the ring until that colour sits at the reading position (3 o'clock),
 * where it grows; the name stays upright in the middle. The panel beside it shows the
 * real materials, what it smells like, and one action: take it into Rooms.
 */
export function FamilyWheel() {
  const n = FAMILIES.length;
  const [k, setK] = useState(3);
  const [turn, setTurn] = useState(-3 * (360 / n));
  const sel = FAMILIES[k];
  const prev = FAMILIES[(k + n - 1) % n];
  const next = FAMILIES[(k + 1) % n];

  const pick = (j: number) => {
    if (j === k) return;
    // shortest way round
    let d = j - k;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    setTurn((t) => t - d * (360 / n));
    setK(j);
  };

  return (
    <div className="dial-wrap">
      <div className="dial" role="radiogroup" aria-label="Scent families">
        <div className="dial__ring" style={{ transform: `rotate(${turn}deg)` }}>
          {FAMILIES.map((f, j) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={j === k}
              aria-label={f.label}
              className="dial__btn"
              onClick={() => pick(j)}
              style={{ transform: `rotate(${j * (360 / n)}deg) translateX(var(--dial-r)) scale(${j === k ? 1.28 : 1})`, background: f.hex }}
            />
          ))}
        </div>
        <span className="dial__mark" aria-hidden="true" />
        <span className="dial__name">{sel.label}</span>
      </div>

      <div className="dial-panel">
        <Atmosphere key={sel.id} families={[sel.id]} intensity={0.8} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: "50%", background: sel.hex }} />
            <h3 style={{ fontSize: 30 }}>{sel.label}</h3>
          </div>
          <p style={{ maxWidth: "32em" }}>{sel.what}</p>
          <div key={sel.id} style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {sel.materials.map((m, i) => (
              <div key={m.id} className="anim-rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animationDelay: `${i * 0.08}s` }}>
                <div style={{ width: 96, height: 96 }}><ItemArt kind={m.id} prefix="dial" /></div>
                <span style={{ fontSize: 15 }}>{m.label}</span>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 15 }}>{sel.notes}</p>
          <p className="muted" style={{ fontSize: 15 }}>Sits next to {prev.label} and {next.label}; neighbours layer well.</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px" }}>
            <Link href={`/rooms?family=${sel.id}`} className="btn btn--primary">Try {sel.label} in a room</Link>
            <Link href={`/library#${sel.id}`} className="hero__link">Read more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
