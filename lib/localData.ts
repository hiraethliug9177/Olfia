"use client";

import { STORAGE_KEY } from "@/lib/store";
import { SHELF_KEY } from "@/lib/shelf";
import { PREFS_KEY } from "@/lib/prefs";
import { QUIZ_KEY } from "@/lib/quiz";
import { ME_KEY } from "@/lib/analytics";

/**
 * Everything Olfia keeps in this browser, for Settings → Export my data and Clear this browser (copy v1, 11/24:
 * "Clear all your locally saved Olfia data?"). Every key starts with "olfia." (the Privacy page lists them).
 * The analytics switch (?me=on, ME_KEY) is the site owner's measurement setting, not a visitor's data: it is
 * left in place so clearing test data does not start counting the owner's own visits.
 */
const PREFIX = "olfia.";

function olfiaKeys(store: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k && k.startsWith(PREFIX) && k !== ME_KEY) keys.push(k);
  }
  return keys;
}

function parse(raw: string | null): unknown {
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return raw; }
}

/** One JSON file: the Scent Atlas entries, the Fragrance Shelf, My Preferences, the quiz result, then small settings. */
export function exportAllData(): string {
  const read = (k: string) => {
    try { return parse(window.localStorage.getItem(k)); } catch { return null; }
  };
  const atlas = read(STORAGE_KEY) as { state?: { entries?: unknown[] } } | null;
  const named = new Set([STORAGE_KEY, SHELF_KEY, PREFS_KEY, QUIZ_KEY]);
  const settings: Record<string, unknown> = {};
  try {
    olfiaKeys(window.localStorage).filter((k) => !named.has(k)).forEach((k) => { settings[k] = read(k); });
  } catch {
    // storage blocked: export what could be read
  }
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      entries: atlas?.state?.entries ?? [],
      fragranceShelf: read(SHELF_KEY) ?? [],
      preferences: read(PREFS_KEY),
      quizResult: read(QUIZ_KEY),
      settings,
    },
    null,
    2,
  );
}

/** Removes every Olfia key from this browser's local and tab storage (the Scent Atlas entries are cleared by the caller's store). */
export function clearAllData(): void {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try { olfiaKeys(store).forEach((k) => store.removeItem(k)); } catch { /* storage blocked */ }
  }
}
