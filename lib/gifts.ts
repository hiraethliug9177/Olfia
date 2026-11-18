import { productById, type Product } from "@/lib/products";
import type { FamilyId } from "@/lib/types";

/**
 * Gifts (11/17). Tiffany chose a guide by the seven scent families with three price tiers, so no other quiz
 * characters appear (her 11/10 rule: people see only their own). Someone who has taken the quiz opens on
 * their own family.
 * One gift per tier, in the order $, $$, $$$. Claude's first choice, for Tiffany to change: a product whose
 * main family is this one when there is one in that tier, with a link to buy, and a winter or year-round
 * scent first; no product appears twice.
 */
export const GIFTS: Record<FamilyId, [string, string, string]> = {
  floral: ["yankee-midsummer", "diptyque-roses", "jomalone-pear-freesia"],
  gourmand: ["otherland-cinnamon-musk", "snif-gingerbread", "replica-lazy-sunday"],
  spicy: ["yankee-sparkling-cinnamon", "nest-holiday", "replica-fireplace"],
  woody: ["pf-teakwood", "diptyque-feu-de-bois", "lelabo-santal26"],
  green: ["saje-tranquility", "diptyque-baies", "aesop-olous"],
  citrus: ["muji-yuzu", "diptyque-figuier", "jomalone-lime-basil"],
  fresh: ["bbw-eucalyptus-spearmint", "vitruvi-eucalyptus", "westin-white-tea"],
};

export const giftsFor = (family: FamilyId): Product[] =>
  GIFTS[family].map(productById).filter((p): p is Product => Boolean(p));
