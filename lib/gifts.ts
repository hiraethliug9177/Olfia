import { productById, type Product } from "@/lib/products";
import type { FamilyId } from "@/lib/types";

/**
 * Gifts (11/17). Tiffany chose a guide by the seven scent families, so no other quiz characters appear (her
 * 11/10 rule: people see only their own). Someone who has taken the quiz opens on their own family.
 * Three gifts per family, from lower to higher price. Claude's choice, for Tiffany to change:
 * - one per price tier where the family has one (Warm & Spicy, Green & Herbal and Citrus & Fruit have no
 *   product of their own in one tier since the 11/17 price check, so they show the next price up instead);
 * - a product whose main family is this one first, with a link to buy and in stock (Snif's gingerbread
 *   candle was sold out on 11/17), a winter or year-round scent first;
 * - no product appears twice.
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
