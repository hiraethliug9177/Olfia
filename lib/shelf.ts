import { PRODUCTS, type Product } from "@/lib/products";
import type { FamilyId, SourceKind } from "@/lib/types";

/**
 * My shelf (Scent Atlas, Tiffany 11/10): the home fragrances someone loves or uses every day,
 * added by pasting a product link or uploading a photo. Saved in this browser only, under its own
 * key so the Atlas entries are never touched. Photos are shrunk before saving.
 */

export type Routine = "daily" | "mornings" | "evenings" | "weekends" | "occasions";

export const ROUTINES: Array<{ id: Routine; label: string }> = [
  { id: "daily", label: "Every day" },
  { id: "mornings", label: "Mornings" },
  { id: "evenings", label: "Evenings" },
  { id: "weekends", label: "Weekends" },
  { id: "occasions", label: "Special occasions" },
];

export interface ShelfItem {
  id: string;
  createdAt: string;
  name: string;
  brand: string;
  kind: SourceKind;
  families: FamilyId[];
  routine: Routine;
  note: string;
  url?: string;
  /** a shrunk photo (data URL) the person uploaded, or the product image found at the link */
  image?: string;
  imageFrom?: "upload" | "link";
  productId?: string;
}

export const SHELF_KEY = "olfia.shelf.v1";

