import { baseLayout, stickersFor } from "@/lib/catalog";
import { newId } from "@/lib/store";
import type { CaptureEntry, Daypart, EmotionId, Entry, FamilyId, RoomsEntry, TimeOfDay } from "@/lib/types";
import { autoTags, seasonOf } from "@/lib/catalog";

/** Sample pages for demos and empty states. Spread over the last ~5 weeks, relative to today. */
export function sampleEntries(now: Date = new Date()): Entry[] {
  const at = (daysAgo: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const room = (daysAgo: number, hour: number, families: FamilyId[], nickname: string, time: TimeOfDay, source: string, starred = false, sceneId = "reading-corner"): RoomsEntry => ({
    id: newId(), schemaVersion: 2, type: "rooms", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred, families,
    sceneId, nickname, items: [...baseLayout(source, sceneId), ...stickersFor(families)], strength: 70, time, windowOpen: false,
  });
  const dp = (hour: number): Daypart => (hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night");
  const ctx = (daysAgo: number, hour: number, families: FamilyId[], emotions: EmotionId[], room: CaptureEntry["room"]) => {
    const d = new Date(now); d.setDate(d.getDate() - daysAgo);
    const season = seasonOf(d); const daypart = dp(hour);
    return { season, daypart, emotions, tags: autoTags({ season, daypart, room, families, emotions }) };
  };
  const product = (daysAgo: number, hour: number, families: FamilyId[], productName: string, scentName: string, situation: string, source: CaptureEntry["source"], starred = false, emotions: EmotionId[] = ["cozy"]): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred, families,
    room: "living", source, situation, feeling: "loved", what: { mode: "product", productName, scentName }, sentence: "", momentName: situation,
    ...ctx(daysAgo, hour, families, emotions, "living"),
  });
  const method = (daysAgo: number, hour: number, families: FamilyId[], m: "window" | "simmer" | "flowers" | "laundry" | "baking" | "rain", situation: string, emotions: EmotionId[] = ["calm"]): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred: false, families,
    room: "kitchen", source: "other", situation, feeling: "loved", what: { mode: "method", method: m, text: "" }, sentence: "", momentName: situation,
    ...ctx(daysAgo, hour, families, emotions, "kitchen"),
  });
  return [
    room(0, 21, ["woody", "spicy", "gourmand"], "rain, chapter three", "night", "candle", true),
    product(0, 21, ["woody", "spicy"], "Cedar & Clove candle", "Cedar & Clove", "Reading after work", "candle", true, ["cozy", "focused"]),
    room(2, 8, ["citrus", "green"], "first coffee", "morning", "diffuser", true, "kitchen"),
    method(3, 18, ["spicy", "citrus"], "simmer", "First cold evening", ["nostalgic", "cozy"]),
    room(5, 16, ["floral", "gourmand"], "a slow sunday", "afternoon", "spray"),
    product(7, 22, ["fresh"], "Sea salt reeds", "Sea Salt", "Bathroom, after a long shower", "diffuser", true, ["calm", "fresh-start"]),
    method(9, 10, ["fresh"], "laundry", "Sheets just off the line", ["fresh-start"]),
    room(10, 22, ["green", "fresh"], "long bath", "night", "candle", false, "bathroom"),
    product(11, 20, ["gourmand"], "Vanilla tonka oil", "Vanilla Tonka", "Too sweet for summer", "oil", false, ["restless"]),
    room(13, 21, ["woody", "green"], "desk, late", "night", "incense"),
    method(16, 15, ["gourmand"], "baking", "Banana bread", ["playful", "safe"]),
    product(19, 9, ["citrus"], "Neroli room spray", "Neroli", "Two sprays, not three", "spray", true, ["energized"]),
    method(23, 16, ["floral"], "flowers", "Peonies from the market", ["romantic"]),
    room(27, 21, ["woody", "spicy"], "first fire of the year", "night", "candle"),
    method(31, 7, ["fresh", "green"], "rain", "After the storm", ["grounded"]),
  ];
}
