import type { CSSProperties, ReactNode } from "react";
import { findMaterial, itemById, texture } from "@/lib/catalog";

/**
 * Shared SVG definitions for the drawn cut-out stand-ins: the white die-cut edge filter,
 * fabric patterns and gradients. Rendered once per page (root layout) and once inside
 * exportable nodes so html-to-image can resolve the references.
 */
export function CutDefs({ prefix = "olfia" }: { prefix?: string }) {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id={`${prefix}-cut`} x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="dil" />
          <feFlood floodColor="#FFFFFF" result="white" />
          <feComposite in="white" in2="dil" operator="in" result="edge" />
          <feGaussianBlur in="dil" stdDeviation="2.4" result="blur" />
          <feOffset in="blur" dx="1" dy="3" result="off" />
          <feFlood floodColor="#292A31" floodOpacity="0.28" />
          <feComposite in2="off" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="edge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id={`${prefix}-cord`} width="5" height="10" patternUnits="userSpaceOnUse">
          <rect width="5" height="10" fill="#7C8743" />
          <rect width="2" height="10" fill="#6A7436" />
        </pattern>
        <pattern id={`${prefix}-rugp`} width="22" height="22" patternUnits="userSpaceOnUse">
          <rect width="22" height="22" fill="#8E3B26" />
          <path d="M11 7v8M7 11h8" stroke="#E9D9C3" strokeWidth="1.4" strokeLinecap="round" />
        </pattern>
        <linearGradient id={`${prefix}-jar`} x1="0" x2="1">
          <stop offset="0" stopColor="#9A4F22" />
          <stop offset="0.45" stopColor="#D08A45" />
          <stop offset="1" stopColor="#8A431C" />
        </linearGradient>
        <radialGradient id={`${prefix}-globe`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#F6D58A" />
          <stop offset="0.6" stopColor="#D9A441" />
          <stop offset="1" stopColor="#A9761F" />
        </radialGradient>
        <linearGradient id={`${prefix}-wood`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7A4A2A" />
          <stop offset="1" stopColor="#5A341C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Art({ viewBox, prefix, children }: { viewBox: string; prefix: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ overflow: "visible", display: "block" }}>
      <g filter={`url(#${prefix}-cut)`}>{children}</g>
    </svg>
  );
}

function drawn(kind: string, p: string): ReactNode {
  switch (kind) {
    case "armchair":
      return (
        <Art viewBox="66 222 148 172" prefix={p}>
          <path d="M84 336 L78 392 M196 336 L202 392" stroke="#6A4126" strokeWidth="6" strokeLinecap="round" />
          <rect x="88" y="226" width="104" height="96" rx="16" fill={`url(#${p}-cord)`} />
          <rect x="80" y="300" width="120" height="40" rx="12" fill="#808B47" />
          <rect x="70" y="282" width="18" height="62" rx="7" fill={`url(#${p}-wood)`} />
          <rect x="192" y="282" width="18" height="62" rx="7" fill={`url(#${p}-wood)`} />
          <rect x="112" y="268" width="50" height="36" rx="9" fill="#A8552E" transform="rotate(-7 137 286)" />
        </Art>
      );
    case "side-table":
      return (
        <Art viewBox="230 280 82 114" prefix={p}>
          <rect x="234" y="302" width="74" height="8" rx="2" fill="#6A4126" />
          <path d="M242 310 L238 392 M300 310 L304 392" stroke="#6A4126" strokeWidth="5" strokeLinecap="round" />
          <rect x="240" y="352" width="62" height="5" rx="1.5" fill="#5A341C" />
          <rect x="244" y="292" width="46" height="10" rx="1.5" fill="#C9935A" />
          <rect x="248" y="283" width="38" height="9" rx="1.5" fill="#2F4A3A" />
        </Art>
      );
    case "arc-lamp":
      return (
        <Art viewBox="16 76 150 324" prefix={p}>
          <path d="M46 388 L46 170 Q46 80 132 84" stroke="#3A2C20" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="134" y="80" width="12" height="8" rx="2" fill="#3A2C20" />
          <circle cx="140" cy="108" r="21" fill={`url(#${p}-globe)`} />
          <ellipse cx="133" cy="100" rx="6" ry="4" fill="#FFF6DD" opacity="0.6" />
          <ellipse cx="46" cy="390" rx="26" ry="7" fill="#6E7A3E" />
        </Art>
      );
    case "plant":
      return (
        <Art viewBox="276 220 92 136" prefix={p}>
          <path d="M322 316 C318 280 300 262 290 250 M326 316 C330 276 346 258 350 246 M324 316 C324 286 326 262 322 236" stroke="#4E5A2A" strokeWidth="2" fill="none" />
          <ellipse cx="292" cy="254" rx="14" ry="7" fill="#6B7A36" transform="rotate(-35 292 254)" />
          <ellipse cx="348" cy="250" rx="13" ry="7" fill="#7C8A4A" transform="rotate(35 348 250)" />
          <ellipse cx="322" cy="238" rx="7" ry="15" fill="#5F6E30" />
          <ellipse cx="306" cy="282" rx="13" ry="6" fill="#7C8A4A" transform="rotate(-20 306 282)" />
          <ellipse cx="340" cy="280" rx="12" ry="6" fill="#6B7A36" transform="rotate(25 340 280)" />
          <path d="M306 316 L340 316 L334 352 L312 352 Z" fill="#B8683F" />
          <rect x="302" y="312" width="42" height="8" rx="2" fill="#A35A35" />
        </Art>
      );
    case "rug":
      return (
        <Art viewBox="4 368 352 68" prefix={p}>
          <path d="M26 372 L334 372 L352 432 L8 432 Z" fill={`url(#${p}-rugp)`} />
        </Art>
      );
    case "frame-landscape":
      return (
        <Art viewBox="146 30 92 74" prefix={p}>
          <rect x="150" y="34" width="84" height="66" fill="#5A3B22" />
          <rect x="156" y="40" width="72" height="54" fill="#F1E8D8" />
          <rect x="163" y="46" width="58" height="42" fill="#4F5E33" />
          <path d="M163 88 L190 60 L205 72 L221 56 L221 88 Z" fill="#7C8A4A" />
          <rect x="196" y="50" width="16" height="22" fill="#C9D3A8" opacity="0.75" />
        </Art>
      );
    case "frame-small":
      return (
        <Art viewBox="246 46 54 64" prefix={p}>
          <rect x="250" y="50" width="46" height="56" fill="#B08A4E" />
          <rect x="254" y="54" width="38" height="48" fill="#33402A" />
          <path d="M258 92 C266 74 276 84 288 62" stroke="#8FA05A" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M260 70 C268 66 274 76 284 72" stroke="#B9C68A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </Art>
      );
    case "candle":
      return (
        <Art viewBox="250 234 36 52" prefix={p}>
          <rect x="256" y="252" width="24" height="31" rx="4" fill={`url(#${p}-jar)`} />
          <rect x="256" y="262" width="24" height="10" fill="#F1E8D8" opacity="0.9" />
          <path d="M268 252 v-4" stroke="#292A31" strokeWidth="1.2" />
          <ellipse cx="268" cy="243" rx="3.2" ry="6" fill="#F2C14E" />
        </Art>
      );
    case "diffuser":
      return (
        <Art viewBox="0 0 40 80" prefix={p}>
          <path d="M14 4 L18 44 M20 2 L20 44 M27 6 L22 44" stroke="#5A3826" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="15" y="42" width="10" height="8" rx="1.5" fill="#3A2C20" />
          <path d="M10 52 Q10 48 14 48 L26 48 Q30 48 30 52 L31 76 Q31 79 28 79 L12 79 Q9 79 9 76 Z" fill="#B9C9CB" opacity="0.95" />
          <rect x="11" y="62" width="18" height="10" fill="#F1E8D8" />
        </Art>
      );
    case "spray":
      return (
        <Art viewBox="0 0 40 70" prefix={p}>
          <rect x="15" y="4" width="10" height="7" rx="2" fill="#3A2C20" />
          <path d="M25 7 h7" stroke="#3A2C20" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="11" width="8" height="7" fill="#C9CBD6" />
          <rect x="9" y="18" width="22" height="50" rx="5" fill="#A0A6C8" />
          <rect x="12" y="34" width="16" height="14" fill="#FFFFFF" opacity="0.85" />
        </Art>
      );
    case "incense":
      return (
        <Art viewBox="0 0 60 70" prefix={p}>
          <path d="M30 8 C24 14 36 18 30 26" stroke="#C9CBD6" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 28 L36 58" stroke="#5A3826" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="30" cy="62" rx="24" ry="6" fill="#6A4126" />
          <ellipse cx="30" cy="60" rx="20" ry="4" fill="#8A5A33" />
        </Art>
      );
    case "oil":
      return (
        <Art viewBox="0 0 50 60" prefix={p}>
          <ellipse cx="25" cy="12" rx="16" ry="5" fill="#D4A26A" />
          <path d="M11 14 L15 48 L35 48 L39 14 Z" fill="#E9DCC6" />
          <path d="M19 40 a6 6 0 0 1 12 0" fill="#3A2C20" />
          <ellipse cx="25" cy="36" rx="2" ry="4" fill="#F2C14E" />
          <rect x="12" y="48" width="26" height="5" rx="2" fill="#C9B79A" />
        </Art>
      );
    default:
      return null;
  }
}

/** Renders one item (drawn stand-in, lovart asset, or material window). Fills its parent box. */
export function ItemArt({ kind, prefix = "olfia" }: { kind: string; prefix?: string }) {
  const def = itemById(kind);
  if (def?.asset) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={def.asset} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} />;
  }
  const mat = findMaterial(kind);
  if (mat) {
    const style: CSSProperties = {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: texture(mat.colors),
      boxShadow: "0 0 0 4px #FFFFFF, 0 6px 12px rgba(41,42,49,0.22)",
    };
    return <div aria-hidden="true" style={style} />;
  }
  return <>{drawn(kind, prefix)}</>;
}
