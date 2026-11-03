/**
 * Olfia data model — authoritative copy. Mirrors docs/ARCHITECTURE.md §3 and docs/DESIGN-SPEC.md §5.
 * Product terms: Scent Scene (Capture output), Rooms, Scent Atlas, Scene Card. Retired terms must not appear here.
 */

export type EntryType = "capture" | "rooms";

export type ScentSourceKind =
  | "candle"
  | "diffuser"
  | "incense"
  | "spray"
  | "oil"
  | "fragrance-free"
  | "other";

export type IntentionId =
  | "wind-down"
  | "focus"
  | "welcome"
  | "fresh-start"
  | "cozy"
  | "clear-the-air";

interface EntryBase {
  id: string;
  schemaVersion: 1;
  type: EntryType;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaptureEntry extends EntryBase {
  type: "capture";
  room: string;
  scentSource: { kind: ScentSourceKind; label?: string };
  note: string;
  intention?: IntentionId[];
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  verdict?: "not-for-me" | "fine" | "keep";
  descriptors?: string[];
}

export interface RoomsEntry extends EntryBase {
  type: "rooms";
  sceneId: string;
  selections: Record<string, string | null>;
  light: string;
  mood?: string;
}

export type Entry = CaptureEntry | RoomsEntry;

/** Persisted shape under localStorage key "olfia.atlas.v1". */
export interface AtlasStorage {
  schemaVersion: 1;
  entries: Entry[];
}

/* ---------- Scene catalog (content/scenes.json) ---------- */

export type Plane = "back" | "mid" | "front";

export interface SceneOption {
  id: string;
  label: string;
  descriptor: string;
  asset: string | null; // null = "none" option (e.g. fresh air)
  emitsLight?: boolean;
  alt: string;
}

export interface SceneSlot {
  id: string;
  label: string;
  plane: Plane;
  anchor: { x: number; y: number }; // percent of stage, bottom-centre of the cut-out
  width: number; // percent of stage width
  z: number;
  allowNone: boolean;
  options: SceneOption[];
}

export interface LightPreset {
  id: string;
  name: string;
  wash: string;
  blend: "soft-light" | "multiply" | "overlay" | "normal";
  opacity: number;
  shadowTint: string;
  glow: { color: string; opacity: number } | null;
}

export interface Mood {
  id: string;
  name: string;
  line: string;
  selections: Record<string, string | null>;
  light: string;
}

export interface Scene {
  id: string;
  name: string;
  line: string;
  background: string;
  defaults: Record<string, string | null>;
  defaultLight: string;
  slots: SceneSlot[];
  lights: LightPreset[];
  moods: Mood[];
}

export interface SceneCatalog {
  version: 1;
  scenes: Scene[];
}
