"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { EMOTION_OPTIONS, FAMILIES, areNeighbours, familyById, sourceLabel } from "@/lib/catalog";
import { useAtlas, useMounted } from "@/lib/store";
import { sampleEntries } from "@/lib/sample";
import { matchProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCards";
import { Stamp } from "@/components/scene/Stamp";
import type { Entry, FamilyId } from "@/lib/types";

/**
 * "Your scents at a glance" (11/4 feedback, B tier; renamed 11/10 because "Scent Profile" is a retired term):
 * family frequency, top emotions and tags,
 * time-of-day and product-type split, and rule-based "try next" suggestions
 * (wheel neighbours of your top family that you haven't used, plus fixed pairings).
 * A "sample data" switch shows it filled when the browser is empty.
 */

const PAIRS: Record<FamilyId, [FamilyId, FamilyId]> = {
  floral: ["gourmand", "green"],
  gourmand: ["spicy", "floral"],
  spicy: ["woody", "citrus"],
  woody: ["spicy", "green"],
  green: ["citrus", "fresh"],
  citrus: ["fresh", "green"],
  fresh: ["citrus", "floral"],
};

function count<T extends string>(items: T[]): Array<[T, number]> {
  const m = new Map<T, number>();
  items.forEach((i) => m.set(i, (m.get(i) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({ rows, color, labelOf }: { rows: Array<[string, number]>; color: string; labelOf?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <>
      {rows.map(([k, n]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ width: 110, fontSize: 14, textTransform: "capitalize" }}>{labelOf ? labelOf(k) : k}</span>
          <span className="bar"><span style={{ width: `${(n / max) * 100}%`, background: color }} /></span>
          <span className="mono" style={{ width: 24, textAlign: "right", fontSize: 14 }}>{n}</span>
        </div>
      ))}
    </>
  );
}

export function ScentSummary({ compact = false }: { compact?: boolean }) {
  const mounted = useMounted();
  const saved = useAtlas((s) => s.entries);
  const [useSample, setUseSample] = useState(false);
  const sample = useMemo(() => sampleEntries(), []);
  const entries: Entry[] = useSample || (mounted && saved.length === 0) ? sample : saved;
  const showingSample = entries === sample;

  const famRows = count(entries.flatMap((e) => e.families)) as Array<[FamilyId, number]>;
  const total = famRows.reduce((a, r) => a + r[1], 0) || 1;
  const top = famRows[0]?.[0] ?? null;
  const captures = entries.filter((e): e is Extract<Entry, { type: "capture" }> => e.type === "capture");
  const emotionRows = count(captures.flatMap((c) => c.emotions ?? []));
  const tagRows = count(captures.flatMap((c) => c.tags ?? [])).slice(0, 8);
  const dayRows = count(captures.map((c) => c.daypart ?? "unknown").filter((d) => d !== "unknown"));
  const typeRows = count(captures.map((c) => c.source));
  const used = new Set(famRows.map((r) => r[0]));
  const tryNext = top
    ? FAMILIES.filter((f) => f.id !== top && areNeighbours(top, f.id) && !used.has(f.id)).map((f) => f.id)
    : [];
  const pair = top ? PAIRS[top] : null;
  const products = top ? matchProducts({ families: [top, famRows[1]?.[0]].filter(Boolean) as FamilyId[] }, 3) : [];

  if (!mounted) return <div className="card" style={{ minHeight: 200 }} />;

  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 className="h-section" style={{ fontSize: compact ? 26 : 30 }}>Your scents at a glance</h2>
        <button type="button" role="switch" aria-checked={showingSample} className="switch" onClick={() => setUseSample((v) => !v)} disabled={saved.length === 0}>
          Sample data
          <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
        </button>
      </div>
      {showingSample && saved.length === 0 ? <p className="muted" style={{ margin: 0 }}>Showing sample pages until you save your own.</p> : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
        <div className="stat" style={{ flex: "2 1 360px" }}>
          <span className="label-mono">Families, all time</span>
          <div style={{ display: "flex", height: 22, borderRadius: 999, overflow: "hidden", gap: 3 }}>
            {famRows.map(([f, n]) => <span key={f} title={familyById(f).label} style={{ flex: `${n} 1 0`, background: familyById(f).hex }} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {famRows.map(([f, n]) => (
              <span key={f} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <span className="chip__dot" style={{ width: 12, height: 12, background: familyById(f).hex }} />{familyById(f).label} {Math.round((n / total) * 100)}%
              </span>
            ))}
          </div>
          {top ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Stamp family={top} size={56} />
              <span style={{ fontSize: 15, whiteSpace: "nowrap" }}>Most used: <span className="hl" style={{ "--hl": `${familyById(top).hex}66` } as CSSProperties}>{familyById(top).label}</span></span>
            </div>
          ) : null}
        </div>
        <div className="stat" style={{ flex: "1 1 220px" }}>
          <span className="label-mono">How it felt</span>
          {emotionRows.length ? <Bars rows={emotionRows.slice(0, 5)} color="#A0A6C8" labelOf={(k) => EMOTION_OPTIONS.find((e) => e.id === k)?.label ?? k} /> : <span className="muted">No emotions recorded yet.</span>}
        </div>
        <div className="stat" style={{ flex: "1 1 220px" }}>
          <span className="label-mono">Time of day</span>
          {dayRows.length ? <Bars rows={dayRows} color="#E7B49F" /> : <span className="muted">—</span>}
        </div>
        {!compact ? (
          <div className="stat" style={{ flex: "1 1 220px" }}>
            <span className="label-mono">Product types</span>
            {typeRows.length ? <Bars rows={typeRows} color="#4C527A" labelOf={(k) => sourceLabel(k as Parameters<typeof sourceLabel>[0])} /> : <span className="muted">—</span>}
          </div>
        ) : null}
      </div>

      {tagRows.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="label-mono">Your tags</span>
          <div className="chips">
            {tagRows.map(([t, n]) => <Link key={t} href={`/atlas?tag=${t}`} className="tag" style={{ textDecoration: "none" }}>#{t} <span className="muted" style={{ marginLeft: 6 }}>{n}</span></Link>)}
          </div>
        </div>
      ) : null}

      {top ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label-mono">Try next</span>
          <div className="chips">
            {tryNext.map((f) => (
              <Link key={f} href={`/rooms?family=${f}`} className="chip" style={{ textDecoration: "none" }}><span className="chip__dot" style={{ background: familyById(f).hex }} />{familyById(f).label} · next to {familyById(top).label.split(" ")[0]} on the wheel</Link>
            ))}
            {pair ? (
              <Link href={`/rooms?family=${pair[0]}`} className="chip" style={{ textDecoration: "none" }}>
                <span className="chip__dot" style={{ background: familyById(pair[0]).hex }} /><span className="chip__dot" style={{ background: familyById(pair[1]).hex, marginLeft: -10 }} />
                {familyById(pair[0]).label} + {familyById(pair[1]).label} blend well
              </Link>
            ) : null}
          </div>
          {!compact && products.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 6 }}>
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
