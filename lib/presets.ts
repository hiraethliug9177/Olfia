import { baseLayout, stickersFor } from "@/lib/catalog";
import type { FamilyId, PlacedItem, TimeOfDay } from "@/lib/types";

/**
 * Room presets for the Home gallery (11/9 feedback 04: the examples all looked like one room).
 * Each preset differs in furniture, light and scent. Only furniture that exists as art is used;
 * Uses Tiffany's 11/10 furniture cut-outs. Kitchen and bathroom wait for their items.
 * Lines drafted by Claude on 2026-11-10 with Tiffany's go-ahead ("generate them or leave them
 * blank"); she can replace them at any time. Each covers the scent source, the light, and one
 * small human detail, without repeating the room or family name.
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
    line: "A cedar candle burning low, one lamp on, a page folded down.",
    families: ["woody", "spicy"],
    time: "night",
    items: [...baseLayout("candle"), ...stickersFor(["woody", "spicy"])],
  },
  {
    id: "bedroom-morning",
    name: "Bedroom, morning",
    line: "Bergamot mist from the diffuser, blinds half up, sheets still warm.",
    families: ["citrus", "fresh"],
    time: "morning",
    items: [
      p("frame-small", 0.24, 0.3, 1, { rot: -2 }),
      p("bed-rattan", 0.42, 0.92, 3),
      p("blue-table", 0.86, 0.92, 4),
      p("table-lamp", 0.84, 0.755, 5),
      p("diffuser", 0.92, 0.755, 9),
      ...stickersFor(["citrus", "fresh"]),
    ],
  },
  {
    id: "study-afternoon",
    name: "Study, afternoon",
    line: "Cedar incense in slanting sun, a pencil tucked behind one ear.",
    families: ["woody", "green"],
    time: "afternoon",
    items: [
      p("shelf-wood", 0.18, 0.92, 2),
      p("desk", 0.62, 0.92, 4),
      p("cantilever", 0.7, 0.94, 6, { flip: -1, scale: 0.85 }),
      p("spring-lamp", 0.47, 0.63, 5),
      p("papers", 0.6, 0.63, 5, { scale: 0.9 }),
      p("incense", 0.76, 0.63, 9),
      p("plant", 0.93, 0.93, 3, { scale: 0.85 }),
      ...stickersFor(["woody", "green"]),
    ],
  },
  {
    id: "living-night",
    name: "Living room, late",
    line: "A vanilla-clove candle, the record on side two, shoes kicked off.",
    families: ["gourmand", "spicy"],
    time: "night",
    items: [
      p("frame-landscape", 0.5, 0.26, 1),
      p("floor-lamp", 0.1, 0.92, 2),
      p("sofa", 0.48, 0.9, 3),
      p("bean-table", 0.52, 0.97, 6, { scale: 0.8 }),
      p("candle", 0.46, 0.84, 9),
      p("record-cabinet", 0.9, 0.92, 4),
      p("record-player", 0.9, 0.71, 5, { scale: 0.85 }),
      ...stickersFor(["gourmand", "spicy"]),
    ],
  },
];
