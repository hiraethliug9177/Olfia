import { baseLayout, stickersFor } from "@/lib/catalog";
import { newId } from "@/lib/store";
import type { CaptureEntry, Entry, FamilyId, RoomsEntry, TimeOfDay } from "@/lib/types";

/** Sample pages for demos and empty states. Spread over the last ~5 weeks, relative to today. */
export function sampleEntries(now: Date = new Date()): Entry[] {
  const at = (daysAgo: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const room = (daysAgo: number, hour: number, families: FamilyId[], nickname: string, time: TimeOfDay, source: string, starred = false): RoomsEntry => ({
    id: newId(), schemaVersion: 2, type: "rooms", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred, families,
    sceneId: "reading-corner", nickname, items: [...baseLayout(source), ...stickersFor(families)], strength: 70, time, windowOpen: false,
  });
  const product = (daysAgo: number, hour: number, families: FamilyId[], productName: string, scentName: string, situation: string, source: CaptureEntry["source"], starred = false): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred, families,
    room: "living", source, situation, feeling: "loved", what: { mode: "product", productName, scentName }, sentence: "",
  });
  const method = (daysAgo: number, hour: number, families: FamilyId[], m: "window" | "simmer" | "flowers" | "laundry" | "baking" | "rain", situation: string): CaptureEntry => ({
    id: newId(), schemaVersion: 2, type: "capture", createdAt: at(daysAgo, hour), updatedAt: at(daysAgo, hour), starred: false, families,
    room: "kitchen", source: "other", situation, feeling: "loved", what: { mode: "method", method: m, text: "" }, sentence: "",
  });
  return [
    room(0, 21, ["woody", "spicy", "gourmand"], "rain, chapter three", "night", "candle", true),
    product(0, 21, ["woody", "spicy"], "Cedar & Clove candle", "Cedar & Clove", "Reading after work", "candle", true),
    room(2, 8, ["citrus", "green"], "first coffee", "morning", "diffuser", true),
    method(3, 18, ["spicy", "citrus"], "simmer", "First cold evening"),
    room(5, 16, ["floral", "gourmand"], "a slow sunday", "afternoon", "spray"),
    product(7, 22, ["fresh"], "Sea salt reeds", "Sea Salt", "Bathroom, after a long shower", "diffuser", true),
    method(9, 10, ["fresh"], "laundry", "Sheets just off the line"),
    product(11, 20, ["gourmand"], "Vanilla tonka oil", "Vanilla Tonka", "Too sweet for summer", "oil"),
    room(13, 21, ["woody", "green"], "desk, late", "night", "incense"),
    method(16, 15, ["gourmand"], "baking", "Banana bread"),
    product(19, 9, ["citrus"], "Neroli room spray", "Neroli", "Two sprays, not three", "spray", true),
    method(23, 16, ["floral"], "flowers", "Peonies from the market"),
    room(27, 21, ["woody", "spicy"], "first fire of the year", "night", "candle"),
    method(31, 7, ["fresh", "green"], "rain", "After the storm"),
  ];
}
