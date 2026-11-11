"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { FAMILIES, familyById } from "@/lib/catalog";
import { monthLabel, partOfDay } from "@/lib/dates";
import type { CaptureEntry, Entry, FamilyId } from "@/lib/types";
import { Stamp } from "@/components/scene/Stamp";

/**
 * The month's record (Tiffany 11/10: "月度记录改版"), drawn as a ticket with a stub.
 * Left: the month's totals and one stamp for every day something was saved.
 * Right (the stub): which families, what time of day, which tags.
 * Every count reads correctly for none, one and many.
 */

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function MonthRecord({ entries, year, month }: { entries: Entry[]; year: number; month: number }) {
  const name = monthLabel(year, month).split(" ")[0];

  // one stamp per recorded day, in the colour of that day's first family
  const byDay = new Map<number, Entry[]>();
  for (const e of entries) {
    const d = new Date(e.createdAt).getDate();
    byDay.set(d, [...(byDay.get(d) ?? []), e]);
  }
  const days = [...byDay.keys()].sort((a, b) => a - b);
  const rooms = entries.filter((e) => e.type === "rooms").length;
  const captures = entries.length - rooms;

  const famCount = new Map<FamilyId, number>();
  entries.forEach((e) => e.families.forEach((f) => famCount.set(f, (famCount.get(f) ?? 0) + 1)));
  const share = FAMILIES.filter((f) => famCount.has(f.id)).map((f) => ({ f, n: famCount.get(f.id) ?? 0 })).sort((a, b) => b.n - a.n);
  const famTotal = share.reduce((a, s) => a + s.n, 0) || 1;

  const tod = { morning: 0, afternoon: 0, night: 0 };
  entries.forEach((e) => { tod[partOfDay(new Date(e.createdAt))] += 1; });
  const todMax = Math.max(1, tod.morning, tod.afternoon, tod.night);

  const tags = new Map<string, number>();
  entries.filter((e): e is CaptureEntry => e.type === "capture").forEach((c) => (c.tags ?? []).forEach((t) => tags.set(t, (tags.get(t) ?? 0) + 1)));
  const topTags = [...tags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  const empty = entries.length === 0;

  return (
    <section className="record" aria-label={`${name} record`}>
      <div className="record__main">
        <div className="record__head">
          <h3 className="record__title">{monthLabel(year, month)}</h3>
          <span className="record__kind">Monthly record</span>
        </div>
        <dl className="record__totals">
          <div><dt>{days.length === 1 ? "day" : "days"}</dt><dd>{days.length}</dd></div>
          <div><dt>{entries.length === 1 ? "page" : "pages"}</dt><dd>{entries.length}</dd></div>
          <div><dt>{rooms === 1 ? "room" : "rooms"}</dt><dd>{rooms}</dd></div>
          <div><dt>{captures === 1 ? "capture" : "captures"}</dt><dd>{captures}</dd></div>
        </dl>
        {empty ? (
          <div className="record__empty">
            <span className="hand" style={{ fontSize: 26, color: "var(--deep)" }}>no stamps in {name} yet</span>
            <Link href="/capture" className="btn btn--terra btn--sm">Capture a scent</Link>
          </div>
        ) : (
          <ul className="record__stamps" aria-label={`${plural(days.length, "day")} with a page`}>
            {days.map((d, i) => {
              const fam = byDay.get(d)?.[0]?.families[0];
              return (
                <li key={d} style={{ rotate: `${((i * 37) % 21) - 10}deg` }}>
                  {fam ? <Stamp family={fam} size={84} date={`${pad(month + 1)} · ${pad(d)}`} rot={0} /> : null}
                </li>
              );
            })}
          </ul>
        )}
        {share[0] ? (
          <div className="record__top">
            <Stamp family={share[0].f.id} size={64} rot={-6} />
            <span>Most used <span className="hl" style={{ "--hl": `${familyById(share[0].f.id).hex}66` } as CSSProperties}>{share[0].f.label}</span></span>
          </div>
        ) : null}
      </div>

      <div className="record__stub" aria-label="This month in numbers">
        <div className="record__block">
          <span className="record__label">Families</span>
          {share.length ? (
            <>
              <div className="record__bar">
                {share.map(({ f, n }) => <span key={f.id} title={`${f.label}: ${n}`} style={{ flex: `${n} 1 0`, background: f.hex }} />)}
              </div>
              <ul className="record__legend">
                {share.slice(0, 4).map(({ f, n }) => (
                  <li key={f.id}><span className="chip__dot" style={{ width: 10, height: 10, background: f.hex }} />{f.label}<em>{Math.round((n / famTotal) * 100)}%</em></li>
                ))}
              </ul>
            </>
          ) : <span className="muted" style={{ fontSize: 15 }}>—</span>}
        </div>
        <div className="record__block">
          <span className="record__label">Time of day</span>
          <div className="record__tod">
            {(["morning", "afternoon", "night"] as const).map((k) => (
              <div key={k}>
                <span className="record__col"><span style={{ height: `${(tod[k] / todMax) * 100}%` }} /></span>
                <span className="record__num">{tod[k]}</span>
                <span className="record__cap">{k}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="record__block">
          <span className="record__label">Tags</span>
          {topTags.length ? (
            <div className="chips" style={{ gap: 6 }}>
              {topTags.map(([t, n]) => <Link key={t} href={`/atlas?tab=tags&tag=${encodeURIComponent(t)}`} className="tag" style={{ textDecoration: "none", minHeight: 28, fontSize: 13 }}>#{t}<span style={{ marginLeft: 6, opacity: 0.7 }}>{n}</span></Link>)}
            </div>
          ) : <span className="muted" style={{ fontSize: 15 }}>—</span>}
        </div>
      </div>
    </section>
  );
}
