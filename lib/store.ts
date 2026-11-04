"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Entry } from "@/lib/types";

/** v2 = design v3 data model (2026-11-03). v1 entries from the earlier build are not read. */
export const STORAGE_KEY = "olfia.atlas.v2";

type AtlasState = {
  entries: Entry[];
  hydrated: boolean;
  add: (entry: Entry) => void;
  replace: (entry: Entry) => void;
  remove: (id: string) => void;
  toggleStar: (id: string) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
};

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAtlas = create<AtlasState>()(
  persist(
    (set) => ({
      entries: [],
      hydrated: false,
      add: (entry) => set((s) => ({ entries: [entry, ...s.entries] })),
      replace: (entry) =>
        set((s) => ({
          entries: s.entries.some((e) => e.id === entry.id)
            ? s.entries.map((e) => (e.id === entry.id ? entry : e))
            : [entry, ...s.entries],
        })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      toggleStar: (id) =>
        set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)) })),
      clear: () => set({ entries: [] }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ entries: s.entries }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Mount once (in the root layout) to load saved entries on the client. */
export function useRehydrateAtlas(): void {
  useEffect(() => {
    try {
      void useAtlas.persist.rehydrate();
    } catch {
      useAtlas.getState().setHydrated(true);
    }
    const t = window.setTimeout(() => {
      if (!useAtlas.getState().hydrated) useAtlas.getState().setHydrated(true);
    }, 800);
    return () => window.clearTimeout(t);
  }, []);
}

/** True once the page has mounted on the client (avoids hydration mismatch). */
export function useMounted(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
