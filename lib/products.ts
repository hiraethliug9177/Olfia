import type { Daypart, FamilyId, Season, SourceKind } from "@/lib/types";

/**
 * Recommended products (B tier, 2026-11-09). Candidate list approved by Tiffany 11/8
 * (claude/olfia-feedback-plan.md). Notes come from retailer and editor pages; prices are tiers, not figures:
 * $ under 30 · $$ 30–60 · $$$ over 60, by the regular (not sale) price of the linked size.
 * Tiers checked on each brand's US site on 11/17 (Tiffany: "可以查价格"); where the brand page shows no price
 * (Le Labo, Maison Margiela), retailer listings for the same size were used. The 11/17 figures are noted per line.
 * No product photos: cards use the family colour and link out. Links are plain (no affiliate yet) and, since
 * 11/17, go to each product's own page on the brand's US site (Trader Joe's sells in store only: no link).
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
  /** Regular price of the linked size on the brand's US site, checked 11/17 ("about": retailer listings). */
  price?: string;
  size?: string;
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
  { id: "lelabo-santal26", brand: "Le Labo", name: "Santal 26", type: "candle", families: ["woody", "spicy"], tier: "$$$", notes: "sandalwood · cedar · leather", seasons: cold, dayparts: eve, price: "about $92", size: "245 g", url: "https://www.lelabofragrances.com/santal-26-33.html" }, // about $92, 245 g (retailers; brand page shows none) (11/17)
  { id: "diptyque-feu-de-bois", brand: "Diptyque", name: "Feu de Bois", type: "candle", families: ["woody"], tier: "$$$", notes: "birch · juniper · smoke", seasons: cold, dayparts: eve, price: "$90", size: "6.7 oz", url: "https://us.diptyqueparis.com/en-us/products/classic-candle-feu-de-bois-wood-fire-fb2" }, // $90, 6.7 oz (11/17)
  { id: "pf-teakwood", brand: "P.F. Candle Co.", name: "Teakwood & Tobacco", type: "candle", families: ["woody", "spicy"], tier: "$", notes: "teak · leather · tobacco", seasons: cold, dayparts: eve, price: "$24", size: "7.2 oz", url: "https://pfcandleco.com/products/teakwood-tobacco-standard-candle" }, // $24, 7.2 oz (11/17)
  { id: "aesop-ptolemy", brand: "Aesop", name: "Ptolemy", type: "candle", families: ["woody", "green"], tier: "$$$", notes: "cedar · cypress · vetiver", seasons: all, dayparts: eve, price: "$120", url: "https://www.aesop.com/home-fragrance/candles/ptolemy-aromatique-candle/HM02.html" }, // $120 (11/17)
  { id: "boysmells-hinoki", brand: "Boy Smells", name: "Hinoki Fantôme", type: "candle", families: ["woody", "floral"], tier: "$$", notes: "hinoki · smoke · florals", seasons: all, dayparts: eve, price: "$44", size: "8.5 oz", url: "https://boysmells.com/products/hinoki-fantome-candle-9oz" }, // $44, 8.5 oz (11/17)
  // Citrus & Fruit
  { id: "jomalone-lime-basil", brand: "Jo Malone London", name: "Lime Basil & Mandarin", type: "diffuser", families: ["citrus", "green"], tier: "$$$", notes: "lime · basil · mandarin", seasons: warm, dayparts: day, price: "$115", size: "165 ml", url: "https://www.jomalone.com/product/25969/22262/home/lime-basil-mandarin-reed-diffuser" }, // $115, 165 ml (11/17)
  { id: "saje-liquid-sunshine", brand: "Saje", name: "Liquid Sunshine", type: "oil", families: ["citrus"], tier: "$", notes: "grapefruit · lime · lemon", seasons: warm, dayparts: day, price: "$28", size: "0.34 oz", url: "https://www.saje.com/products/liquid-sunshine-cheerful-diffuser-blend" }, // $28, 0.34 oz (11/17)
  { id: "muji-yuzu", brand: "MUJI", name: "Yuzu essential oil", type: "oil", families: ["citrus"], tier: "$", notes: "yuzu · orange", seasons: all, dayparts: day, price: "$19.90", size: "10 ml", url: "https://www.muji.us/products/essential-oil-yuzu" }, // $19.90, 10 ml (11/17)
  { id: "diptyque-figuier", brand: "Diptyque", name: "Figuier", type: "candle", families: ["citrus", "green"], tier: "$$$", notes: "fig · fig leaf · wood", seasons: warm, dayparts: day, price: "$90", size: "6.7 oz", url: "https://us.diptyqueparis.com/en-us/products/classic-candle-figuier-fig-tree-fi2" }, // $90, 6.7 oz (11/17)
  { id: "tj-grapefruit", brand: "Trader Joe's", name: "Grapefruit candle", type: "candle", families: ["citrus"], tier: "$", notes: "grapefruit (seasonal)", seasons: ["spring", "summer"], dayparts: day },
  // Floral
  { id: "diptyque-roses", brand: "Diptyque", name: "Roses", type: "candle", families: ["floral"], tier: "$$$", notes: "fresh rose", seasons: warm, dayparts: any, price: "$90", size: "6.7 oz", url: "https://us.diptyqueparis.com/en-us/products/classic-candle-roses-ro3" }, // $90, 6.7 oz (11/17)
  { id: "jomalone-pear-freesia", brand: "Jo Malone London", name: "English Pear & Freesia", type: "spray", families: ["floral", "citrus"], tier: "$$$", notes: "pear · freesia", seasons: warm, dayparts: day, price: "$68", size: "100 ml", url: "https://www.jomalone.com/product/25969/100397/home/english-pear-freesia-room-spray" }, // $68, 100 ml (11/17)
  { id: "yankee-midsummer", brand: "Yankee Candle", name: "Midsummer's Night", type: "candle", families: ["floral", "woody"], tier: "$$", notes: "lavender · musk", seasons: all, dayparts: eve, price: "$34.99", size: "20 oz", url: "https://www.yankeecandle.com/yankee-candle/candles/candle-styles/signature-tumbler-candles/signature-large-tumbler-candles/midsummers-night/SAP_1630036.html" }, // $34.99 regular, 20 oz tumbler (11/17)
  { id: "otherland-rattan", brand: "Otherland", name: "Rattan", type: "candle", families: ["floral", "citrus"], tier: "$", notes: "rattan · bergamot · white florals", seasons: warm, dayparts: day, price: "$20", size: "8 oz", url: "https://www.otherland.com/products/rattan" }, // $20, 8 oz (11/17)
  { id: "westin-white-tea", brand: "Westin", name: "White Tea", type: "diffuser", families: ["floral", "fresh"], tier: "$$$", notes: "white tea · freesia", seasons: all, dayparts: any, price: "$65", size: "5 oz", url: "https://shop.marriott.com/brands/westin/fragrance/reed-diffuser/HB-606-01-01-WL-5.html" }, // $65 regular, 5 oz; new address (11/17)
  // Green & Herbal
  { id: "aesop-olous", brand: "Aesop", name: "Olous room spray", type: "spray", families: ["green", "spicy"], tier: "$$$", notes: "basil · cardamom · green", seasons: all, dayparts: day, price: "$66", url: "https://www.aesop.com/home-fragrance/room-sprays/olous-aromatique-room-spray/FR19.html" }, // $66 (11/17)
  { id: "saje-tranquility", brand: "Saje", name: "Tranquility", type: "oil", families: ["green"], tier: "$", notes: "lavender · chamomile", seasons: all, dayparts: eve, price: "$28", size: "0.34 oz", url: "https://www.saje.com/products/tranquility-relaxing-diffuser-blend" }, // $28, 0.34 oz (11/17)
  { id: "muji-lavender", brand: "MUJI", name: "Lavender essential oil", type: "oil", families: ["green"], tier: "$", notes: "lavender", seasons: all, dayparts: eve, price: "$19.90", size: "10 ml", url: "https://www.muji.us/products/essential-oil-french-lavender" }, // $19.90, 10 ml (11/17)
  { id: "diptyque-baies", brand: "Diptyque", name: "Baies", type: "candle", families: ["green", "floral"], tier: "$$$", notes: "blackcurrant leaf · rose", seasons: all, dayparts: any, price: "$90", size: "6.7 oz", url: "https://us.diptyqueparis.com/en-us/products/classic-candle-baies-berries-b2" }, // $90, 6.7 oz (11/17)
  { id: "tj-cedar-balsam", brand: "Trader Joe's", name: "Cedar Balsam candle", type: "candle", families: ["green", "woody"], tier: "$", notes: "balsam · cedar (seasonal)", seasons: ["winter"], dayparts: eve },
  // Gourmand
  { id: "yankee-vanilla-cupcake", brand: "Yankee Candle", name: "Vanilla Cupcake", type: "candle", families: ["gourmand"], tier: "$$", notes: "vanilla · butter", seasons: all, dayparts: eve, price: "$34.99", size: "22 oz", url: "https://www.yankeecandle.com/yankee-candle/candles/candle-styles/original-jar-candles/vanilla-cupcake/SAP_2654292W.html" }, // $34.99 regular, 22 oz jar (11/17)
  { id: "otherland-cinnamon-musk", brand: "Otherland", name: "Cinnamon Musk", type: "candle", families: ["gourmand", "spicy"], tier: "$", notes: "cinnamon · almond · amber", seasons: cold, dayparts: eve, price: "$20", size: "8 oz", url: "https://www.otherland.com/products/cinnamon-musk" }, // $20, 8 oz (11/17)
  { id: "snif-gingerbread", brand: "Snif", name: "Half Baked Gingerbread Smash", type: "candle", families: ["gourmand", "spicy"], tier: "$$", notes: "gingerbread · chai", seasons: ["winter"], dayparts: eve, price: "$34", size: "6 oz", url: "https://snif.co/products/half-baked-gingerbread-smash-candle" }, // $34, 6 oz; sold out on 11/17 (waitlist) (11/17)
  { id: "replica-lazy-sunday", brand: "Maison Margiela Replica", name: "Lazy Sunday Morning", type: "candle", families: ["gourmand", "fresh"], tier: "$$$", notes: "linen · lily · musk", seasons: all, dayparts: day, price: "about $76", size: "165 g", url: "https://www.maisonmargiela-fragrances.us/candles/replica-lazy-sunday-morning-scented-candle/MM020.html" }, // about $76, 165 g (retailers) (11/17)
  // Warm & Spicy
  { id: "nest-holiday", brand: "NEST New York", name: "Holiday", type: "candle", families: ["spicy", "citrus"], tier: "$$", notes: "pomegranate · pine · clove · cinnamon", seasons: ["winter"], dayparts: eve, price: "$52", url: "https://www.nestnewyork.com/products/holiday-classic-candle-2" }, // $52 (her Christmas story's reference) (11/17)
  { id: "yankee-sparkling-cinnamon", brand: "Yankee Candle", name: "Sparkling Cinnamon", type: "candle", families: ["spicy"], tier: "$$", notes: "cinnamon · clove", seasons: cold, dayparts: eve, price: "$31", size: "22 oz", url: "https://www.yankeecandle.com/yankee-candle/candles/candle-styles/original-jar-candles/sparkling-cinnamon/SAP_1100952W.html" }, // $31, 22 oz jar (11/17)
  { id: "lelabo-palo-santo", brand: "Le Labo", name: "Palo Santo 14", type: "candle", families: ["spicy", "woody"], tier: "$$$", notes: "palo santo · cardamom", seasons: cold, dayparts: eve, price: "about $92", size: "245 g", url: "https://www.lelabofragrances.com/palo-santo-14-402.html" }, // about $92, 245 g (retailers) (11/17)
  { id: "voluspa-baltic-amber", brand: "Voluspa", name: "Baltic Amber", type: "candle", families: ["spicy", "gourmand"], tier: "$$", notes: "amber · vanilla · sandalwood", seasons: cold, dayparts: eve, price: "$34", size: "9 oz", url: "https://voluspa.com/products/baltic-amber-classic-candle" }, // $34, 9 oz (11/17)
  { id: "replica-fireplace", brand: "Maison Margiela Replica", name: "By the Fireplace", type: "candle", families: ["spicy", "woody"], tier: "$$$", notes: "chestnut · smoke · vanilla", seasons: ["winter"], dayparts: eve, price: "about $72", size: "165 g", url: "https://www.maisonmargiela-fragrances.us/fragrances/replica-by-the-fireplace-ceramic-candle/MM165.html" }, // about $72, 165 g (retailers) (11/17)
  // Fresh & Clean
  { id: "yankee-clean-cotton", brand: "Yankee Candle", name: "Clean Cotton", type: "candle", families: ["fresh"], tier: "$$", notes: "cotton · white florals", seasons: all, dayparts: day, price: "$34.99", size: "22 oz", url: "https://www.yankeecandle.com/yankee-candle/candles/candle-styles/original-jar-candles/clean-cotton/SAP_2654258.html" }, // $34.99 regular, 22 oz jar (11/17)
  { id: "bbw-eucalyptus-spearmint", brand: "Bath & Body Works", name: "Eucalyptus Spearmint", type: "candle", families: ["fresh", "green"], tier: "$", notes: "eucalyptus · mint", seasons: all, dayparts: day, price: "$24.95", size: "14.5 oz", url: "https://www.bathandbodyworks.com/p/eucalyptus-spearmint-3-wick-candle-028016790" }, // $24.95, 14.5 oz (11/17)
  { id: "vitruvi-breathe", brand: "Vitruvi", name: "Breathe diffuser blend", type: "oil", families: ["fresh", "green"], tier: "$", notes: "peppermint · eucalyptus · tea tree", seasons: all, dayparts: day, price: "$28.99", url: "https://vitruvi.com/products/breathe-essential-oil-blend" }, // $28.99; replaces the Stone Diffuser link, which sold the diffuser alone at $129.99 (11/17)
  { id: "mrsmeyers-basil", brand: "Mrs. Meyer's", name: "Basil candle", type: "candle", families: ["fresh", "green"], tier: "$", notes: "basil · clean", seasons: all, dayparts: day, price: "$10.99", size: "7.2 oz", url: "https://mrsmeyers.com/products/large-candle-basil" }, // $10.99, 7.2 oz (11/17)
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
