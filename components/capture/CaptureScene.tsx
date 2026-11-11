"use client";

import type { CSSProperties } from "react";
import { familyById, itemById } from "@/lib/catalog";
import type { Daypart, FamilyId, RoomKind, SourceKind } from "@/lib/types";
import { Atmosphere } from "@/components/scene/Atmosphere";
import { ItemArt } from "@/components/scene/Cutout";

/**
 * The place and the light of the moment, drawn (11/9 feedback 11: each answer has to show).
 * Room decides the surface the scent sits on; time of day decides where the light comes from.
 */
const SURFACE: Record<RoomKind, "table" | "tiles" | "desk" | "rail" | "ledge"> = {
  living: "table", bedroom: "table", reading: "table", other: "table",
  kitchen: "tiles", bathroom: "tiles",
  study: "desk", office: "desk",
  closet: "rail", entryway: "rail",
  balcony: "ledge", car: "ledge",
};

function Setting({ room, daypart }: { room: RoomKind | null; daypart: Daypart | null }) {
  const kind = room ? SURFACE[room] : null;
  const ink = "#5a4a3a";
  return (
    <svg viewBox="0 0 340 490" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="cap-am" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE9B8" stopOpacity="0.9" /><stop offset="1" stopColor="#FFE9B8" stopOpacity="0" /></linearGradient>
        <linearGradient id="cap-noon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></linearGradient>
        <linearGradient id="cap-pm" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A45A" stopOpacity="0.85" /><stop offset="1" stopColor="#F2A45A" stopOpacity="0" /></linearGradient>
        <radialGradient id="cap-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#F6D58A" stopOpacity="0.95" /><stop offset="1" stopColor="#F6D58A" stopOpacity="0" /></radialGradient>
      </defs>
      {/* light */}
      <polygon points="0,40 150,40 340,360 150,360" fill="url(#cap-am)" style={{ opacity: daypart === "morning" ? 1 : 0, transition: "opacity 0.9s ease" }} />
      <polygon points="110,40 230,40 300,360 40,360" fill="url(#cap-noon)" style={{ opacity: daypart === "afternoon" ? 1 : 0, transition: "opacity 0.9s ease" }} />
      <polygon points="340,90 340,220 0,360 0,300" fill="url(#cap-pm)" style={{ opacity: daypart === "evening" ? 1 : 0, transition: "opacity 0.9s ease" }} />
      <g style={{ opacity: daypart === "night" ? 1 : 0, transition: "opacity 0.9s ease" }}>
        <rect width="340" height="490" fill="#2c2f4a" opacity="0.34" />
        <circle cx="240" cy="300" r="120" fill="url(#cap-lamp)" />
      </g>
      {/* surface */}
      {kind === "table" ? (
        <g key="table" className="anim-rise">
          <rect x="24" y="360" width="292" height="12" rx="3" fill="#8A5A33" />
          <path d="M40 362 h260" stroke="#b98a5c" strokeWidth="2" />
          <rect x="52" y="372" width="10" height="70" fill="#6f4627" /><rect x="278" y="372" width="10" height="70" fill="#6f4627" />
        </g>
      ) : null}
      {kind === "tiles" ? (
        <g key="tiles" className="anim-rise">
          <g stroke="#c9d3d6" strokeWidth="1.5" fill="none">{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${i * 50 + 20} 250 V360`} />)}<path d="M0 285 H340 M0 322 H340" /></g>
          <rect x="0" y="360" width="340" height="16" fill="#E8EEF0" /><rect x="0" y="376" width="340" height="4" fill="#b9c6ca" />
        </g>
      ) : null}
      {kind === "desk" ? (
        <g key="desk" className="anim-rise">
          <rect x="0" y="360" width="340" height="14" fill="#C7A27A" /><rect x="0" y="374" width="340" height="5" fill="#9c7a55" />
          <path d="M40 358 l70 -6 6 8 -70 6 Z" fill="#FBFAF6" stroke={ink} strokeWidth="1" />
          <path d="M150 356 l48 -10" stroke="#4C527A" strokeWidth="5" strokeLinecap="round" />
        </g>
      ) : null}
      {kind === "rail" ? (
        <g key="rail" className="anim-rise">
          <path d="M20 86 H320" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <g fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round"><path d="M92 86 q0 14 10 14 M102 100 l-44 26 h88 Z" /><path d="M214 86 q0 14 10 14 M224 100 l-44 26 h88 Z" /></g>
          <rect x="24" y="360" width="292" height="10" rx="3" fill="#8A5A33" />
        </g>
      ) : null}
      {kind === "ledge" ? (
        <g key="ledge" className="anim-rise">
          <g stroke={ink} strokeWidth="3" strokeLinecap="round">{[30, 80, 130, 180, 230, 280].map((x) => <path key={x} d={`M${x} 250 V360`} />)}<path d="M10 250 H330" strokeWidth="5" /></g>
          <rect x="0" y="360" width="340" height="12" fill="#b9b3a6" />
        </g>
      ) : null}
    </svg>
  );
}


/**
 * The picture side of a captured moment: the place's surface and light, the families' air and
 * materials, and what the scent came from. Shared by the Capture postcard and the Scent Card.
 */
export function CaptureScene({ room, daypart, families, source, blendKey = 0, place, prefix = "cap", atmosphere = true }: {
  room: RoomKind | null;
  daypart: Daypart | null;
  families: FamilyId[];
  source: SourceKind | null;
  blendKey?: number;
  place?: string;
  prefix?: string;
  /** the families' motion layer (the Scent Card can switch it off) */
  atmosphere?: boolean;
}) {
  const sourceDef = source ? itemById(source) : undefined;
  return (
    <>
      {atmosphere ? <Atmosphere key={blendKey} families={families} intensity={0.9} /> : null}
      <Setting room={room} daypart={daypart} />
      {families.map((f, i) => {
        const fam = familyById(f);
        const two = families.length === 2;
        const style: CSSProperties = {
          position: "absolute",
          left: two ? (i === 0 ? "2%" : "36%") : "16%",
          top: two ? (i === 0 ? "6%" : "18%") : "10%",
          width: "66%",
          aspectRatio: "1",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${fam.glow} 0%, rgba(255,255,255,0) 68%)`,
          filter: "blur(16px)",
          opacity: 0.85,
          transition: "left 1.1s var(--ease), top 1.1s var(--ease)",
        };
        return <div key={`${f}-${blendKey}`} className="anim-bloom" aria-hidden="true" style={style} />;
      })}
      {families.slice(0, 2).map((f, i) => {
        const m = familyById(f).materials[0];
        const spots = [{ l: "8%", t: "22%", r: -8 }, { l: "38%", t: "12%", r: 7 }];
        const sp = spots[i];
        return (
          <div key={`${m.id}-${i}`} className="anim-pin" aria-hidden="true" style={{ position: "absolute", left: sp.l, top: sp.t, width: "26%", aspectRatio: "1", rotate: `${sp.r}deg` }}>
            <ItemArt kind={m.id} prefix={prefix} />
          </div>
        );
      })}
      {sourceDef ? (
        <div className="anim-rise" aria-hidden="true" style={{ position: "absolute", left: "64%", bottom: "26.5%", width: `${Math.max(12, sourceDef.w * 130)}%`, aspectRatio: `${1 / sourceDef.aspect}` }}>
          <ItemArt kind={sourceDef.id} prefix={prefix} />
        </div>
      ) : null}
      {place ? <span className="postcard__place">{place}</span> : null}
    </>
  );
}
