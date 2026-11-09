import type { Daypart, EmotionId, FamilyId, MethodId, Occasion, PlacedItem, RoomKind, Season, SourceKind, TimeOfDay } from "@/lib/types";

/* ---------- Scent families (wheel order: neighbours blend well) ---------- */

export interface Material {
  id: string;
  label: string;
  colors: [string, string, string];
  /** photo cut-out (lovart, white die-cut edge baked in); the drawn window is the fallback */
  asset?: string;
}

export interface Family {
  id: FamilyId;
  label: string;
  hex: string;
  glow: string;
  notes: string;
  what: string;
  home: string;
  wheel: string;
  materials: Material[];
  /** square close-up photo, masked into stickers and used as the stamp fill */
  texture: string;
}

export const FAMILIES: Family[] = [
  {
    id: "floral", label: "Floral", hex: "#C98A8A", glow: "rgba(201,138,138,0.6)",
    notes: "rose · jasmine · peony · orange blossom · iris",
    what: "The largest family in perfumery, built around flowers: from fresh-cut petals to soft, powdery blooms.",
    home: "bedrooms and living rooms in spring and summer.",
    wheel: "Floral, Soft Floral",
    texture: "/assets/textures/texture-floral.webp",
    materials: [
      { id: "rose", label: "dried rose", colors: ["#C98A8A", "#B8676E", "#F3D6D6"], asset: "/assets/materials/floral-rose.webp" },
      { id: "jasmine", label: "jasmine", colors: ["#F4EEDF", "#E2D8C0", "#FFFFFF"], asset: "/assets/materials/floral-jasmine.webp" },
      { id: "peony", label: "peony", colors: ["#E3A6A9", "#D88E93", "#F8E1E2"], asset: "/assets/materials/floral-peony.webp" },
    ],
  },
  {
    id: "gourmand", label: "Gourmand", hex: "#D4A26A", glow: "rgba(212,162,106,0.6)",
    notes: "vanilla · tonka · honey · coffee · caramel",
    what: "Scents you could almost eat. A younger family that grew popular in the 1990s.",
    home: "cozy evenings; a little goes a long way in small rooms.",
    wheel: "Not on the wheel; a home-fragrance shelf category",
    texture: "/assets/textures/texture-gourmand.webp",
    materials: [
      { id: "vanilla", label: "vanilla pod", colors: ["#5A3826", "#3A2418", "#8A6A50"], asset: "/assets/materials/gourmand-vanilla.webp" },
      { id: "honeycomb", label: "honeycomb", colors: ["#E2A23B", "#C98522", "#F7D99A"] },
      { id: "coffee", label: "coffee beans", colors: ["#5A3826", "#3A2418", "#8A5A33"], asset: "/assets/materials/gourmand-coffee.webp" },
    ],
  },
  {
    id: "spicy", label: "Warm & Spicy", hex: "#B4552E", glow: "rgba(180,85,46,0.55)",
    notes: "amber · cinnamon · clove · frankincense · tobacco",
    what: "Called Amber on the fragrance wheel (once “Oriental”): resins, balsams and warm spices.",
    home: "autumn and winter, layered over woods.",
    wheel: "Amber, Soft Amber, Woody Amber",
    texture: "/assets/textures/texture-spicy.webp",
    materials: [
      { id: "cinnamon", label: "cinnamon", colors: ["#8E4A1F", "#7A3E19", "#C98A5A"], asset: "/assets/materials/spicy-cinnamon.webp" },
      { id: "resin", label: "resin", colors: ["#D08A45", "#A9662E", "#F2C98E"], asset: "/assets/materials/spicy-resin.webp" },
      { id: "clove", label: "clove", colors: ["#6A3A22", "#4E2A18", "#9A6A4A"] },
    ],
  },
  {
    id: "woody", label: "Woody & Earthy", hex: "#8A5A33", glow: "rgba(138,90,51,0.55)",
    notes: "cedar · sandalwood · vetiver · oakmoss · patchouli",
    what: "Dry woods, mosses and roots. Often the base that makes a scent last.",
    home: "reading corners, studies and living rooms.",
    wheel: "Woods, Mossy Woods, Dry Woods",
    texture: "/assets/textures/texture-woody.webp",
    materials: [
      { id: "cedar", label: "cedar ring", colors: ["#D8B386", "#B0804F", "#F1DDBF"], asset: "/assets/materials/woody-cedar-ring.webp" },
      { id: "bark", label: "bark", colors: ["#6A4126", "#4E2E1A", "#9A6A44"], asset: "/assets/materials/woody-bark.webp" },
      { id: "moss", label: "moss", colors: ["#6B7A36", "#4E5A2A", "#A6B46A"], asset: "/assets/materials/woody-moss.webp" },
    ],
  },
  {
    id: "green", label: "Green & Herbal", hex: "#7C8A4A", glow: "rgba(124,138,74,0.55)",
    notes: "basil · tomato leaf · rosemary · lavender · green tea",
    what: "Crushed leaves, cut stems and kitchen herbs. Aromatic notes like lavender sit here too.",
    home: "kitchens and work desks; it cuts through cooking smells.",
    wheel: "Green, Aromatic",
    texture: "/assets/textures/texture-green.webp",
    materials: [
      { id: "figleaf", label: "fig leaf", colors: ["#6B7A36", "#4E5A2A", "#A6B46A"], asset: "/assets/materials/green-fig-leaf.webp" },
      { id: "rosemary", label: "rosemary", colors: ["#5F6E30", "#3F4A20", "#8FA05A"], asset: "/assets/materials/green-rosemary.webp" },
      { id: "lavender", label: "lavender", colors: ["#9A8FC0", "#7D72A8", "#D2CCE6"], asset: "/assets/materials/green-lavender.webp" },
    ],
  },
  {
    id: "citrus", label: "Citrus & Fruit", hex: "#E2A23B", glow: "rgba(226,162,59,0.6)",
    notes: "bergamot · lemon · blood orange · grapefruit · pear",
    what: "Bright notes pressed from peels, plus juicy fruit. They are the first to fade.",
    home: "mornings, entryways and kitchens.",
    wheel: "Citrus; Fruity",
    texture: "/assets/textures/texture-citrus.webp",
    materials: [
      { id: "orange", label: "orange slice", colors: ["#F6C46A", "#E8952F", "#F9E3B0"], asset: "/assets/materials/citrus-orange-slice.webp" },
      { id: "lemon", label: "lemon peel", colors: ["#EDCB45", "#D4AE22", "#F8EBA0"], asset: "/assets/materials/citrus-lemon-peel.webp" },
      { id: "pear", label: "pear", colors: ["#C9C46A", "#A9A44A", "#ECE8B0"] },
    ],
  },
  {
    id: "fresh", label: "Fresh & Clean", hex: "#8FB5B8", glow: "rgba(143,181,184,0.6)",
    notes: "sea salt · rain · ozone · cotton · cucumber",
    what: "Water, air and clean laundry. Light, airy and easy to live with.",
    home: "bathrooms and entryways, any season.",
    wheel: "Water",
    texture: "/assets/textures/texture-fresh.webp",
    materials: [
      { id: "salt", label: "sea salt", colors: ["#E8EEF0", "#C9D6DA", "#FFFFFF"], asset: "/assets/materials/fresh-salt.webp" },
      { id: "linen", label: "linen", colors: ["#EFE9DE", "#D9D0C0", "#FFFFFF"], asset: "/assets/materials/fresh-linen.webp" },
      { id: "pebble", label: "pebble", colors: ["#A9B3B4", "#8A9596", "#D9DFE0"], asset: "/assets/materials/fresh-pebble.webp" },
    ],
  },
];

