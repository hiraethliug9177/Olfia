/**
 * Olfia data model (design v3, 2026-11-03).
 * Product terms: Scent Scene (Capture output), Rooms, Scent Atlas, Scent Card.
 * Retired terms must not appear here: Scent Profile, Room Profile, Scent Direction, Experience Record, Scene Card.
 */

export type FamilyId = "floral" | "gourmand" | "spicy" | "woody" | "green" | "citrus" | "fresh";

export type SourceKind = "candle" | "diffuser" | "incense" | "spray" | "oil" | "fragrance-free" | "other";

export type RoomKind =
  | "bedroom" | "living" | "kitchen" | "bathroom" | "study" | "reading" | "entryway"
  | "closet" | "balcony" | "car" | "office" | "other";

/** Capture context (added 2026-11-09 from the 11/4 feedback). */
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Daypart = "morning" | "afternoon" | "evening" | "night";
export type Occasion =
  | "everyday" | "date" | "party" | "meditation" | "bath" | "sleep" | "work" | "guests" | "cleaning" | "holiday";
export type EmotionId =
  | "calm" | "cozy" | "focused" | "nostalgic" | "energized" | "romantic"
  | "melancholy" | "playful" | "grounded" | "fresh-start" | "restless" | "safe";

export type TimeOfDay = "morning" | "afternoon" | "night";

export type MethodId = "window" | "simmer" | "flowers" | "laundry" | "baking" | "rain" | "other";

interface EntryBase {
  id: string;
  schemaVersion: 2;
  createdAt: string;
  updatedAt: string;
  starred: boolean;
  families: FamilyId[];
}

export type CaptureWhat =
  | { mode: "product"; productName: string; scentName: string }
  | { mode: "method"; method: MethodId; text: string };

/** Capture output: a Scent Scene. */
export interface CaptureEntry extends EntryBase {
  type: "capture";
  room: RoomKind;
  source: SourceKind;
  situation: string;
  feeling: "loved" | "not-for-me";
  what: CaptureWhat;
  sentence: string;
  /* Added 2026-11-09; optional so entries saved before then still read. */
  season?: Season;
  daypart?: Daypart;
  occasion?: Occasion;
  emotions?: EmotionId[];
  momentName?: string;
  tags?: string[];
}

/** One thing placed on a Rooms page. x/y are 0–1 of the stage; the anchor is the item's bottom centre. */
export interface PlacedItem {
  uid: string;
  kind: string;
  x: number;
  y: number;
  scale: number;
  rot: number;
  flip: 1 | -1;
  z: number;
}

export interface RoomsEntry extends EntryBase {
  type: "rooms";
  sceneId: string;
  nickname: string;
  items: PlacedItem[];
  strength: number;
  time: TimeOfDay;
  windowOpen: boolean;
}

export type Entry = CaptureEntry | RoomsEntry;
