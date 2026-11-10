import { familyById } from "@/lib/catalog";
import type { FamilyId } from "@/lib/types";

/**
 * Family stamp / postmark (feedback 11/4): one per scent family.
 * A postmark ring with the family name, a simple material silhouette in the middle,
 * and an optional date slot. Pure SVG, ink colour = family hex, so it works on paper,
 * on Scent Cards and on calendar pieces.
 */

export interface StampProps {
  family: FamilyId;
  size?: number;
  /** text under the silhouette, e.g. a date "11 · 09" */
  date?: string;
  rot?: number;
  className?: string;
  /** inked (default) or embossed outline only */
  variant?: "ink" | "outline";
}

function Silhouette({ family }: { family: FamilyId }) {
  // 100×100 box, drawn in currentColor
  switch (family) {
    case "woody": // tree rings
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2">
          <circle cx="50" cy="50" r="9" />
          <circle cx="50" cy="50" r="17" />
          <circle cx="50" cy="50" r="25" />
          <path d="M50 25 l0 8 M75 50 l-8 0" strokeLinecap="round" />
        </g>
      );
    case "citrus": // orange slice
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
          <circle cx="50" cy="50" r="24" />
          <circle cx="50" cy="50" r="19" strokeWidth="1.6" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1="50" y1="50" x2={50 + Math.cos(a) * 19} y2={50 + Math.sin(a) * 19} strokeWidth="2" />;
          })}
        </g>
      );
    case "floral": // five-petal bloom
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const px = 50 + Math.cos(a) * 15;
            const py = 50 + Math.sin(a) * 15;
            return <ellipse key={i} cx={px} cy={py} rx="8" ry="12" transform={`rotate(${(a * 180) / Math.PI + 90} ${px} ${py})`} />;
          })}
          <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
        </g>
      );
    case "green": // sprig
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
          <path d="M50 78 L50 26" />
          <path d="M50 66 C 40 64, 34 58, 33 50 C 42 50, 48 56, 50 66 Z" />
          <path d="M50 54 C 60 52, 66 46, 67 38 C 58 38, 52 44, 50 54 Z" />
          <path d="M50 44 C 40 42, 34 36, 33 28 C 42 28, 48 34, 50 44 Z" />
        </g>
      );
    case "gourmand": // coffee cup with steam
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 46 h34 v14 a17 17 0 0 1 -34 0 z" />
          <path d="M64 50 h6 a6 6 0 0 1 0 12 h-6" />
          <path d="M40 38 c0 -5 4 -5 4 -10 M50 38 c0 -5 4 -5 4 -10" />
          <path d="M28 76 h40" />
        </g>
      );
    case "spicy": // star anise
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            const x = 50 + Math.cos(a) * 24;
            const y = 50 + Math.sin(a) * 24;
            return <path key={i} d={`M50 50 L${x} ${y}`} />;
          })}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            const x = 50 + Math.cos(a) * 20;
            const y = 50 + Math.sin(a) * 20;
            return <circle key={`c${i}`} cx={x} cy={y} r="4.5" />;
          })}
        </g>
      );
    case "fresh": // waves
      return (
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
          <path d="M26 40 c6 -6 12 -6 18 0 s12 6 18 0 s12 -6 12 -6" />
          <path d="M26 52 c6 -6 12 -6 18 0 s12 6 18 0 s12 -6 12 -6" />
          <path d="M26 64 c6 -6 12 -6 18 0 s12 6 18 0 s12 -6 12 -6" />
        </g>
      );
    default:
      return null;
  }
}

export function Stamp({ family, size = 96, date, rot = -8, className, variant = "ink" }: StampProps) {
  const f = familyById(family);
  const label = `${f.label} · OLFIA · `;
  const text = label.repeat(3);
  const id = `stamp-${family}`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`stamp ${className ?? ""}`}
      style={{ color: f.hex, rotate: `${rot}deg` }}
      role="img"
      aria-label={`${f.label} stamp`}
    >
      <defs>
        <path id={`${id}-ring`} d="M50 50 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.4" strokeDasharray="3 2.2" />
      <circle cx="50" cy="50" r="33" fill={variant === "ink" ? "rgba(255,255,255,0.5)" : "none"} stroke="currentColor" strokeWidth="1.6" />
      <text fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7.6" fontWeight="600" letterSpacing="1.4" fill="currentColor">
        <textPath href={`#${id}-ring`} startOffset="0">{text}</textPath>
      </text>
      <g transform="translate(50 46) scale(0.56) translate(-50 -50)">
        <Silhouette family={family} />
      </g>
      {date ? (
        <text x="50" y="76" textAnchor="middle" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="8" fontWeight="600" fill="currentColor">
          {date}
        </text>
      ) : null}
    </svg>
  );
}
