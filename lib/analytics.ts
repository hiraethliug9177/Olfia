"use client";

import { sendGAEvent } from "@next/third-parties/google";

type Mode = "capture" | "rooms";

type EventMap = {
  mode_entered: { mode: Mode };
  creation_complete: { mode: Mode; scene_id?: string };
  scent_card_export: { mode: Mode | "none"; method: "download" | "share"; ratio: "9:16" | "3:4" };
  entry_deleted: { mode: Mode };
  quiz_complete: { code: string; family: string };
  quiz_share: { method: "download" | "share" };
};

const enabled = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_GA_ID);

export function track<K extends keyof EventMap>(name: K, params: EventMap[K]): void {
  if (!enabled) return;
  try {
    sendGAEvent("event", name, params as Record<string, unknown>);
  } catch {
    // analytics must never break the product
  }
}
