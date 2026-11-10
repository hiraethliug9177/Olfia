"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { FAMILIES, familyById, itemById, methodLabel, roomLabel, sourceLabel } from "@/lib/catalog";
import { useAtlas, useMounted } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { hourOnly, monthLabel, partOfDay, sameDay } from "@/lib/dates";
import { PIECE_H, PIECE_W, monthPieces } from "@/lib/jigsaw";
import { FitWidth } from "@/components/ui/FitWidth";
import { sampleEntries } from "@/lib/sample";
import type { CaptureEntry, Entry, FamilyId, RoomsEntry } from "@/lib/types";
import { ScenePage } from "@/components/scene/ScenePage";
import { ScentProfile } from "@/components/account/ScentProfile";
import { Stamp } from "@/components/scene/Stamp";
import { useSearchParams } from "next/navigation";

function entryTitle(e: Entry): string {
  if (e.type === "rooms") return e.nickname ? `Reading Corner · ${e.nickname}` : "Reading Corner";
  if (e.what.mode === "product") return e.what.productName || e.what.scentName || sourceLabel(e.source);
  return e.what.text || methodLabel(e.what.method);
}

function entryKind(e: Entry): string {
  if (e.type === "capture") return e.what.mode === "method" ? "Method" : sourceLabel(e.source);
  const src = [...e.items].reverse().find((i) => itemById(i.kind)?.category === "source");
  return src ? (itemById(src.kind)?.label ?? "Scent") : "Scent";
}

