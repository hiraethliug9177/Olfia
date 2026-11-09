"use client";

import { useMemo, useState } from "react";
import { DAYPART_OPTIONS, SEASON_OPTIONS, familyById, sourceLabel } from "@/lib/catalog";
import { matchProducts, type Product } from "@/lib/products";
import type { Daypart, FamilyId, Season } from "@/lib/types";

/**
 * Recommended products (11/4 feedback, B tier): sample data from lib/products.ts.
 * Filters: season · time of day · "matches this room" (the families passed in) · similar to one product.
 */

export function ProductCard({ p, onSimilar }: { p: Product; onSimilar?: (id: string) => void }) {
  const f = familyById(p.families[0]);
  const inner = (
    <>
      <span className="pcard__band" style={{ background: `linear-gradient(90deg, ${p.families.map((id) => familyById(id).hex).join(", ")})` }} />
      <span className="pcard__brand">{p.brand}</span>
      <span className="pcard__name">{p.name}</span>
      <span className="muted" style={{ fontSize: 16 }}>{p.notes}</span>
      <span className="pcard__meta">
        <span className="chip__dot" style={{ background: f.hex }} />
        {p.families.map((id) => familyById(id).label).join(" · ")}
        <span>·</span>
        <span>{sourceLabel(p.type)}</span>
        <span>·</span>
        <span className="mono">{p.tier}</span>
      </span>
    </>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {p.url ? (
        <a className="pcard" href={p.url} target="_blank" rel="noopener noreferrer">{inner}</a>
      ) : (
        <div className="pcard">{inner}</div>
      )}
      {onSimilar ? (
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onSimilar(p.id)} style={{ alignSelf: "flex-start", height: 36, fontSize: 14 }}>Similar to this</button>
      ) : null}
    </div>
  );
}

export function ProductCards({ families, title = "Recreate this at home", limit = 6, compact = false }: { families: FamilyId[]; title?: string; limit?: number; compact?: boolean }) {
  const [season, setSeason] = useState<Season | null>(null);
  const [daypart, setDaypart] = useState<Daypart | null>(null);
  const [similar, setSimilar] = useState<string | null>(null);

  const list = useMemo(
    () => matchProducts({ families, season: season ?? undefined, daypart: daypart ?? undefined, similarTo: similar ?? undefined }, limit),
    [families, season, daypart, similar, limit],
  );

  return (
    <section aria-label={title} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: compact ? 26 : 32 }}>{title}</h3>
        {similar ? <button type="button" className="chip" onClick={() => setSimilar(null)}>Back to this room ×</button> : null}
      </div>
      {!compact ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SEASON_OPTIONS.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={season === s.id} onClick={() => setSeason(season === s.id ? null : s.id)}>{s.label}</button>
          ))}
          <span style={{ width: 8 }} />
          {DAYPART_OPTIONS.map((d) => (
            <button key={d.id} type="button" className="chip" aria-pressed={daypart === d.id} onClick={() => setDaypart(daypart === d.id ? null : d.id)}>{d.label}</button>
          ))}
        </div>
      ) : null}
      {list.length ? (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? 220 : 250}px, 1fr))`, gap: 18 }}>
          {list.map((p) => <ProductCard key={p.id} p={p} onSimilar={compact ? undefined : setSimilar} />)}
        </div>
      ) : (
        <p className="muted">Nothing matches that combination yet.</p>
      )}
      <p className="muted" style={{ fontSize: 14 }}>Links open the brand’s site. Olfia doesn’t sell products.</p>
    </section>
  );
}
