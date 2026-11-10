import type { FamilyId } from "@/lib/types";

/**
 * Colour pairs for filled buttons and panels (2026-11-10: Tiffany asked for the whole palette to
 * show up in buttons and sections, with body text and page background unchanged).
 * Every pair here passes WCAG AA for 16–17px text (checked 11/10):
 * dark fills carry white text, light fills carry charcoal.
 */
export interface Pair { bg: string; fg: string }

const INK = "#292A31";
const WHITE = "#FFFFFF";

/** A family's colour as a button fill. Green is one step darker so white text stays legible. */
export const FAMILY_FILL: Record<FamilyId, Pair> = {
  floral: { bg: "#C98A8A", fg: INK },
  gourmand: { bg: "#D4A26A", fg: INK },
  spicy: { bg: "#B4552E", fg: WHITE },
  woody: { bg: "#8A5A33", fg: WHITE },
  green: { bg: "#5F6E30", fg: WHITE },
  citrus: { bg: "#E2A23B", fg: INK },
  fresh: { bg: "#8FB5B8", fg: INK },
};

/** A very light wash of a family colour, for panels that hold charcoal and slate text. */
export const FAMILY_WASH: Record<FamilyId, string> = {
  floral: "#F4E1E1",
  gourmand: "#F7E9D6",
  spicy: "#F2DCD0",
  woody: "#EEE3D7",
  green: "#E3E8D3",
  citrus: "#F8E8C6",
  fresh: "#DCEAEB",
};
