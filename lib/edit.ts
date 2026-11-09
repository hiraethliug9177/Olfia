import type { FamilyId } from "@/lib/types";

/**
 * The Olfia Edit — articles (2026-11-09). Page added from the 11/4 feedback: news, knowledge and
 * platform updates, with room to grow into sponsored stories later.
 * Body text is Tiffany's. Until she writes it, `body` is empty and the page shows a TODO box
 * plus the fact notes and sources she is writing from (facts, not brand copy).
 */

export interface Article {
  slug: string;
  title: string;
  dek: string;
  date: string;
  families: FamilyId[];
  /** paragraphs; empty until Tiffany writes them */
  body: string[];
  /** facts and sources gathered for the writer; shown as "Notes & sources" */
  notes: Array<{ text: string; source?: { label: string; url: string } }>;
  /** product ids from lib/products.ts to show under the article */
  products: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "what-does-a-movie-smell-like",
    title: "What does a movie smell like?",
    dek: "TODO(Tiffany): one-line standfirst for the film × fragrance piece.",
    date: "2026-11-10",
    families: ["woody", "spicy"],
    body: [],
    notes: [
      { text: "July 2025: Scentbird and Sony Pictures held a “scent-a-long” screening of I Know What You Did Last Summer in New York, diffusing five fragrances from a $35 set into the theatre at specific moments.", source: { label: "Glossy", url: "https://www.glossy.co/beauty/how-scentbird-scented-a-movie-for-its-latest-marketing-activation/" } },
      { text: "Scentbird’s CMO: fragrance has long been tied to fashion; the next link is entertainment and culture. Earlier tie-ins: Marvel’s Ironheart, Agatha All Along, Palm Royale, The Bachelor.", source: { label: "Glossy", url: "https://www.glossy.co/beauty/how-scentbird-scented-a-movie-for-its-latest-marketing-activation/" } },
      { text: "March 2026: Lionsgate × Scentbird released John Wick (spiced lemon, a gunmetal accord, clary sage, cedarwood, amber bourbon) and Twilight (plum butter, tuberose, moon flower, macadamia, creamy woods) eaux de parfum.", source: { label: "License Global", url: "https://www.licenseglobal.com/movies/lionsgate-and-scentbird-drop-two-film-themed-scents" } },
      { text: "2019: A24 and Joya made six genre candles — Horror was leather, mandarin and clove leaf; Musical was fig leaf and pink pepper — at $48 each.", source: { label: "Domino", url: "https://www.domino.com/content/a24-joya-movie-candles/" } },
      { text: "Angle for Olfia: film scents are mostly personal perfumes; Olfia’s version is the room — build “the living room of that film” in Rooms." },
    ],
    products: ["lelabo-santal26", "replica-fireplace", "pf-teakwood", "diptyque-feu-de-bois"],
  },
  {
    slug: "why-every-luxury-hotel-smells-the-same",
    title: "Why every luxury hotel smells the same",
    dek: "TODO(Tiffany): one-line standfirst for the hotel scents piece.",
    date: "2026-11-10",
    families: ["floral", "fresh"],
    body: [],
    notes: [
      { text: "Westin’s White Tea (white tea, freesia, cedar, vanilla) has scented its lobbies since 1999 and is sold as a diffuser and candle.", source: { label: "Aroma Paradise", url: "https://aromaparadise.com/blogs/news/hotel-scent-decoder" } },
      { text: "Edition hotels developed their citrus, lavender and amber signature with Le Labo; the Baccarat Hotel in New York adapted Baccarat Rouge 540 (saffron, amberwood, fir resin); Ritz-Carlton leans grapefruit, orange blossom and driftwood; 1 Hotels use bergamot, jasmine and sandalwood.", source: { label: "Aroma Paradise", url: "https://aromaparadise.com/blogs/news/hotel-scent-decoder" } },
      { text: "Retail versions: Westin White Tea diffuser, Ritz-Carlton White Amber candle, Four Seasons at Home candles, W Hotels room spray; Fairmont uses Le Labo Rose 31.", source: { label: "HGTV", url: "https://www.hgtv.com/lifestyle/travel/make-your-home-smell-like-your-favorite-hotel" } },
      { text: "How hotel scenting works as a business (scent marketing, diffusion systems).", source: { label: "Air Aroma", url: "https://www.air-aroma.com/au/blog/scenting-hotels/" } },
      { text: "Angle for Olfia: a signature scent is memory design — the same reason Olfia saves a scent to a room." },
    ],
    products: ["westin-white-tea", "replica-lazy-sunday", "diptyque-roses", "yankee-clean-cotton"],
  },
  {
    slug: "christmas-smells-less-like-sugar",
    title: "Christmas smells less like sugar, more like a fire",
    dek: "TODO(Tiffany): one-line standfirst for the seasonal piece.",
    date: "2026-11-10",
    families: ["spicy", "gourmand"],
    body: [],
    notes: [
      { text: "Editors’ 2025–26 holiday picks lean woodsy, smoky and fireside, with boozy notes (bourbon, spiked eggnog) and warm spice over sugary sweetness: NEST Holiday, Diptyque Feu de Bois, Cire Trudon Nazareth, Voluspa Noble Fir, Otherland Cinnamon Musk; Bath & Body Works’ Twisted Peppermint has returned every year since 2006.", source: { label: "PureWow", url: "https://purewow.com/home/christmas-scented-candles" } },
      { text: "Marie Claire’s holiday list (Oct 2026): Le Labo Papyrus 20, Hotel Lobby Candle Après Ski (mountain air, fireplace, bourbon, marshmallow), Homecourt Balsam Fireplace, LAFCO Pumpkin Seed & Sandalwood, NEST Winter Chai.", source: { label: "Marie Claire", url: "https://www.marieclaire.com/beauty/fragrance/best-holiday-candles/" } },
      { text: "2026 Gift Book Consumer Survey: candles remain the home-fragrance product most people plan to buy; 50% of Gen Z and 58% of millennials plan to buy a diffuser within a year; floral/botanical is the top profile (74% of Gen Z), fresh second; figural seasonal diffusers and lamp-style candle warmers are trending.", source: { label: "Home Accents Today", url: "https://www.homeaccentstoday.com/trending-gifts/product-trends/looking-to-light-up-your-shelves-with-fresh-inventory-here-are-the-top-candle-trends-for-2026" } },
      { text: "Angle for Olfia: map the holiday palette onto the families (Woody + Warm & Spicy with a Gourmand accent) and show a Christmas living room built in Rooms." },
    ],
    products: ["nest-holiday", "snif-gingerbread", "otherland-cinnamon-musk", "tj-cedar-balsam", "voluspa-baltic-amber"],
  },
];

export const articleBySlug = (slug: string): Article | undefined => ARTICLES.find((a) => a.slug === slug);
