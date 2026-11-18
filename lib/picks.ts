import { PRODUCTS, type Product } from "@/lib/products";
import type { FamilyId } from "@/lib/types";

/*
 * 11/17 the Picks page lived here (filters by family, room and price). Tiffany folded it into Gifts and on 11/18
 * replaced both with the new Gifts (lib/gifts.ts); what stays is the product choice at the end of a story.
 */

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
