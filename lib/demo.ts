import { sampleEntries } from "@/lib/sample";
import { loadShelf, saveShelf, type ShelfItem } from "@/lib/shelf";
import { productById } from "@/lib/products";
import { ARCHETYPES, loadQuiz, saveQuiz } from "@/lib/quiz";
import { newId, useAtlas } from "@/lib/store";
import { markSample } from "@/lib/mockAuth";

/**
 * Sample pages on request (Tiffany 11/15: first visits start clean; the "See a sample" button in the
 * Scent Atlas and the ?sample=on link load them; the link is the one for the professor). Adds the sample
 * Atlas pages if the Atlas is empty, four My shelf products if the shelf is empty, preferences if none are set,
 * and (11/18, for the class demo) a quiz result if the quiz has not been taken, so My Page and Gifts show a
 * character. Everything stays in this browser; "Clear this browser" in My Page removes it.
 * (11/10–11/15 the samples loaded by themselves on a first visit, for the class review.)
 */
const PREFS_KEY = "olfia.prefs.v1";

function shelfItem(productId: string, routine: ShelfItem["routine"], note: string, daysAgo: number): ShelfItem | null {
  const p = productById(productId);
  if (!p) return null;
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id: newId(), createdAt: d.toISOString(), name: p.name, brand: p.brand, kind: p.type, families: p.families, routine, note, url: p.url, productId: p.id };
}

/**
 * Preferences and shelf right away (pages read them on mount); pages once the Atlas has loaded.
 * `onDone(added)` reports whether sample pages went into the Atlas (false when it already held pages).
 */
export function loadSample(onDone?: (added: boolean) => void): void {
  // v2 (11/23): asking for the samples puts this browser in sample mode, where the mock sign-in shows (answer 17)
  markSample(true);
  try {
    if (!window.localStorage.getItem(PREFS_KEY)) {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ families: ["woody", "citrus", "green"], sources: ["candle", "diffuser"] }));
    }
    if (!loadQuiz()) {
      // The Strategist, woody first and citrus second: the sample pages lean woody, citrus and green
      const archetype = ARCHETYPES.find((a) => a.code === "INTJ");
      const taken = new Date();
      taken.setDate(taken.getDate() - 23);
      if (archetype) {
        saveQuiz({
          code: "INTJ", archetype, family: "woody", second: "citrus",
          scores: { woody: 11, citrus: 7, green: 6, spicy: 4, fresh: 3, floral: 2, gourmand: 1 },
          takenAt: taken.toISOString(),
        });
      }
    }
    if (loadShelf().length === 0) {
      const items = [
        shelfItem("lelabo-santal26", "evenings", "The one I light first.", 2),
        shelfItem("saje-liquid-sunshine", "mornings", "Three drops before work.", 9),
        shelfItem("westin-white-tea", "daily", "Entryway, always on.", 15),
        shelfItem("diptyque-figuier", "weekends", "Sunday mornings only.", 21),
      ].filter((x): x is ShelfItem => !!x);
      saveShelf(items);
    }
  } catch {
    onDone?.(false);
    return;
  }
  const fill = () => {
    const empty = useAtlas.getState().entries.length === 0;
    if (empty) useAtlas.setState({ entries: sampleEntries() });
    onDone?.(empty);
  };
  if (useAtlas.getState().hydrated) fill();
  else {
    const stop = useAtlas.subscribe((s) => {
      if (s.hydrated) { stop(); fill(); }
    });
  }
}