export const familyById = (id: FamilyId): Family => FAMILIES.find((f) => f.id === id) ?? FAMILIES[0];

export function familyIndex(id: FamilyId): number {
  return FAMILIES.findIndex((f) => f.id === id);
}

/** True when two families sit next to each other on the wheel. */
export function areNeighbours(a: FamilyId, b: FamilyId): boolean {
  const n = FAMILIES.length;
  const d = Math.abs(familyIndex(a) - familyIndex(b));
  return d === 1 || d === n - 1;
}

export function blendHint(ids: FamilyId[]): string {
  if (ids.length < 2) return "pick two to see if they blend";
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (areNeighbours(ids[i], ids[j])) {
        return `${familyById(ids[i]).label.toLowerCase()} + ${familyById(ids[j]).label.toLowerCase()} blend well`;
      }
    }
  }
  return "an unusual pair, try a neighbour on the wheel";
}

/** Photo-cut-out stand-in: a textured "window" in the material's colours. */
export function texture([a, b, c]: [string, string, string]): string {
  return `radial-gradient(circle at 30% 28%, ${c} 0%, rgba(255,255,255,0) 38%), repeating-radial-gradient(circle at 62% 64%, ${a} 0 5px, ${b} 5px 8px)`;
}

export function findMaterial(id: string): (Material & { family: FamilyId }) | undefined {
  for (const f of FAMILIES) {
    const m = f.materials.find((x) => x.id === id);
    if (m) return { ...m, family: f.id };
  }
  return undefined;
}

