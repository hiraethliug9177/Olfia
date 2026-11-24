import { FAMILIES, familyById, itemById, type ItemDef, type ScentType } from "@/lib/catalog";
import { PRODUCTS, type Product } from "@/lib/products";
import type { EmotionId, FamilyId, PlacedItem, SourceKind } from "@/lib/types";

/**
 * Rooms v2 (Tiffany's Notion "Capstone Draft", 11/23): the fragrance layer of a room.
 * - Notes tags: every fragrance product carries a tag of notes, typed by the user or filled from a product name.
 *   Until she types one, the tag suggests three notes from one of the room's families (shown with a dashed edge).
 * - Scent View: each product's notes decide the colour of its scent flow.
 * - Fragrance Matches: the notes in the room rank and explain the products.
 */

/** Mid tones from the v2 motion spec (11/23): family colour → 50/50 mid tone → wash. */
export const SCENT_MID: Record<FamilyId, string> = {
  floral: "#DEB6B6",
  gourmand: "#E6C6A0",
  spicy: "#D3987F",
  woody: "#BC9E85",
  green: "#B0B98E",
  citrus: "#EDC580",
  fresh: "#B6D0D2",
};

export const isScentItem = (kind: string): boolean => itemById(kind)?.category === "source";

/** "cedar · sandalwood, vetiver" → ["cedar", "sandalwood", "vetiver"] */
export function splitNotes(text: string): string[] {
  return text
    .split(/\s*(?:·|,|;|\/|\n|\band\b|&)\s*/i)
    .map((s) => s.replace(/\(.*?\)/g, "").trim().toLowerCase())
    .filter((s) => s.length > 1);
}

/** Note → family, from the seven families' notes and then the recommended products' notes. */
const NOTE_FAMILY: Array<[string, FamilyId]> = (() => {
  const m = new Map<string, FamilyId>();
  for (const f of FAMILIES) for (const n of splitNotes(f.notes)) m.set(n, f.id);
  for (const p of PRODUCTS) for (const n of splitNotes(p.notes)) if (!m.has(n)) m.set(n, p.families[0]);
  return [...m.entries()].sort((a, b) => b[0].length - a[0].length);
})();

function familyOfNote(note: string): FamilyId | undefined {
  for (const [k, f] of NOTE_FAMILY) if (note === k) return f;
  for (const [k, f] of NOTE_FAMILY) if (k.length > 2 && (note.includes(k) || (note.length > 3 && k.includes(note)))) return f;
  return undefined;
}

/** The family a line of notes leans to, if any of its notes is known. */
export function familyOfNotes(text: string): FamilyId | undefined {
  const count = new Map<FamilyId, number>();
  splitNotes(text).forEach((n, i) => {
    const f = familyOfNote(n);
    // the first note weighs a little more, so "rose · cedar" reads as floral
    if (f) count.set(f, (count.get(f) ?? 0) + (i === 0 ? 1.5 : 1));
  });
  let best: FamilyId | undefined;
  let top = 0;
  for (const [f, c] of count) if (c > top) { best = f; top = c; }
  return best;
}

