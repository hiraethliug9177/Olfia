/**
 * Opening My Scentprint on one tag. Tags can be typed by the person (Capture, up to three), so the tag travels
 * in this tab's sessionStorage instead of the address: Google Analytics records page addresses, and personal
 * text never goes in a URL (privacy rule, 11/15). Links point to /atlas?tab=scentprint and call handOffTag first.
 */
const ATLAS_TAG_KEY = "olfia.atlas.tag";

export function handOffTag(tag: string): void {
  try { window.sessionStorage.setItem(ATLAS_TAG_KEY, tag); } catch { /* storage blocked: the tab still opens */ }
}

export function takeTag(): string | null {
  try {
    const t = window.sessionStorage.getItem(ATLAS_TAG_KEY);
    if (t) window.sessionStorage.removeItem(ATLAS_TAG_KEY);
    return t;
  } catch {
    return null;
  }
}
