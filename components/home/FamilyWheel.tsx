"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FAMILIES } from "@/lib/catalog";
import { ItemArt } from "@/components/scene/Cutout";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { FAMILY_GUIDE, WHEEL_HINT } from "@/lib/copy/familyGuide";
import { ResearchNotes } from "@/components/ui/Sources";

/**
 * Seven families as an old rotary telephone dial (Tiffany's reference, 11/10).
 * A satin metal plate inside a raised rim; a finger wheel of seven recessed, chrome-rimmed holes,
 * each holding the family's plain colour circle (Tiffany 11/10: keep the pure colour circles);
 * a cream label in a metal bezel; a chrome finger stop. Picking a family turns the wheel until that
 * hole rests beside the stop, and the label reads its name.
 * 11/18 (Tiffany): the dial turns by itself to the next family every 5 seconds and the card follows, with no pause
 * button. It only turns while it is on screen; a turn by hand starts the 5 seconds again; it waits while someone
 * is moving through it with the keyboard; and it stays still for people whose device asks for reduced motion.
 * Copy v1 (Tiffany 11/24, §1.2): the card is a knowledge card from the shared family guide (lib/copy/familyGuide.ts,
 * also used by Scentpedia): a short description, signature notes, at home, a pairing and a starter recipe that
 * folds open. The old "neighbours layer well" line is gone (the guide removes automatic layering claims).
 */

/** Where the chosen hole comes to rest: degrees clockwise from 3 o'clock (here, 4 o'clock). */
const REST = 30;

/** How long each family stays before the dial turns to the next. */
const AUTO_MS = 5000;

/** The finger stop, drawn in the dial's 400 × 400 box: from just outside the rim, curving inward. */
const STOP = "M303.8 387.2 Q288 352.4 292.4 318.2";

export function FamilyWheel() {
  const n = FAMILIES.length;
  const step = 360 / n;
  const [k, setK] = useState(3);
  const [turn, setTurn] = useState(REST - 3 * step);
  const sel = FAMILIES[k];
  const g = FAMILY_GUIDE[sel.id];

  const wrapRef = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);
  // bumped by a turn by hand, so the 5 seconds start again from there
  const [handTurns, setHandTurns] = useState(0);

  const pick = (j: number) => {
    if (j === k) return;
    // turn the shortest way round
    let d = j - k;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    setTurn((t) => t - d * step);
    setK(j);
    setHandTurns((h) => h + 1);
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { onScreen.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!onScreen.current || document.hidden) return;
      const a = document.activeElement;
      let keyboardInside = false;
      try { keyboardInside = !!a && !!wrapRef.current?.contains(a) && a.matches(":focus-visible"); } catch { /* older browsers */ }
      if (keyboardInside) return;
      // copy v1 made the card long: hold the family while the pointer rests on the card or a fold is open
      try { if (wrapRef.current?.querySelector("details[open]") || wrapRef.current?.querySelector(".dial-panel:hover")) return; } catch { /* older browsers */ }
      // always one step forward, so the wheel keeps turning the same way
      setK((cur) => (cur + 1) % n);
      setTurn((t) => t - step);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [handTurns, n, step]);

  return (
    <div className="dial-wrap" ref={wrapRef}>
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
            {/* 11/18 (Tiffany): the family's name in bold; its line and its materials use the card's full width */}
            <h3 className="dial-panel__title">{sel.label}</h3>
          </div>
          <p>{g.card}</p>
          <div key={sel.id} className="dial-panel__mats">
            {sel.materials.map((m, i) => (
              <div key={m.id} className="dial-panel__mat anim-rise" role="img" aria-label={m.label} style={{ animationDelay: `${i * 0.08}s` }}>
                <ItemArt kind={m.id} prefix="dial" />
              </div>
            ))}
          </div>
          <dl className="fam-facts">
            <div><dt>Signature notes</dt><dd>{g.signatureNotes}</dd></div>
            <div><dt>At home</dt><dd>{g.atHome}</dd></div>
            <div><dt>Scent pairing</dt><dd>{g.pairing}</dd></div>
          </dl>
          <details className="recipe" key={`recipe-${sel.id}`}>
            <summary>Your first scent recipe</summary>
            <h4 className="recipe__title">{g.recipe.title}</h4>
            <p className="recipe__parts"><span>Main scent: {g.recipe.main}</span><span>Accent: {g.recipe.accent}</span></p>
            <p>{g.recipe.body}</p>
            <p className="muted recipe__hint">{WHEEL_HINT}</p>
          </details>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px" }}>
            <Link href={`/rooms?family=${sel.id}`} className="btn btn--primary"><span className="chip__dot" style={{ background: sel.hex, boxShadow: "0 0 0 2px #fff" }} aria-hidden="true" />Try {sel.label} in a room</Link>
            <Link href={`/scentpedia#${sel.id}`} className="hero__link">Explore in Scentpedia</Link>
          </div>
          <ResearchNotes key={`src-${sel.id}`} ids={g.cardSources} label="Research sources" />
        </div>
      </div>
    </div>
  );
}