/* ---------- Rooms items ---------- */

export type ItemCategory = "furniture" | "source" | "material";

export interface ItemDef {
  id: string;
  label: string;
  category: ItemCategory;
  /** width as a fraction of stage width at scale 1 */
  w: number;
  /** height / width */
  aspect: number;
  /** stands on the floor (used by floor snap) */
  floor?: boolean;
  /** future lovart cut-out; when set, an <img> replaces the drawn stand-in */
  asset?: string;
}

export const FURNITURE: ItemDef[] = [
  { id: "armchair", label: "Armchair", category: "furniture", w: 0.4, aspect: 303 / 279, floor: true, asset: "/assets/furniture/seat-armchair.webp" },
  { id: "lounge", label: "Lounge chair", category: "furniture", w: 0.42, aspect: 425 / 462, floor: true, asset: "/assets/furniture/seat-lounge.webp" },
  { id: "rocking", label: "Rocking chair", category: "furniture", w: 0.36, aspect: 323 / 266, floor: true, asset: "/assets/furniture/seat-rocking.webp" },
  { id: "slipper", label: "Slipper chair", category: "furniture", w: 0.34, aspect: 299 / 285, floor: true, asset: "/assets/furniture/seat-slipper.webp" },
  { id: "side-table", label: "Side table", category: "furniture", w: 0.22, aspect: 114 / 82, floor: true },
  { id: "arc-lamp", label: "Arc lamp", category: "furniture", w: 0.36, aspect: 324 / 150, floor: true },
  { id: "plant", label: "Plant", category: "furniture", w: 0.22, aspect: 136 / 92, floor: true },
  { id: "rug", label: "Rug", category: "furniture", w: 0.9, aspect: 68 / 352, floor: true },
  { id: "frame-landscape", label: "Painting", category: "furniture", w: 0.24, aspect: 74 / 92 },
  { id: "frame-small", label: "Small print", category: "furniture", w: 0.14, aspect: 64 / 54 },
];

export const SOURCES: ItemDef[] = [
  { id: "candle", label: "Candle", category: "source", w: 0.075, aspect: 266 / 152, asset: "/assets/sources/source-candle.webp" },
  { id: "diffuser", label: "Diffuser", category: "source", w: 0.075, aspect: 299 / 146, asset: "/assets/sources/source-diffuser.webp" },
  { id: "spray", label: "Room spray", category: "source", w: 0.06, aspect: 282 / 120, asset: "/assets/sources/source-spray.webp" },
  { id: "incense", label: "Incense", category: "source", w: 0.08, aspect: 296 / 158, asset: "/assets/sources/source-incense.webp" },
  { id: "oil", label: "Oil burner", category: "source", w: 0.1, aspect: 259 / 220, asset: "/assets/sources/source-oil-burner.webp" },
];

export const MATERIAL_ITEMS: ItemDef[] = FAMILIES.flatMap((f) =>
  f.materials.map((m) => ({ id: m.id, label: m.label, category: "material" as const, w: 0.12, aspect: 1, asset: m.asset })),
);

export const ITEMS: ItemDef[] = [...FURNITURE, ...SOURCES, ...MATERIAL_ITEMS];

