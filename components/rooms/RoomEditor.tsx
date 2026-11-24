"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, DragEvent as ReactDragEvent, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMOTION_OPTIONS,
  FAMILIES,
  FLOOR_LINE,
  FURNITURE,
  SOURCES,
  SCENT_GROUPS,
  baseLayout,
  areNeighbours,
  FURNITURE_GROUPS,
  SCENES,
  familyById,
  findMaterial,
  itemById,
  sceneName,
  stickersFor,
  uid,
} from "@/lib/catalog";
import {
  SENSE_ROWS,
  SENSORY_DEFAULT,
  artFor,
  emitPoint,
  impressionWords,
  intenseToStrength,
  strengthToIntense,
  feelingShape,
  findProducts,
  isScentItem,
  noteWords,
  productNotes,
  roomNotes,
  type SenseId,
  type SensoryValues,
} from "@/lib/roomScent";
import { shrinkPhoto } from "@/lib/shelf";
import { ROOM_PRESETS } from "@/lib/presets";
import { newId, useAtlas } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import { shortDate } from "@/lib/dates";
import type { EmotionId, FamilyId, PlacedItem, RoomsEntry, TimeOfDay } from "@/lib/types";
import { ScenePage } from "@/components/scene/ScenePage";
import { ItemArt } from "@/components/scene/Cutout";
import { Icon } from "@/components/ui/Icon";
import { ProductCards } from "@/components/products/ProductCards";
import type { Product } from "@/lib/products";
import { ThirdRoom } from "@/components/plans/ThirdRoom";
import { ScentFlow, type FlowSource } from "@/components/rooms/ScentFlow";
import { SensorySwatch } from "@/components/rooms/SensorySwatch";
import { FREE_ROOMS } from "@/lib/plans";

const DEFAULT_FAMS: FamilyId[] = ["woody", "spicy"];
const TIMES: Array<{ id: TimeOfDay; label: string }> = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "night", label: "Night" },
];
const TRAY = ["Furniture", "Scent", "Materials"] as const;

/** Rooms v2 (Tiffany's Notion 11/23; Photo View is her answer 8): one room, three ways of looking at it. */
type View = "room" | "scent" | "photo";
const VIEWS: Array<{ id: View; label: string }> = [
  { id: "room", label: "Room View" },
  { id: "scent", label: "Scent View" },
  { id: "photo", label: "Photo View" },
];

/**
 * Tiffany's Rooms flow (Notion, 11/24): choose a feeling, a space and a fragrance, then style the atmosphere, discover
 * matching products and save. The first three are the row above a new room; which families a feeling brings and which
 * room a space opens are Claude's reading (each feeling also sets the same feeling in Scent View).
 */
const START_FEELINGS: Array<{ id: EmotionId; label: string; families: FamilyId[] }> = [
  { id: "calm", label: "Calm", families: ["green", "fresh"] },
  { id: "cozy", label: "Cozy", families: ["gourmand", "spicy"] },
  { id: "energized", label: "Energized", families: ["citrus", "green"] },
  { id: "fresh-start", label: "Refreshed", families: ["fresh", "citrus"] },
];
const START_SPACES: Array<{ id: string; label: string }> = [
  { id: "bedroom-morning", label: "Bedroom" },
  { id: "living-night", label: "Living room" },
  { id: "study-afternoon", label: "Study" },
];
const START_FRAGRANCES: Array<{ id: string; label: string }> = [
  { id: "candle", label: "Candle" },
  { id: "diffuser", label: "Diffuser" },
  { id: "incense", label: "Incense" },
  { id: "spray", label: "Room spray" },
];
const MATERIAL_IDS = new Set(FAMILIES.flatMap((f) => f.materials.map((m) => m.id)));
const STICKER_SPOTS: Array<[number, number]> = [[0.78, 0.46], [0.6, 0.42], [0.88, 0.6]];

/** The room's family stickers, swapped for another set of families (stickers already there stay where they are). */
function restick(list: PlacedItem[], next: FamilyId[]): PlacedItem[] {
  const wanted = new Set(next.flatMap((f) => familyById(f).materials.map((m) => m.id)));
  const kept = list.filter((i) => !MATERIAL_IDS.has(i.kind) || wanted.has(i.kind));
  const have = new Set(kept.map((i) => i.kind));
  let z = Math.max(0, ...kept.map((i) => i.z));
  const added = next.flatMap((f, n) => {
    if (familyById(f).materials.some((m) => have.has(m.id))) return [];
    const [x, y] = STICKER_SPOTS[n % STICKER_SPOTS.length];
    z += 1;
    return [{ uid: uid(), kind: familyById(f).materials[0].id, x, y, scale: 1, rot: -6, flip: 1 as const, z }];
  });
  return [...kept, ...added];
}

