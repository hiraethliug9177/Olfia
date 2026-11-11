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
    /* ---- Kitchen (2026-11-10, drawn in code; Tiffany: 厨房和浴室房间) ---- */
    case "counter":
      return (
        <Art viewBox="0 0 300 165" prefix={p}>
          <rect x="8" y="15" width="284" height="140" fill="#7C8A4A" />
          <rect x="14" y="155" width="272" height="10" fill="#4E5A2A" />
          {[14, 206].map((x) => (
            <g key={x}>
              <rect x={x} y="21" width="90" height="26" rx="2" fill="#8E9B5A" />
              <rect x={x + 35} y="32" width="20" height="4" rx="2" fill="#C9935A" />
              <rect x={x} y="53" width="90" height="96" rx="2" fill="#8E9B5A" />
              <rect x={x + 8} y="61" width="74" height="80" rx="2" fill="#7C8A4A" />
              <circle cx={x === 14 ? x + 80 : x + 10} cy="101" r="3.5" fill="#C9935A" />
            </g>
          ))}
          <rect x="110" y="21" width="90" height="26" rx="2" fill="#3A332D" />
          {[126, 146, 166, 186].map((x) => <circle key={x} cx={x - 2} cy="34" r="4.5" fill="#C9CBD6" />)}
          <rect x="110" y="53" width="90" height="96" rx="2" fill="#2F2A26" />
          <rect x="114" y="59" width="82" height="5" rx="2.5" fill="#C9CBD6" />
          <rect x="120" y="72" width="70" height="66" rx="5" fill="#4A403A" />
          <path d="M128 80 L146 80" stroke="#6B5F56" strokeWidth="3" strokeLinecap="round" />
          <rect x="0" y="0" width="300" height="12" rx="2" fill="#EDE6D8" />
          <rect x="0" y="10" width="300" height="5" fill="#D3C9B6" />
        </Art>
      );
    case "backsplash":
      return (
        <Art viewBox="0 0 300 120" prefix={p}>
          <rect width="300" height="120" fill="#F4F1E8" />
          {Array.from({ length: 40 }, (_, i) => {
            const c = i % 10;
            const r = Math.floor(i / 10);
            const fill = ["#DCE5D3", "#D1DEC6", "#E2E9DA", "#C9D7BD"][(r * 7 + c * 3) % 4];
            return <rect key={i} x={c * 30 + 1.5} y={r * 30 + 1.5} width="27" height="27" rx="2" fill={fill} />;
          })}
          {[[1, 0], [4, 2], [7, 1], [9, 3], [2, 3]].map(([c, r]) => <path key={`${c}${r}`} d={`M${c * 30 + 6} ${r * 30 + 9} l7 -4`} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />)}
        </Art>
      );
    case "jar-shelf":
      return (
        <Art viewBox="0 0 160 84" prefix={p}>
          <path d="M20 74 v10 l12 -10 Z M140 74 v10 l-12 -10 Z" fill="#6A4126" />
          {[
            { x: 8, w: 26, top: 22, fill: "#E9C46A" },
            { x: 40, w: 24, top: 36, fill: "#7A3B2A" },
            { x: 70, w: 20, top: 46, fill: "#C1662F" },
            { x: 96, w: 24, top: 30, fill: "#EDE3CF" },
          ].map((j) => (
            <g key={j.x}>
              <rect x={j.x} y={j.top} width={j.w} height={66 - j.top} rx="5" fill="#E3ECEE" />
              <rect x={j.x + 2} y={j.top + 10} width={j.w - 4} height={66 - j.top - 12} rx="3" fill={j.fill} />
              <rect x={j.x + 1} y={j.top - 6} width={j.w - 2} height="7" rx="2" fill="#C9A27A" />
              <rect x={j.x + 4} y={j.top + 4} width="3" height={66 - j.top - 12} rx="1.5" fill="#FFFFFF" opacity="0.6" />
            </g>
          ))}
          <path d="M128 66 V40 Q128 34 133 32 V24 h6 v8 Q144 34 144 40 V66 Z" fill="#B8742A" />
          <rect x="132" y="19" width="8" height="6" rx="1.5" fill="#3A2C20" />
          <rect x="0" y="66" width="160" height="8" rx="1.5" fill="#8A5A33" />
        </Art>
      );
    case "kettle":
      return (
        <Art viewBox="0 0 60 56" prefix={p}>
          <path d="M16 26 C16 6 44 6 44 26" stroke="#3A2C20" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M47 41 L58 29 L55.5 27 L45 35 Z" fill="#B4552E" />
          <path d="M10 52 C8 34 14 22 30 22 C46 22 52 34 50 52 Z" fill="#B4552E" />
          <path d="M17 45 C16 37 19 31 24 29" stroke="#F1C9A8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          <ellipse cx="30" cy="22.5" rx="11" ry="3" fill="#8E3F22" />
          <circle cx="30" cy="17.5" r="3" fill="#3A2C20" />
          <rect x="9" y="51" width="42" height="5" rx="2" fill="#8E3F22" />
        </Art>
      );
    case "simmer-pot":
      return (
        <Art viewBox="0 0 70 72" prefix={p}>
          {[22, 35, 48].map((x, i) => <path key={x} d={`M${x} 22 C${x - 6} 16 ${x + 6} 11 ${x} ${3 + i * 2}`} stroke="#C9CBD6" strokeWidth="2.4" fill="none" strokeLinecap="round" />)}
          <circle cx="25" cy="31" r="7.5" fill="#E2A23B" />
          <circle cx="25" cy="31" r="5" fill="#F6C76B" />
          <path d="M25 26 v10 M20 31 h10" stroke="#E2A23B" strokeWidth="1" />
          <rect x="36" y="25" width="20" height="4.5" rx="2" fill="#8A4A26" transform="rotate(-14 46 27)" />
          <rect x="0" y="38" width="9" height="5" rx="2" fill="#3A2C20" />
          <rect x="61" y="38" width="9" height="5" rx="2" fill="#3A2C20" />
          <rect x="8" y="34" width="54" height="38" rx="6" fill="#4C527A" />
          <rect x="14" y="41" width="4" height="24" rx="2" fill="#A0A6C8" opacity="0.6" />
          <rect x="5" y="30" width="60" height="7" rx="3" fill="#3D4266" />
        </Art>
      );
    case "fruit-bowl":
      return (
        <Art viewBox="0 0 80 52" prefix={p}>
          <path d="M44 9 C48 2 56 1 60 4 C56 9 50 11 44 9 Z" fill="#6B7A36" />
          <ellipse cx="24" cy="22" rx="11" ry="9" fill="#E8C547" />
          <circle cx="42" cy="18" r="11" fill="#E2A23B" />
          <ellipse cx="58" cy="23" rx="11" ry="9" fill="#E8C547" />
          <circle cx="38" cy="14" r="2.5" fill="#F6C76B" />
          <path d="M4 26 H76 C74 42 60 48 40 48 C20 48 6 42 4 26 Z" fill="#F1E8D8" />
          <path d="M7.5 33 H72.5" stroke="#4C527A" strokeWidth="3" />
          <rect x="30" y="47" width="20" height="5" rx="1.5" fill="#DCCFB8" />
        </Art>
      );
    case "herb-pots":
      return (
        <Art viewBox="0 0 90 70" prefix={p}>
          {[[16, 30, 0], [26, 24, 20], [30, 34, -10], [14, 20, 30], [22, 14, -20], [32, 18, 10]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="7" ry="4.5" fill={i % 2 ? "#7FA046" : "#6B8A3A"} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <path d="M23 42 V18" stroke="#4E5A2A" strokeWidth="1.6" />
          {[56, 64, 72, 80].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 42 Q${x + (i % 2 ? 3 : -3)} 24 ${x + (i % 2 ? 1 : -1)} ${8 + i * 2}`} stroke="#5F6E30" strokeWidth="1.6" fill="none" />
              {[14, 20, 26, 32].map((y) => <path key={y} d={`M${x - 3} ${y + i} l6 -2`} stroke="#6B7A36" strokeWidth="1.4" strokeLinecap="round" />)}
            </g>
          ))}
          {[6, 50].map((x) => (
            <g key={x}>
              <path d={`M${x} 44 H${x + 34} L${x + 30} 70 H${x + 4} Z`} fill="#B8683F" />
              <rect x={x - 2} y="40" width="38" height="7" rx="2" fill="#A35A35" />
            </g>
          ))}
        </Art>
      );
    /* ---- Bathroom ---- */
    case "bathtub":
      return (
        <Art viewBox="0 0 300 162" prefix={p}>
          <path d="M24 40 V16 Q24 8 32 8 H38 Q44 8 44 14 V19" stroke="#C9935A" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="15" cy="30" r="4" fill="#C9935A" />
          <path d="M15 34 V40" stroke="#C9935A" strokeWidth="3" />
          {[[150, 34, 9], [166, 30, 11], [184, 34, 8], [200, 31, 10], [218, 35, 7], [234, 33, 8]].map(([x, y, r]) => (
            <circle key={x} cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#DDE1EA" strokeWidth="1.2" />
          ))}
          <path d="M56 136 q-8 16 -20 26 h24 q4 -12 10 -26 Z" fill="#C9935A" />
          <path d="M244 136 q8 16 20 26 h-24 q-4 -12 -10 -26 Z" fill="#C9935A" />
          <path d="M14 46 H286 C284 104 252 136 196 140 H104 C48 136 16 104 14 46 Z" fill="#4C527A" />
          <path d="M30 60 C40 98 70 122 110 126" stroke="#6E76A8" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
          <rect x="6" y="38" width="288" height="12" rx="6" fill="#F7F4EE" />
        </Art>
      );
    case "pedestal-sink":
      return (
        <Art viewBox="0 0 100 158" prefix={p}>
          <path d="M50 24 V12 Q50 6 58 6 H64" stroke="#C9CBD6" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="43" y="19" width="14" height="7" rx="2" fill="#AEB1BF" />
          <path d="M40 60 H60 L64 146 H36 Z" fill="#EFEAE0" />
          <path d="M44 66 L46 140" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M6 28 H94 V34 C94 52 74 62 50 62 C26 62 6 52 6 34 Z" fill="#F7F4EE" />
          <path d="M16 48 C28 56 72 56 84 48" stroke="#DCD6CB" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="4" y="24" width="92" height="8" rx="4" fill="#FFFFFF" />
          <rect x="28" y="146" width="44" height="12" rx="4" fill="#E2DCD0" />
        </Art>
      );
    case "bath-tiles":
      return (
        <Art viewBox="0 0 300 130" prefix={p}>
          <rect width="300" height="130" fill="#EEF3F4" />
          {Array.from({ length: 15 * 6 }, (_, i) => {
            const c = i % 15;
            const r = Math.floor(i / 15);
            const fill = r === 0 ? "#A0A6C8" : ["#D7E4E8", "#CDDDE2", "#DDE8EB"][(r * 5 + c * 2) % 3];
            return <rect key={i} x={c * 20 + 1} y={r * 21.6 + 1} width="18" height="19.6" rx="1.5" fill={fill} />;
          })}
        </Art>
      );
    case "round-mirror":
      return (
        <Art viewBox="0 0 90 104" prefix={p}>
          <path d="M45 3 L28 24 M45 3 L62 24" stroke="#6A4126" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="45" cy="3" r="3" fill="#3A2C20" />
          <circle cx="45" cy="62" r="42" fill="#C9935A" />
          <circle cx="45" cy="62" r="36" fill="#DCE7EB" />
          <path d="M23 56 L45 32" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
          <path d="M30 70 L56 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        </Art>
      );
    case "towel-rail":
      return (
        <Art viewBox="0 0 110 92" prefix={p}>
          <rect x="8" y="2" width="6" height="12" rx="2" fill="#A9761F" />
          <rect x="96" y="2" width="6" height="12" rx="2" fill="#A9761F" />
          <path d="M14 10 H54 V92 H14 Z" fill="#F1E8D8" />
          <rect x="14" y="10" width="40" height="9" fill="#E2D6C0" />
          <rect x="14" y="72" width="40" height="5" fill="#B4552E" />
          <rect x="14" y="80" width="40" height="2.5" fill="#B4552E" />
          <path d="M58 10 H96 V76 H58 Z" fill="#9DB28A" />
          <rect x="58" y="10" width="38" height="9" fill="#8CA078" />
          {[61, 66, 71, 76, 81, 86, 91].map((x) => <path key={x} d={`M${x} 76 v5`} stroke="#8CA078" strokeWidth="1.6" strokeLinecap="round" />)}
          <rect x="4" y="7" width="102" height="5" rx="2.5" fill="#C9935A" />
        </Art>
      );
    case "bath-mat":
      return (
        <Art viewBox="0 0 300 46" prefix={p}>
          <path d="M30 2 H270 L292 46 H8 Z" fill="#EAE3D4" />
          <path d="M25 12 H275 L278 18 H22 Z" fill="#8FB5B8" />
          <path d="M16 30 H284 L287 36 H13 Z" fill="#8FB5B8" />
        </Art>
      );
    case "soap":
      return (
        <Art viewBox="0 0 60 27" prefix={p}>
          <rect x="12" y="5" width="36" height="13" rx="5" fill="#C7B6E0" />
          <rect x="16" y="7.5" width="16" height="3" rx="1.5" fill="#E6DDF4" />
          <circle cx="51" cy="6" r="3.2" fill="#FFFFFF" stroke="#D5D9E6" strokeWidth="1" />
          <circle cx="56" cy="11" r="2" fill="#FFFFFF" stroke="#D5D9E6" strokeWidth="1" />
          <path d="M2 18 H58 C56 24 48 27 30 27 C12 27 4 24 2 18 Z" fill="#F1E8D8" />
          <rect x="1" y="15.5" width="58" height="4" rx="2" fill="#E6DAC4" />
        </Art>
      );
    case "bottles":
      return (
        <Art viewBox="0 0 80 70" prefix={p}>
          <rect x="9" y="8" width="18" height="5" rx="2" fill="#3A2C20" />
          <path d="M27 10.5 h6" stroke="#3A2C20" strokeWidth="3" strokeLinecap="round" />
          <rect x="11" y="13" width="8" height="10" fill="#3A2C20" />
          <rect x="4" y="22" width="22" height="48" rx="5" fill="#B8742A" />
          <rect x="7" y="38" width="16" height="16" rx="1" fill="#F1E8D8" />
          <rect x="34" y="22" width="12" height="9" rx="2" fill="#F1E8D8" />
          <rect x="30" y="30" width="20" height="40" rx="6" fill="#9DB28A" />
          <rect x="33" y="36" width="3" height="26" rx="1.5" fill="#FFFFFF" opacity="0.5" />
          <rect x="59" y="32" width="12" height="7" rx="2" fill="#4C527A" />
          <rect x="54" y="38" width="22" height="32" rx="10" fill="#F7F4EE" />
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
