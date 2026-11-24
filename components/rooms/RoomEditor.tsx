"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { CSSProperties, ChangeEvent, DragEvent as ReactDragEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
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
import { Dialog } from "@/components/ui/Dialog";
import { onTabKeys } from "@/components/ui/tabKeys";
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
 * matching products and save. The first three are the intention bar above a new room; which families a feeling brings
 * and which room a space opens are Claude's reading (each feeling also sets the same feeling in Scent View).
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

/**
 * One step of the room's history (11/24 handoff, P0): everything a person shapes on this page, so Undo and Redo bring
 * the furniture, the scent families, the room, the light and the Scent View settings back together. Only the typed
 * name stays out (the text field has its own undo).
 */
interface Snap {
  items: PlacedItem[];
  families: FamilyId[];
  sceneId: string;
  time: TimeOfDay;
  strength: number;
  windowOpen: boolean;
  feelings: EmotionId[];
  sensory: SensoryValues;
  start: { feel?: EmotionId; space?: string };
}

/** A change that would replace the room on the page while it has unsaved changes, held until the person says so. */
interface Ask {
  title: string;
  text: string;
  go: string;
  run: () => void;
}

/* Claude's wording for the unsaved-changes window (11/24), hers to change */
const LEAVE = {
  title: "Leave without saving?",
  text: "The changes you made to this room haven’t been saved yet.",
  go: "Leave without saving",
};

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
  const [snapFloor, setSnapFloor] = useState(true);
  const [tray, setTray] = useState(0);
  /** Tablets and phones: the sticker book is a drawer at the bottom of the screen (11/17). Closed it shows only its tabs. */
  const [drawer, setDrawer] = useState(false);
  const [past, setPast] = useState<Snap[]>([]);
  const [future, setFuture] = useState<Snap[]>([]);
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
  /** the intention bar's choices for a new room (feeling and space; the fragrance reads from the room itself) */
  const [start, setStart] = useState<{ feel?: EmotionId; space?: string }>({});

  // 11/24 handoff: unsaved changes are asked about before anything replaces the room, and a dragged object lifts
  const [ask, setAsk] = useState<Ask | null>(null);
  const [cleanKey, setCleanKey] = useState<string | null>(null);
  const [cleanTick, setCleanTick] = useState(0);
  const [lifted, setLifted] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ uid: string; ox: number; oy: number; before: Snap; moved: boolean } | null>(null);
  const handleDrag = useRef(false);
  /** a slider being moved: its history step is written once, when the movement starts */
  const gesture = useRef<number | null>(null);

  /* ---------- saved or not ---------- */

  // What the room is made of, as one string: compared with the last time it was loaded, saved or laid out from a preset.
  const designKey = JSON.stringify([sceneId, items, families, strength, time, windowOpen, nickname.trim()]);
  const designRef = useRef(designKey);
  designRef.current = designKey;
  useEffect(() => {
    if (cleanTick) setCleanKey(designRef.current);
  }, [cleanTick]);
  const dirty = cleanKey !== null && designKey !== cleanKey;
  /** the room as it is after this change counts as unchanged (read once the change has rendered) */
  const markClean = () => setCleanTick((t) => t + 1);

  /* ---------- history ---------- */

  const current = (): Snap => ({ items, families, sceneId, time, strength, windowOpen, feelings, sensory, start });
  const endGesture = () => {
    if (gesture.current !== null) window.clearTimeout(gesture.current);
    gesture.current = null;
  };
  const record = () => {
    endGesture();
    const s = current();
    setPast((p) => [...p.slice(-40), s]);
    setFuture([]);
  };
  /** for sliders: one history step per movement, not one per pixel */
  const live = (apply: () => void) => {
    if (gesture.current === null) {
      const s = current();
      setPast((p) => [...p.slice(-40), s]);
      setFuture([]);
    } else {
      window.clearTimeout(gesture.current);
    }
    gesture.current = window.setTimeout(() => { gesture.current = null; }, 450);
    apply();
  };
  const restore = (s: Snap) => {
    setItems(s.items); setFamilies(s.families); setSceneId(s.sceneId); setTime(s.time); setStrength(s.strength);
    setWindowOpen(s.windowOpen); setFeelings(s.feelings); setSensory(s.sensory); setStart(s.start);
    if (selected && !s.items.some((i) => i.uid === selected)) setSelected(null);
    setNoteFor(null);
  };
  const commit = (next: PlacedItem[]) => {
    record();
    setItems(next);
  };
  const undo = () => {
    endGesture();
    if (!past.length) return;
    const prev = past[past.length - 1];
    const now = current();
    setFuture((f) => [now, ...f]);
    setPast((p) => p.slice(0, -1));
    restore(prev);
  };
  const redo = () => {
    endGesture();
    if (!future.length) return;
    const next = future[0];
    const now = current();
    setPast((p) => [...p, now]);
    setFuture((f) => f.slice(1));
    restore(next);
  };

  /* ---------- loading ---------- */

  /** A new room: a Home preset as it is, or the reading corner (or the room asked for) with the families asked for. */
  const startNew = (presetId: string | null, sceneAsked: string | null, familyList: string | null) => {
    endGesture();
    setEntryId(null); setCreatedAt(null); setNickname("");
    setPast([]); setFuture([]); setSelected(null); setStart({}); setNoteFor(null);
    setPhoto(readPhotos()[DRAFT] ?? null);
    const preset = ROOM_PRESETS.find((r) => r.id === presetId);
    if (preset) {
      // Opened from a Home preset: that exact room, ready to change.
      setSceneId(preset.scene); setItems(preset.items); setFamilies(preset.families);
      setStrength(70); setTime(preset.time); setWindowOpen(false);
    } else {
      // Opened from the quiz result, a family window or a room tab: start with that family applied.
      const fromParam = (familyList ?? "").split(",").map((id) => FAMILIES.find((f) => f.id === id)?.id).filter((id): id is FamilyId => !!id).slice(0, 3);
      const fams: FamilyId[] = fromParam.length ? fromParam : DEFAULT_FAMS;
      const scene = SCENES.find((x) => x.id === sceneAsked)?.id ?? "reading-corner";
      setSceneId(scene);
      setItems([...baseLayout("candle", scene), ...stickersFor(fams)]);
      setFamilies(fams); setStrength(70); setTime("afternoon"); setWindowOpen(false);
    }
    markClean();
  };

  // Load a saved room when opened with ?id=, or start a new one
  useEffect(() => {
    if (!hydrated) return;
    const key = editId ?? `new:${presetParam ?? ""}:${sceneParam ?? ""}`;
    if (loadedFor === key) return;
    setLoadedFor(key);
    setNoteFor(null);
    if (!editId) {
      startNew(presetParam, sceneParam, famParam);
      return;
    }
    const e = entries.find((x) => x.id === editId);
    if (e && e.type === "rooms") {
      endGesture();
      setEntryId(e.id); setCreatedAt(e.createdAt); setNickname(e.nickname); setSceneId(e.sceneId);
      setItems(e.items); setFamilies(e.families); setStrength(e.strength); setTime(e.time); setWindowOpen(e.windowOpen);
      setPast([]); setFuture([]); setSelected(null);
      setPhoto(readPhotos()[e.id] ?? null);
      markClean();
    }
    // startNew and markClean only call state setters
  }, [hydrated, editId, famParam, sceneParam, presetParam, entries, loadedFor]); // eslint-disable-line react-hooks/exhaustive-deps

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

  useEffect(() => () => endGesture(), []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Anything that replaces the room on the page asks first while there are unsaved changes (P0, 11/24 handoff). */
  const guard = (message: Omit<Ask, "run">, run: () => void) => {
    if (dirty) setAsk({ ...message, run });
    else run();
  };

  /** A room tab starts a new page of that room, keeping the families already chosen. */
  const openScene = (id: string) => {
    if (id === sceneId) return;
    guard(
      { title: "Start a new room?", text: `${sceneName(id)} opens as a new room. The changes you made here haven’t been saved yet.`, go: "Start a new room" },
      () => router.replace(`/rooms?scene=${id}&family=${families.join(",")}`, { scroll: false }),
    );
  };

  /** New room and the saved rooms below: the same question before the room on the page is left. */
  const leaveTo = (href: string) => (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const onFreshPage = !editId && !presetParam && !sceneParam && !famParam;
    if (href === "/rooms" && onFreshPage) {
      // the address would not change, so the new room is set up here
      e.preventDefault();
      guard(LEAVE, () => startNew(null, null, null));
      return;
    }
    if (!dirty) return;
    e.preventDefault();
    setAsk({ ...LEAVE, run: () => router.push(href) });
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
  const drawerScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1099px)").matches;

  const addItem = (kind: string) => {
    const def = itemById(kind);
    if (!def) return;
    const jitter = (Math.random() - 0.5) * 0.12;
    const pos = def.category === "furniture" ? { x: 0.5 + jitter, y: def.floor ? 0.9 : 0.3 } : def.category === "source" ? { x: 0.55 + jitter, y: 0.72 } : { x: 0.6 + jitter, y: 0.42 };
    const it: PlacedItem = { uid: uid(), kind, x: pos.x, y: pos.y, scale: 1, rot: def.category === "material" ? Math.round(jitter * 60) : 0, flip: 1, z: topZ() + 1 };
    commit([...items, it]);
    setSelected(it.uid);
    setNoteFor(null);
    // where the sticker book is a drawer, close it so the new piece can be dragged into place
    if (drawerScreen()) setDrawer(false);
  };

  const toggleFamily = (f: FamilyId) => {
    const on = families.includes(f);
    const mats = familyById(f).materials.map((m) => m.id);
    if (on) {
      record();
      setFamilies(families.filter((x) => x !== f));
      setItems(items.filter((i) => !mats.includes(i.kind)));
    } else if (families.length < 3) {
      record();
      setFamilies([...families, f]);
      const [x, y] = STICKER_SPOTS[families.length] ?? [0.6, 0.4];
      setItems([...items, { uid: uid(), kind: mats[0], x, y, scale: 1, rot: -6, flip: 1, z: topZ() + 1 }]);
    }
  };

  // The intention bar. A feeling or a fragrance changes nothing a space would undo, so a room that had no unsaved
  // changes still has none after them; a space lays out a preset, so it asks first when there are changes.
  const pickFeeling = (f: (typeof START_FEELINGS)[number]) => {
    const wasClean = !dirty;
    record();
    setFamilies(f.families);
    setFeelings([f.id]);
    setStart((cur) => ({ ...cur, feel: f.id }));
    setItems(restick(items, f.families));
    if (wasClean) markClean();
  };
  const pickSpace = (id: string) => {
    const preset = ROOM_PRESETS.find((r) => r.id === id);
    if (!preset) return;
    const feel = START_FEELINGS.find((f) => f.id === start.feel);
    const fams = feel ? feel.families : preset.families;
    const scentKind = items.find((i) => isScentItem(i.kind))?.kind;
    let next = restick(preset.items, fams);
    if (scentKind && START_FRAGRANCES.some((o) => o.id === scentKind)) next = swapScent(next, scentKind);
    record();
    setSceneId(preset.scene);
    setTime(preset.time);
    setFamilies(fams);
    setStart((cur) => ({ ...cur, space: id }));
    setSelected(null);
    setNoteFor(null);
    setItems(next);
    markClean();
  };
  const chooseSpace = (id: string) => {
    const label = START_SPACES.find((o) => o.id === id)?.label ?? "";
    guard(
      { title: `Use the ${label.toLowerCase()} layout?`, text: "It replaces the arrangement you have made. You can undo this afterwards.", go: "Use this layout" },
      () => pickSpace(id),
    );
  };
  const pickFragrance = (kind: string) => {
    const wasClean = !dirty;
    setSelected(null);
    setNoteFor(null);
    commit(swapScent(items, kind));
    if (wasClean) markClean();
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
    // bring the room, its tools and the save buttons into view together
    document.querySelector("#editor .ws__canvas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    show("Added to your room");
  };

  const onItemDown = (id: string, e: ReactPointerEvent<HTMLButtonElement>) => {
    const stage = stageRef.current;
    const it = items.find((i) => i.uid === id);
    if (!stage || !it) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
    const r = stage.getBoundingClientRect();
    endGesture();
    drag.current = { uid: id, ox: (e.clientX - r.left) / r.width - it.x, oy: (e.clientY - r.top) / r.height - it.y, before: current(), moved: false };
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
    if (!d.moved) setLifted(d.uid);
    d.moved = true;
    setItems((cur) => cur.map((i) => (i.uid === d.uid ? { ...i, x, y } : i)));
  };

  const onUp = () => {
    handleDrag.current = false;
    const d = drag.current;
    drag.current = null;
    setLifted(null);
    if (!d || !d.moved) return;
    setItems((cur) =>
      cur.map((i) => {
        if (i.uid !== d.uid) return i;
        const def = itemById(i.kind);
        if (snapFloor && def?.floor && i.y < FLOOR_LINE + 0.08) return { ...i, y: 0.9 };
        return i;
      }),
    );
    setPast((p) => [...p.slice(-40), d.before]);
    setFuture([]);
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!selected || noteFor) return;
    if ((e.target as HTMLElement).closest("input, textarea, [role='slider'], .ws-rail")) return;
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
  const toggleFeeling = (id: EmotionId) => {
    record();
    setFeelings((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 2 ? [...cur, id] : [cur[1], id]));
  };
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
    endGesture();
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
    markClean();
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
  const selLabel = selItem ? (itemById(selItem.kind)?.label ?? findMaterial(selItem.kind)?.label ?? "") : "";
  const roomNoteWords = useMemo(() => noteWords(roomNotes(items, families)), [items, families]);

  const senseValues: Record<SenseId, number> = { ...sensory, intense: strengthToIntense(strength) };
  const setSense = (id: SenseId, v: number) =>
    live(() => {
      if (id === "intense") setStrength(intenseToStrength(v));
      else setSensory((cur) => ({ ...cur, [id]: v }));
    });
  const impression = impressionWords(senseValues);
  const fragranceKind = items.find((i) => isScentItem(i.kind))?.kind ?? "";
  const fragranceValue = START_FRAGRANCES.some((o) => o.id === fragranceKind) ? fragranceKind : "";
  const viewIndex = VIEWS.findIndex((v) => v.id === view);
  const notesOn = view === "scent" ? scentNotes : showNotes;

  /* ---------- pieces ---------- */

  const windowSwitch = (
    <button type="button" role="switch" aria-checked={windowOpen} className="switch switch--sm switch--row" onClick={() => { record(); setWindowOpen((v) => !v); }}>
      Window open
      <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
    </button>
  );
  const strengthNote = <p className="ws-note">Scent strength represents your imagined atmosphere, rather than a measured concentration.</p>;

  // the intention bar: feeling → space → fragrance, three compact choices in a row (11/24 handoff, §3.4)
  const intentSteps = [
    {
      id: "feel",
      title: "Choose a feeling",
      value: start.feel ?? "",
      opts: START_FEELINGS.map((f) => ({ id: f.id as string, label: f.label })),
      pick: (v: string) => { const f = START_FEELINGS.find((x) => x.id === v); if (f) pickFeeling(f); },
    },
    { id: "space", title: "Choose a space", value: start.space ?? "", opts: START_SPACES, pick: chooseSpace },
    { id: "fragrance", title: "Choose your fragrance", value: fragranceValue, opts: START_FRAGRANCES, pick: pickFragrance },
  ];

  const shelves = (() => {
    if (tray === 2) return [{ title: "", list: trayItems }];
    const groups: string[] =
      tray === 1
        ? [...SCENT_GROUPS]
        : (() => {
            // the room's own pieces first, then everything else
            const own = SCENES.find((x) => x.id === sceneId)?.group;
            const others = SCENES.map((x) => x.group).filter((g) => g && g !== own);
            return [...(own ? [own] : []), ...FURNITURE_GROUPS.filter((g) => g !== own && !others.includes(g)), ...others.filter((g): g is NonNullable<typeof g> => !!g)];
          })();
    return groups.map((g) => ({ title: g, list: trayItems.filter((it) => (it.group ?? "Objects") === g) })).filter((s) => s.list.length);
  })();

  const roomSettings = (
    <>
      <label className="ws-field">
        Name your room
        <input className="input hand" type="text" value={nickname} maxLength={40} onChange={(e) => setNickname(e.target.value)} placeholder="rain, chapter three" />
      </label>

      {/* 11/18 (Tiffany): the room is one more setting, below the name and in the same style as Time of day */}
      <div className="ws-group">
        <span className="ws-label" id="ws-room">Room</span>
        <div role="radiogroup" aria-labelledby="ws-room" className="seg seg--soft seg--fit">
          {SCENES.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={sceneId === x.id} className="seg__opt" onClick={() => openScene(x.id)}>{x.name}</button>
          ))}
        </div>
      </div>

      <div className="ws-group">
        <span className="ws-label" id="ws-time">Time of day</span>
        <div role="radiogroup" aria-labelledby="ws-time" className="seg seg--soft">
          {TIMES.map((t) => (
            <button key={t.id} type="button" role="radio" aria-checked={time === t.id} className="seg__opt" onClick={() => { if (t.id !== time) { record(); setTime(t.id); } }}>{t.label}</button>
          ))}
        </div>
      </div>

      {windowSwitch}

      <div className="ws-group">
        <span className="ws-label">Scent families <span className="field__hint">Choose up to three</span></span>
        <div className="chips">
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={families.includes(f.id)} onClick={() => toggleFamily(f.id)}>
              <span className="chip__dot" style={{ background: f.hex }} />
              {f.label}
            </button>
          ))}
        </div>
        {(() => {
          // copy v1 (11/24, §4.1): one suggestion, "Explore {family} as an additional scent."; the family is the button
          const near = FAMILIES.filter((f) => !families.includes(f.id) && families.some((id) => areNeighbours(id, f.id))).slice(0, 1);
          return near.length && families.length < 3 ? (
            <div className="ws-explore">
              <span>Explore</span>
              {near.map((f) => (
                <button key={f.id} type="button" className="chip" onClick={() => toggleFamily(f.id)}>
                  <span className="chip__dot" style={{ background: f.hex }} />
                  {f.label}
                </button>
              ))}
              <span>as an additional scent.</span>
            </div>
          ) : null;
        })()}
      </div>

      <label className="ws-field">
        Scent strength
        <input
          className="rng"
          type="range"
          min={20}
          max={100}
          value={strength}
          style={{ "--v": `${((strength - 20) / 80) * 100}%` } as CSSProperties}
          onChange={(e) => { const v = Number(e.target.value); live(() => setStrength(v)); }}
        />
        <span className="rng-ends" style={{ fontWeight: 400 }}><span>barely there</span><span>fills the room</span></span>
      </label>
      {strengthNote}
    </>
  );

  const scentSettings = (
    <>
      <div className="ws-group">
        <span className="ws-label">Feelings <span className="field__hint">Choose up to two</span></span>
        <div className="chips">
          {EMOTION_OPTIONS.map((o) => (
            <button key={o.id} type="button" className="chip" aria-pressed={feelings.includes(o.id)} style={{ padding: "0 12px" }} onClick={() => toggleFeeling(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tiffany's sensory sketch (11/24): five two-sided sliders; the word each leans to darkens, then the impression they make */}
      <div className="bis">
        {SENSE_ROWS.map((r) => {
          const v = senseValues[r.id];
          return (
            <label key={r.id} className="bi">
              <span className="bi__ends">
                <span className={v - 50 <= -8 ? "is-on" : undefined}>{r.from}</span>
                <span className={v - 50 >= 8 ? "is-on" : undefined}>{r.to}</span>
              </span>
              <span className="bi__track">
                <input
                  className="rng rng--bi"
                  type="range"
                  min={0}
                  max={100}
                  value={v}
                  aria-label={`${r.from} to ${r.to}`}
                  style={{ "--lo": `${Math.min(50, v)}%`, "--hi": `${Math.max(50, v)}%` } as CSSProperties}
                  onChange={(e) => setSense(r.id, Number(e.target.value))}
                />
              </span>
            </label>
          );
        })}
      </div>

      <div className="impression">
        <SensorySwatch families={families} values={senseValues} />
        <div className="impression__text">
          <span className="impression__h">Your sensory impression</span>
          {impression.length ? <span className="impression__words">{impression.join(" · ")}</span> : null}
        </div>
      </div>

      {windowSwitch}
      {strengthNote}
    </>
  );

  // 11/24 handoff (P1): Photo View shows only what a photo needs; the room settings stay in Room View
  const photoSettings = (
    <>
      <div className="ws-photo-actions">
        <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
          <Icon name="imagePlus" size={20} />{photo ? "Replace photo" : "Add a photo of your room"}
        </button>
        {photo ? <button type="button" className="tool" aria-label="Remove the photo" onClick={removePhoto}><Icon name="trash" /></button> : null}
      </div>
      <p className="ws-note">Your photo stays in this browser.</p>
      {photoNote ? <span className="field__error" role="status">{photoNote}</span> : null}
    </>
  );

  const noteEditor =
    noteFor && view !== "photo" ? (
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
    ) : null;

  return (
    <div className="rooms-page">
      <section id="editor" aria-label="Room editor" className="ws anchor">
        {!entryId ? (
          <div className="ws__intent" role="group" aria-label="Start a room">
            {intentSteps.map((s, i) => (
              <div key={s.id} style={{ display: "contents" }}>
                {i ? <Icon name="arrowRight" size={18} className="ws__intent-arrow" /> : null}
                <label className="ws-pick">
                  <span>{s.title}</span>
                  <span className="ws-pick__box">
                    <select className="ws-pick__select" value={s.value} onChange={(e) => s.pick(e.target.value)}>
                      <option value="" disabled hidden>—</option>
                      {s.opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                    </select>
                    <Icon name="chevronDown" size={18} className="ws-pick__chev" />
                  </span>
                </label>
              </div>
            ))}
          </div>
        ) : null}

        <aside className={`ws__tray${drawer ? " is-open" : ""}`} aria-label="Furniture, scent and materials">
          <div className="ws__tray-in">
            <button type="button" className="ws__handle" aria-expanded={drawer} aria-label={drawer ? "Close the drawer" : "Open the drawer"} onClick={() => setDrawer((v) => !v)}>
              <span aria-hidden="true" />
            </button>
            <div role="tablist" aria-label="Items" className="ws-tabs" onKeyDown={(e) => onTabKeys(e, TRAY.length, tray, (j) => { setTray(j); setDrawer(true); })}>
              {TRAY.map((t, j) => (
                <button key={t} type="button" role="tab" id={`ws-tray-${j}`} aria-controls="ws-tray-body" aria-selected={tray === j} tabIndex={tray === j ? 0 : -1} className="ws-tab" onClick={() => { setTray(j); setDrawer(true); }}>{t}</button>
              ))}
            </div>
            <div id="ws-tray-body" role="tabpanel" aria-labelledby={`ws-tray-${tray}`} className="ws__tray-body">
              {shelves.map((s) => (
                <div key={s.title || "all"} className="ws-shelf">
                  {s.title ? <h3 className="ws-shelf__h">{s.title}</h3> : null}
                  <div className={`ws-tiles${tray === 2 ? " ws-tiles--3" : ""}`}>
                    {s.list.map((it) => (
                      <button key={it.id} type="button" className="ws-tile" onClick={() => addItem(it.id)} aria-label={`Add ${it.label}`} title={it.label}>
                        <span className="ws-tile__art" aria-hidden="true">
                          <span className="ws-tile__img"><ItemArt kind={it.id} /></span>
                        </span>
                        <span className="ws-tile__name" aria-hidden="true">{it.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="ws__hint">Select an object to add it, then drag it into place.</p>
          </div>
        </aside>

        <div className="ws__canvas">
          <div className="ws__head">
            <div role="tablist" aria-label="View" className="seg seg--soft ws__views" onKeyDown={(e) => onTabKeys(e, VIEWS.length, viewIndex, (i) => switchView(VIEWS[i].id))}>
              {VIEWS.map((v) => (
                <button key={v.id} type="button" role="tab" aria-selected={view === v.id} tabIndex={view === v.id ? 0 : -1} className="seg__opt" onClick={() => switchView(v.id)}>{v.label}</button>
              ))}
            </div>
            <div className="ws__display">
              {view === "scent" ? (
                <button type="button" className="ws-tool" aria-label={paused ? "Play the scent motion" : "Pause the scent motion"} aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
                  <Icon name={paused ? "play" : "pause"} />
                </button>
              ) : null}
              {view !== "photo" ? (
                <button type="button" role="switch" aria-checked={notesOn} className="switch switch--sm" onClick={() => { if (view === "scent") setScentNotes((v) => !v); else setShowNotes((v) => !v); setNoteFor(null); }}>
                  Notes
                  <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
                </button>
              ) : null}
              {view === "room" ? (
                <button type="button" role="switch" aria-checked={snapFloor} className="switch switch--sm" onClick={() => setSnapFloor((v) => !v)}>
                  Snap to floor
                  <span className="switch__track" aria-hidden="true"><span className="switch__knob" /></span>
                </button>
              ) : null}
            </div>
          </div>

          <div className="ws__stage" onKeyDown={onKey} onDragOver={(e) => { if (view === "photo") e.preventDefault(); }} onDrop={onDropPhoto}>
            <div className="ws__frame">
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
                lifted={lifted}
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

              <div role="toolbar" aria-label="History" aria-orientation="vertical" className="ws-rail ws-rail--l">
                <button type="button" className="ws-tool" aria-label="Undo" title="Undo" onClick={undo} disabled={!past.length}><Icon name="undo" /></button>
                <button type="button" className="ws-tool" aria-label="Redo" title="Redo" onClick={redo} disabled={!future.length}><Icon name="redo" /></button>
              </div>

              {view !== "photo" ? (
                <div role="toolbar" aria-label="Selected item" aria-orientation="vertical" className="ws-rail ws-rail--r">
                  <button type="button" className="ws-tool" aria-label="Notes" title="Notes" aria-expanded={selIsScent ? noteFor === selected : undefined} disabled={!selIsScent} onClick={() => (noteFor ? saveNotes(noteDraft) : selected && openNotes(selected))}><Icon name="tag" /></button>
                  <span className="ws-rail__sep" aria-hidden="true" />
                  <button type="button" className="ws-tool" aria-label="Rotate" title="Rotate" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, rot: (it.rot + 15) % 360 }))}><Icon name="rotateCw" /></button>
                  <button type="button" className="ws-tool" aria-label="Flip" title="Flip" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, flip: it.flip === 1 ? -1 : 1 }))}><Icon name="flip" /></button>
                  <button type="button" className="ws-tool" aria-label="Increase size" title="Increase size" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.min(2, +(it.scale + 0.1).toFixed(2)) }))}><Icon name="plus" /></button>
                  <button type="button" className="ws-tool" aria-label="Decrease size" title="Decrease size" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, scale: Math.max(0.4, +(it.scale - 0.1).toFixed(2)) }))}><Icon name="minus" /></button>
                  <button type="button" className="ws-tool" aria-label="Bring to front" title="Bring to front" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: topZ() + 1 }))}><Icon name="front" /></button>
                  <button type="button" className="ws-tool" aria-label="Send to back" title="Send to back" disabled={!selItem} onClick={() => patchSel((it) => ({ ...it, z: lowZ() - 1 }))}><Icon name="back" /></button>
                  <span className="ws-rail__sep" aria-hidden="true" />
                  <button type="button" className="ws-tool" aria-label="Delete" title="Delete" disabled={!selItem} onClick={() => patchSel(() => null)}><Icon name="trash" /></button>
                </div>
              ) : null}

              {view !== "photo" ? (
                <p className="ws__caption" aria-live="polite">{selItem ? <b>{selLabel}</b> : "Select an item"}</p>
              ) : null}

              {noteEditor}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e: ChangeEvent<HTMLInputElement>) => { void takePhoto(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
        </div>

        <aside className="ws__panel" aria-label="Settings">
          <div className="ws__panel-in">
            {view === "room" ? roomSettings : view === "scent" ? scentSettings : photoSettings}
          </div>
        </aside>

        <div className="ws__bar">
          <div className="ws__status">
            <span className="ws__status-name">
              {sceneName(sceneId)}
              {nickname.trim() ? <span className="hand">{nickname.trim()}</span> : null}
            </span>
            {/* Claude's wording (11/24), hers to change: where the room stands */}
            <span className="ws__status-line" role="status">{!entryId ? "Not saved yet" : dirty ? "Unsaved changes" : "Saved to your Scent Atlas"}</span>
          </div>
          <a href="#products" className="ws__jump">Fragrance Matches<Icon name="arrowDown" size={16} /></a>
          <div className="ws__actions">
            <button type="button" className="btn btn--apricot" onClick={() => save(true)}>Make a card</button>
            <button type="button" className="btn btn--primary" onClick={() => save(false)}>{entryId ? "Save changes" : "Save room"}</button>
          </div>
        </div>
      </section>

      {/* 11/24 handoff (§3.9): the matches belong to the room being made, so they come before the saved rooms */}
      <section id="products" className="card anchor">
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

      <section id="your-rooms" aria-label="Your rooms" className="anchor" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ fontSize: 28 }}>Your rooms</h2>
          <Link href="/rooms" className="btn btn--ghost btn--sm" style={{ height: 40, gap: 6 }} onClick={leaveTo("/rooms")}><Icon name="plus" size={18} />New room</Link>
        </div>
        {recent.length ? (
          <div className="strip">
            {recent.map((r, i) => (
              <Link key={r.id} href={`/rooms?id=${r.id}`} onClick={r.id === entryId ? undefined : leaveTo(`/rooms?id=${r.id}`)} className="card" style={{ flex: "none", width: i === 0 ? 400 : 210, maxWidth: "80vw", display: "flex", gap: 16, alignItems: "center", padding: 14, textDecoration: "none", color: "var(--ink)", outline: r.id === entryId ? "2px solid var(--deep)" : undefined }}>
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

      <ThirdRoom
        open={limit !== null}
        rooms={savedRooms}
        onClose={() => setLimit(null)}
        onReplace={(id) => { const goCard = limit?.goCard ?? false; setLimit(null); remove(id); store(goCard); }}
      />

      <Dialog open={ask !== null} onClose={() => setAsk(null)} label={ask?.title ?? "Unsaved changes"}>
        {ask ? (
          <div className="dlg__body">
            <h2 className="dlg__title">{ask.title}</h2>
            <p className="dlg__text">{ask.text}</p>
            <div className="dlg__actions">
              <button type="button" className="btn btn--primary" data-autofocus onClick={() => setAsk(null)}>Keep editing</button>
              <button type="button" className="dlg__link" onClick={() => { const run = ask.run; setAsk(null); run(); }}>{ask.go}</button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
