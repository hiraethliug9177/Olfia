import type { Daypart, FamilyId, Season, SourceKind } from "@/lib/types";

/**
 * Recommended products (B tier, 2026-11-09). Candidate list approved by Tiffany 11/8
 * (claude/olfia-feedback-plan.md). Notes come from retailer and editor pages and are to be
 * verified on each brand's site before the public launch; prices are tiers, not figures.
 * No product photos: cards use the family colour and link out. Links are plain (no affiliate yet).
 */

export type PriceTier = "$" | "$$" | "$$$";

export interface Product {
  id: string;
  brand: string;
  name: string;
  type: SourceKind;
  families: FamilyId[];
  tier: PriceTier;
  notes: string;
  seasons: Season[];
  dayparts: Daypart[];
  url?: string;
}

const all: Season[] = ["spring", "summer", "autumn", "winter"];
const cold: Season[] = ["autumn", "winter"];
const warm: Season[] = ["spring", "summer"];
const day: Daypart[] = ["morning", "afternoon"];
const eve: Daypart[] = ["evening", "night"];
const any: Daypart[] = ["morning", "afternoon", "evening", "night"];

export const PRODUCTS: Product[] = [
  // Woody & Earthy
  { id: "lelabo-santal26", brand: "Le Labo", name: "Santal 26", type: "candle", families: ["woody", "spicy"], tier: "$$$", notes: "sandalwood · cedar · leather", seasons: cold, dayparts: eve, url: "https://www.lelabofragrances.com" },
  { id: "diptyque-feu-de-bois", brand: "Diptyque", name: "Feu de Bois", type: "candle", families: ["woody"], tier: "$$", notes: "birch · juniper · smoke", seasons: cold, dayparts: eve, url: "https://www.diptyqueparis.com" },
  { id: "pf-teakwood", brand: "P.F. Candle Co.", name: "Teakwood & Tobacco", type: "candle", families: ["woody", "spicy"], tier: "$", notes: "teak · leather · tobacco", seasons: cold, dayparts: eve, url: "https://pfcandleco.com" },
  { id: "aesop-ptolemy", brand: "Aesop", name: "Ptolemy", type: "candle", families: ["woody", "green"], tier: "$$$", notes: "cedar · cypress · vetiver", seasons: all, dayparts: eve, url: "https://www.aesop.com" },
  { id: "boysmells-hinoki", brand: "Boy Smells", name: "Hinoki Fantôme", type: "candle", families: ["woody", "floral"], tier: "$$", notes: "hinoki · smoke · florals", seasons: all, dayparts: eve, url: "https://boysmells.com" },
  // Citrus & Fruit
  { id: "jomalone-lime-basil", brand: "Jo Malone London", name: "Lime Basil & Mandarin", type: "diffuser", families: ["citrus", "green"], tier: "$$$", notes: "lime · basil · mandarin", seasons: warm, dayparts: day, url: "https://www.jomalone.com" },
  { id: "saje-liquid-sunshine", brand: "Saje", name: "Liquid Sunshine", type: "oil", families: ["citrus"], tier: "$", notes: "grapefruit · lime · lemon", seasons: warm, dayparts: day, url: "https://www.saje.com" },
  { id: "muji-yuzu", brand: "MUJI", name: "Yuzu essential oil", type: "oil", families: ["citrus"], tier: "$", notes: "yuzu · orange", seasons: all, dayparts: day, url: "https://www.muji.us" },
  { id: "diptyque-figuier", brand: "Diptyque", name: "Figuier", type: "candle", families: ["citrus", "green"], tier: "$$", notes: "fig · fig leaf · wood", seasons: warm, dayparts: day, url: "https://www.diptyqueparis.com" },
  { id: "tj-grapefruit", brand: "Trader Joe's", name: "Grapefruit candle", type: "candle", families: ["citrus"], tier: "$", notes: "grapefruit (seasonal)", seasons: ["spring", "summer"], dayparts: day },
  // Floral
  { id: "diptyque-roses", brand: "Diptyque", name: "Roses", type: "candle", families: ["floral"], tier: "$$", notes: "fresh rose", seasons: warm, dayparts: any, url: "https://www.diptyqueparis.com" },
  { id: "jomalone-pear-freesia", brand: "Jo Malone London", name: "English Pear & Freesia", type: "spray", families: ["floral", "citrus"], tier: "$$$", notes: "pear · freesia", seasons: warm, dayparts: day, url: "https://www.jomalone.com" },
  { id: "yankee-midsummer", brand: "Yankee Candle", name: "Midsummer's Night", type: "candle", families: ["floral", "woody"], tier: "$", notes: "lavender · musk", seasons: all, dayparts: eve, url: "https://www.yankeecandle.com" },
  { id: "otherland-rattan", brand: "Otherland", name: "Rattan", type: "candle", families: ["floral", "citrus"], tier: "$", notes: "rattan · bergamot · white florals", seasons: warm, dayparts: day, url: "https://www.otherland.com" },
  { id: "westin-white-tea", brand: "Westin", name: "White Tea", type: "diffuser", families: ["floral", "fresh"], tier: "$$$", notes: "white tea · freesia", seasons: all, dayparts: any, url: "https://www.westinstore.com" },
  // Green & Herbal
  { id: "aesop-olous", brand: "Aesop", name: "Olous room spray", type: "spray", families: ["green", "spicy"], tier: "$$$", notes: "basil · cardamom · green", seasons: all, dayparts: day, url: "https://www.aesop.com" },
  { id: "saje-tranquility", brand: "Saje", name: "Tranquility", type: "oil", families: ["green"], tier: "$", notes: "lavender · chamomile", seasons: all, dayparts: eve, url: "https://www.saje.com" },
  { id: "muji-lavender", brand: "MUJI", name: "Lavender essential oil", type: "oil", families: ["green"], tier: "$", notes: "lavender", seasons: all, dayparts: eve, url: "https://www.muji.us" },
  { id: "diptyque-baies", brand: "Diptyque", name: "Baies", type: "candle", families: ["green", "floral"], tier: "$$", notes: "blackcurrant leaf · rose", seasons: all, dayparts: any, url: "https://www.diptyqueparis.com" },
  { id: "tj-cedar-balsam", brand: "Trader Joe's", name: "Cedar Balsam candle", type: "candle", families: ["green", "woody"], tier: "$", notes: "balsam · cedar (seasonal)", seasons: ["winter"], dayparts: eve },
  // Gourmand
  { id: "yankee-vanilla-cupcake", brand: "Yankee Candle", name: "Vanilla Cupcake", type: "candle", families: ["gourmand"], tier: "$", notes: "vanilla · butter", seasons: all, dayparts: eve, url: "https://www.yankeecandle.com" },
  { id: "otherland-cinnamon-musk", brand: "Otherland", name: "Cinnamon Musk", type: "candle", families: ["gourmand", "spicy"], tier: "$", notes: "cinnamon · almond · amber", seasons: cold, dayparts: eve, url: "https://www.otherland.com" },
  { id: "snif-gingerbread", brand: "Snif", name: "Half Baked Gingerbread Smash", type: "candle", families: ["gourmand", "spicy"], tier: "$$", notes: "gingerbread · chai", seasons: ["winter"], dayparts: eve, url: "https://snif.co" },
  { id: "replica-lazy-sunday", brand: "Maison Margiela Replica", name: "Lazy Sunday Morning", type: "candle", families: ["gourmand", "fresh"], tier: "$$$", notes: "linen · lily · musk", seasons: all, dayparts: day, url: "https://www.maisonmargiela-fragrances.us" },
  // Warm & Spicy
  { id: "nest-holiday", brand: "NEST New York", name: "Holiday", type: "candle", families: ["spicy", "citrus"], tier: "$$", notes: "pomegranate · pine · clove · cinnamon", seasons: ["winter"], dayparts: eve, url: "https://www.nestnewyork.com" },
  { id: "yankee-sparkling-cinnamon", brand: "Yankee Candle", name: "Sparkling Cinnamon", type: "candle", families: ["spicy"], tier: "$", notes: "cinnamon · clove", seasons: cold, dayparts: eve, url: "https://www.yankeecandle.com" },
  { id: "lelabo-palo-santo", brand: "Le Labo", name: "Palo Santo 14", type: "candle", families: ["spicy", "woody"], tier: "$$$", notes: "palo santo · cardamom", seasons: cold, dayparts: eve, url: "https://www.lelabofragrances.com" },
  { id: "voluspa-baltic-amber", brand: "Voluspa", name: "Baltic Amber", type: "candle", families: ["spicy", "gourmand"], tier: "$$", notes: "amber · vanilla · sandalwood", seasons: cold, dayparts: eve, url: "https://www.voluspa.com" },
  { id: "replica-fireplace", brand: "Maison Margiela Replica", name: "By the Fireplace", type: "candle", families: ["spicy", "woody"], tier: "$$$", notes: "chestnut · smoke · vanilla", seasons: ["winter"], dayparts: eve, url: "https://www.maisonmargiela-fragrances.us" },
  // Fresh & Clean
  { id: "yankee-clean-cotton", brand: "Yankee Candle", name: "Clean Cotton", type: "candle", families: ["fresh"], tier: "$", notes: "cotton · white florals", seasons: all, dayparts: day, url: "https://www.yankeecandle.com" },
  { id: "bbw-eucalyptus-spearmint", brand: "Bath & Body Works", name: "Eucalyptus Spearmint", type: "candle", families: ["fresh", "green"], tier: "$", notes: "eucalyptus · mint", seasons: all, dayparts: day, url: "https://www.bathandbodyworks.com" },
  { id: "vitruvi-eucalyptus", brand: "Vitruvi", name: "Stone diffuser + eucalyptus", type: "diffuser", families: ["fresh", "green"], tier: "$$", notes: "eucalyptus · tea tree", seasons: all, dayparts: day, url: "https://vitruvi.com" },
  { id: "mrsmeyers-basil", brand: "Mrs. Meyer's", name: "Basil candle", type: "candle", families: ["fresh", "green"], tier: "$", notes: "basil · clean", seasons: all, dayparts: day, url: "https://www.mrsmeyers.com" },
];

export interface ProductFilter {
  families?: FamilyId[];
  season?: Season;
  daypart?: Daypart;
  /** products that share a family with this one, excluding itself */
  similarTo?: string;
}

/** Scores products against the filter; higher is a better match. */
export function matchProducts(filter: ProductFilter, limit = 6): Product[] {
  const ref = filter.similarTo ? PRODUCTS.find((p) => p.id === filter.similarTo) : undefined;
  const fams = ref ? ref.families : (filter.families ?? []);
  return PRODUCTS
    .filter((p) => !ref || p.id !== ref.id)
    .map((p) => {
      let s = 0;
      fams.forEach((f, i) => { if (p.families.includes(f)) s += i === 0 ? 3 : 2; });
      if (filter.season && p.seasons.includes(filter.season)) s += 1;
      if (filter.daypart && p.dayparts.includes(filter.daypart)) s += 1;
      return { p, s };
    })
    .filter((x) => (fams.length ? x.s >= 2 : true))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

export const productById = (id: string): Product | undefined => PRODUCTS.find((p) => p.id === id);
