"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { strings } from "@/lib/strings";

/**
 * Home hero (2026-11-09): the cork scent design board, confirmed by Tiffany.
 * A pencil sketch of a window reading corner sits in the middle. Two pinned references can be
 * tried on it: the bookshop photo prints shelves and a warm lamp onto the empty wall; the
 * courtyard sketch drops branch shadows and clear light by the window. When the reference
 * changes, the old print lingers for a moment over the new one — the afterimage. "Layer both"
 * holds the overlap. Everything is drawn here as SVG; no photographs are used.
 * 11/10 (Tiffany): the board plays by itself — Bookshop, Courtyard, Layer both — with no slide
 * controls (removed 11/10 evening); picking a pinned reference pauses it for a moment; the scent words on the board and under the buttons are gone; both buttons
 * share one style.
 */

type Slide = "books" | "garden" | "both";
const SLIDES: Slide[] = ["books", "garden", "both"];
const SLIDE_MS = 4200;

type Ref = "books" | "garden";

const REFS: Record<Ref, { family: string; tag: string; name: string }> = {
  books: { family: "woody", tag: "cedar / paper / soft smoke", name: "Bookshop photograph" },
  garden: { family: "green", tag: "green stems / linen / open air", name: "Courtyard sketch" },
};

const PENCIL = "#4a4a52";

function Pin({ x, y, c = "#B4552E" }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <ellipse cx={x + 2} cy={y + 5} rx="7" ry="3.5" fill="rgba(41,42,49,0.25)" />
      <circle cx={x} cy={y} r="7" fill={c} />
      <circle cx={x - 2} cy={y - 2.5} r="2.2" fill="rgba(255,255,255,0.6)" />
    </g>
  );
}

