"use client";

import { useState } from "react";
import type { Article } from "@/lib/edit";

/** Drawn covers: used when an article has no photograph, or when its source stops serving one. */
function Drawn({ kind }: { kind: Article["fallback"] }) {
  if (kind === "pool") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" fill="#F6C9D3" />
        <circle cx="318" cy="70" r="38" fill="#FBE7A6" />
        <path d="M0 150 H400 V300 H0 Z" fill="#F2A9BC" />
        <path d="M40 190 Q200 150 360 190 L330 290 Q200 262 70 290 Z" fill="#6FC3DD" />
        <path d="M70 210 q32 -14 64 0 t64 0 t64 0 t64 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M96 244 q26 -12 52 0 t52 0 t52 0 t52 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <g stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round"><path d="M92 208 V150 q0 -16 16 -16" /><path d="M124 204 V150 q0 -16 16 -16" /><path d="M92 170 h32 M92 190 h32" strokeWidth="5" /></g>
        <ellipse cx="270" cy="232" rx="34" ry="14" fill="none" stroke="#F8E16C" strokeWidth="12" />
      </svg>
    );
  }
  if (kind === "lobby") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" fill="#EDE6D8" />
        <rect y="214" width="400" height="86" fill="#D9CDB8" />
        <circle cx="96" cy="96" r="90" fill="#F5D9A0" opacity="0.5" />
        <g fill="#56653a">
          {[-58, -34, -12, 10, 32, 56].map((a) => <path key={a} d="M316 232 C 312 170, 322 120, 318 60 C 336 120, 334 172, 324 232 Z" transform={`rotate(${a} 320 232)`} opacity="0.85" />)}
        </g>
        <rect x="302" y="224" width="36" height="44" rx="4" fill="#B4552E" />
        <rect x="70" y="182" width="190" height="58" rx="14" fill="#FBF8F1" />
        <rect x="58" y="204" width="214" height="48" rx="14" fill="#F3EDE0" />
        <rect x="78" y="250" width="8" height="18" fill="#8A5A33" /><rect x="244" y="250" width="8" height="18" fill="#8A5A33" />
        <rect x="92" y="60" width="6" height="124" fill="#292A31" /><path d="M70 60 h50 l-10 -34 h-30 Z" fill="#292A31" />
        <rect x="150" y="150" width="34" height="36" rx="4" fill="#292A31" /><path d="M167 150 v-10" stroke="#292A31" strokeWidth="3" /><circle cx="167" cy="134" r="5" fill="#F2B45A" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="300" fill="#EFE3CF" />
      <g fill="none" stroke="#56653a" strokeWidth="5" strokeLinecap="round">
        <path d="M30 250 C 110 228, 180 232, 250 262" />
        {[50, 80, 110, 140, 170, 200].map((x, i) => <path key={x} d={`M${x} ${245 - i} l-14 -26 M${x} ${245 - i} l12 -28`} strokeWidth="4" />)}
      </g>
      <circle cx="236" cy="150" r="92" fill="#E8952F" />
      <circle cx="206" cy="118" r="30" fill="#F6B45C" opacity="0.6" />
      <g fill="#5a3a22">
        {Array.from({ length: 26 }, (_, i) => {
          const t = i * 0.52;
          const r = 12 + i * 3;
          return <circle key={i} cx={236 + Math.cos(t) * r} cy={150 + Math.sin(t) * r} r="5.2" />;
        })}
      </g>
      <path d="M236 58 q4 -18 18 -24" fill="none" stroke="#5a3a22" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function ArticleCover({ a, ratio = "4 / 3", eager = false }: { a: Article; ratio?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const photo = a.image && !failed;
  return (
    <div className="edit-cover" style={{ aspectRatio: ratio }}>
      {photo && a.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image.src} alt={a.image.alt} loading={eager ? "eager" : "lazy"} referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <Drawn kind={a.fallback} />
      )}
    </div>
  );
}
