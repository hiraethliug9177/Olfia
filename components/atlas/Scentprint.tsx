"use client";

import Link from "next/link";
import { FAMILIES, OCCASION_OPTIONS, DAYPART_OPTIONS, areNeighbours, familyById, roomLabel, sourceLabel, methodLabel, sourceKindOf } from "@/lib/catalog";
import { partOfDay, hourOnly } from "@/lib/dates";
import { matchProducts } from "@/lib/products";
import type { CaptureEntry, Entry, FamilyId, Occasion, SourceKind } from "@/lib/types";
import { Stamp } from "@/components/scene/Stamp";
import { ItemArt } from "@/components/scene/Cutout";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProductCard } from "@/components/products/ProductCards";
import { SAMPLE_SUMMARY } from "@/lib/copy/scentprint";
import { useAuthState } from "@/lib/mockAuth";

/**
 * My Scentprint (Scent Atlas). Copy v1 (11/24): the old "Tags & profile" tab with My Preferences merged in and a map
 * that grows from the families a person records (her Notion "Capstone Draft", Scent Atlas).
 * Design round (Tiffany's annotated screenshots, 11/24), top to bottom:
 *  1. the title and its line across the full width;
 *  2. the map, larger, with Top scent family / Most recorded format / Most recorded ritual stacked in one column
 *     beside it (renamed from "Favorite …" so recorded counts are not read as preferences; no "Recorded frequency" label);
 *  3. the picture, at three quarters of the width, with the line about night and morning as a handwritten quotation
 *     in its middle; the quarter beside it is kept for a future written summary of a person's preferences (placeholder);
 *     the preference chips are gone;
 *  4. the tag index;
 *  5. Something New to Explore and its three products, moved here from My Page's "Your Scents at a Glance" (removed).
 */

/** The picture for "Most recorded format": the original cut-out of each kind. */
const FORMAT_ART: Partial<Record<SourceKind, string>> = { candle: "candle", diffuser: "diffuser", spray: "spray", incense: "incense", oil: "oil" };
const RITUAL_ICONS: Record<Occasion, IconName> = {
  everyday: "sun", date: "heart", party: "partyPopper", meditation: "leaf", bath: "bath",
  sleep: "moon", work: "laptop", guests: "users", cleaning: "sparkles", holiday: "gift",
};
/** Fixed pairings for "Something New to Explore" (from the old glance summary, 11/4). */
const PAIRS: Record<FamilyId, [FamilyId, FamilyId]> = {
  floral: ["gourmand", "green"],
  gourmand: ["spicy", "floral"],
  spicy: ["woody", "citrus"],
  woody: ["spicy", "green"],
  green: ["citrus", "fresh"],
  citrus: ["fresh", "green"],
  fresh: ["citrus", "floral"],
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
  const CX = 260;
  const C = 175;
  const R = 116;
  const max = Math.max(1, ...Object.values(counts));
  const at = (i: number, r: number) => {
    const a = (-90 + (360 / FAMILIES.length) * i) * (Math.PI / 180);
    return [CX + r * Math.cos(a), C + r * Math.sin(a)] as const;
  };
  const pts = FAMILIES.map((f, i) => at(i, (counts[f.id] / max) * R));
  const any = Object.values(counts).some((n) => n > 0);
  const summary = FAMILIES.map((f) => `${f.label} ${counts[f.id]}`).join(", ");
  return (
    <svg viewBox="0 0 520 350" className="scentmap" role="img" aria-label={`Recorded scent families: ${summary}`}>
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
      {any ? <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="rgba(160,166,200,0.28)" stroke="#4C527A" strokeWidth={1.6} /> : null}
      {any ? FAMILIES.map((f, i) => counts[f.id] > 0 ? <circle key={f.id} cx={pts[i][0]} cy={pts[i][1]} r={7} fill={f.hex} stroke="#fff" strokeWidth={2} /> : null) : null}
    </svg>
  );
}