export function Hero() {
  const [ref, setRef] = useState<Ref>("books");
  const [ghost, setGhost] = useState<Ref | null>(null);
  const [both, setBoth] = useState(false);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<number | null>(null);
  const refState = useRef<{ ref: Ref; both: boolean }>({ ref: "books", both: false });
  refState.current = { ref, both };

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  // auto-advance: bookshop -> courtyard -> both layered -> bookshop ...
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      return;
    }
  }, []);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const { ref: r, both: b } = refState.current;
      const now: Slide = b ? "both" : r;
      const next = SLIDES[(SLIDES.indexOf(now) + 1) % SLIDES.length];
      if (next === "both") setBoth(true);
      else { setBoth(false); choose(next); }
    }, SLIDE_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const choose = (next: Ref) => {
    const cur = refState.current.ref;
    if (next === cur) return;
    // the reference that is leaving stays visible for a moment over the new one
    setGhost(cur);
    setRef(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setGhost(null), 2600);
  };
  const onKey = (next: Ref) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPlaying(false); setBoth(false); choose(next); }
  };
  // picking a reference pauses the slideshow; it starts again after a quiet moment
  const resume = useRef<number | null>(null);
  useEffect(() => () => { if (resume.current) window.clearTimeout(resume.current); }, []);
  const pick = (slide: Slide) => {
    setPlaying(false);
    if (resume.current) window.clearTimeout(resume.current);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resume.current = window.setTimeout(() => setPlaying(true), 12000);
    }
    if (slide === "both") { setBoth(true); return; }
    setBoth(false);
    choose(slide);
  };

  const layer = (id: Ref): CSSProperties => {
    const on = both || ref === id;
    const lingering = !both && ghost === id;
    return {
      opacity: on ? 1 : lingering ? 0.45 : 0,
      transition: on ? "opacity 0.7s cubic-bezier(0.2,0.7,0.2,1)" : lingering ? "opacity 0.5s ease" : "opacity 1.6s ease",
    };
  };
  const card = (id: Ref, rot: number): CSSProperties => ({
    transformBox: "fill-box",
    transformOrigin: "50% 6%",
    transform: ref === id || both ? `rotate(${rot * 0.3}deg) translateY(-6px)` : `rotate(${rot}deg)`,
    transition: "transform 0.5s cubic-bezier(0.2,0.7,0.2,1)",
    cursor: "pointer",
    outline: "none",
  });

  const families = both ? "woody,green" : REFS[ref].family;

  return (
    <section className="wrap hero">
      <div className="hero__text">
        <h1 className="hero__h1 anim-rise">Scent is an afterimage.</h1>
        <p className="lead anim-rise" style={{ animationDelay: "0.12s" }}>{strings.brand.awareness}</p>
        <div className="anim-rise hero__ctas" style={{ animationDelay: "0.24s" }}>
          <Link href={`/rooms?family=${families}`} className="btn btn--primary">Open in Rooms</Link>
          <Link href="/capture" className="btn btn--apricot">Capture a scent</Link>
        </div>
      </div>

      <div className="hero__board anim-fade" style={{ animationDelay: "0.2s" }}>
        <svg viewBox="0 0 760 640" role="group" aria-label="Scent design board: tap a pinned reference to try it on the room sketch">
          <defs>
            <filter id="hb-cork" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.12  0 0 0 -1.6 1.0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
            <filter id="hb-rough" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" />
            </filter>
            <filter id="hb-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#292A31" floodOpacity="0.22" />
            </filter>
            <filter id="hb-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
            <pattern id="hb-dots" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
              <circle cx="3" cy="3" r="1.7" fill="#7a4a26" />
            </pattern>
            <pattern id="hb-dots-s" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
              <circle cx="2.5" cy="2.5" r="1.1" fill="#7a4a26" />
            </pattern>
            <pattern id="hb-weave" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#9C97B6" />
              <path d="M0 2h8M0 6h8" stroke="#847FA3" strokeWidth="1.6" />
              <path d="M2 0v8M6 0v8" stroke="#B4B0CB" strokeWidth="1.2" />
            </pattern>
            <radialGradient id="hb-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#F2B45A" stopOpacity="0.85" />
              <stop offset="1" stopColor="#F2B45A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hb-beam" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFBE6" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFFBE6" stopOpacity="0" />
            </linearGradient>
            <clipPath id="hb-paper"><rect x="0" y="0" width="400" height="480" /></clipPath>
          </defs>

          {/* cork board */}
          <g filter="url(#hb-shadow)">
            <rect x="8" y="14" width="860" height="596" rx="10" fill="#C79F74" />
            <rect x="8" y="14" width="860" height="596" rx="10" fill="#5a3a22" filter="url(#hb-cork)" opacity="0.55" />
            <rect x="8" y="14" width="860" height="596" rx="10" fill="none" stroke="#8a6238" strokeWidth="3" />
          </g>

          {/* magazine clipping */}
          <g transform="rotate(-4 110 78)" filter="url(#hb-shadow)">
            <path d="M34 44 L186 40 L190 112 L160 116 L120 110 L80 117 L36 112 Z" fill="#EFEADD" />
            <rect x="46" y="54" width="52" height="46" fill="url(#hb-dots-s)" opacity="0.7" />
            <g fill="#8d8a82"><rect x="106" y="56" width="70" height="5" /><rect x="106" y="67" width="62" height="3" /><rect x="106" y="75" width="68" height="3" /><rect x="106" y="83" width="54" height="3" /><rect x="106" y="91" width="64" height="3" /></g>
          </g>
          <Pin x={112} y={44} c="#4C527A" />

          {/* fabric swatch */}
          <g transform="rotate(5 660 120)" filter="url(#hb-shadow)">
            <path d="M604 60 H716 V178 l-8 8 -8 -8 -8 8 -8 -8 -8 8 -8 -8 -8 8 -8 -8 -8 8 -8 -8 -8 8 -8 -8 -8 8 -8 -8 Z" fill="url(#hb-weave)" />
          </g>
          <Pin x={662} y={62} c="#E7B49F" />

          {/* the sketch */}
          <g transform="translate(186 78) rotate(-1.4 200 240)">
            <g filter="url(#hb-shadow)"><rect x="0" y="0" width="400" height="480" fill="#F7F1E3" /></g>
            <g clipPath="url(#hb-paper)">
              {/* reference prints */}
              <g style={layer("books")}>
                <rect x="0" y="0" width="400" height="480" fill="#B46E32" opacity="0.1" />
                <g opacity="0.82">
                  {[0, 1, 2].map((r) => (
                    <g key={r}>
                      <rect x="34" y={124 + r * 56} width="176" height="4" fill="#7a4a26" />
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((b) => {
                        const w = 13 + ((b * 7 + r * 3) % 4) * 3;
                        const h = 34 + ((b * 5 + r * 7) % 4) * 4;
                        const x = 38 + b * 19;
                        const lean = (b + r) % 5 === 4;
                        return (
                          <rect key={b} x={x} y={124 + r * 56 - h} width={w} height={h} fill={(b + r) % 3 === 0 ? "#7a4a26" : "url(#hb-dots)"} opacity={(b + r) % 3 === 0 ? 0.55 : 1} transform={lean ? `rotate(9 ${x} ${124 + r * 56})` : undefined} />
                        );
                      })}
                    </g>
                  ))}
                </g>
                <circle cx="62" cy="262" r="70" fill="url(#hb-lamp)" />
                <g fill="#5a3a22" opacity="0.72">
                  <path d="M44 250 L80 250 L72 222 L52 222 Z" />
                  <rect x="60" y="250" width="4" height="146" />
                  <ellipse cx="62" cy="398" rx="20" ry="4" />
                </g>
              </g>
              <g style={layer("garden")}>
                <rect x="0" y="0" width="400" height="480" fill="#7C8A4A" opacity="0.07" />
                <path d="M258 70 H360 V262 L40 400 L10 330 Z" fill="url(#hb-beam)" opacity="0.75" />
                <g fill="#56653a" opacity="0.36" filter="url(#hb-soft)" transform="translate(0 0)">
                  <path d="M360 86 C 300 130, 230 170, 150 250 S 60 330, 30 372" stroke="#56653a" strokeWidth="5" fill="none" />
                </g>
                <g fill="#56653a" opacity="0.4">
                  {[[322, 112, -40], [296, 148, 20], [270, 150, -55], [240, 190, 15], [214, 196, -50], [186, 236, 25], [158, 240, -45], [128, 284, 20], [104, 296, -40], [76, 334, 10], [52, 346, -50], [300, 96, 30], [200, 172, -20], [140, 220, -30]].map(([x, y, a], i) => (
                    <ellipse key={i} cx={x} cy={y} rx="22" ry="8" transform={`rotate(${a} ${x} ${y})`} />
                  ))}
                </g>
              </g>

              {/* pencil lines */}
              <g fill="none" stroke={PENCIL} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" filter="url(#hb-rough)">
                <path d="M14 398 H388" />
                <path d="M14 404 H120 M300 404 H388" strokeWidth="0.9" opacity="0.6" />
                {/* window */}
                <rect x="258" y="70" width="102" height="192" />
                <path d="M309 70 V262 M258 166 H360" />
                <path d="M248 262 H370 M252 270 H366" />
                <path d="M266 78 l14 20 M270 110 l20 30" strokeWidth="0.8" opacity="0.5" />
                {/* armchair */}
                <path d="M112 318 V262 q0 -16 16 -16 h64 q16 0 16 16 V318" />
                <path d="M98 300 q0 -10 10 -10 q8 0 8 10 V352 H98 Z" />
                <path d="M204 300 q0 -10 10 -10 q8 0 8 10 V352 h-18 Z" />
                <path d="M116 318 H204 V352 H116 Z" />
                <path d="M106 352 l-5 46 M214 352 l5 46 M122 352 l-2 30 M198 352 l2 30" />
                {/* side table */}
                <ellipse cx="262" cy="330" rx="28" ry="6" />
                <path d="M244 334 l-6 64 M280 334 l6 64 M262 336 V398" />
                {/* candle on the table */}
                <rect x="254" y="304" width="16" height="24" rx="2" />
                <path d="M262 304 v-6" />
              </g>
              {/* marker test on the seat */}
              <path d="M118 320 H202 V350 H118 Z" fill="#A0A6C8" opacity="0.55" />
              <path d="M120 322 l80 26 M120 334 l70 14 M134 322 l66 12" stroke="#8a90b8" strokeWidth="5" opacity="0.35" strokeLinecap="round" />
              <text x="22" y="456" style={{ fontFamily: "var(--font-hand)", fontWeight: 700 }} fontSize="22" fill={PENCIL}>reading corner, by the window</text>
            </g>
          </g>

          {/* bulldog clip on the sketch */}
          <g transform="translate(350 40)">
            <path d="M0 34 H72 V62 H0 Z" fill="#b9bcc4" stroke="#7f838c" strokeWidth="1.5" />
            <path d="M0 34 H72" stroke="#e8eaee" strokeWidth="3" />
            <path d="M22 34 q-6 -30 14 -30 q20 0 14 30" fill="none" stroke="#8b8f98" strokeWidth="4" />
            <circle cx="36" cy="10" r="4" fill="#C79F74" stroke="#7f838c" strokeWidth="1.5" />
          </g>

          {/* reference 1: bookshop photograph */}
          <g role="button" tabIndex={0} aria-pressed={ref === "books" || both} aria-label={`${REFS.books.name}: try it on the sketch`} onClick={() => pick("books")} onKeyDown={onKey("books")} style={card("books", -7)} className="hero__ref">
            <g filter="url(#hb-shadow)">
              <rect x="22" y="170" width="168" height="206" fill="#FBFAF6" />
            </g>
            <rect x="34" y="182" width="144" height="144" fill="#3d2616" />
            <circle cx="106" cy="200" r="46" fill="url(#hb-lamp)" opacity="0.9" />
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <rect x="34" y={232 + r * 40} width="144" height="4" fill="#24150b" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => {
                  const cols = ["#B4552E", "#D4A26A", "#7C8A4A", "#E7D7B4", "#8A5A33", "#4C527A", "#C98A8A"];
                  const h = 24 + ((b * 5 + r * 3) % 4) * 3;
                  return <rect key={b} x={38 + b * 14} y={232 + r * 40 - h} width={11} height={h} fill={cols[(b * 3 + r * 2) % cols.length]} opacity="0.9" />;
                })}
              </g>
            ))}
            <rect x="34" y="182" width="144" height="144" fill="url(#hb-dots-s)" opacity="0.12" />
            <Pin x={106} y={174} />
          </g>

          {/* reference 2: courtyard sketch */}
          <g role="button" tabIndex={0} aria-pressed={ref === "garden" || both} aria-label={`${REFS.garden.name}: try it on the sketch`} onClick={() => pick("garden")} onKeyDown={onKey("garden")} style={card("garden", 6)} className="hero__ref">
            <g filter="url(#hb-shadow)">
              <path d="M598 262 l14 -4 14 3 16 -4 14 4 16 -3 14 4 16 -4 16 3 14 -2 V470 H598 Z" fill="#EEF0E2" />
            </g>
            <g fill="none" stroke="#56653a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M676 452 C 672 400, 684 350, 668 296" />
              <path d="M674 420 C 650 414, 636 398, 632 380 C 654 384, 668 398, 674 420 Z" fill="#7C8A4A" fillOpacity="0.35" />
              <path d="M676 386 C 700 380, 714 362, 716 344 C 696 350, 682 364, 676 386 Z" fill="#7C8A4A" fillOpacity="0.35" />
              <path d="M674 352 C 652 346, 640 332, 638 314 C 658 320, 670 334, 674 352 Z" fill="#7C8A4A" fillOpacity="0.35" />
              <path d="M670 316 C 688 308, 696 294, 696 280 C 680 286, 672 300, 670 316 Z" fill="#7C8A4A" fillOpacity="0.35" />
              <path d="M616 452 q10 -22 4 -44 M626 452 q-2 -16 8 -30 M724 452 q-8 -20 -2 -40" strokeWidth="1.4" />
            </g>
            <path d="M610 452 H742" stroke="#56653a" strokeWidth="1.4" />
            <Pin x={672} y={266} c="#7C8A4A" />
          </g>

          {/* ledge: marker with its cap off, incense */}
          <g transform="rotate(-9 300 592)" filter="url(#hb-shadow)">
            <rect x="232" y="582" width="116" height="20" rx="6" fill="#4C527A" />
            <rect x="348" y="586" width="16" height="12" fill="#e9eaf3" />
            <path d="M364 588 l10 4 -10 4 Z" fill="#A0A6C8" />
            <rect x="248" y="582" width="10" height="20" fill="#353a5c" />
          </g>
          <g>
            <ellipse cx="520" cy="596" rx="46" ry="11" fill="#6f4a36" />
            <ellipse cx="520" cy="592" rx="46" ry="11" fill="#9a6a4c" />
            <ellipse cx="520" cy="592" rx="30" ry="6" fill="#7d533b" />
            <path d="M520 592 L470 500" stroke="#3d2616" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M470 500 c -10 -18, 12 -26, 2 -46 c -8 -16, 8 -22, 2 -40" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" className="hero__smoke" />
          </g>
        </svg>

      </div>
    </section>
  );
}
