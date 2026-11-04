"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MOODS, baseLayout, stickersFor } from "@/lib/catalog";
import { strings } from "@/lib/strings";
import { ScenePage } from "@/components/scene/ScenePage";

export function Hero() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % MOODS.length), 4200);
    return () => window.clearInterval(t);
  }, [hold]);

  const mood = MOODS[i];
  const items = [...baseLayout(mood.source), ...stickersFor(mood.families)];

  return (
    <section className="wrap hero">
      <div className="hero__text">
        <span className="hand anim-rise" style={{ fontSize: 26, color: "var(--deep)", animationDelay: "0.35s" }}>a home-fragrance scrapbook</span>
        <h1 className="hero__h1 anim-rise" style={{ animationDelay: "0.5s" }}>
          There’s <em>more</em> to a room than what you see.
        </h1>
        <p className="lead anim-rise" style={{ fontSize: 21, animationDelay: "0.65s" }}>{strings.brand.invitation}</p>
        <div className="anim-rise" style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 6, animationDelay: "0.8s" }}>
          <Link href="/rooms" className="btn btn--primary">
            Start a scene
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
        <div className="anim-rise" style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 18, animationDelay: "0.95s" }}>
          <span className="hand" style={{ fontSize: 24, color: "var(--deep)" }}>{strings.brand.hero.toLowerCase()}</span>
          <div role="radiogroup" aria-label="Scent" className="chips">
            {MOODS.map((m, j) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={j === i}
                className="chip"
                onClick={() => {
                  setI(j);
                  setHold(true);
                }}
              >
                <span className="chip__dot" style={{ background: m.dot }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero__blob" aria-hidden="true">
          <span className="anim-bloom" style={{ left: "8%", top: "10%", width: "60%", height: "55%", background: "radial-gradient(circle, rgba(160,166,200,0.85) 0%, rgba(160,166,200,0) 70%)" }} />
          <span className="anim-bloom" style={{ right: "4%", top: "30%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(231,180,159,0.8) 0%, rgba(231,180,159,0) 70%)", animationDelay: "0.15s" }} />
          <span className="anim-bloom" style={{ left: "22%", bottom: 0, width: "60%", height: "45%", background: "radial-gradient(circle, rgba(124,138,74,0.28) 0%, rgba(124,138,74,0) 70%)", animationDelay: "0.3s" }} />
        </div>
        <div className="hero__stage anim-fade" style={{ animationDelay: "0.9s" }}>
          <ScenePage key={mood.id} items={items} families={mood.families} title="Reading Corner" note={mood.note} time={mood.time} />
        </div>
        <svg viewBox="0 0 640 220" aria-hidden="true" className="hero__ribbon">
          <defs>
            <path id="olf-ribbon" d="M-20 170 C 120 60, 240 60, 320 120 S 520 200, 660 70" />
          </defs>
          <use href="#olf-ribbon" fill="none" stroke="#4C527A" strokeWidth="38" strokeLinecap="round" />
          <text fontFamily="'Source Sans 3', sans-serif" fontWeight="700" fontSize="14.5" letterSpacing="2.4" fill="#FFFFFF" dy="5">
            <textPath href="#olf-ribbon" startOffset="8">LIGHT A CANDLE · NAME THE NOTE · PIN THE MOMENT · OPEN A WINDOW · KEEP THE ROOM · SHARE THE PAGE ·</textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
