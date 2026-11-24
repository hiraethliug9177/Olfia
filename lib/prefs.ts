"use client";

import { useEffect, useState } from "react";
import type { FamilyId, SourceKind } from "@/lib/types";

/**
 * My Preferences: the families and product types a person says they like (a selected preference, kept apart from
 * what they record). Stored in this browser only. Since copy v1 (Tiffany 11/24) it lives in Scent Atlas → My
 * Scentprint; before, it was a section of My Page.
 */
export const PREFS_KEY = "olfia.prefs.v1";
export interface Prefs { families: FamilyId[]; sources: SourceKind[] }

export function usePrefs(): [Prefs, (p: Prefs) => void] {
  const [prefs, setPrefs] = useState<Prefs>({ families: [], sources: [] });
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs(JSON.parse(raw) as Prefs);
    } catch {
      // storage unavailable
    }
  }, []);
  const save = (p: Prefs) => {
    setPrefs(p);
    try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* ignore */ }
  };
  return [prefs, save];
}
