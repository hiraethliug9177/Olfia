"use client";

import { useMemo, useState } from "react";
import { familyById, sourceLabel } from "@/lib/catalog";
import { matchProducts, type Product } from "@/lib/products";
import type { Daypart, FamilyId, Season } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { ProductLink } from "@/components/products/ProductLink";

/**
 * Recommended products (B tier). 11/9 feedback 10: larger cards, less text, one line saying why
 * it fits this room, one combined "when" filter.
 * 11/10: instead of product photos, every card carries the same Olfia name tile — the brand name set
 * in Newsreader on a cream label over the family colour and texture. Brand logos are the brands'
 * own trademark artwork, so they are not redrawn here.
 */

export function NameTile({ brand, kind, family, height }: { brand: string; kind: string; family: FamilyId; height?: number }) {
  const f = familyById(family);
  return (
    <span className="ptile" style={{ backgroundColor: f.hex, height }} aria-hidden="true">
      <span className="ptile__tex" style={{ backgroundImage: `url(${f.texture})` }} />
      <span className="ptile__label">
        <span className="ptile__brand">{brand}</span>
        <span className="ptile__rule" />
        <span className="ptile__type">{kind}</span>
      </span>
    </span>
  );
}

type When = "any" | "mornings" | "evenings" | "warm" | "cold";
const WHEN: Array<{ id: When; label: string }> = [
  { id: "any", label: "Any time" },
  { id: "mornings", label: "Mornings" },
  { id: "evenings", label: "Evenings" },
  { id: "warm", label: "Warm months" },
  { id: "cold", label: "Cold months" },
];
const WHEN_FILTER: Record<When, { season?: Season; daypart?: Daypart }> = {
  any: {},
  mornings: { daypart: "morning" },
  evenings: { daypart: "evening" },
  warm: { season: "summer" },
  cold: { season: "winter" },
};

/** Copy v1 (Tiffany 11/24, §4.3): "Shares the {family} scent family with your design." */
function sharesLine(shared: FamilyId[]): string {
  const names = shared.map((id) => familyById(id).label);
  return names.length === 1
    ? `Shares the ${names[0]} scent family with your design.`
    : `Shares the ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} scent families with your design.`;
}

export function ProductCard({ p, match, onSimilar, place }: { p: Product; match?: FamilyId[]; onSimilar?: (id: string) => void; place?: string }) {
  const f = familyById(p.families[0]);
  const shared = (match ?? []).filter((id) => p.families.includes(id));
  const why = shared.length ? sharesLine(shared) : p.families.map((id) => familyById(id).label).join(" and ");
  const body = (
    <>
      <NameTile brand={p.brand} kind={sourceLabel(p.type)} family={f.id} />
      <span className="pcard__body">
        <span className="pcard__brand">{p.brand} · {sourceLabel(p.type)} · {p.tier}</span>
        <span className="pcard__name">{p.name}</span>
        <span className="pcard__why"><span className="chip__dot" style={{ background: f.hex }} />{why}</span>
        <span className="muted" style={{ fontSize: 15 }}>{p.notes}</span>
      </span>
    </>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {p.url ? (
        <ProductLink className="pcard" href={p.url} place={place} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} ariaLabel={`${p.brand} ${p.name}, opens the brand’s website`}>
          {body}
          <span className="pcard__out"><Icon name="external" size={18} /></span>
        </ProductLink>
      ) : (
        <div className="pcard">{body}</div>
      )}
      {onSimilar ? <button type="button" className="hero__link" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 15 }}>Explore similar fragrances</button> : null}
    </div>
  );
}

const DAYPART_ORDER: Daypart[] = ["morning", "afternoon", "evening", "night"];
const SEASON_ORDER: Season[] = ["spring", "summer", "autumn", "winter"];
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const joinAnd = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs[0] ?? "");

/** "Evening and night", "Any time of day" */
export function dayText(d: Daypart[]): string {
  const list = DAYPART_ORDER.filter((x) => d.includes(x));
  return list.length === 4 ? "Any time of day" : cap(joinAnd(list));
}