export function Scentprint({ entries, tag, setTag }: { entries: Entry[]; tag: string | null; setTag: (t: string | null) => void }) {
  const { sample } = useAuthState();
  const caps = entries.filter((e): e is CaptureEntry => e.type === "capture");
  const counts = Object.fromEntries(FAMILIES.map((f) => [f.id, 0])) as Record<FamilyId, number>;
  entries.forEach((e) => e.families.forEach((f) => { counts[f] += 1; }));
  const famRows = tally(entries.flatMap((e) => e.families));
  const top = famRows[0]?.[0] ?? null;

  const formats = tally([
    ...caps.map((c) => c.source).filter((s) => s !== "fragrance-free" && s !== "other"),
    // Rooms v2: the new fragrance objects count as their kind (a tulip wax lamp is not a Capture source, so it is left out)
    ...entries.flatMap((e) => (e.type === "rooms" ? e.items.map((i) => sourceKindOf(i.kind)).filter((s): s is SourceKind => Boolean(s)) : [])),
  ]);
  const format = formats[0]?.[0] ?? null;
  const formatItem = format ? FORMAT_ART[format] : undefined;

  const occasions = tally(caps.map((c) => c.occasion).filter((o): o is Occasion => Boolean(o)));
  const ritual = occasions[0]?.[0] ?? null;
  const dayparts = tally(caps.map((c) => c.daypart).filter((d): d is NonNullable<typeof d> => Boolean(d)));
  const ritualLabel = ritual ? OCCASION_OPTIONS.find((o) => o.id === ritual)?.label : dayparts[0] ? DAYPART_OPTIONS.find((d) => d.id === dayparts[0][0])?.label : null;

  const night = topFamily(entries, "night");
  const morning = topFamily(entries, "morning");
  const quote = night || morning
    ? `Your records feature ${[night ? `${familyById(night).label} at night` : null, morning ? `${familyById(morning).label} in the morning` : null].filter(Boolean).join(" and ")}.`
    : null;

  const tagCounts = tally(caps.flatMap((c) => c.tags ?? []));
  const tagged = tag ? caps.filter((c) => (c.tags ?? []).includes(tag)) : [];

  // Something New to Explore: wheel neighbours of the top family not yet recorded, a fixed pairing, three products
  const used = new Set(famRows.map((r) => r[0]));
  const tryNext = top ? FAMILIES.filter((f) => f.id !== top && areNeighbours(top, f.id) && !used.has(f.id)).map((f) => f.id) : [];
  const pair = top ? PAIRS[top] : null;
  const products = top ? matchProducts({ families: [top, famRows[1]?.[0]].filter(Boolean) as FamilyId[] }, 3) : [];

  return (
    <div className="scentprint">
      <div className="scentprint__head">
        <h2 className="h-section" style={{ fontSize: 40 }}>My Scentprint</h2>
        <p className="lead scentprint__lead">A closer look at the details you’ve collected. Revisit the tags that connect your scent notes and make your archive easier to explore.</p>
      </div>

      <section className="scentprint__map" aria-label="Scent map">
        <div className="scentprint__mapcol">
          <ScentMap counts={counts} />
        </div>
        <div className="scentprint__favs">
          <div className="fav">
            <span className="fav__pic">{top ? <Stamp family={top} size={76} /> : null}</span>
            <span className="fav__text">
              <span className="label-mono">Top scent family</span>
              <span className="fav__name">{top ? familyById(top).label : "—"}</span>
            </span>
          </div>
          <div className="fav">
            <span className="fav__pic" aria-hidden="true">{formatItem ? <ItemArt kind={formatItem} prefix="fav" /> : null}</span>
            <span className="fav__text">
              <span className="label-mono">Most recorded format</span>
              <span className="fav__name">{format ? sourceLabel(format) : "—"}</span>
            </span>
          </div>
          <div className="fav">
            <span className="fav__pic fav__pic--icon" aria-hidden="true">{ritual ? <Icon name={RITUAL_ICONS[ritual]} size={40} /> : null}</span>
            <span className="fav__text">
              <span className="label-mono">Most recorded ritual</span>
              <span className="fav__name">{ritualLabel ?? "—"}</span>
            </span>
          </div>
        </div>
      </section>

      <section id="preferences" className="scentprint__picture anchor" aria-label="Your scent scene">
        <figure className="pref-scene">
          <img
            src="/assets/preferences/sample-scene.png"
            width={192}
            height={108}
            alt="Pixel picture: a timber cabin among cedar trees at dusk, a candle in its window, mist from the chimney and an orange tree beside it"
          />
          {quote ? <blockquote className="pref-quote"><p>“{quote}”</p></blockquote> : null}
        </figure>
        {/* her summary text (11/24) with the sample records; for anyone else the space waits for a real reading of their records */}
        {sample ? (
          <aside className="scentprint__ai scentprint__ai--text" aria-label="Summary of your scent preferences">
            <p className="scentprint__ai-text">{SAMPLE_SUMMARY}</p>
          </aside>
        ) : (
          <aside className="scentprint__ai" aria-hidden="true">
            <span className="scentprint__ai-line" /><span className="scentprint__ai-line" /><span className="scentprint__ai-line" />
            <span className="scentprint__ai-line scentprint__ai-line--short" />
          </aside>
        )}
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
                <div className="chips">{(e.tags ?? []).map((t) => <span key={t} className="tag" style={{ minHeight: 26, fontSize: 13 }}>#{t}</span>)}</div>
                <Link href={`/card?from=${e.id}`} className="btn btn--ghost btn--sm" style={{ height: 36, alignSelf: "flex-start" }}>Scent Card</Link>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {top ? (
        <section className="try-next scentprint__explore" aria-label="Something New to Explore">
          <div className="try-next__head">
            <span className="label-mono">Something New to Explore</span>
            {tryNext.map((f) => (
              <Link key={f} href={`/rooms?family=${f}`} className="chip" style={{ textDecoration: "none" }}><span className="chip__dot" style={{ background: familyById(f).hex }} />Explore {familyById(f).label} alongside {familyById(top).label} on the wheel</Link>
            ))}
            {pair ? (
              <Link href={`/rooms?family=${pair[0]}`} className="chip" style={{ textDecoration: "none" }}>
                <span className="chip__dot" style={{ background: familyById(pair[0]).hex }} /><span className="chip__dot" style={{ background: familyById(pair[1]).hex, marginLeft: -10 }} />
                Explore {familyById(pair[0]).label} and {familyById(pair[1]).label} for a new scent direction
              </Link>
            ) : null}
          </div>
          {products.length ? (
            <div className="try-next__grid">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
