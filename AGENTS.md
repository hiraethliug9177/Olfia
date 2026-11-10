# Olfia — conventions for coding agents

Read `CLAUDE.md` first (stack, terms, data rules). This file holds conventions every agent follows.

## Icons (Tiffany, 2026-11-10)

- Use **Lucide** as the default and only icon library: `lucide-react` in this Next.js project. Browse at https://lucide.dev/icons/.
- Prefer Lucide icons over emojis, other icon libraries, or custom icon assets. Brand marks Lucide does not ship (e.g. 小红书, X) are the only exception.
- Sizes: **20px** for interface controls, **24px** for primary navigation.
- Stroke: **1.5** (`strokeWidth={1.5} absoluteStrokeWidth`) for a refined, minimal editorial style.
- Keep spacing, alignment and colours consistent: icons inherit `currentColor`; interactive colour is periwinkle-deep `#4C527A`.
- SVG only, never raster icons.
- Import only the icons a component needs (named imports, e.g. `import { Undo2 } from "lucide-react"`). The shared wrapper is `components/ui/Icon.tsx`; add new names there.
- Accessibility: icon-only buttons carry `aria-label`; the icon itself is `aria-hidden`.
- Motion: icon swaps (Menu ↔ X) cross-fade and turn at 1× speed (≈0.3 s), and stop under `prefers-reduced-motion`.

## Type (2026-11-10)

- Three faces only: **Newsreader** (page and article titles, names of works), **IBM Plex Mono** (navigation, body, questions, buttons, dates, charts), **Caveat Bold** (notes, ideas, quick handwriting).
- No all-caps labels; no single italic word inside headings.

## Look

- Analog: film grain over every page, frosted-glass panels, a slow three-colour backdrop, a warm light leak on the hero board. No soft-focus or defocus blur on content or images (removed 11/10). Keep the grain light enough that body text stays sharp.
- The family dial keeps plain colour circles in its holes (no photos).