/** "Autumn and winter", "All year" */
export function seasonText(s: Season[]): string {
  const list = SEASON_ORDER.filter((x) => s.includes(x));
  return list.length === 4 ? "All year" : cap(joinAnd(list));
}

/**
 * The detailed card of Rooms' Fragrance Matches (formerly "Matches this room") (Tiffany 11/18: four products, more about each): what it is and
 * its size and price (checked on the brand's site 11/17), its notes, when it suits, and the families it shares with
 * the room. Facts only; nothing here is written as Olfia copy.
 */
export function ProductDetailCard({ p, match, onSimilar }: { p: Product; match: FamilyId[]; onSimilar?: (id: string) => void }) {
  const f = familyById(p.families[0]);
  const shared = match.filter((id) => p.families.includes(id));
  const dots = shared.length ? shared : p.families;
  const why = shared.length ? sharesLine(shared) : p.families.map((id) => familyById(id).label).join(" and ");
  const price = p.price ? [p.price, p.size].filter(Boolean).join(" · ") : p.url ? null : "Available in stores only";
  const body = (
    <>
      <NameTile brand={p.brand} kind={sourceLabel(p.type)} family={f.id} />
      <span className="pcard__body pdetail">
        <span className="pcard__brand">{p.brand} · {sourceLabel(p.type)}</span>
        <span className="pcard__name">{p.name}</span>
        {price ? <span className="pdetail__price">{price}</span> : null}
        <span className="pdetail__notes">
          {p.notes.split(" · ").map((n) => <span key={n} className="pdetail__note">{n}</span>)}
        </span>
        <span className="pdetail__row"><Icon name="clock" size={18} />{dayText(p.dayparts)}</span>
        <span className="pdetail__row"><Icon name="calendar" size={18} />{seasonText(p.seasons)}</span>
        <span className="pcard__why">
          <span className="pdetail__dots" aria-hidden="true">{dots.map((id) => <span key={id} className="chip__dot" style={{ background: familyById(id).hex }} />)}</span>
          {why}
        </span>
      </span>
    </>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      {p.url ? (
        <ProductLink className="pcard" href={p.url} product={{ id: p.id, brand: p.brand, family: p.families[0], tier: p.tier }} ariaLabel={`${p.brand} ${p.name}, opens the brand’s website`}>
          {body}
          <span className="pcard__out"><Icon name="external" size={18} /></span>
        </ProductLink>
      ) : (
        <div className="pcard">{body}</div>
      )}
      {onSimilar ? <button type="button" className="hero__link" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 15 }}>Explore similar fragrances</button> : null}
    </div>
  );
}

export function ProductCards({ families, title = "Recreate this at home", lead, limit = 4, compact = false }: { families: FamilyId[]; title?: string; lead?: string; limit?: number; compact?: boolean }) {
  const [when, setWhen] = useState<When>("any");
  const [similar, setSimilar] = useState<string | null>(null);

  const list = useMemo(
    () => matchProducts({ families, ...WHEN_FILTER[when], similarTo: similar ?? undefined }, limit),
    [families, when, similar, limit],
  );

  return (
    <section aria-label={title} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ fontSize: compact ? 26 : 30 }}>{title}</h2>
        {similar ? <button type="button" className="chip" onClick={() => setSimilar(null)}>Back to this room</button> : null}
      </div>
      {lead ? <p className="lead" style={{ margin: 0 }}>{lead}</p> : null}
      {!compact ? (
        <div className="chips" role="group" aria-label="When">
          {WHEN.map((w) => (
            <button key={w.id} type="button" className="chip chip--solid" aria-pressed={when === w.id} onClick={() => setWhen(w.id)}>{w.label}</button>
          ))}
        </div>
      ) : null}
      {list.length ? (
        <div className="pcard-grid pcard-grid--four">
          {list.map((p) => <ProductDetailCard key={p.id} p={p} match={families} onSimilar={compact ? undefined : setSimilar} />)}
        </div>
      ) : (
        <p className="muted">No fragrances match these selections yet. Try another time filter or scent family.</p>
      )}
      <p className="muted" style={{ fontSize: 14 }}>Product links take you to the brand’s website. Olfia does not sell fragrances.</p>
    </section>
  );
}
