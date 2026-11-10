"use client";

import Link from "next/link";
import { useState } from "react";
import { FAMILIES } from "@/lib/catalog";
import { ItemArt } from "@/components/scene/Cutout";
import { Atmosphere } from "@/components/scene/Atmosphere";

/**
 * Seven families as an old rotary telephone dial (11/10, Tiffany's reference): a brushed
 * metal plate, a finger wheel with seven holes that each show the family's material photo,
 * a cream paper label in the middle and a finger stop. Picking a family turns the wheel until
 * that hole rests against the stop; the label reads the name. The panel beside it shows the
 * real materials, what it smells like, and one action: take it into Rooms.
 */
export function FamilyWheel() {
  const n = FAMILIES.length;
  const [k, setK] = useState(3);
  const [turn, setTurn] = useState(60 - 3 * (360 / n));
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

  const step = 360 / n;
  return (
    <div className="dial-wrap">
      <div className="rotary" role="radiogroup" aria-label="Scent families">
        <div className="rotary__plate" aria-hidden="true" />
        <div className="rotary__wheel" style={{ transform: `rotate(${turn}deg)` }}>
          {FAMILIES.map((f, j) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={j === k}
              aria-label={f.label}
              className="rotary__hole"
              onClick={() => pick(j)}
              style={{ transform: `rotate(${j * step}deg) translateX(var(--hole-r)) rotate(${-(j * step) - turn}deg)` }}
            >
              <span className="rotary__photo" style={{ backgroundImage: `url(${f.texture})`, backgroundColor: f.hex }} />
              <span className="rotary__tint" style={{ background: f.hex }} />
            </button>
          ))}
        </div>
        <div className="rotary__label">
          <span className="rotary__name">{sel.label}</span>
          <span className="rotary__dot" style={{ background: sel.hex }} />
        </div>
        <svg className="rotary__stop" viewBox="0 0 60 90" aria-hidden="true">
          <defs>
            <linearGradient id="stop-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2f2ef" /><stop offset="0.5" stopColor="#b5b5b0" /><stop offset="1" stopColor="#7d7d78" />
            </linearGradient>
          </defs>
          <path d="M14 6 C 40 18, 50 46, 46 84 L 34 84 C 36 52, 28 30, 6 18 Z" fill="url(#stop-metal)" stroke="#6d6d68" strokeWidth="1.2" />
        </svg>
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