function Star({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill={on ? "#E2A23B" : "none"} stroke={on ? "#E2A23B" : "#5C5E6B"} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function AtlasView() {
  const mounted = useMounted();
  const entries = useAtlas((s) => s.entries);
  const hydrated = useAtlas((s) => s.hydrated);
  const toggleStar = useAtlas((s) => s.toggleStar);
  const remove = useAtlas((s) => s.remove);
  const add = useAtlas((s) => s.add);
  const show = useToast((s) => s.show);

  const params = useSearchParams();
  const [tab, setTab] = useState<0 | 1 | 2>(params.get("tag") ? 2 : 0);
  const [tag, setTag] = useState<string | null>(params.get("tag"));
  const [fav, setFav] = useState<0 | 1>(0);
  const [ym, setYm] = useState<{ y: number; m: number } | null>(null);
  const [day, setDay] = useState<number>(1);

  useEffect(() => {
    if (!mounted || ym) return;
    const now = new Date();
    setYm({ y: now.getFullYear(), m: now.getMonth() });
    setDay(now.getDate());
  }, [mounted, ym]);

  const monthEntries = useMemo(() => {
    if (!ym) return [] as Entry[];
    return entries.filter((e) => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === ym.y && d.getMonth() === ym.m;
    });
  }, [entries, ym]);

  if (!mounted || !hydrated || !ym) {
    return <div className="card" style={{ minHeight: 420 }} aria-busy="true" />;
  }

  const { pieces, rows } = monthPieces(ym.y, ym.m);
  const byDay = new Map<number, Entry[]>();
  for (const e of monthEntries) {
    const d = new Date(e.createdAt).getDate();
    byDay.set(d, [...(byDay.get(d) ?? []), e]);
  }
  const shift = (delta: number) => {
    const d = new Date(ym.y, ym.m + delta, 1);
    setYm({ y: d.getFullYear(), m: d.getMonth() });
    const now = new Date();
    setDay(d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() ? now.getDate() : 1);
  };

  const famCount = new Map<FamilyId, number>();
  monthEntries.forEach((e) => e.families.forEach((f) => famCount.set(f, (famCount.get(f) ?? 0) + 1)));
  const share = FAMILIES.filter((f) => famCount.has(f.id))
    .map((f) => ({ f, n: famCount.get(f.id) ?? 0 }))
    .sort((a, b) => b.n - a.n);
  const tod = { morning: 0, afternoon: 0, night: 0 };
  monthEntries.forEach((e) => { tod[partOfDay(new Date(e.createdAt))] += 1; });
  const kinds = new Map<string, number>();
  monthEntries.forEach((e) => kinds.set(entryKind(e), (kinds.get(entryKind(e)) ?? 0) + 1));
  const kindRows = [...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTod = Math.max(1, tod.morning, tod.afternoon, tod.night);
  const maxKind = Math.max(1, ...kindRows.map((k) => k[1]));
  const dayEntries = byDay.get(day) ?? [];
  const today = new Date();
  const monthName = monthLabel(ym.y, ym.m).split(" ")[0];

  const del = (e: Entry) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this page from your Scent Atlas?")) return;
    remove(e.id);
    track("entry_deleted", { mode: e.type });
  };

  const starredRooms = entries.filter((e): e is RoomsEntry => e.type === "rooms" && e.starred);
  const products = entries.filter((e): e is CaptureEntry => e.type === "capture" && e.what.mode === "product");

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 26 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h1 className="h-page">Scent Atlas</h1>
          <p className="lead" style={{ fontSize: 18 }}>Your rooms, ideas, and scent notes, all in one place.</p>
        </div>
        {tab === 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 600 }}>
            <button type="button" className="tool" aria-label="Previous month" onClick={() => shift(-1)} style={{ borderRadius: "50%" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <span style={{ minWidth: 200, textAlign: "center" }} aria-live="polite">{monthLabel(ym.y, ym.m)}</span>
            <button type="button" className="tool" aria-label="Next month" onClick={() => shift(1)} style={{ borderRadius: "50%" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        ) : null}
      </div>

      <div role="tablist" aria-label="Atlas views" className="folder-tabs">
        <button type="button" role="tab" aria-selected={tab === 0} className="folder-tab" onClick={() => setTab(0)}>Calendar</button>
        <button type="button" role="tab" aria-selected={tab === 1} className="folder-tab" onClick={() => setTab(1)}>Favorites</button>
        <button type="button" role="tab" aria-selected={tab === 2} className="folder-tab" onClick={() => setTab(2)}>Tags &amp; profile</button>
      </div>

      <div className="card" style={{ padding: 0, borderRadius: 28 }}>
        {entries.length === 0 ? (
          <div style={{ padding: "56px 32px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <span className="hand" style={{ fontSize: 30, color: "var(--deep)" }}>nothing pinned yet</span>
            <p className="lead">Save a room or capture a scent, and it lands here as a page of the month.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/capture" className="btn btn--primary">Capture a scent</Link>
              <Link href="/rooms" className="btn btn--ghost">Make a room</Link>
              <button type="button" className="btn btn--ghost" onClick={() => { sampleEntries().forEach((e) => add(e)); show("Sample pages added"); }}>Try with sample pages</button>
            </div>
          </div>
        ) : tab === 0 ? (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px", alignItems: "flex-start", paddingTop: 8 }}>
              <div className="cal-scroll" style={{ flex: "1 1 100%", minWidth: 0 }}>
                <FitWidth width={PIECE_W * 7 + 12} height={rows * PIECE_H + 44}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${PIECE_W}px)`, marginBottom: 18, fontSize: 15, fontWeight: 600, color: "var(--slate)" }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d} style={{ paddingLeft: 16 }}>{d}</span>)}
                </div>
                <div style={{ position: "relative", width: PIECE_W * 7, height: rows * PIECE_H }}>
                  {pieces.map((p) => {
                    const list = byDay.get(p.day) ?? [];
                    const main = list[0]?.families[0];
                    const sel = p.day === day;
                    const isToday = sameDay(new Date(ym.y, ym.m, p.day), today);
                    const dots = list.flatMap((e) => e.families.slice(0, 1)).slice(0, 3);
                    return (
                      <button
                        key={p.day}
                        type="button"
                        className="piece"
                        aria-label={`${monthName.toLowerCase()} ${p.day}, ${list.length ? `${list.length} ${list.length === 1 ? "entry" : "entries"}` : "no entries"}`}
                        aria-pressed={sel}
                        onClick={() => setDay(p.day)}
                        style={{ left: p.col * PIECE_W, top: p.row * PIECE_H, width: PIECE_W, height: PIECE_H, zIndex: sel ? 3 : 1 }}
                      >
                        <svg viewBox={`0 0 ${PIECE_W} ${PIECE_H}`} width={PIECE_W} height={PIECE_H} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
                          <path d={p.d} fill={main ? `${familyById(main).hex}33` : "#FFFFFF"} stroke={sel ? "#4C527A" : "rgba(41,42,49,0.22)"} strokeWidth={sel ? 3 : 1.2} />
                        </svg>
                        <span className="mono" style={{ position: "absolute", left: 16, top: 12, fontSize: 15, fontWeight: 600, color: "var(--ink)", textDecoration: isToday ? "underline" : undefined, textUnderlineOffset: 4 }}>{p.day}</span>
                        {dots.map((f, j) => (
                          <span key={j} aria-hidden="true" className="window" style={{ position: "absolute", left: [56, 92, 38][j], top: [56, 28, 30][j], width: j ? 26 : 40, height: j ? 26 : 40, background: familyById(f).hex, boxShadow: "0 0 0 2.5px #fff, 0 3px 6px rgba(41,42,49,0.2)" }} />
                        ))}
                      </button>
                    );
                  })}
                </div>
                </FitWidth>
              </div>

              <aside style={{ flex: "1 1 100%", minWidth: 0, display: "flex", flexDirection: "column", gap: 14, padding: "0 28px 28px" }}>
                <span className="label-mono">{monthName} {day}</span>
                {dayEntries.length === 0 ? (
                  <>
                    <span className="hand muted" style={{ fontSize: 24 }}>nothing pinned this day</span>
                    <Link href="/capture" className="hero__link">Capture a scent</Link>
                  </>
                ) : (
                  dayEntries.map((e) => (
                    <div key={e.id} style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: 18, background: "var(--ivory)" }}>
                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <span aria-hidden="true" className="window" style={{ flex: "none", width: 44, height: 44, background: e.families[0] ? familyById(e.families[0]).hex : "#C9CBD6", boxShadow: "0 0 0 3px #fff" }} />
                        <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: 17, fontWeight: 600 }}>{entryTitle(e)}</span>
                          <span className="mono muted" style={{ fontSize: 13 }}>{e.type === "rooms" ? "Rooms" : "Capture"} · {hourOnly(new Date(e.createdAt))}{e.type === "capture" ? ` · ${roomLabel(e.room)}` : ""}</span>
                        </span>
                        <button type="button" className="tool" aria-label={e.starred ? "Unstar" : "Star"} aria-pressed={e.starred} onClick={() => toggleStar(e.id)} style={{ boxShadow: "none", background: "transparent" }}><Star on={e.starred} /></button>
                      </div>
                      {e.type === "capture" && (e.situation || e.sentence) ? <span className="hand" style={{ fontSize: 21 }}>{e.sentence || e.situation}</span> : null}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {e.type === "rooms" ? <Link href={`/rooms?id=${e.id}`} className="btn btn--ghost btn--sm" style={{ height: 40 }}>Open</Link> : null}
                        <Link href={`/card?from=${e.id}`} className="btn btn--ghost btn--sm" style={{ height: 40 }}>Scent Card</Link>
                        <button type="button" className="btn btn--ghost btn--sm" style={{ height: 40 }} onClick={() => del(e)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </aside>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: "8px 28px 32px" }}>
              <div className="stat" style={{ flex: "2 1 420px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                  <span className="label-mono">Families this month</span>
                  <span className="callout">{byDay.size} DAYS RECORDED</span>
                </div>
                {share.length ? (
                  <>
                    <div style={{ display: "flex", height: 22, borderRadius: 999, overflow: "hidden", gap: 3 }}>
                      {share.map(({ f, n }) => <span key={f.id} title={f.label} style={{ flex: `${n} 1 0`, background: f.hex }} />)}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
                      {share.map(({ f, n }) => (
                        <span key={f.id} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14 }}><span className="chip__dot" style={{ width: 12, height: 12, background: f.hex }} />{f.label} {n}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 18 }}>Most used: <span className="hl" style={{ "--hl": `${share[0].f.hex}66` } as CSSProperties}>{share[0].f.label}</span></span>
                  </>
                ) : <span className="muted">Nothing this month yet.</span>}
              </div>
              <div className="stat" style={{ flex: "1 1 240px" }}>
                <span className="label-mono">Time of day</span>
                {(["morning", "afternoon", "night"] as const).map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mono" style={{ width: 92, fontSize: 14, textTransform: "capitalize" }}>{k}</span>
                    <span className="bar"><span style={{ width: `${(tod[k] / maxTod) * 100}%`, background: "#A0A6C8" }} /></span>
                    <span className="mono" style={{ width: 24, textAlign: "right", fontSize: 14 }}>{tod[k]}</span>
                  </div>
                ))}
              </div>
              <div className="stat" style={{ flex: "1 1 240px" }}>
                <span className="label-mono">Scent sources</span>
                {kindRows.length ? kindRows.map(([k, n]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="mono" style={{ width: 92, fontSize: 14 }}>{k}</span>
                    <span className="bar"><span style={{ width: `${(n / maxKind) * 100}%`, background: "#E7B49F" }} /></span>
                    <span className="mono" style={{ width: 24, textAlign: "right", fontSize: 14 }}>{n}</span>
                  </div>
                )) : <span className="muted">—</span>}
              </div>
            </div>
          </>
        ) : tab === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px 28px" }}>
            {(() => {
              const caps = entries.filter((e): e is CaptureEntry => e.type === "capture");
              const counts = new Map<string, number>();
              caps.forEach((c) => (c.tags ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
              const allTags = [...counts.entries()].sort((a, b) => b[1] - a[1]);
              const list = tag ? caps.filter((c) => (c.tags ?? []).includes(tag)) : [];
              return (
                <>
                  {allTags.length ? (
                    <div className="chips">
                      {allTags.map(([t, n]) => (
                        <button key={t} type="button" className={`tag${tag === t ? " tag--on" : ""}`} onClick={() => setTag(tag === t ? null : t)} style={{ border: 0, cursor: "pointer" }}>#{t} <span style={{ marginLeft: 6, opacity: 0.7 }}>{n}</span></button>
                      ))}
                    </div>
                  ) : <span className="muted">Tags appear once you capture a scent.</span>}
                  {tag ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                      {list.map((e) => (
                        <div key={e.id} style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16, borderRadius: 18, background: "var(--ivory)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {e.families[0] ? <Stamp family={e.families[0]} size={48} /> : null}
                            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 17, fontWeight: 600 }}>{entryTitle(e)}</span>
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
                  <ScentProfile compact />
                </>
              );
            })()}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px 28px" }}>
            <div role="tablist" aria-label="Favorites" className="seg" style={{ width: 340, maxWidth: "100%" }}>
              <span className="seg__thumb" aria-hidden="true" style={{ left: fav === 0 ? 5 : "50%", width: "calc(50% - 5px)" }} />
              <button type="button" role="tab" aria-selected={fav === 0} className="seg__opt" onClick={() => setFav(0)}>Starred rooms</button>
              <button type="button" role="tab" aria-selected={fav === 1} className="seg__opt" onClick={() => setFav(1)}>Saved products</button>
            </div>
            {fav === 0 ? (
              starredRooms.length ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 26 }}>
                  {starredRooms.map((r) => (
                    <Link key={r.id} href={`/rooms?id=${r.id}`} style={{ display: "flex", flexDirection: "column", gap: 10, textDecoration: "none", color: "var(--ink)" }}>
                      <ScenePage items={r.items} families={r.families} title="Reading Corner" note={r.nickname} date={new Date(r.updatedAt)} time={r.time} strength={r.strength} windowOpen={r.windowOpen} showLabels={false} />
                    </Link>
                  ))}
                </div>
              ) : <span className="muted">Star a room in the calendar to keep it here.</span>
            ) : products.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
                {products.map((p) => {
                  const f = p.families[0] ? familyById(p.families[0]) : undefined;
                  return (
                    <div key={p.id} className="mono" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 22, borderRadius: 18, background: "var(--ivory)", border: "1px solid rgba(41,42,49,0.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: 17, fontWeight: 600 }}><span className="hl" style={{ "--hl": f ? `${f.hex}66` : undefined } as CSSProperties}>{p.what.mode === "product" ? (p.what.productName || p.what.scentName || "Unnamed") : ""}</span></span>
                        <button type="button" className="tool" aria-label={p.starred ? "Unstar" : "Star"} aria-pressed={p.starred} onClick={() => toggleStar(p.id)} style={{ boxShadow: "none", background: "transparent", width: 36, height: 36 }}><Star on={p.starred} /></button>
                      </div>
                      <span className="muted" style={{ fontSize: 14 }}>{sourceLabel(p.source)} · {f ? f.label : "—"}</span>
                      {p.situation ? <span className="hand" style={{ fontSize: 22 }}>{p.situation}</span> : null}
                    </div>
                  );
                })}
              </div>
            ) : <span className="muted">Products you capture land here.</span>}
          </div>
        )}
      </div>
    </div>
  );
}