/** Products whose brand or name contains every word typed ("le labo", "santal"). */
export function findProducts(query: string, limit = 4): Product[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return PRODUCTS.filter((p) => {
    const hay = `${p.brand} ${p.name}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  }).slice(0, limit);
}

/** A product's notes as they read on a tag. */
export const productNotes = (p: Product): string => splitNotes(p.notes).join(" · ");

export interface ItemNote {
  uid: string;
  text: string;
  family: FamilyId;
  /** true while the tag shows Olfia's suggestion rather than what the user typed */
  suggested: boolean;
}

/** The notes tag of every fragrance product in the room, in the order they were added. */
export function roomNotes(items: PlacedItem[], families: FamilyId[]): ItemNote[] {
  const scent = items.filter((i) => isScentItem(i.kind));
  return scent.map((it, i) => {
    const fallback: FamilyId = families.length ? families[i % families.length] : "fresh";
    const typed = it.notes?.trim();
    if (typed) return { uid: it.uid, text: typed, family: familyOfNotes(typed) ?? fallback, suggested: false };
    if (!families.length) return { uid: it.uid, text: "", family: fallback, suggested: true };
    // the second product of the same family starts two notes further along, so two tags rarely read the same
    const all = splitNotes(familyById(fallback).notes);
    const start = (Math.floor(i / families.length) * 2) % all.length;
    const pick = [0, 1, 2].map((k) => all[(start + k) % all.length]);
    return { uid: it.uid, text: pick.join(" · "), family: fallback, suggested: true };
  });
}

/** Every note in the room, once each. */
export function noteWords(notes: ItemNote[]): string[] {
  return [...new Set(notes.flatMap((n) => splitNotes(n.text)))];
}

/** True when a product note and a room note name the same thing ("fresh rose" and "rose"). */
export function sameNote(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return x === y || (y.length > 2 && x.includes(y)) || (x.length > 2 && y.includes(x));
}

/* ---------- geometry: where things sit on the stage ---------- */

/** Stage aspect (width / height) of the area items live in; the same number as ScenePage's STAGE_ASPECT. */
const STAGE = 0.83;

const EMIT: Record<ScentType, [number, number]> = {
  candle: [0.5, 0.08],
  reed: [0.5, 0.08],
  aroma: [0.5, 0.04],
  incense: [0.5, 0.01],
  spray: [0.5, 0.05],
  wax: [0.5, 0.12],
  stones: [0.5, 0.4],
  flora: [0.5, 0.36],
};

/** The item's box on the stage, as fractions: left, top, width, height. */
export function boxOf(it: PlacedItem, def: ItemDef): { left: number; top: number; w: number; h: number } {
  const w = def.w * it.scale;
  const h = w * def.aspect * STAGE;
  return { left: it.x - w / 2, top: it.y - h, w, h };
}

/** Where the scent leaves a fragrance product, as fractions of the stage (flipped products mirror the point). */
export function emitPoint(it: PlacedItem, def: ItemDef): { x: number; y: number } {
  const b = boxOf(it, def);
  const [fx, fy] = def.emit ?? EMIT[def.scentType ?? "candle"];
  const gx = it.flip === -1 ? 1 - fx : fx;
  return { x: b.left + gx * b.w, y: b.top + fy * b.h };
}

/* ---------- Scent View ---------- */

/** The sensory sliders of Scent View (v2 spec, 11/23), each 0–100 with 50 in the middle. */
export interface SensoryValues {
  /** Light ↔ Rich: how dense the core of each field is */
  rich: number;
  /** Cool ↔ Warm: a touch of Periwinkle or Apricot */
  warm: number;
  /** Dry ↔ Creamy: crisp grains or soft, blurred edges */
  creamy: number;
  /** Airy ↔ Enveloping: high and thin, or wide and low */
  envelop: number;
}

export const SENSORY_DEFAULT: SensoryValues = { rich: 50, warm: 50, creamy: 50, envelop: 50 };

export const SENSORY_SLIDERS: Array<{ id: keyof SensoryValues; from: string; to: string }> = [
  { id: "rich", from: "Light", to: "Rich" },
  { id: "warm", from: "Cool", to: "Warm" },
  { id: "creamy", from: "Dry", to: "Creamy" },
  { id: "envelop", from: "Airy", to: "Enveloping" },
];

/** How a feeling changes the motion: speed, sway, spread, warmth, colour strength and how high it rises. */
export interface FeelingShape {
  speed: number;
  wobble: number;
  spread: number;
  warm: number;
  alpha: number;
  sat: number;
  rise: number;
}

const FEELINGS: Record<EmotionId, Partial<FeelingShape>> = {
  calm: { speed: 0.7, wobble: 0.6 },
  cozy: { speed: 0.8, warm: 0.35, spread: 1.1 },
  focused: { spread: 0.82, wobble: 0.5, rise: 1.15 },
  nostalgic: { sat: 0.65, speed: 0.85, warm: 0.15 },
  energized: { speed: 1.4, wobble: 1.35, rise: 1.2 },
  romantic: { warm: 0.45, alpha: 1.1, wobble: 1.1 },
  melancholy: { speed: 0.75, sat: 0.6, warm: -0.25, rise: 0.85 },
  playful: { speed: 1.25, wobble: 1.6 },
  grounded: { speed: 0.8, rise: 0.7, spread: 1.15 },
  "fresh-start": { warm: -0.35, alpha: 0.92, rise: 1.15, speed: 1.1 },
  restless: { speed: 1.35, wobble: 1.8 },
  safe: { speed: 0.75, spread: 1.2, alpha: 1.05 },
};

/** Feelings combined (up to two): multipliers multiply, warmth adds. */
export function feelingShape(ids: EmotionId[]): FeelingShape {
  const out: FeelingShape = { speed: 1, wobble: 1, spread: 1, warm: 0, alpha: 1, sat: 1, rise: 1 };
  for (const id of ids) {
    const f = FEELINGS[id];
    if (!f) continue;
    out.speed *= f.speed ?? 1;
    out.wobble *= f.wobble ?? 1;
    out.spread *= f.spread ?? 1;
    out.alpha *= f.alpha ?? 1;
    out.sat *= f.sat ?? 1;
    out.rise *= f.rise ?? 1;
    out.warm += f.warm ?? 0;
  }
  return out;
}

/* ---------- Fragrance Matches ---------- */

/** A same-type cut-out for a recommendation card (her answer 10, 11/23: a cut-out plus the brand name, never a product photo). */
const TYPE_ART: Partial<Record<SourceKind, string[]>> = {
  candle: ["candle-apothecary", "candle-rose", "candle-amber-bowl", "candle-gold-leaf", "candle-pumpkin"],
  diffuser: ["reed-hex", "reed-cloche", "reed-fiber", "reed-paper-flower", "reed-amber"],
  spray: ["spray-flask", "spray-tall", "spray-wood-cap", "spray-mint"],
  incense: ["incense-dish", "incense-ceramic", "incense-flower", "incense-concrete"],
  // essential oils and diffuser blends go in an aroma diffuser
  oil: ["aroma-wood-lid"],
};

export function artFor(type: SourceKind, seed: string): ItemDef | undefined {
  const list = TYPE_ART[type];
  if (!list?.length) return undefined;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return itemById(list[h % list.length]);
}
