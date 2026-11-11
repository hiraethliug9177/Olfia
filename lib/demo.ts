import { sampleEntries } from "@/lib/sample";
import { loadShelf, saveShelf, type ShelfItem } from "@/lib/shelf";
import { productById } from "@/lib/products";
import { newId, useAtlas } from "@/lib/store";

/**
 * Sample data on a first visit (Tiffany 11/10: this version is for the professor's review, so the site
 * opens with a lived-in Atlas, shelf and preferences). It runs once per browser: after that, nothing is
 * added again, so "Clear this browser" in My Account empties it for good. Everything stays in this browser.
 */
const DEMO_KEY = "olfia.demo.v1";
const PREFS_KEY = "olfia.prefs.v1";

function shelfItem(productId: string, routine: ShelfItem["routine"], note: string, daysAgo: number): ShelfItem | null {
  const p = productById(productId);
  if (!p) return null;
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return { id: newId(), createdAt: d.toISOString(), name: p.name, brand: p.brand, kind: p.type, families: p.families, routine, note, url: p.url, productId: p.id };
}

/** Seeds once. Preferences and shelf right away (pages read them on mount); pages once the Atlas has loaded. */
export function seedDemo(): void {
  try {
    if (window.localStorage.getItem(DEMO_KEY)) return;
    window.localStorage.setItem(DEMO_KEY, new Date().toISOString());
    if (!window.localStorage.getItem(PREFS_KEY)) {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ families: ["woody", "citrus", "green"], sources: ["candle", "diffuser"] }));
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
    return;
  }
  const fill = () => {
    if (useAtlas.getState().entries.length === 0) useAtlas.setState({ entries: sampleEntries() });
  };
  if (useAtlas.getState().hydrated) fill();
  else {
    const stop = useAtlas.subscribe((s) => {
      if (s.hydrated) { stop(); fill(); }
    });
  }
}