export const itemById = (id: string): ItemDef | undefined => ITEMS.find((i) => i.id === id);

export const FLOOR_LINE = 0.74;

/* ---------- Scenes ---------- */

export interface SceneDef {
  id: string;
  name: string;
}

export const SCENES: SceneDef[] = [{ id: "reading-corner", name: "Reading Corner" }];

let uidCounter = 0;
export function uid(): string {
  uidCounter += 1;
  return `i${Date.now().toString(36)}${uidCounter.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function place(kind: string, x: number, y: number, z: number, extra?: Partial<PlacedItem>): PlacedItem {
  return { uid: `${kind}-${z}`, kind, x, y, scale: 1, rot: 0, flip: 1, z, ...extra };
}

export function baseLayout(source: string = "candle"): PlacedItem[] {
  const sourceY = source === "candle" ? 0.69 : 0.7;
  return [
    place("rug", 0.5, 0.98, 1),
    place("frame-landscape", 0.5, 0.27, 2),
    place("frame-small", 0.74, 0.29, 3, { rot: 2 }),
    place("arc-lamp", 0.19, 0.9, 4),
    place("armchair", 0.4, 0.9, 5),
    place("side-table", 0.72, 0.9, 6),
    place(source, 0.72, sourceY, 9),
    place("plant", 0.89, 0.93, 7),
  ];
}

export function stickersFor(families: FamilyId[]): PlacedItem[] {
  const spots: Array<[number, number, number]> = [
    [0.78, 0.46, -8],
    [0.6, 0.42, 6],
    [0.88, 0.6, -4],
  ];
  return families.slice(0, 3).map((f, i) => {
    const m = familyById(f).materials[0];
    const [x, y, rot] = spots[i];
    return { uid: `${m.id}-s${i}`, kind: m.id, x, y, scale: 1, rot, flip: 1, z: 20 + i };
  });
}

export interface MoodPreset {
  id: string;
  label: string;
  dot: string;
  families: FamilyId[];
  source: string;
  time: TimeOfDay;
  note: string;
}

export const MOODS: MoodPreset[] = [
  { id: "woody", label: "Woody", dot: "#8A5A33", families: ["woody", "spicy", "gourmand"], source: "candle", time: "night", note: "rain, chapter three" },
  { id: "citrus", label: "Citrus", dot: "#E2A23B", families: ["citrus", "green", "fresh"], source: "diffuser", time: "morning", note: "first coffee, window open" },
  { id: "floral", label: "Floral", dot: "#C98A8A", families: ["floral", "gourmand", "green"], source: "spray", time: "afternoon", note: "a slow sunday" },
];

/* ---------- Capture options ---------- */

export const ROOM_OPTIONS: Array<{ id: RoomKind; label: string }> = [
  { id: "living", label: "Living room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "study", label: "Study" },
  { id: "reading", label: "Reading corner" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "closet", label: "Closet" },
  { id: "entryway", label: "Entryway" },
  { id: "balcony", label: "Balcony" },
  { id: "car", label: "Car" },
  { id: "office", label: "Office" },
  { id: "other", label: "Other" },
];

export const SEASON_OPTIONS: Array<{ id: Season; label: string; paper: string }> = [
  { id: "spring", label: "Spring", paper: "#F3F1E4" },
  { id: "summer", label: "Summer", paper: "#F7F0DC" },
  { id: "autumn", label: "Autumn", paper: "#F2E6D2" },
  { id: "winter", label: "Winter", paper: "#F1F0EE" },
];

export const DAYPART_OPTIONS: Array<{ id: Daypart; label: string; time: TimeOfDay }> = [
  { id: "morning", label: "Morning", time: "morning" },
  { id: "afternoon", label: "Afternoon", time: "afternoon" },
  { id: "evening", label: "Evening", time: "night" },
  { id: "night", label: "Night", time: "night" },
];

export const OCCASION_OPTIONS: Array<{ id: Occasion; label: string }> = [
  { id: "everyday", label: "Everyday" },
  { id: "date", label: "Date" },
  { id: "party", label: "Party" },
  { id: "meditation", label: "Meditation" },
  { id: "bath", label: "Bath" },
  { id: "sleep", label: "Sleep" },
  { id: "work", label: "Work" },
  { id: "guests", label: "Guests over" },
  { id: "cleaning", label: "Cleaning day" },
  { id: "holiday", label: "Holiday" },
];

export const EMOTION_OPTIONS: Array<{ id: EmotionId; label: string }> = [
  { id: "calm", label: "Calm" },
  { id: "cozy", label: "Cozy" },
  { id: "focused", label: "Focused" },
  { id: "nostalgic", label: "Nostalgic" },
  { id: "energized", label: "Energized" },
  { id: "romantic", label: "Romantic" },
  { id: "melancholy", label: "Melancholy" },
  { id: "playful", label: "Playful" },
  { id: "grounded", label: "Grounded" },
  { id: "fresh-start", label: "Fresh start" },
  { id: "restless", label: "Restless" },
  { id: "safe", label: "Safe" },
];

export function seasonOf(d: Date): Season {
  const m = d.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

export function daypartOf(d: Date): Daypart {
  const h = d.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

/** Lower-case, no spaces; the tag list a capture carries, built from its choices. */
export function autoTags(c: { season?: Season; daypart?: Daypart; room?: RoomKind | null; occasion?: Occasion; families: FamilyId[]; emotions?: EmotionId[] }): string[] {
  const t: string[] = [];
  if (c.season) t.push(c.season);
  if (c.daypart) t.push(c.daypart);
  if (c.room) t.push(c.room === "living" ? "livingroom" : c.room === "reading" ? "readingcorner" : c.room);
  if (c.occasion) t.push(c.occasion);
  c.families.forEach((f) => t.push(familyById(f).label.split(" ")[0].toLowerCase()));
  (c.emotions ?? []).forEach((e) => t.push(e.replace("-", "")));
  return Array.from(new Set(t));
}

/** A suggested name for the moment, from what was chosen. The user can overwrite it. */
export function suggestMomentName(c: { daypart?: Daypart; season?: Season; families: FamilyId[]; emotions?: EmotionId[]; room?: RoomKind | null }, d: Date = new Date()): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const feel = c.emotions?.[0] ? EMOTION_OPTIONS.find((e) => e.id === c.emotions?.[0])?.label.toLowerCase() : null;
  const fam = c.families[0] ? familyById(c.families[0]).materials[0].label.split(" ")[0] : null;
  const when = c.daypart ? `${days[d.getDay()]} ${c.daypart}` : days[d.getDay()];
  const bits = [feel, fam].filter(Boolean).join(" ");
  return bits ? `${when}, ${bits}` : when;
}

export const SOURCE_OPTIONS: Array<{ id: SourceKind; label: string }> = [
  { id: "candle", label: "Candle" },
  { id: "diffuser", label: "Diffuser" },
  { id: "incense", label: "Incense" },
  { id: "spray", label: "Room spray" },
  { id: "oil", label: "Essential oil" },
  { id: "fragrance-free", label: "Fragrance-free / none" },
  { id: "other", label: "Other" },
];

export const METHOD_OPTIONS: Array<{ id: MethodId; label: string; families: FamilyId[] }> = [
  { id: "window", label: "Open window", families: ["fresh", "green"] },
  { id: "simmer", label: "Simmer pot", families: ["spicy", "citrus"] },
  { id: "flowers", label: "Fresh flowers", families: ["floral"] },
  { id: "laundry", label: "Clean laundry", families: ["fresh"] },
  { id: "baking", label: "Baking", families: ["gourmand"] },
  { id: "rain", label: "After rain", families: ["fresh", "green"] },
  { id: "other", label: "Other", families: [] },
];

export const roomLabel = (id: RoomKind): string => ROOM_OPTIONS.find((r) => r.id === id)?.label ?? "Room";
export const sourceLabel = (id: SourceKind): string => SOURCE_OPTIONS.find((s) => s.id === id)?.label ?? "Scent";
export const methodLabel = (id: MethodId): string => METHOD_OPTIONS.find((m) => m.id === id)?.label ?? "Method";
