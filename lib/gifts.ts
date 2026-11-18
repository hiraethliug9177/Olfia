import { baseLayout, seasonOf, stickersFor } from "@/lib/catalog";
import { PRODUCTS, productById, type Product } from "@/lib/products";
import type { Entry, FamilyId, PlacedItem, RoomsEntry, Season, TimeOfDay } from "@/lib/types";

/**
 * Gifts (11/17). Tiffany chose a guide by the seven scent families, so no other quiz characters appear (her
 * 11/10 rule: people see only their own). Three gifts per family, from lower to higher price. Claude's choice,
 * for Tiffany to change:
 * - one per price tier where the family has one (Warm & Spicy, Green & Herbal and Citrus & Fruit have no
 *   product of their own in one tier since the 11/17 price check, so they show the next price up instead);
 * - a product whose main family is this one first, with a link to buy and in stock (Snif's gingerbread
 *   candle was sold out on 11/17), a winter or year-round scent first;
 * - no product appears twice.
 *
 * 11/18 (Tiffany): Gifts is for the visitor too ("For me"), and every pick is drawn into a room from Rooms, in the
 * light it suits, so the three picks of a family land in three different rooms.
 */
export const GIFTS: Record<FamilyId, [string, string, string]> = {
  floral: ["otherland-rattan", "yankee-midsummer", "jomalone-pear-freesia"],
  gourmand: ["otherland-cinnamon-musk", "yankee-vanilla-cupcake", "replica-lazy-sunday"],
  spicy: ["yankee-sparkling-cinnamon", "nest-holiday", "replica-fireplace"],
  woody: ["pf-teakwood", "boysmells-hinoki", "lelabo-santal26"],
  green: ["saje-tranquility", "aesop-olous", "diptyque-baies"],
  citrus: ["muji-yuzu", "diptyque-figuier", "jomalone-lime-basil"],
  fresh: ["bbw-eucalyptus-spearmint", "yankee-clean-cotton", "westin-white-tea"],
};

export const giftsFor = (family: FamilyId): Product[] =>
  GIFTS[family].map(productById).filter((p): p is Product => Boolean(p));

/** The family a page opens on when nobody has chosen one: the season's. */
const SEASON_FAMILY: Record<Season, FamilyId> = { winter: "spicy", spring: "floral", summer: "citrus", autumn: "woody" };
export const seasonFamily = (d: Date = new Date()): FamilyId => SEASON_FAMILY[seasonOf(d)];

/* ---------- where a pick lives ---------- */

/** Rooms a kind of product suits, best first. */
const ROOM_PREF: Record<string, string[]> = {
  candle: ["reading-corner", "bathroom", "kitchen"],
  diffuser: ["bathroom", "reading-corner", "kitchen"],
  oil: ["kitchen", "bathroom", "reading-corner"],
  spray: ["bathroom", "kitchen", "reading-corner"],
  incense: ["reading-corner", "bathroom", "kitchen"],
};

/** The light a product suits: evenings at night, mornings in the morning, any time in the afternoon. */
export function giftTime(p: Product): TimeOfDay {
  if (p.dayparts.length >= 4) return "afternoon";
  if (p.dayparts.includes("evening") || p.dayparts.includes("night")) return "night";
  if (p.dayparts.includes("morning")) return "morning";
  return "afternoon";
}

export interface GiftScene {
  p: Product;
  sceneId: string;
  time: TimeOfDay;
  items: PlacedItem[];
}

/** The room drawn for one product: the scene's default layout with the product in it, and its families pinned up. */
export function sceneItems(p: Product, sceneId: string): PlacedItem[] {
  const source = ROOM_PREF[p.type] ? p.type : "candle";
  const base = baseLayout(source, sceneId).map((it) => (it.kind === "simmer-pot" ? { ...it, kind: source } : it));
  return [...base, ...stickersFor(p.families)];
}

/** Gives each product a room (no room twice, each product's best free room) and its light. */
export function giftScenes(products: Product[]): GiftScene[] {
  const used = new Set<string>();
  return products.map((p) => {
    const pref = ROOM_PREF[p.type] ?? ROOM_PREF.candle;
    const sceneId = pref.find((r) => !used.has(r)) ?? pref[0];
    used.add(sceneId);
    return { p, sceneId, time: giftTime(p), items: sceneItems(p, sceneId) };
  });
}

/* ---------- For me ---------- */

const TIER_ORDER = ["$", "$$", "$$$"] as const;

/**
 * Three picks for the visitor: products in their first family, one per price where there is one, preferring
 * ones that also carry their second family, then the families their Scent Atlas holds most.
 */
export function picksForMe(families: FamilyId[], entries: Entry[] = []): Product[] {
  const [first, second] = families;
  if (!first) return [];
  const weight: Partial<Record<FamilyId, number>> = {};
  entries.forEach((e) => e.families.forEach((f) => (weight[f] = (weight[f] ?? 0) + 1)));
  const score = (p: Product) =>
    (p.families[0] === first ? 4 : 0) + (second && p.families.includes(second) ? 3 : 0) + (p.url ? 1 : 0) +
    p.families.reduce((n, f) => n + (weight[f] ?? 0) / Math.max(1, entries.length), 0);
  const pool = PRODUCTS.filter((p) => p.families.includes(first) && p.url).sort((a, b) => score(b) - score(a));
  const picks: Product[] = [];
  TIER_ORDER.forEach((tier) => {
    const best = pool.find((p) => p.tier === tier && !picks.includes(p));
    if (best) picks.push(best);
  });
  pool.forEach((p) => {
    if (picks.length < 3 && !picks.includes(p)) picks.push(p);
  });
  return picks.slice(0, 3).sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

/** The two families someone's Scent Atlas holds most. */
export function topFamilies(entries: Entry[]): FamilyId[] {
  const count = new Map<FamilyId, number>();
  entries.forEach((e) => e.families.forEach((f) => count.set(f, (count.get(f) ?? 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([f]) => f);
}

/* ---------- saving a pick to the Scent Atlas ---------- */

const makeId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** A Rooms page holding the pick's room, so a gift idea or a Scent Card starts from it. */
export function giftEntry(scene: GiftScene, nickname: string): RoomsEntry {
  const now = new Date().toISOString();
  return {
    id: makeId(), schemaVersion: 2, type: "rooms", createdAt: now, updatedAt: now, starred: false,
    families: scene.p.families, sceneId: scene.sceneId, nickname, items: scene.items, strength: 75,
    time: scene.time, windowOpen: false,
  };
}
