import { autoTags, baseLayout, seasonOf, stickersFor } from "@/lib/catalog";
import { ROOM_PRESETS } from "@/lib/presets";
import { newId } from "@/lib/store";
import type { CaptureEntry, Daypart, EmotionId, Entry, FamilyId, MethodId, Occasion, PlacedItem, RoomKind, RoomsEntry, SourceKind, TimeOfDay } from "@/lib/types";

/**
 * Sample pages for the class review and for empty states (2026-11-10: richer set, loaded on a first visit).
 * About six weeks of pages, relative to today: rooms in all three rooms and from the Home presets,
 * captures of products and of everyday moments, loved and not-for-me, starred favourites, every time of day.
 */
export function sampleEntries(now: Date = new Date()): Entry[] {
  const at = (daysAgo: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const dp = (hour: number): Daypart => (hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night");
  const presetItems = (id: string): PlacedItem[] | null => ROOM_PRESETS.find((p) => p.id === id)?.items ?? null;

  const room = (
    daysAgo: number, hour: number, families: FamilyId[], nickname: string, time: TimeOfDay,
    o: { source?: string; scene?: string; preset?: string; starred?: boolean; strength?: number; windowOpen?: boolean } = {},
  ): RoomsEntry => {
    const scene = o.scene ?? "reading-corner";
    const items = (o.preset && presetItems(o.preset)) || [...baseLayout(o.source ?? "candle", scene), ...stickersFor(families)];
    return {
      id: newId(), schemaVersion: 2, type: "rooms", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred: !!o.starred, families,
      sceneId: scene, nickname, items, strength: o.strength ?? 70, time, windowOpen: !!o.windowOpen,
    };
  };

  type CaptureOpts = { room: RoomKind; emotions: EmotionId[]; occasion?: Occasion; sentence?: string; starred?: boolean; notForMe?: boolean; tags?: string[] };
  const ctx = (daysAgo: number, hour: number, families: FamilyId[], o: CaptureOpts) => {
    const d = new Date(now); d.setDate(d.getDate() - daysAgo);
    const season = seasonOf(d);
    const daypart = dp(hour);
    const tags = [...autoTags({ season, daypart, room: o.room, occasion: o.occasion, families, emotions: o.emotions }), ...(o.tags ?? [])];
    return { season, daypart, occasion: o.occasion, emotions: o.emotions, tags: Array.from(new Set(tags)) };
  };
  const product = (daysAgo: number, hour: number, families: FamilyId[], brand: string, scent: string, source: SourceKind, situation: string, o: CaptureOpts): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred: !!o.starred, families,
    room: o.room, source, situation, feeling: o.notForMe ? "not-for-me" : "loved",
    what: { mode: "product", productName: `${brand} ${scent}`, scentName: scent }, sentence: o.sentence ?? "", momentName: situation,
    ...ctx(daysAgo, hour, families, o),
  });
  const method = (daysAgo: number, hour: number, families: FamilyId[], m: MethodId, situation: string, o: CaptureOpts & { text?: string }): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred: !!o.starred, families,
    room: o.room, source: "other", situation, feeling: o.notForMe ? "not-for-me" : "loved",
    what: { mode: "method", method: m, text: o.text ?? "" }, sentence: o.sentence ?? "", momentName: situation,
    ...ctx(daysAgo, hour, families, o),
  });

  return [
    // this week
    room(0, 21, ["woody", "spicy"], "rain, chapter three", "night", { preset: "reading-night", starred: true, strength: 80 }),
    product(0, 21, ["woody", "spicy"], "Le Labo", "Santal 26", "candle", "Reading after work", { room: "reading", emotions: ["cozy", "focused"], occasion: "everyday", sentence: "The room smelled like a library with the lights low.", starred: true, tags: ["afterwork"] }),
    room(1, 8, ["citrus", "green"], "first coffee", "morning", { scene: "kitchen", source: "diffuser", starred: true, windowOpen: true }),
    method(1, 18, ["spicy", "citrus"], "simmer", "First cold evening", { room: "kitchen", emotions: ["nostalgic", "cozy"], sentence: "Orange peel, two cinnamon sticks, the radio on.", tags: ["firstcold"] }),
    product(2, 7, ["citrus", "green"], "Jo Malone London", "Lime Basil & Mandarin", "diffuser", "Breakfast, window open", { room: "kitchen", emotions: ["energized"], occasion: "everyday" }),
    room(3, 22, ["green", "fresh"], "long bath", "night", { scene: "bathroom", source: "candle" }),
    room(4, 15, ["woody", "green"], "desk, late afternoon", "afternoon", { preset: "study-afternoon", strength: 55 }),
    method(4, 9, ["fresh", "green"], "window", "Window open after rain", { room: "bedroom", emotions: ["fresh-start"], tags: ["rainyday"] }),
    product(5, 22, ["woody"], "Diptyque", "Feu de Bois", "candle", "Too smoky for sleep", { room: "bedroom", emotions: ["restless"], occasion: "sleep", notForMe: true, sentence: "Lovely in the living room, too much by the bed." }),
    room(6, 9, ["citrus", "fresh"], "sunday sheets", "morning", { preset: "bedroom-morning", starred: true, windowOpen: true }),
    method(6, 15, ["floral"], "flowers", "Peonies from the market", { room: "living", emotions: ["romantic", "calm"], starred: true, tags: ["sunday"] }),
    product(7, 20, ["floral", "fresh"], "Westin", "White Tea", "diffuser", "Hotel lobby at home", { room: "entryway", emotions: ["calm"], occasion: "guests", starred: true, sentence: "Guests noticed it before they took their coats off." }),
    room(8, 22, ["gourmand", "spicy"], "record on side two", "night", { preset: "living-night" }),
    product(9, 18, ["spicy", "citrus"], "NEST New York", "Holiday", "candle", "First winter dinner", { room: "living", emotions: ["cozy", "playful"], occasion: "guests", tags: ["holiday"] }),
    // last month
    method(10, 11, ["fresh"], "laundry", "Sheets just off the line", { room: "closet", emotions: ["calm", "safe"] }),
    product(11, 13, ["citrus"], "Saje", "Liquid Sunshine", "oil", "Afternoon slump, three drops", { room: "office", emotions: ["energized", "focused"], occasion: "work", tags: ["afterlunch"] }),
    room(12, 16, ["citrus", "spicy"], "orange peel simmer", "afternoon", { preset: "kitchen-morning" }),
    method(13, 16, ["gourmand"], "baking", "Banana bread, second batch", { room: "kitchen", emotions: ["playful", "safe"], sentence: "The whole flat smelled like Sunday." }),
    product(14, 23, ["green"], "MUJI", "Lavender essential oil", "oil", "Lights out", { room: "bedroom", emotions: ["calm", "safe"], occasion: "sleep", starred: true }),
    room(16, 17, ["floral", "gourmand"], "a slow sunday", "afternoon", { source: "spray", strength: 60 }),
    method(17, 7, ["fresh", "green"], "rain", "After the storm", { room: "balcony", emotions: ["grounded"], tags: ["rainyday"] }),
    product(18, 10, ["green", "spicy"], "Aesop", "Olous room spray", "spray", "Two sprays after the shower", { room: "bathroom", emotions: ["fresh-start"], occasion: "bath" }),
    room(20, 21, ["green", "fresh"], "eucalyptus steam", "night", { preset: "bath-evening", starred: true }),
    method(22, 19, ["citrus"], "other", "Orange peel on the radiator", { room: "living", emotions: ["playful"], text: "orange peel on the radiator" }),
    product(24, 21, ["spicy", "woody"], "Maison Margiela Replica", "By the Fireplace", "candle", "Movie night", { room: "living", emotions: ["nostalgic", "cozy"], occasion: "date", sentence: "Chestnuts and smoke, a blanket for two." }),
    room(27, 21, ["woody", "spicy"], "first fire of the year", "night", { source: "candle", strength: 85 }),
    product(30, 16, ["gourmand"], "Yankee Candle", "Vanilla Cupcake", "candle", "Too sweet for the whole house", { room: "kitchen", emotions: ["restless"], notForMe: true }),
    method(33, 8, ["green"], "window", "Pine trail, windows down", { room: "car", emotions: ["energized"], tags: ["weekendtrip"] }),
    room(36, 15, ["woody", "citrus"], "exam week", "afternoon", { source: "diffuser", strength: 50 }),
    method(40, 17, ["floral", "green"], "flowers", "Lilies on the desk", { room: "study", emotions: ["focused", "romantic"] }),
  ];
}