export function loadShelf(): ShelfItem[] {
  try {
    const raw = window.localStorage.getItem(SHELF_KEY);
    const list = raw ? (JSON.parse(raw) as ShelfItem[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** False when the browser refuses (storage full or blocked). */
export function saveShelf(items: ShelfItem[]): boolean {
  try {
    window.localStorage.setItem(SHELF_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

/* ---------- reading a product link ---------- */

const BRANDS: Array<[RegExp, string]> = [
  [/diptyqueparis\./, "Diptyque"],
  [/aesop\./, "Aesop"],
  [/lelabofragrances\./, "Le Labo"],
  [/saje\./, "Saje"],
  [/yankeecandle\./, "Yankee Candle"],
  [/muji\./, "MUJI"],
  [/traderjoes\./, "Trader Joe's"],
  [/byredo\./, "Byredo"],
  [/dsanddurga\./, "D.S. & DURGA"],
  [/loewe\./, "LOEWE"],
  [/jomalone\./, "Jo Malone London"],
  [/nestnewyork\./, "NEST New York"],
  [/boysmells\./, "Boy Smells"],
  [/otherland\./, "Otherland"],
  [/pfcandleco\./, "P.F. Candle Co."],
  [/vitruvi\./, "Vitruvi"],
  [/voluspa\./, "Voluspa"],
  [/bathandbodyworks\./, "Bath & Body Works"],
  [/mrsmeyers\./, "Mrs. Meyer's"],
  [/snif\./, "Snif"],
  [/maisonmargiela/, "Maison Margiela Replica"],
  [/westinstore\./, "Westin"],
  [/vacation\.inc/, "Vacation"],
  [/marriott\./, "Marriott Bonvoy Boutiques"],
  [/amazon\./, "Amazon"],
  [/target\./, "Target"],
  [/sephora\./, "Sephora"],
  [/nordstrom\./, "Nordstrom"],
  [/anthropologie\./, "Anthropologie"],
];

const STORES = new Set(["Amazon", "Target", "Sephora", "Nordstrom", "Anthropologie"]);

const KIND_WORDS: Array<[RegExp, SourceKind]> = [
  [/\bcandles?\b|\bwick\b/, "candle"],
  [/\bdiffusers?\b|\breeds?\b/, "diffuser"],
  [/\bincense\b|\bcones?\b|\bsticks\b/, "incense"],
  [/\bspray\b|\bmist\b|\broom spray\b|\bhome spray\b/, "spray"],
  [/\boils?\b|\bessential\b/, "oil"],
];

const FAMILY_WORDS: Array<[RegExp, FamilyId]> = [
  [/\b(rose|jasmine|peony|iris|floral|blossom|tuberose|lily|violet|gardenia|magnolia|neroli)\b/, "floral"],
  [/\b(vanilla|tonka|honey|coffee|caramel|cocoa|chocolate|cake|sugar|almond|gourmand|maple)\b/, "gourmand"],
  [/\b(amber|cinnamon|clove|frankincense|incense|tobacco|spice|spiced|spicy|oud|leather|pepper|saffron)\b/, "spicy"],
  [/\b(cedar|cedarwood|sandalwood|santal|vetiver|oak|oakmoss|patchouli|wood|woods|woody|hinoki|birch|pine|fir|balsam|cypress|smoke|feu|bois)\b/, "woody"],
  [/\b(basil|tomato|rosemary|lavender|tea|herb|herbal|fig|mint|sage|leaf|leaves|green|grass|eucalyptus|thyme)\b/, "green"],
  [/\b(bergamot|lemon|orange|grapefruit|pear|lime|mandarin|yuzu|citrus|cassis|berry|apple|peach|plum|pomegranate|fruit)\b/, "citrus"],
  [/\b(sea|salt|rain|ozone|cotton|cucumber|linen|clean|water|marine|air|fresh|laundry|ocean|aquatic|lightning|concrete)\b/, "fresh"],
];

const SKU = /^(?=.*\d)[a-z0-9]{5,}$/i;

function titleCase(words: string[]): string {
  return words
    .map((w) => (w.length <= 2 && w !== "&" ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Best guess at the product name from the address itself. */
export function nameFromUrl(u: URL): string {
  const segs = u.pathname.split("/").filter(Boolean).map((x) => decodeURIComponent(x));
  const dp = segs.indexOf("dp");
  let seg = dp > 0 ? segs[dp - 1] : [...segs].reverse().find((x) => /[a-z]{3,}/i.test(x) && x.includes("-")) ?? segs[segs.length - 1] ?? "";
  seg = seg.replace(/\.(html?|php|aspx?)$/i, "");
  const words = seg.split(/[-_+\s]+/).filter((w) => w && !SKU.test(w) && !/^\d+$/.test(w));
  return words.length ? titleCase(words) : "";
}

export function brandFromHost(host: string): string {
  const h = host.toLowerCase().replace(/^www\./, "");
  const hit = BRANDS.find(([re]) => re.test(h));
  if (hit) return hit[1];
  const core = h.split(".").slice(-2, -1)[0] ?? h;
  return core ? core[0].toUpperCase() + core.slice(1) : "";
}

export function kindFrom(text: string): SourceKind {
  const t = text.toLowerCase();
  return KIND_WORDS.find(([re]) => re.test(t))?.[1] ?? "candle";
}

export function familiesFrom(text: string): FamilyId[] {
  const t = text.toLowerCase();
  const hits: FamilyId[] = [];
  for (const [re, f] of FAMILY_WORDS) if (re.test(t) && !hits.includes(f)) hits.push(f);
  return hits.slice(0, 2);
}

/** A product from Olfia's own list that this link is about, if any. */
export function matchCatalog(brand: string, name: string): Product | undefined {
  const words = name.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  let best: { p: Product; s: number } | undefined;
  for (const p of PRODUCTS) {
    if (p.brand.toLowerCase() !== brand.toLowerCase()) continue;
    const pw = p.name.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
    const s = pw.filter((w) => words.includes(w) || name.toLowerCase().replace(/\s+/g, "").includes(w)).length;
    if (s > 0 && (!best || s > best.s)) best = { p, s };
  }
  return best?.p;
}

export interface LinkGuess {
  url: string;
  brand: string;
  name: string;
  kind: SourceKind;
  families: FamilyId[];
  image?: string;
  productId?: string;
  /** "page" when the product page itself was read, "address" when only the link was */
  from: "page" | "address";
}

export function normaliseUrl(raw: string): URL | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return u.protocol === "http:" || u.protocol === "https:" ? u : null;
  } catch {
    return null;
  }
}

/** Reads the link: the product page's own title and picture when the page allows it, the address otherwise. */
export async function readLink(raw: string): Promise<LinkGuess | null> {
  const u = normaliseUrl(raw);
  if (!u) return null;
  let brand = brandFromHost(u.hostname);
  let name = nameFromUrl(u);
  let image: string | undefined;
  let description = "";
  let from: LinkGuess["from"] = "address";
  try {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(`/api/link-preview?url=${encodeURIComponent(u.toString())}`, { signal: ctrl.signal });
    window.clearTimeout(t);
    if (res.ok) {
      const d = (await res.json()) as { ok: boolean; title?: string; image?: string; siteName?: string; description?: string };
      if (d.ok) {
        from = "page";
        if (d.title) name = cleanTitle(d.title, brand, d.siteName);
        // an unknown shop's own name is usually the brand; big stores keep the store's name
        if (d.siteName && !STORES.has(brand) && !BRANDS.some(([re]) => re.test(u.hostname.toLowerCase()))) brand = d.siteName.slice(0, 40);
        image = d.image;
        description = d.description ?? "";
      }
    }
  } catch {
    // the page could not be read; the address is enough to start
  }
  const text = `${name} ${description} ${u.pathname}`;
  const match = matchCatalog(brand, name);
  return {
    url: u.toString(),
    brand: match?.brand ?? brand,
    name: match?.name ?? name,
    kind: match?.type ?? kindFrom(text),
    families: match?.families.slice(0, 2) ?? familiesFrom(text),
    image,
    productId: match?.id,
    from,
  };
}

/** "Santal 26 Classic Candle | Le Labo Fragrances" -> "Santal 26 Classic Candle" */
function cleanTitle(title: string, brand: string, site?: string): string {
  let t = title.replace(/\s+/g, " ").trim();
  const cut = t.split(/\s[|–—·-]\s/);
  if (cut.length > 1) {
    const keep = cut.filter((part) => {
      const p = part.toLowerCase();
      return !(brand && p.includes(brand.toLowerCase())) && !(site && p.includes(site.toLowerCase()));
    });
    t = (keep[0] ?? cut[0]).trim();
  }
  return t.slice(0, 80);
}

/* ---------- photos ---------- */

/** Shrinks a photo to at most `max` px on its long side and returns a JPEG data URL. */
export function shrinkPhoto(file: File, max = 640, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * s));
      const h = Math.max(1, Math.round(img.naturalHeight * s));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error("no canvas")); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    img.src = url;
  });
}
