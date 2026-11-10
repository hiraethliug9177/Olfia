"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  FAMILIES,
  FLOOR_LINE,
  FURNITURE,
  SOURCES,
  baseLayout,
  areNeighbours,
  FURNITURE_GROUPS,
  familyById,
  findMaterial,
  itemById,
  stickersFor,
  uid,
} from "@/lib/catalog";
import { newId, useAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { shortDate } from "@/lib/dates";
import type { FamilyId, PlacedItem, RoomsEntry, TimeOfDay } from "@/lib/types";
import { ScenePage } from "@/components/scene/ScenePage";
import { ItemArt } from "@/components/scene/Cutout";
import { Icon } from "@/components/ui/Icon";
import { ProductCards } from "@/components/products/ProductCards";

const DEFAULT_FAMS: FamilyId[] = ["woody", "spicy"];
const TIMES: Array<{ id: TimeOfDay; label: string }> = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "night", label: "Night" },
];
const TRAY = ["Furniture", "Scent", "Materials"] as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));


export function RoomEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const famParam = params.get("family");
  const entries = useAtlas((s) => s.entries);
  const hydrated = useAtlas((s) => s.hydrated);
  const replace = useAtlas((s) => s.replace);
  const show = useToast((s) => s.show);

  const [entryId, setEntryId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [items, setItems] = useState<PlacedItem[]>(() => [...baseLayout("candle"), ...stickersFor(DEFAULT_FAMS)]);
  const [families, setFamilies] = useState<FamilyId[]>(DEFAULT_FAMS);
  const [strength, setStrength] = useState(70);
  const [time, setTime] = useState<TimeOfDay>("afternoon");
  const [windowOpen, setWindowOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [snap, setSnap] = useState(true);
  const [tray, setTray] = useState(0);
  const [past, setPast] = useState<PlacedItem[][]>([]);
  const [future, setFuture] = useState<PlacedItem[][]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ uid: string; ox: number; oy: number; before: PlacedItem[]; moved: boolean } | null>(null);

  // Load a saved room when opened with ?id=
  useEffect(() => {
    if (!hydrated) return;
    const key = editId ?? "new";
    if (loadedFor === key) return;
    setLoadedFor(key);
    if (!editId) {
      // Opened from the quiz result or a family window: start with that family applied.
      const fromParam = (famParam ?? "").split(",").map((id) => FAMILIES.find((f) => f.id === id)?.id).filter((id): id is FamilyId => !!id).slice(0, 3);
      const start: FamilyId[] = fromParam.length ? fromParam : DEFAULT_FAMS;
      setEntryId(null); setCreatedAt(null); setNickname("");
      setItems([...baseLayout("candle"), ...stickersFor(start)]);
      setFamilies(start); setStrength(70); setTime("afternoon"); setWindowOpen(false);
      setPast([]); setFuture([]); setSelected(null);
      return;
    }
    const e = entries.find((x) => x.id === editId);
    if (e && e.type === "rooms") {
      setEntryId(e.id); setCreatedAt(e.createdAt); setNickname(e.nickname);
      setItems(e.items); setFamilies(e.families); setStrength(e.strength); setTime(e.time); setWindowOpen(e.windowOpen);
      setPast([]); setFuture([]); setSelected(null);
    }
  }, [hydrated, editId, famParam, entries, loadedFor]);

  const commit = (next: PlacedItem[]) => {
    setPast((p) => [...p.slice(-40), items]);
    setFuture([]);
    setItems(next);
  };
  const undo = () => {
    if (!past.length) return;
    setFuture((f) => [items, ...f]);
    setItems(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    setPast((p) => [...p, items]);
    setItems(future[0]);
    setFuture((f) => f.slice(1));
  };

  const patchSel = (fn: (it: PlacedItem) => PlacedItem | null) => {
    if (!selected) return;
    const next: PlacedItem[] = [];
    for (const it of items) {
      if (it.uid !== selected) { next.push(it); continue; }
      const r = fn(it);
      if (r) next.push(r);
    }
    commit(next);
    if (!next.some((i) => i.uid === selected)) setSelected(null);
  };

  const topZ = () => Math.max(0, ...items.map((i) => i.z));
  const lowZ = () => Math.min(0, ...items.map((i) => i.z));

  const addItem = (kind: string) => {
    const def = itemById(kind);
    if (!def) return;
    const jitter = (Math.random() - 0.5) * 0.12;
    const pos = def.category === "furniture" ? { x: 0.5 + jitter, y: def.floor ? 0.9 : 0.3 } : def.category === "source" ? { x: 0.55 + jitter, y: 0.72 } : { x: 0.6 + jitter, y: 0.42 };
    const it: PlacedItem = { uid: uid(), kind, x: pos.x, y: pos.y, scale: 1, rot: def.category === "material" ? Math.round(jitter * 60) : 0, flip: 1, z: topZ() + 1 };
    commit([...items, it]);
    setSelected(it.uid);
  };

  const toggleFamily = (f: FamilyId) => {
    const on = families.includes(f);
    const mats = familyById(f).materials.map((m) => m.id);
    if (on) {
      setFamilies(families.filter((x) => x !== f));
      commit(items.filter((i) => !mats.includes(i.kind)));
    } else if (families.length < 3) {
      setFamilies([...families, f]);
      const spots: Array<[number, number]> = [[0.78, 0.46], [0.6, 0.42], [0.88, 0.6]];
      const [x, y] = spots[families.length] ?? [0.6, 0.4];
      commit([...items, { uid: uid(), kind: mats[0], x, y, scale: 1, rot: -6, flip: 1, z: topZ() + 1 }]);
    }
  };

  const onItemDown = (id: string, e: ReactPointerEvent<HTMLButtonElement>) => {
    const stage = stageRef.current;
    const it = items.find((i) => i.uid === id);
    if (!stage || !it) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
    const r = stage.getBoundingClientRect();
    drag.current = { uid: id, ox: (e.clientX - r.left) / r.width - it.x, oy: (e.clientY - r.top) / r.height - it.y, before: items, moved: false };
    setSelected(id);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const stage = stageRef.current;
    if (!d || !stage) return;
    const r = stage.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width - d.ox, 0.02, 0.98);
    const y = clamp((e.clientY - r.top) / r.height - d.oy, 0.06, 1.02);
    d.moved = true;
    setItems((cur) => cur.map((i) => (i.uid === d.uid ? { ...i, x, y } : i)));
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    setItems((cur) =>
      cur.map((i) => {
        if (i.uid !== d.uid) return i;
        const def = itemById(i.kind);
        if (snap && def?.floor && i.y < FLOOR_LINE + 0.08) return { ...i, y: 0.9 };
        return i;
      }),
    );
    setPast((p) => [...p.slice(-40), d.before]);
    setFuture([]);
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!selected) return;
    const step = e.shiftKey ? 0.05 : 0.015;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (map[e.key]) {
      e.preventDefault();
      const [dx, dy] = map[e.key];
      patchSel((it) => ({ ...it, x: clamp(it.x + dx, 0.02, 0.98), y: clamp(it.y + dy, 0.06, 1.02) }));
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      patchSel(() => null);
    }
  };

  const save = (goCard: boolean) => {
    const now = new Date().toISOString();
    const id = entryId ?? newId();
    const entry: RoomsEntry = {
      id, schemaVersion: 2, type: "rooms", createdAt: createdAt ?? now, updatedAt: now,
      starred: entries.find((x) => x.id === id)?.starred ?? false,
      families, sceneId: "reading-corner", nickname: nickname.trim(), items, strength, time, windowOpen,
    };
    replace(entry);
    if (!entryId) track("creation_complete", { mode: "rooms", scene_id: "reading-corner" });
    setEntryId(id); setCreatedAt(entry.createdAt); setLoadedFor(id);
    if (goCard) {
      router.push(`/card?from=${id}`);
    } else {
      show("Saved to your Scent Atlas", "/atlas", "Open the Atlas");
      if (!editId) router.replace(`/rooms?id=${id}`, { scroll: false });
    }
  };

  const recent = entries
    .filter((e): e is RoomsEntry => e.type === "rooms")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const trayItems: Array<{ id: string; label: string; group?: string }> =
    tray === 0
      ? FURNITURE.map((d) => ({ id: d.id, label: d.label, group: d.group }))
      : tray === 1
        ? SOURCES.map((d) => ({ id: d.id, label: d.label }))
        : FAMILIES.flatMap((f) => f.materials.map((m) => ({ id: m.id, label: m.label })));
  const selItem = items.find((i) => i.uid === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <section id="editor" aria-label="Room editor" className="editor anchor">
        <div className="card editor__tray" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div role="tablist" aria-label="Items" className="seg">
            <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${tray / 3})`, width: "calc((100% - 10px) / 3)" }} />
            {TRAY.map((t, j) => (
              <button key={t} type="button" role="tab" aria-selected={tray === j} className="seg__opt" style={{ fontSize: 13, padding: 0, letterSpacing: "-0.02em" }} onClick={() => setTray(j)}>{t}</button>
            ))}
          </div>
          {(() => {
            const btn = (it: (typeof trayItems)[number]) => (
              <button key={it.id} type="button" className="tray-item" onClick={() => addItem(it.id)} aria-label={`Add ${it.label}`}>
                <span className="tray-item__art" style={tray === 2 ? { width: 44, height: 44 } : undefined}>
                  <span style={{ display: "block", width: tray === 0 ? "100%" : tray === 1 ? "56%" : "100%", height: "100%" }}>
                    <ItemArt kind={it.id} />
                  </span>
                </span>
                <span style={{ fontSize: tray === 2 ? 13 : 14 }}>{it.label}</span>
              </button>
            );
            if (tray !== 0) {
              return <div className="tray-grid" style={tray === 2 ? { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" } : undefined}>{trayItems.map(btn)}</div>;
            }
            return (
              <div className="tray-groups">
                {FURNITURE_GROUPS.map((g) => {
                  const list = trayItems.filter((it) => (it.group ?? "Objects") === g);
                  return list.length ? (
                    <div key={g} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span className="tray-group__h">{g}</span>
                      <div className="tray-grid">{list.map(btn)}</div>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })()}
          <span className="muted" style={{ fontSize: 15 }}>Tap to add, then drag it into place.</span>
        </div>

        <div className="editor__stage">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="tool" aria-label="Undo" onClick={undo} disabled={!past.length}><Icon name="undo" /></button>
              <button type="button" className="tool" aria-label="Redo" onClick={redo} disabled={!future.length}><Icon name="redo" /></button>
            </div>
            <button type="button" role="switch" aria-checked={snap} className="switch" style={{ width: "auto", fontSize: 15, background: "#fff", borderRadius: 999, padding: "0 16px", minHeight: 44 }} onClick={() => setSnap((v) => !v)}>
              <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
              Snap to floor
            </button>
          </div>

          <div className="stage-box" onKeyDown={onKey}>
            <ScenePage
              items={items}
              families={families}
              title="Reading Corner"
              nickname={nickname}
              strength={strength}
              time={time}
              windowOpen={windowOpen}
              interactive
              selected={selected}
              stageRef={stageRef}
              onItemPointerDown={onItemDown}
              onStagePointerMove={onMove}
              onStagePointerUp={onUp}
              onStageBackgroundDown={() => setSelected(null)}
              bloomKey={families.join("-")}
            />
            <div role="toolbar" aria-label="Selected item" className="glass-pill" style={{ position: "absolute", left: 16, bottom: 16, flexWrap: "wrap", maxWidth: "calc(100% - 32px)", opacity: selItem ? 1 : 0.5 }}>
              <span className="mono" style={{ fontSize: 13, padding: "0 10px" }}>{selItem ? (itemById(selItem.kind)?.label ?? findMaterial(selItem.kind)?.label ?? "") : "select an item"}</span>
              <button type="button" className="tool" aria-label="Rotate" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, rot: (it.rot + 15) % 360 }))}><Icon name="rotateCw" /></button>
              <button type="button" className="tool" aria-label="Flip" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, flip: it.flip === 1 ? -1 : 1 }))}><Icon name="flip" /></button>
              <button type="button" className="tool" aria-label="Bigger" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.min(2, +(it.scale + 0.1).toFixed(2)) }))}><Icon name="plus" /></button>
              <button type="button" className="tool" aria-label="Smaller" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.max(0.4, +(it.scale - 0.1).toFixed(2)) }))}><Icon name="minus" /></button>
              <button type="button" className="tool" aria-label="Bring to front" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: topZ() + 1 }))}><Icon name="front" /></button>
              <button type="button" className="tool" aria-label="Send to back" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: lowZ() - 1 }))}><Icon name="back" /></button>
              <button type="button" className="tool" aria-label="Delete" disabled={!selItem} onClick={() => patchSel(() => null)}><Icon name="trash" /></button>
            </div>
          </div>
        </div>

        <div className="card editor__panel" style={{ padding: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, lineHeight: 1.1 }}>Reading Corner</span>
            <label className="field" style={{ fontSize: 15, color: "var(--slate)" }}>
              Your name for it
              <input className="input hand" style={{ fontSize: 22 }} type="text" value={nickname} maxLength={40} onChange={(e) => setNickname(e.target.value)} placeholder="rain, chapter three" />
            </label>
          </div>

          <label className="field">
            Scent strength
            <input className="range" type="range" min={20} max={100} value={strength} onChange={(e) => setStrength(Number(e.target.value))} />
            <span className="muted" style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 400 }}><span>barely there</span><span>fills the room</span></span>
          </label>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Time of day</span>
            <div role="radiogroup" aria-label="Time of day" className="seg">
              <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${TIMES.findIndex((t) => t.id === time) / 3})`, width: "calc((100% - 10px) / 3)" }} />
              {TIMES.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={time === t.id} className="seg__opt" style={{ padding: 0 }} onClick={() => setTime(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>

          <button type="button" role="switch" aria-checked={windowOpen} className="switch" onClick={() => setWindowOpen((v) => !v)}>
            Window open
            <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Scent families <span className="field__hint">up to 3</span></span>
            <div className="chips" style={{ gap: 6 }}>
              {FAMILIES.map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={families.includes(f.id)} style={{ minHeight: 40, padding: "0 12px 0 8px", fontSize: 14 }} onClick={() => toggleFamily(f.id)}>
                  <span className="chip__dot" style={{ background: f.hex, width: 13, height: 13 }} />
                  {f.label}
                </button>
              ))}
            </div>
            {(() => {
              const near = FAMILIES.filter((f) => !families.includes(f.id) && families.some((id) => areNeighbours(id, f.id))).slice(0, 2);
              return near.length && families.length < 3 ? (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 15 }}>
                  <span className="muted">Try adding</span>
                  {near.map((f) => (
                    <button key={f.id} type="button" className="chip" style={{ minHeight: 36, padding: "0 12px 0 8px", fontSize: 14, borderStyle: "dashed" }} onClick={() => toggleFamily(f.id)}>
                      <span className="chip__dot" style={{ background: f.hex, width: 13, height: 13 }} />
                      {f.label}
                    </button>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button type="button" className="btn btn--primary btn--block" onClick={() => save(false)}>{entryId ? "Save changes" : "Save room"}</button>
            <button type="button" className="btn btn--apricot btn--block" onClick={() => save(true)}>Make a card</button>
          </div>
        </div>
      </section>

      <section id="your-rooms" aria-label="Your rooms" className="anchor" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ fontSize: 28 }}>Your rooms</h2>
          <Link href="/rooms" className="btn btn--ghost btn--sm" style={{ height: 40, gap: 6 }}><Icon name="plus" size={18} />New room</Link>
        </div>
        {recent.length ? (
        <div className="strip">
        {recent.map((r, i) => (
          <Link key={r.id} href={`/rooms?id=${r.id}`} className="card" style={{ flex: "none", width: i === 0 ? 400 : 210, maxWidth: "80vw", display: "flex", gap: 16, alignItems: "center", padding: 14, textDecoration: "none", color: "var(--ink)", outline: r.id === entryId ? "2px solid var(--deep)" : undefined }}>
            <div style={{ width: i === 0 ? 120 : 80, flex: "none" }}>
              <ScenePage items={r.items} families={r.families} title="" date={new Date(r.updatedAt)} showLabels={false} time={r.time} strength={r.strength} windowOpen={r.windowOpen} prefix="olfia" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span className="label-mono" style={{ fontSize: 13 }}>{shortDate(new Date(r.updatedAt))}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: i === 0 ? 24 : 19, lineHeight: 1.1 }}>Reading Corner</span>
              {r.nickname ? <span className="hand" style={{ fontSize: 20, color: "var(--deep)" }}>{r.nickname}</span> : null}
              {i === 0 ? <span className="btn btn--primary btn--sm" style={{ alignSelf: "flex-start", marginTop: 6, height: 40 }}>Continue</span> : null}
            </div>
          </Link>
        ))}
        </div>
        ) : <span className="muted" style={{ fontSize: 15 }}>Rooms you save land here.</span>}
      </section>


      <section id="products" className="card anchor" style={{ marginTop: 8, background: "var(--moss-soft)" }}>
        <ProductCards families={families} title="Matches this room" />
      </section>
    </div>
  );
}
