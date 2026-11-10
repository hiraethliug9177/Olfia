import { baseLayout, stickersFor } from "@/lib/catalog";
import type { FamilyId, PlacedItem, TimeOfDay } from "@/lib/types";

/**
 * Room presets for the Home gallery (11/9 feedback 04: the examples all looked like one room).
 * Each preset differs in furniture, light and scent. Only furniture that exists as art is used;
 * kitchen, bathroom and desk rooms wait for their furniture images.
 * Names and lines are placeholders. TODO(Tiffany): rename and rewrite.
 */
export interface RoomPreset {
  id: string;
  name: string;
  line: string;
  families: FamilyId[];
  time: TimeOfDay;
  items: PlacedItem[];
}

const p = (kind: string, x: number, y: number, z: number, extra: Partial<PlacedItem> = {}): PlacedItem => ({ uid: `${kind}-${z}`, kind, x, y, scale: 1, rot: 0, flip: 1, z, ...extra });

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: "reading-night",
    name: "Reading corner, night",
    line: "Cedar candle, the arc lamp on low.",
    families: ["woody", "spicy"],
    time: "night",
    items: [...baseLayout("candle"), ...stickersFor(["woody", "spicy"])],
  },
  {
    id: "window-morning",
    name: "By the window, morning",
    line: "Citrus diffuser, plants, nothing on the walls.",
    families: ["citrus", "green"],
    time: "morning",
    items: [
      p("plant", 0.14, 0.93, 2, { scale: 1.25 }),
      p("lounge", 0.47, 0.9, 4),
      p("side-table", 0.8, 0.9, 5),
      p("diffuser", 0.8, 0.7, 9),
      p("frame-small", 0.24, 0.3, 1, { rot: -2 }),
      ...stickersFor(["citrus", "green"]),
    ],
  },
  {
    id: "sunday-afternoon",
    name: "Slow Sunday, afternoon",
    line: "Rose room spray and a rocking chair.",
    families: ["floral", "fresh"],
    time: "afternoon",
    items: [
      p("rug", 0.5, 0.98, 1),
      p("frame-landscape", 0.3, 0.26, 2),
      p("rocking", 0.6, 0.9, 4, { flip: -1 }),
      p("side-table", 0.22, 0.9, 5),
      p("spray", 0.22, 0.7, 9),
      p("plant", 0.9, 0.93, 6),
      ...stickersFor(["floral", "fresh"]),
    ],
  },
  {
    id: "late-corner",
    name: "Late corner, one lamp",
    line: "Incense, vanilla, a low chair.",
    families: ["gourmand", "spicy"],
    time: "night",
    items: [
      p("arc-lamp", 0.82, 0.9, 3, { flip: -1 }),
      p("slipper", 0.56, 0.9, 4),
      p("side-table", 0.24, 0.9, 5),
      p("incense", 0.24, 0.71, 9),
      p("frame-small", 0.2, 0.3, 1, { rot: 3 }),
      p("frame-landscape", 0.5, 0.24, 2),
      ...stickersFor(["gourmand", "spicy"]),
    ],
  },
];
