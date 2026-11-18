import { PRODUCTS, type PriceTier, type Product } from "@/lib/products";
import { ROOM_PRESETS } from "@/lib/presets";
import type { FamilyId } from "@/lib/types";

/**
 * Picks (11/17, Tiffany: "做 Picks 选品页"): every recommended product on one page, filtered by scent family,
 * room and price. Rooms are the six room presets from Home, each with its scent families; a product fits a
 * room when it shares a family with it. Prices are the tiers of the 11/8 product list.
 */

export interface PickRoom { id: string; label: string; families: FamilyId[] }

/** "Kitchen, Sunday morning" → id "kitchen", label "Kitchen". */
export const PICK_ROOMS: PickRoom[] = ROOM_PRESETS.map((p) => ({
  id: p.id.split("-")[0],
  label: p.name.split(",")[0],
  families: p.families,
}));

export const TIERS: PriceTier[] = ["$", "$$", "$$$"];

/** Price tiers travel in the address as 1, 2, 3 (a "$" in a link is easy to break). */
export const tierFromParam = (v: string | null): PriceTier | null => (v === "1" || v === "2" || v === "3" ? TIERS[Number(v) - 1] : null);
export const tierParam = (t: PriceTier): string => String(TIERS.indexOf(t) + 1);

/** How well a product fits a set of families: 3 for the first family, 2 for each other one it shares. */
function fit(p: Product, families: FamilyId[]): number {
  return families.reduce((s, f, i) => (p.families.includes(f) ? s + (i === 0 ? 3 : 2) : s), 0);
}

/** The products for a choice of family, room and price, best matches first. */
export function pickList(choice: { family: FamilyId | null; room: PickRoom | null; tier: PriceTier | null }): Product[] {
  const { family, room, tier } = choice;
  return PRODUCTS
    .map((p, i) => ({ p, i, s: room ? fit(p, room.families) : 0 }))
    .filter(({ p, s }) => (!family || p.families.includes(family)) && (!room || s >= 2) && (!tier || p.tier === tier))
    .sort((a, b) =>
      (family ? Number(b.p.families[0] === family) - Number(a.p.families[0] === family) : 0)
      || b.s - a.s
      || a.i - b.i)
    .map(({ p }) => p);
}

/**
 * Products for the end of a story (11/17): only ones with a link to buy; a product whose main family is one
 * of the story's families counts most, and each of the story's families gets its best match first.
 */
export function storyPicks(families: FamilyId[], n = 3): Product[] {
  const score = (p: Product) =>
    families.reduce((s, f, i) => (p.families.includes(f) ? s + (p.families[0] === f ? 3 : 1.5) + (i === 0 ? 0.5 : 0) : s), 0);
  const ranked = PRODUCTS
    .map((p, i) => ({ p, i, s: score(p) }))
    .filter((x) => x.p.url && x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i);
  const picks: Product[] = [];
  for (const f of families) {
    const hit = ranked.find((x) => x.p.families[0] === f && !picks.includes(x.p));
    if (hit && picks.length < n) picks.push(hit.p);
  }
  for (const x of ranked) {
    if (picks.length >= n) break;
    if (!picks.includes(x.p)) picks.push(x.p);
  }
  return picks.sort((a, b) => score(b) - score(a));
}
