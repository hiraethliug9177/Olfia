"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { FAMILIES, OCCASION_OPTIONS, DAYPART_OPTIONS, SOURCE_OPTIONS, familyById, roomLabel, sourceLabel, methodLabel } from "@/lib/catalog";
import { partOfDay, hourOnly } from "@/lib/dates";
import { usePrefs } from "@/lib/prefs";
import type { CaptureEntry, Entry, FamilyId, Occasion, SourceKind } from "@/lib/types";
import { Stamp } from "@/components/scene/Stamp";
import { ItemArt } from "@/components/scene/Cutout";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * My Scentprint (Scent Atlas, copy v1 of 11/24): Tiffany merged the old "Tags & profile" tab with My Preferences
 * (which was on My Page), asked for a map that grows from the families a person records (her Notion "Capstone
 * Draft", Scent Atlas), and for the long duplicate summary to go. Three parts, kept apart as the copy guide asks
 * (§6, recorded frequency vs selected preference):
 *  1. the map: how often each family appears in what was recorded, with her three favourites
 *     (Top scent family with its stamp, Favorite format with its Rooms illustration, Favorite ritual);
 *  2. My Preferences: what the person says they like;
 *  3. the tag index.
 * Headings, lead, preference lines and empty line: her copy (§5.3, §10.3). "Recorded frequency" is a plain label
 * added so the map is not read as a preference; hers to change.
 */

const SOURCE_ITEMS: Partial<Record<string, SourceKind>> = { candle: "candle", diffuser: "diffuser", spray: "spray", incense: "incense", oil: "oil" };
const RITUAL_ICONS: Record<Occasion, IconName> = {
  everyday: "sun", date: "heart", party: "partyPopper", meditation: "leaf", bath: "bath",
  sleep: "moon", work: "laptop", guests: "users", cleaning: "sparkles", holiday: "gift",
};

function tally<T extends string>(xs: T[]): Array<[T, number]> {
  const m = new Map<T, number>();
  xs.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function topFamily(entries: Entry[], part: "morning" | "night"): FamilyId | null {
  const rows = tally(entries.filter((e) => partOfDay(new Date(e.createdAt)) === part).flatMap((e) => e.families));
  return rows[0]?.[0] ?? null;
}

function captureTitle(e: CaptureEntry): string {
  if (e.what.mode === "product") return e.what.productName || e.what.scentName || sourceLabel(e.source);
  return e.what.text || methodLabel(e.what.method);
}

/** Seven axes in the dial's order; each point reaches as far as that family is recorded. Full family names (copy guide). */
function ScentMap({ counts }: { counts: Record<FamilyId, number> }) {
  const CX = 240;
  const C = 160;
  const R = 104;
  const max = Math.max(1, ...Object.values(counts));
  const at = (i: number, r: number) => {
    const a = (-90 + (360 / FAMILIES.length) * i) * (Math.PI / 180);
    return [CX + r * Math.cos(a), C + r * Math.sin(a)] as const;
  };
  const pts = FAMILIES.map((f, i) => at(i, (counts[f.id] / max) * R));
  const any = Object.values(counts).some((n) => n > 0);
  const summary = FAMILIES.map((f) => `${f.label} ${counts[f.id]}`).join(", ");
  return (
    <svg viewBox="0 0 480 320" className="scentmap" role="img" aria-label={`Recorded scent families: ${summary}`}>
      {[1 / 3, 2 / 3, 1].map((k) => <circle key={k} cx={CX} cy={C} r={R * k} fill="none" stroke="rgba(41,42,49,0.14)" />)}
      {FAMILIES.map((f, i) => {
        const [x, y] = at(i, R);
        const [lx, ly] = at(i, R + 18);
        return (
          <g key={f.id}>
            <line x1={CX} y1={C} x2={x} y2={y} stroke="rgba(41,42,49,0.14)" />
            <text x={lx} y={ly} textAnchor={Math.abs(lx - CX) < 8 ? "middle" : lx > CX ? "start" : "end"} dominantBaseline="middle" className="scentmap__label">{f.label}</text>
          </g>
        );
      })}
      {any ? <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="rgba(160,166,200,0.28)" stroke="#4C527A" strokeWidth={1.5} /> : null}
      {any ? FAMILIES.map((f, i) => counts[f.id] > 0 ? <circle key={f.id} cx={pts[i][0]} cy={pts[i][1]} r={6} fill={f.hex} stroke="#fff" strokeWidth={2} /> : null) : null}
    </svg>
  );
}

export function Scentprint({ entries, tag, setTag }: { entries: Entry[]; tag: string | null; setTag: (t: string | null) => void }) {
  const [prefs, savePrefs] = usePrefs();
  const flip = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const caps = entries.filter((e): e is CaptureEntry => e.type === "capture");
  const counts = Object.fromEntries(FAMILIES.map((f) => [f.id, 0])) as Record<FamilyId, number>;
  entries.forEach((e) => e.families.forEach((f) => { counts[f] += 1; }));
  const famRows = tally(entries.flatMap((e) => e.families));
  const top = famRows[0]?.[0] ?? null;

  const formats = tally([
    ...caps.map((c) => c.source).filter((s) => s !== "fragrance-free" && s !== "other"),
    ...entries.flatMap((e) => (e.type === "rooms" ? e.items.map((i) => SOURCE_ITEMS[i.kind]).filter((s): s is SourceKind => Boolean(s)) : [])),
  ]);
  const format = formats[0]?.[0] ?? null;
  const formatItem = format ? Object.keys(SOURCE_ITEMS).find((k) => SOURCE_ITEMS[k] === format) : undefined;

  const occasions = tally(caps.map((c) => c.occasion).filter((o): o is Occasion => Boolean(o)));
  const ritual = occasions[0]?.[0] ?? null;
  const dayparts = tally(caps.map((c) => c.daypart).filter((d): d is NonNullable<typeof d> => Boolean(d)));
  const ritualLabel = ritual ? OCCASION_OPTIONS.find((o) => o.id === ritual)?.label : dayparts[0] ? DAYPART_OPTIONS.find((d) => d.id === dayparts[0][0])?.label : null;

  const night = topFamily(entries, "night");
  const morning = topFamily(entries, "morning");

  const tagCounts = tally(caps.flatMap((c) => c.tags ?? []));
  const tagged = tag ? caps.filter((c) => (c.tags ?? []).includes(tag)) : [];

  return (
    <div className="scentprint">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2 className="h-section" style={{ fontSize: 34 }}>My Scentprint</h2>
        <p className="lead" style={{ margin: 0 }}>A closer look at the details you’ve collected. Revisit the tags that connect your scent notes and make your archive easier to explore.</p>
      </div>

      <section className="scentprint__map" aria-label="Scent map">
        <div className="scentprint__mapcol">
          <span className="label-mono">Recorded frequency</span>
          <ScentMap counts={counts} />
        </div>
        <div className="scentprint__favs">
          <div className="fav">
            <span className="label-mono">Top scent family</span>
            {top ? <Stamp family={top} size={72} /> : null}
            <span className="fav__name">{top ? familyById(top).label : "—"}</span>
          </div>
          <div className="fav">
            <span className="label-mono">Favorite format</span>
            {formatItem ? <span className="fav__art" aria-hidden="true"><ItemArt kind={formatItem} prefix="fav" /></span> : null}
            <span className="fav__name">{format ? sourceLabel(format) : "—"}</span>
          </div>
          <div className="fav">
            <span className="label-mono">Favorite ritual</span>
            {ritual ? <span className="fav__icon" aria-hidden="true"><Icon name={RITUAL_ICONS[ritual]} size={40} /></span> : null}
            <span className="fav__name">{ritualLabel ?? "—"}</span>
          </div>
        </div>
      </section>

      <section id="preferences" className="scentprint__prefs anchor" aria-labelledby="prefs-h">
        <h3 id="prefs-h" className="h-section" style={{ fontSize: 28 }}>My Preferences</h3>
        <span className="label-mono">Preferred Scent Families</span>
        <div className="pref-chips" role="group" aria-label="Preferred scent families">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" className="pref-chip" aria-pressed={prefs.families.includes(f.id)} onClick={() => savePrefs({ ...prefs, families: flip(prefs.families, f.id) })}>
              <span className="chip__dot" style={{ background: f.hex }} aria-hidden="true" />{f.label}
            </button>
          ))}
        </div>
        <span className="label-mono">Preferred Products</span>
        <div className="pref-chips" role="group" aria-label="Preferred products">
          {SOURCE_OPTIONS.filter((s) => s.id !== "other").map((s) => (
            <button key={s.id} type="button" className="pref-chip" aria-pressed={prefs.sources.includes(s.id)} onClick={() => savePrefs({ ...prefs, sources: flip(prefs.sources, s.id) })}>{s.label}</button>
          ))}
        </div>
        {night || morning ? (
          <p style={{ margin: 0, fontSize: 20 }}>
            Your records feature{" "}
            {night ? <><span className="hl" style={{ "--hl": `${familyById(night).hex}66` } as CSSProperties}>{familyById(night).label}</span> at night</> : null}
            {night && morning ? " and " : null}
            {morning ? <><span className="hl" style={{ "--hl": `${familyById(morning).hex}66` } as CSSProperties}>{familyById(morning).label}</span> in the morning</> : null}.
          </p>
        ) : null}
        <figure className="pref-scene">
          <img
            src="/assets/preferences/sample-scene.png"
            width={192}
            height={108}
            alt="Pixel picture: a timber cabin among cedar trees at dusk, a candle in its window, mist from the chimney and an orange tree beside it"
          />
        </figure>
      </section>

      <section className="scentprint__tags" aria-labelledby="tags-h">
        <h3 id="tags-h" className="label-mono" style={{ margin: 0 }}>Your Tags</h3>
        {tagCounts.length ? (
          <div className="chips">
            {tagCounts.map(([t, n]) => (
              <button key={t} type="button" className={`tag${tag === t ? " tag--on" : ""}`} onClick={() => setTag(tag === t ? null : t)} style={{ border: 0, cursor: "pointer" }}>#{t} <span style={{ marginLeft: 6, opacity: 0.7 }}>{n}</span></button>
            ))}
          </div>
        ) : <span className="muted">Add tags when you capture a scent to start building your personal index.</span>}
        {tag ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {tagged.map((e) => (
              <div key={e.id} className="light" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16, borderRadius: 18, background: "var(--ivory)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {e.families[0] ? <Stamp family={e.families[0]} size={48} /> : null}
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 17, fontWeight: 600 }}>{captureTitle(e)}</span>
                    <span className="mono muted" style={{ fontSize: 13 }}>{roomLabel(e.room)} · {hourOnly(new Date(e.createdAt))}</span>
                  </span>
                </div>
                {e.momentName || e.situation ? <span className="hand" style={{ fontSize: 21 }}>{e.momentName || e.situation}</span> : null}
                <div className="chips">{(e.tags ?? []).map((t) => <span key={t} className="tag" style={{ minHeight: 26, fontSize: 12 }}>#{t}</span>)}</div>
                <Link href={`/card?from=${e.id}`} className="btn btn--ghost btn--sm" style={{ height: 36, alignSelf: "flex-start" }}>Scent Card</Link>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