/** The room's first fragrance product becomes another kind, in the same spot (one is added if there is none). */
function swapScent(list: PlacedItem[], kind: string): PlacedItem[] {
  const i = list.findIndex((it) => isScentItem(it.kind));
  if (i < 0) return [...list, { uid: uid(), kind, x: 0.55, y: 0.72, scale: 1, rot: 0, flip: 1, z: Math.max(0, ...list.map((it) => it.z)) + 1 }];
  return list.map((it, j) => (j === i ? { ...it, kind, scale: 1 } : it));
}

/** Room photos for Photo View, shrunk and kept in this browser by room (never uploaded, never in a URL). */
const PHOTO_KEY = "olfia.roomphoto.v1";
const DRAFT = "draft";
function readPhotos(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(PHOTO_KEY) ?? "{}") as unknown;
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}
function writePhotos(map: Record<string, string>): boolean {
  try {
    if (Object.keys(map).length) localStorage.setItem(PHOTO_KEY, JSON.stringify(map));
    else localStorage.removeItem(PHOTO_KEY);
    return true;
  } catch {
    return false;
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function RoomEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");
  const famParam = params.get("family");
  const sceneParam = params.get("scene");
  const presetParam = params.get("preset");
  const entries = useAtlas((s) => s.entries);
  const hydrated = useAtlas((s) => s.hydrated);
  const replace = useAtlas((s) => s.replace);
  const remove = useAtlas((s) => s.remove);
  // v2 (11/23): a new room beyond the free plan's two opens the plans window instead of saving (goCard kept for after)
  const [limit, setLimit] = useState<{ goCard: boolean } | null>(null);
  const show = useToast((s) => s.show);

  const [entryId, setEntryId] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState<string>("reading-corner");
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
  /** Phones: the tray is a drawer under the room (11/17). Closed it shows only its tabs. */
  const [drawer, setDrawer] = useState(false);
  const [past, setPast] = useState<PlacedItem[][]>([]);
  const [future, setFuture] = useState<PlacedItem[][]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Rooms v2
  const [view, setView] = useState<View>("room");
  const [showNotes, setShowNotes] = useState(true);
  /** In Scent View the tags give way to the air: only the product you point at shows its tag, unless Notes is on. */
  const [scentNotes, setScentNotes] = useState(false);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  // Scent View settings live with the page (saving them is an Olfia Plus line in Tiffany's plans table)
  const [feelings, setFeelings] = useState<EmotionId[]>([]);
  const [sensory, setSensory] = useState<SensoryValues>(SENSORY_DEFAULT);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [split, setSplit] = useState(50);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [stagePx, setStagePx] = useState(560);
  /** the starting row's choices for a new room (feeling and space; the fragrance reads from the room itself) */
  const [start, setStart] = useState<{ feel?: EmotionId; space?: string }>({});

  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ uid: string; ox: number; oy: number; before: PlacedItem[]; moved: boolean } | null>(null);
  const handleDrag = useRef(false);

  // Load a saved room when opened with ?id=
  useEffect(() => {
    if (!hydrated) return;
    const key = editId ?? `new:${presetParam ?? ""}:${sceneParam ?? ""}`;
    if (loadedFor === key) return;
    setLoadedFor(key);
    setNoteFor(null);
    if (!editId) {
      setEntryId(null); setCreatedAt(null); setNickname("");
      setPast([]); setFuture([]); setSelected(null); setStart({});
      setPhoto(readPhotos()[DRAFT] ?? null);
      // Opened from a Home preset: that exact room, ready to change.
      const preset = ROOM_PRESETS.find((r) => r.id === presetParam);
      if (preset) {
        setSceneId(preset.scene); setItems(preset.items); setFamilies(preset.families);
        setStrength(70); setTime(preset.time); setWindowOpen(false);
        return;
      }
      // Opened from the quiz result, a family window or a room tab: start with that family applied.
      const fromParam = (famParam ?? "").split(",").map((id) => FAMILIES.find((f) => f.id === id)?.id).filter((id): id is FamilyId => !!id).slice(0, 3);
      const start: FamilyId[] = fromParam.length ? fromParam : DEFAULT_FAMS;
      const scene = SCENES.find((x) => x.id === sceneParam)?.id ?? "reading-corner";
      setSceneId(scene);
      setItems([...baseLayout("candle", scene), ...stickersFor(start)]);
      setFamilies(start); setStrength(70); setTime("afternoon"); setWindowOpen(false);
      return;
    }
    const e = entries.find((x) => x.id === editId);
    if (e && e.type === "rooms") {
      setEntryId(e.id); setCreatedAt(e.createdAt); setNickname(e.nickname); setSceneId(e.sceneId);
      setItems(e.items); setFamilies(e.families); setStrength(e.strength); setTime(e.time); setWindowOpen(e.windowOpen);
      setPast([]); setFuture([]); setSelected(null);
      setPhoto(readPhotos()[e.id] ?? null);
    }
  }, [hydrated, editId, famParam, sceneParam, presetParam, entries, loadedFor]);

  // Photos of rooms that were deleted are let go.
  useEffect(() => {
    if (!hydrated) return;
    const map = readPhotos();
    const ids = new Set(entries.map((e) => e.id));
    const keep = Object.fromEntries(Object.entries(map).filter(([k]) => k === DRAFT || ids.has(k)));
    if (Object.keys(keep).length !== Object.keys(map).length) writePhotos(keep);
  }, [hydrated, entries]);

  // The notes tags keep out of each other's way at the stage's real width.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStagePx(Math.max(240, el.getBoundingClientRect().width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** A room tab starts a new page of that room, keeping the families already chosen. */
  const openScene = (id: string) => {
    if (id === sceneId) return;
    router.replace(`/rooms?scene=${id}&family=${families.join(",")}`, { scroll: false });
  };

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
    if (!next.some((i) => i.uid === selected)) { setSelected(null); setNoteFor(null); }
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
    setNoteFor(null);
    // on a phone, close the drawer so the new piece can be dragged into place
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches) setDrawer(false);
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

  const pickFeeling = (f: (typeof START_FEELINGS)[number]) => {
    setFamilies(f.families);
    setFeelings([f.id]);
    setStart((cur) => ({ ...cur, feel: f.id }));
    commit(restick(items, f.families));
  };
  const pickSpace = (id: string) => {
    const preset = ROOM_PRESETS.find((r) => r.id === id);
    if (!preset) return;
    const feel = START_FEELINGS.find((f) => f.id === start.feel);
    const fams = feel ? feel.families : preset.families;
    const scentKind = items.find((i) => isScentItem(i.kind))?.kind;
    let next = restick(preset.items, fams);
    if (scentKind && START_FRAGRANCES.some((o) => o.id === scentKind)) next = swapScent(next, scentKind);
    setSceneId(preset.scene);
    setTime(preset.time);
    setFamilies(fams);
    setStart((cur) => ({ ...cur, space: id }));
    setSelected(null);
    setNoteFor(null);
    commit(next);
  };
  const pickFragrance = (kind: string) => {
    setSelected(null);
    setNoteFor(null);
    commit(swapScent(items, kind));
  };

  /** Fragrance Matches → Add to room: a cut-out of the same kind of product, carrying the product's notes on its tag. */
  const addProduct = (p: Product) => {
    const def = artFor(p.type, p.id) ?? itemById(p.type);
    if (!def) return;
    const taken = items.filter((i) => isScentItem(i.kind)).map((i) => i.x);
    const x = [0.3, 0.7, 0.5, 0.2, 0.8].find((c) => taken.every((t) => Math.abs(t - c) > 0.12)) ?? 0.5;
    const it: PlacedItem = { uid: uid(), kind: def.id, x, y: 0.72, scale: 1, rot: 0, flip: 1, z: topZ() + 1, notes: productNotes(p) };
    commit([...items, it]);
    setSelected(it.uid);
    setNoteFor(null);
    if (view === "photo") setView("room");
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    show("Added to your room");
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
    if (noteFor && noteFor !== id) setNoteFor(null);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    if (handleDrag.current) {
      setSplit(clamp(((e.clientX - r.left) / r.width) * 100, 0, 100));
      return;
    }
    const d = drag.current;
    if (!d) return;
    const x = clamp((e.clientX - r.left) / r.width - d.ox, 0.02, 0.98);
    const y = clamp((e.clientY - r.top) / r.height - d.oy, 0.06, 1.02);
    d.moved = true;
    setItems((cur) => cur.map((i) => (i.uid === d.uid ? { ...i, x, y } : i)));
  };

  const onUp = () => {
    handleDrag.current = false;
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
    if (!selected || noteFor) return;
    if ((e.target as HTMLElement).closest("input, textarea, [role='slider']")) return;
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

  /* ---------- notes tags ---------- */

  const openNotes = (id: string) => {
    const it = items.find((i) => i.uid === id);
    if (!it) return;
    setSelected(id);
    setNoteFor(id);
    setNoteDraft(it.notes ?? "");
    if (view === "room") setShowNotes(true);
    window.setTimeout(() => noteInputRef.current?.focus(), 30);
  };
  const saveNotes = (text: string) => {
    const id = noteFor;
    if (!id) return;
    const clean = text.replace(/\s+/g, " ").trim().slice(0, 80);
    const it = items.find((i) => i.uid === id);
    if (it && (it.notes ?? "") !== clean) commit(items.map((i) => (i.uid === id ? { ...i, notes: clean || undefined } : i)));
    setNoteFor(null);
  };

  const notes = useMemo(() => {
    const base = roomNotes(items, families);
    if (!noteFor) return base;
    // while a tag is being edited it shows what is being typed
    const typed = noteDraft.trim();
    return base.map((n) => (n.uid === noteFor && typed ? { ...n, text: typed, suggested: false } : n));
  }, [items, families, noteFor, noteDraft]);
  const matchesFor = noteFor ? findProducts(noteDraft) : [];

  /* ---------- Scent View ---------- */

  const feel = useMemo(() => feelingShape(feelings), [feelings]);
  const flowSources: FlowSource[] = useMemo(
    () =>
      notes.flatMap((n) => {
        const it = items.find((i) => i.uid === n.uid);
        const def = it ? itemById(it.kind) : undefined;
        if (!it || !def?.scentType) return [];
        const p = emitPoint(it, def);
        return [{ uid: it.uid, type: def.scentType, x: p.x, y: p.y, w: def.w * it.scale, family: n.family }];
      }),
    [notes, items],
  );
  const toggleFeeling = (id: EmotionId) =>
    setFeelings((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 2 ? [...cur, id] : [cur[1], id]));
  const focus = view === "scent" ? (hover ?? (selected && isScentItem(items.find((i) => i.uid === selected)?.kind ?? "") ? selected : null)) : null;

  const switchView = (v: View) => {
    setView(v);
    setHover(null);
    if (v === "scent") setTray(1);
  };

  /* ---------- Photo View ---------- */

  const photoKey = entryId ?? DRAFT;
  const takePhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoNote("Choose a picture file, such as a JPG or PNG."); return; }
    try {
      const data = await shrinkPhoto(file, 1100, 0.82);
      setPhoto(data);
      setSplit(50);
      const ok = writePhotos({ ...readPhotos(), [photoKey]: data });
      setPhotoNote(ok ? null : "This photo is too large to keep in this browser. It stays until you leave the page.");
    } catch {
      setPhotoNote("This picture could not be opened. Try a JPG or PNG.");
    }
  };
  const removePhoto = () => {
    setPhoto(null);
    setPhotoNote(null);
    const map = readPhotos();
    delete map[photoKey];
    writePhotos(map);
  };
  const onDropPhoto = (e: ReactDragEvent<HTMLDivElement>) => {
    if (view !== "photo") return;
    e.preventDefault();
    void takePhoto(e.dataTransfer.files?.[0]);
  };

  /* ---------- saving ---------- */

  const savedRooms = entries.filter((e): e is RoomsEntry => e.type === "rooms");
  const save = (goCard: boolean) => {
    if (!entryId && savedRooms.length >= FREE_ROOMS) { setLimit({ goCard }); return; }
    store(goCard);
  };
  const store = (goCard: boolean) => {
    const now = new Date().toISOString();
    const id = entryId ?? newId();
    const entry: RoomsEntry = {
      id, schemaVersion: 2, type: "rooms", createdAt: createdAt ?? now, updatedAt: now,
      starred: entries.find((x) => x.id === id)?.starred ?? false,
      families, sceneId, nickname: nickname.trim(), items, strength, time, windowOpen,
    };
    replace(entry);
    if (!entryId && photo) {
      // a new room takes its draft photo along
      const map = readPhotos();
      delete map[DRAFT];
      writePhotos({ ...map, [id]: photo });
    }
    if (!entryId) track("creation_complete", { mode: "rooms", scene_id: sceneId });
    setEntryId(id); setCreatedAt(entry.createdAt); setLoadedFor(id);
    if (goCard) {
      router.push(`/card?from=${id}`);
    } else {
      show("Saved to your Scent Atlas", "/atlas", "Open Scent Atlas");
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
        ? SOURCES.map((d) => ({ id: d.id, label: d.label, group: d.scentGroup }))
        : FAMILIES.flatMap((f) => f.materials.map((m) => ({ id: m.id, label: m.label })));
  const selItem = items.find((i) => i.uid === selected);
  const selIsScent = selItem ? isScentItem(selItem.kind) : false;
  const roomNoteWords = useMemo(() => noteWords(roomNotes(items, families)), [items, families]);

  const saveButtons = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button type="button" className="btn btn--primary btn--block" onClick={() => save(false)}>{entryId ? "Save changes" : "Save room"}</button>
      <button type="button" className="btn btn--apricot btn--block" onClick={() => save(true)}>Make a card</button>
    </div>
  );

  const strengthField = (
    <label className="field">
      Scent strength
      <input className="range" type="range" min={20} max={100} value={strength} onChange={(e) => setStrength(Number(e.target.value))} />
      <span className="muted" style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 400 }}><span>barely there</span><span>fills the room</span></span>
      <span className="field__hint" style={{ fontWeight: 400 }}>Scent strength represents your imagined atmosphere, rather than a measured concentration.</span>
    </label>
  );

  const senseValues: Record<SenseId, number> = { ...sensory, intense: strengthToIntense(strength) };
  const setSense = (id: SenseId, v: number) => {
    if (id === "intense") setStrength(intenseToStrength(v));
    else setSensory((cur) => ({ ...cur, [id]: v }));
  };
  const impression = impressionWords(senseValues);

  const windowSwitch = (
    <button type="button" role="switch" aria-checked={windowOpen} className="switch" onClick={() => setWindowOpen((v) => !v)}>
      Window open
      <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
    </button>
  );

  const notesOn = view === "scent" ? scentNotes : showNotes;
  const notesSwitch = (
    <button type="button" role="switch" aria-checked={notesOn} className="switch switch--pill" onClick={() => { if (view === "scent") setScentNotes((v) => !v); else setShowNotes((v) => !v); setNoteFor(null); }}>
      <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
      Notes
    </button>
  );

  const viewIndex = VIEWS.findIndex((v) => v.id === view);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {!entryId ? (
        <section aria-label="Start a room" className="card room-start">
          {[
            { title: "Choose a feeling", opts: START_FEELINGS.map((f) => ({ id: f.id, label: f.label, on: start.feel === f.id, pick: () => pickFeeling(f) })) },
            { title: "Choose a space", opts: START_SPACES.map((o) => ({ id: o.id, label: o.label, on: start.space === o.id, pick: () => pickSpace(o.id) })) },
            { title: "Choose your fragrance", opts: START_FRAGRANCES.map((o) => ({ id: o.id, label: o.label, on: items.find((i) => isScentItem(i.kind))?.kind === o.id, pick: () => pickFragrance(o.id) })) },
          ].map((step, i) => (
            <div key={step.title} className="room-start__step">
              {i ? <Icon name="arrowRight" size={18} className="room-start__arrow" /> : null}
              <div role="group" aria-label={step.title} className="room-start__group">
                <span className="room-start__h">{step.title}</span>
                <div className="room-start__opts">
                  {step.opts.map((o) => (
                    <button key={o.id} type="button" className="chip" aria-pressed={o.on} onClick={o.pick}>{o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <section id="editor" aria-label="Room editor" className={`editor editor--${view} anchor`}>
        <div className={`card editor__tray${drawer ? " is-open" : ""}`}>
          <button type="button" className="editor__handle" aria-expanded={drawer} aria-label={drawer ? "Close the drawer" : "Open the drawer"} onClick={() => setDrawer((v) => !v)}>
            <span aria-hidden="true" />
          </button>
          <div role="tablist" aria-label="Items" className="seg">
            <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${tray / 3})`, width: "calc((100% - 10px) / 3)" }} />
            {TRAY.map((t, j) => (
              <button key={t} type="button" role="tab" aria-selected={tray === j} className="seg__opt" style={{ fontSize: 13, padding: 0, letterSpacing: "-0.02em" }} onClick={() => { setTray(j); setDrawer(true); }}>{t}</button>
            ))}
          </div>
          <div className="editor__tray-body">
          {(() => {
            const btn = (it: (typeof trayItems)[number]) => (
              <button key={it.id} type="button" className={`tray-item${tray === 1 ? " tray-item--scent" : ""}`} onClick={() => addItem(it.id)} aria-label={`Add ${it.label}`}>
                <span className="tray-item__art" style={tray === 2 ? { width: 44, height: 44 } : undefined}>
                  <span style={{ display: "block", width: "100%", height: "100%" }}>
                    <ItemArt kind={it.id} />
                  </span>
                </span>
                <span style={{ fontSize: tray === 2 ? 13 : 14 }}>{it.label}</span>
              </button>
            );
            if (tray === 2) {
              return <div className="tray-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>{trayItems.map(btn)}</div>;
            }
            const groups: string[] =
              tray === 1
                ? [...SCENT_GROUPS]
                : (() => {
                    // the room's own pieces first, then everything else
                    const own = SCENES.find((x) => x.id === sceneId)?.group;
                    const others = SCENES.map((x) => x.group).filter((g) => g && g !== own);
                    return [...(own ? [own] : []), ...FURNITURE_GROUPS.filter((g) => g !== own && !others.includes(g)), ...others.filter((g): g is NonNullable<typeof g> => !!g)];
                  })();
            return (
              <div className="tray-groups">
                {groups.map((g) => {
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
          <span className="muted" style={{ fontSize: 15 }}>Select an object to add it, then drag it into place.</span>
          </div>
        </div>

        <div className="editor__stage">
          <div role="tablist" aria-label="View" className="seg editor__views">
            <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${viewIndex / 3})`, width: "calc((100% - 10px) / 3)" }} />
            {VIEWS.map((v) => (
              <button key={v.id} type="button" role="tab" aria-selected={view === v.id} className="seg__opt" onClick={() => switchView(v.id)}>{v.label}</button>
            ))}
          </div>

          <div className="editor__tools">
            {view !== "photo" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="tool" aria-label="Undo" onClick={undo} disabled={!past.length}><Icon name="undo" /></button>
                <button type="button" className="tool" aria-label="Redo" onClick={redo} disabled={!future.length}><Icon name="redo" /></button>
                {view === "scent" ? (
                  <button type="button" className="tool" aria-label={paused ? "Play the scent motion" : "Pause the scent motion"} aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
                    <Icon name={paused ? "play" : "pause"} />
                  </button>
                ) : null}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current?.click()}>
                  <Icon name="imagePlus" size={18} />{photo ? "Replace photo" : "Add a photo of your room"}
                </button>
                {photo ? <button type="button" className="tool" aria-label="Remove the photo" onClick={removePhoto}><Icon name="trash" /></button> : null}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {view !== "photo" ? notesSwitch : null}
              {view === "room" ? (
                <button type="button" role="switch" aria-checked={snap} className="switch switch--pill" onClick={() => setSnap((v) => !v)}>
                  <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
                  Snap to floor
                </button>
              ) : null}
            </div>
          </div>

          <div className="stage-box" onKeyDown={onKey} onDragOver={(e) => { if (view === "photo") e.preventDefault(); }} onDrop={onDropPhoto}>
            <ScenePage
              items={items}
              families={families}
              title={sceneName(sceneId)}
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
              onStageBackgroundDown={() => { setSelected(null); setNoteFor(null); }}
              bloomKey={families.join("-")}
              view={view === "scent" ? "scent" : "room"}
              emphasizeScent
              notes={view === "photo" ? undefined : view === "scent" ? (scentNotes ? notes : notes.filter((n) => n.uid === focus || n.uid === noteFor)) : showNotes ? notes : undefined}
              stagePx={stagePx}
              onNoteClick={openNotes}
              focusUid={focus}
              onItemHover={view === "scent" ? setHover : undefined}
              atmosphere={view !== "scent"}
              overlay={
                view === "scent" ? (
                  <ScentFlow sources={flowSources} settings={{ strength, sensory, feel, time, windowOpen, paused, focus }} />
                ) : view === "photo" && photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="photo-layer" src={photo} alt="Your room" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }} />
                    <span className="photo-split" style={{ left: `${split}%` }} aria-hidden="true" />
                    <span
                      role="slider"
                      tabIndex={0}
                      aria-label="Photo and collage"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(split)}
                      className="photo-knob"
                      style={{ left: `${split}%` }}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDrag.current = true;
                        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
                      }}
                      onKeyDown={(e) => {
                        const step = e.shiftKey ? 10 : 4;
                        if (e.key === "ArrowLeft") { e.preventDefault(); setSplit((v) => clamp(v - step, 0, 100)); }
                        if (e.key === "ArrowRight") { e.preventDefault(); setSplit((v) => clamp(v + step, 0, 100)); }
                        if (e.key === "Home") { e.preventDefault(); setSplit(0); }
                        if (e.key === "End") { e.preventDefault(); setSplit(100); }
                      }}
                    >
                      <Icon name="chevronLeft" size={16} />
                      <Icon name="chevronRight" size={16} />
                    </span>
                  </>
                ) : view === "photo" ? (
                  <div className="photo-empty">
                    <button type="button" className="photo-empty__btn" onClick={() => fileRef.current?.click()}>
                      <Icon name="imagePlus" size={28} />
                      <span>Add a photo of your room</span>
                    </button>
                  </div>
                ) : null
              }
            />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e: ChangeEvent<HTMLInputElement>) => { void takePhoto(e.target.files?.[0]); e.target.value = ""; }} />

            {view !== "photo" ? (
              <div role="toolbar" aria-label="Selected item" className="glass-pill editor__toolbar" style={{ opacity: selItem ? 1 : 0.5 }}>
                <span className="mono" style={{ fontSize: 13, padding: "0 10px" }}>{selItem ? (itemById(selItem.kind)?.label ?? findMaterial(selItem.kind)?.label ?? "") : "select an item"}</span>
                {selIsScent ? (
                  <button type="button" className="tool" aria-label="Notes" aria-expanded={noteFor === selected} onClick={() => (noteFor ? saveNotes(noteDraft) : selected && openNotes(selected))}><Icon name="tag" /></button>
                ) : null}
                <button type="button" className="tool" aria-label="Rotate" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, rot: (it.rot + 15) % 360 }))}><Icon name="rotateCw" /></button>
                <button type="button" className="tool" aria-label="Flip" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, flip: it.flip === 1 ? -1 : 1 }))}><Icon name="flip" /></button>
                <button type="button" className="tool" aria-label="Increase size" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.min(2, +(it.scale + 0.1).toFixed(2)) }))}><Icon name="plus" /></button>
                <button type="button" className="tool" aria-label="Decrease size" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.max(0.4, +(it.scale - 0.1).toFixed(2)) }))}><Icon name="minus" /></button>
                <button type="button" className="tool" aria-label="Bring to front" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: topZ() + 1 }))}><Icon name="front" /></button>
                <button type="button" className="tool" aria-label="Send to back" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: lowZ() - 1 }))}><Icon name="back" /></button>
                <button type="button" className="tool" aria-label="Delete" disabled={!selItem} onClick={() => patchSel(() => null)}><Icon name="trash" /></button>
              </div>
            ) : null}

            {noteFor && view !== "photo" ? (
              <div
                className="note-editor glass-pill"
                role="dialog"
                aria-label="Notes"
                onKeyDown={(e) => {
                  if (e.key === "Escape") { e.preventDefault(); setNoteFor(null); }
                }}
              >
                <label className="note-editor__field">
                  <span className="note-editor__label">Notes</span>
                  <input
                    ref={noteInputRef}
                    className="input"
                    type="text"
                    value={noteDraft}
                    maxLength={80}
                    placeholder="Notes or a product name"
                    onChange={(e) => setNoteDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveNotes(matchesFor.length === 1 ? productNotes(matchesFor[0]) : noteDraft); } }}
                  />
                </label>
                {matchesFor.length ? (
                  <div className="note-editor__matches">
                    {matchesFor.map((p) => (
                      <button key={p.id} type="button" className="note-editor__match" onClick={() => saveNotes(productNotes(p))}>
                        <span className="note-editor__brand">{p.brand} · {p.name}</span>
                        <span className="note-editor__notes">{productNotes(p)}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="note-editor__row">
                  {items.find((i) => i.uid === noteFor)?.notes ? (
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => saveNotes("")}>Clear</button>
                  ) : <span />}
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => saveNotes(noteDraft)}>Done</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card editor__panel" style={{ padding: 22 }}>
          {view === "photo" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="field__hint" style={{ fontSize: 14 }}>Your photo stays in this browser.</span>
              {photoNote ? <span className="field__error" role="status">{photoNote}</span> : null}
            </div>
          ) : null}
          {view !== "scent" ? (
            <>
              <label className="field">
                Name your room
                <input className="input hand" style={{ fontSize: 22 }} type="text" value={nickname} maxLength={40} onChange={(e) => setNickname(e.target.value)} placeholder="rain, chapter three" />
              </label>

              {/* 11/18 (Tiffany): the room is one more setting, below the name and in the same style as Time of day */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Room</span>
                <div role="radiogroup" aria-label="Room" className="seg seg--wrap">
                  <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${Math.max(0, SCENES.findIndex((x) => x.id === sceneId)) / SCENES.length})`, width: `calc((100% - 10px) / ${SCENES.length})` }} />
                  {SCENES.map((x) => (
                    <button key={x.id} type="button" role="radio" aria-checked={sceneId === x.id} className="seg__opt" onClick={() => openScene(x.id)}>{x.name}</button>
                  ))}
                </div>
              </div>

              {strengthField}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Time of day</span>
                <div role="radiogroup" aria-label="Time of day" className="seg">
                  <span className="seg__thumb" aria-hidden="true" style={{ left: `calc(5px + (100% - 10px) * ${TIMES.findIndex((t) => t.id === time) / 3})`, width: "calc((100% - 10px) / 3)" }} />
                  {TIMES.map((t) => (
                    <button key={t.id} type="button" role="radio" aria-checked={time === t.id} className="seg__opt" style={{ padding: 0 }} onClick={() => setTime(t.id)}>{t.label}</button>
                  ))}
                </div>
              </div>

              {windowSwitch}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Scent families <span className="field__hint">Choose up to three</span></span>
                <div className="chips" style={{ gap: 6 }}>
                  {FAMILIES.map((f) => (
                    <button key={f.id} type="button" className="chip" aria-pressed={families.includes(f.id)} style={{ minHeight: 40, padding: "0 12px 0 8px", fontSize: 14 }} onClick={() => toggleFamily(f.id)}>
                      <span className="chip__dot" style={{ background: f.hex, width: 13, height: 13 }} />
                      {f.label}
                    </button>
                  ))}
                </div>
                {(() => {
                  // copy v1 (11/24, §4.1): one suggestion, "Explore {family} as an additional scent."; the family is the button
                  const near = FAMILIES.filter((f) => !families.includes(f.id) && families.some((id) => areNeighbours(id, f.id))).slice(0, 1);
                  return near.length && families.length < 3 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 15 }}>
                      <span className="muted">Explore</span>
                      {near.map((f) => (
                        <button key={f.id} type="button" className="chip" style={{ minHeight: 36, padding: "0 12px 0 8px", fontSize: 14, borderStyle: "dashed" }} onClick={() => toggleFamily(f.id)}>
                          <span className="chip__dot" style={{ background: f.hex, width: 13, height: 13 }} />
                          {f.label}
                        </button>
                      ))}
                      <span className="muted">as an additional scent.</span>
                    </div>
                  ) : null;
                })()}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Feelings <span className="field__hint">Choose up to two</span></span>
                <div className="chips" style={{ gap: 6 }}>
                  {EMOTION_OPTIONS.map((o) => (
                    <button key={o.id} type="button" className="chip" aria-pressed={feelings.includes(o.id)} style={{ minHeight: 38, padding: "0 12px", fontSize: 14 }} onClick={() => toggleFeeling(o.id)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tiffany's sensory sketch (11/24): five sliders, the words above each track, then the impression they make */}
              <div className="senses">
                {SENSE_ROWS.map((r) => (
                  <label key={r.id} className="sense">
                    <span className="sense__ends"><span>{r.from}</span><span>{r.to}</span></span>
                    <input
                      className="range"
                      type="range"
                      min={0}
                      max={100}
                      value={senseValues[r.id]}
                      aria-label={`${r.from} to ${r.to}`}
                      onChange={(e) => setSense(r.id, Number(e.target.value))}
                    />
                  </label>
                ))}
                <span className="field__hint" style={{ fontWeight: 400 }}>Scent strength represents your imagined atmosphere, rather than a measured concentration.</span>
              </div>

              <div className="impression">
                <SensorySwatch families={families} values={senseValues} />
                <div className="impression__text">
                  <span className="impression__h">Your sensory impression</span>
                  {impression.length ? <span className="impression__words">{impression.join(" · ")}</span> : null}
                </div>
              </div>

              {windowSwitch}
            </>
          )}

          {saveButtons}
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
              <span style={{ fontFamily: "var(--font-display)", fontSize: i === 0 ? 24 : 19, lineHeight: 1.1 }}>{sceneName(r.sceneId)}</span>
              {r.nickname ? <span className="hand" style={{ fontSize: 20, color: "var(--deep)" }}>{r.nickname}</span> : null}
              {i === 0 ? <span className="btn btn--primary btn--sm" style={{ alignSelf: "flex-start", marginTop: 6, height: 40 }}>Continue</span> : null}
            </div>
          </Link>
        ))}
        </div>
        ) : <span className="muted" style={{ fontSize: 15 }}>Save a room to keep your design here and return to it whenever you like.</span>}
      </section>


      <section id="products" className="card anchor" style={{ marginTop: 8 }}>
        <ProductCards
          families={families}
          roomNotes={roomNoteWords}
          feelings={feelings.map((id) => (id === "fresh-start" ? "fresh" : (EMOTION_OPTIONS.find((o) => o.id === id)?.label ?? id).toLowerCase()))}
          room={(START_SPACES.find((o) => o.id === start.space)?.label ?? sceneName(sceneId)).toLowerCase()}
          onAdd={addProduct}
          title="Fragrance Matches"
          lead="Explore products with fragrance families in common with your room. Use the match as a starting point, then consider how the product smells to you."
        />
      </section>

      <ThirdRoom
        open={limit !== null}
        rooms={savedRooms}
        onClose={() => setLimit(null)}
        onReplace={(id) => { const goCard = limit?.goCard ?? false; setLimit(null); remove(id); store(goCard); }}
      />
    </div>
  );
}
