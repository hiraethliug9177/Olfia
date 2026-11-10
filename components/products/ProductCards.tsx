"use client";

import { useMemo, useState } from "react";
import { familyById, sourceLabel } from "@/lib/catalog";
import { matchProducts, type Product } from "@/lib/products";
import type { Daypart, FamilyId, Season } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

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

export function ProductCard({ p, match, onSimilar }: { p: Product; match?: FamilyId[]; onSimilar?: (id: string) => void }) {
  const f = familyById(p.families[0]);
  const shared = (match ?? []).filter((id) => p.families.includes(id));
  const why = shared.length ? `Shares ${shared.map((id) => familyById(id).label).join(" and ")} with this room` : p.families.map((id) => familyById(id).label).join(" and ");
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
        <a className="pcard" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.brand} ${p.name}, opens the brand's site`}>
          {body}
          <span className="pcard__out"><Icon name="external" size={18} /></span>
        </a>
      ) : (
        <div className="pcard">{body}</div>
      )}
      {onSimilar ? <button type="button" className="hero__link" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", border: 0, background: "transparent", padding: 0, fontSize: 15 }}>More like this</button> : null}
    </div>
  );
}

export function ProductCards({ families, title = "Recreate this at home", limit = 6, compact = false }: { families: FamilyId[]; title?: string; limit?: number; compact?: boolean }) {
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
      {!compact ? (
        <div className="chips" role="group" aria-label="When">
          {WHEN.map((w) => (
            <button key={w.id} type="button" className="chip chip--solid" aria-pressed={when === w.id} onClick={() => setWhen(w.id)}>{w.label}</button>
          ))}
        </div>
      ) : null}
      {list.length ? (
        <div className="pcard-grid">
          {list.map((p) => <ProductCard key={p.id} p={p} match={families} onSimilar={compact ? undefined : setSimilar} />)}
        </div>
      ) : (
        <p className="muted">Nothing matches that combination yet.</p>
      )}
      <p className="muted" style={{ fontSize: 14 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </section>
  );
}
