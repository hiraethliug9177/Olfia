"use client";

import type { CSSProperties } from "react";
import { familyById } from "@/lib/catalog";
import type { FamilyId } from "@/lib/types";

/**
 * Atmosphere layer (feedback 11/4: "let me feel the scent").
 * One reusable layer keyed by scent family: a colour wash plus one slow ambient motion.
 * Used behind Rooms, in the Capture preview, on the quiz result and on Home.
 * Everything is CSS; `prefers-reduced-motion` stops the motion (see globals.css).
 *
 *   woody    drifting dust motes in warm light
 *   citrus   bright sun spots
 *   floral   slow falling petals
 *   green    leaf shadows swaying
 *   gourmand soft rising steam
 *   spicy    ember glow pulse
 *   fresh    rippling water light
 */

export interface AtmosphereProps {
  families: FamilyId[];
  /** 0–1, scales opacity of the motion layer */
  intensity?: number;
  /** keep the paper visible (scene) or fill a page section (page) */
  variant?: "scene" | "page";
  style?: CSSProperties;
  className?: string;
}

const seeded = (n: number, salt: number) => {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Particles({ family, count, kind }: { family: FamilyId; count: number; kind: "mote" | "spot" | "petal" | "leaf" | "steam" }) {
  const f = familyById(family);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const left = seeded(i, 1) * 100;
        const top = seeded(i, 2) * 100;
        const dur = 9 + seeded(i, 3) * 12;
        const delay = -seeded(i, 4) * dur;
        const size = kind === "spot" ? 60 + seeded(i, 5) * 120 : kind === "steam" ? 40 + seeded(i, 5) * 60 : kind === "leaf" ? 50 + seeded(i, 5) * 70 : 5 + seeded(i, 5) * 9;
        const style: CSSProperties = {
          left: `${left}%`,
          top: kind === "petal" ? `${-10 - seeded(i, 6) * 20}%` : kind === "steam" ? "auto" : `${top}%`,
          bottom: kind === "steam" ? `${seeded(i, 6) * 20}%` : undefined,
          width: size,
          height: kind === "petal" ? size * 0.7 : kind === "steam" ? size * 2.6 : size,
          animationDuration: `${dur}s`,
          animationDelay: `${delay}s`,
          background:
            kind === "spot"
              ? `radial-gradient(circle, ${f.glow} 0%, rgba(255,255,255,0) 70%)`
              : kind === "leaf"
                ? `radial-gradient(ellipse at center, rgba(60,70,30,0.22) 0%, rgba(60,70,30,0) 70%)`
                : kind === "steam"
                  ? "linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)"
                  : kind === "petal"
                    ? f.hex
                    : "rgba(255, 236, 200, 0.9)",
          borderRadius: kind === "petal" ? "60% 40% 60% 40% / 50% 50% 50% 50%" : "50%",
          filter: kind === "spot" || kind === "leaf" ? "blur(10px)" : kind === "steam" ? "blur(12px)" : "blur(0.6px)",
          opacity: kind === "petal" ? 0.75 : undefined,
          rotate: kind === "leaf" ? `${seeded(i, 7) * 60 - 30}deg` : undefined,
        };
        return <span key={i} className={`atm__${kind}`} style={style} aria-hidden="true" />;
      })}
    </>
  );
}

function Layer({ family }: { family: FamilyId }) {
  switch (family) {
    case "woody":
      return <Particles family={family} count={26} kind="mote" />;
    case "citrus":
      return <Particles family={family} count={6} kind="spot" />;
    case "floral":
      return <Particles family={family} count={14} kind="petal" />;
    case "green":
      return <Particles family={family} count={7} kind="leaf" />;
    case "gourmand":
      return <Particles family={family} count={7} kind="steam" />;
    case "spicy":
      return <span className="atm__ember" aria-hidden="true" />;
    case "fresh":
      return <span className="atm__water" aria-hidden="true" />;
    default:
      return null;
  }
}

export function Atmosphere({ families, intensity = 1, variant = "scene", style, className }: AtmosphereProps) {
  const fams = families.slice(0, 2);
  if (fams.length === 0) return null;
  const [a, b] = fams.map(familyById);
  const wash = b
    ? `linear-gradient(135deg, ${a.glow} 0%, rgba(255,255,255,0) 55%), linear-gradient(315deg, ${b.glow} 0%, rgba(255,255,255,0) 55%)`
    : `radial-gradient(ellipse at 50% 60%, ${a.glow} 0%, rgba(255,255,255,0) 70%)`;
  return (
    <div
      className={`atm atm--${variant} ${className ?? ""}`}
      style={{ ...style, opacity: intensity }}
      aria-hidden="true"
      data-family={fams.join("+")}
    >
      <div className="atm__wash" style={{ background: wash }} />
      {fams.map((f) => (
        <div key={f} className="atm__layer">
          <Layer family={f} />
        </div>
      ))}
    </div>
  );
}
