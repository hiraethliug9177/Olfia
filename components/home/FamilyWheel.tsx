"use client";

import Link from "next/link";
import { useState } from "react";
import { FAMILIES } from "@/lib/catalog";
import { ItemArt } from "@/components/scene/Cutout";
import { Atmosphere } from "@/components/scene/Atmosphere";

/**
 * Seven families as an old rotary telephone dial (Tiffany's reference, 11/10).
 * A satin metal plate inside a raised rim; a finger wheel of seven recessed, chrome-rimmed holes,
 * each holding the family's plain colour circle (Tiffany 11/10: keep the pure colour circles);
 * a cream label in a metal bezel; a chrome finger stop. Picking a family turns the wheel until that
 * hole rests beside the stop, and the label reads its name.
 */

/** Where the chosen hole comes to rest: degrees clockwise from 3 o'clock (here, 4 o'clock). */
const REST = 30;

/** The finger stop, drawn in the dial's 400 × 400 box: from just outside the rim, curving inward. */
const STOP = "M303.8 387.2 Q288 352.4 292.4 318.2";

export function FamilyWheel() {
  const n = FAMILIES.length;
  const step = 360 / n;
  const [k, setK] = useState(3);
  const [turn, setTurn] = useState(REST - 3 * step);
  const sel = FAMILIES[k];
  const prev = FAMILIES[(k + n - 1) % n];
  const next = FAMILIES[(k + 1) % n];

  const pick = (j: number) => {
    if (j === k) return;
    // turn the shortest way round
    let d = j - k;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    setTurn((t) => t - d * step);
    setK(j);
  };

  return (
    <div className="dial-wrap">
      <div className="rotary" role="radiogroup" aria-label="Scent families">
        <div className="rotary__rim" aria-hidden="true" />
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
              // the last rotate keeps each hole's lighting upright while the wheel turns
              style={{ transform: `rotate(${j * step}deg) translateX(var(--hole-r)) rotate(${-(j * step) - turn}deg)` }}
            >
              <span className="rotary__color" style={{ background: f.hex }} />
            </button>
          ))}
        </div>
        <div className="rotary__bezel" aria-hidden="true">
          <div className="rotary__label">{sel.label}</div>
        </div>
        <svg className="rotary__stop" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <filter id="rotary-stop-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          </defs>
          <g fill="none" strokeLinecap="round">
            <path d={STOP} transform="translate(3 5)" stroke="rgba(41,42,49,0.35)" strokeWidth="16" filter="url(#rotary-stop-shadow)" />
            <path d={STOP} stroke="#6b6c68" strokeWidth="16" />
            <path d={STOP} stroke="#a8a9a5" strokeWidth="12" />
            <path d={STOP} transform="translate(-1.8 -1.6)" stroke="#f8f8f5" strokeWidth="4.5" opacity="0.9" />
          </g>
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
            <Link href={`/rooms?family=${sel.id}`} className="btn btn--primary"><span className="chip__dot" style={{ background: sel.hex, boxShadow: "0 0 0 2px #fff" }} aria-hidden="true" />Try {sel.label} in a room</Link>
            <Link href={`/library#${sel.id}`} className="hero__link">Read more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
