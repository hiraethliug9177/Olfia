# Olfia — instructions for coding agents

Read `docs/PRD.md`, `docs/DESIGN-SPEC.md`, and `docs/ARCHITECTURE.md` before changing anything. This file is the short version.

- Stack: Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4 (tokens in `app/globals.css` `@theme`), zustand + localStorage, html-to-image, GA4 via `@next/third-parties`. npm. Node 22.
- Commands: `npm run dev`, `npm run typecheck`, `npm run build`. Type errors fail the build; run typecheck before finishing.
- Terms, exactly: **Scent Scene**, **Rooms**, **Scent Atlas**, **Scent Card** (renamed from Scene Card on 2026-11-03). Never use: Scent Profile, Room Profile, Scent Direction, Experience Record.
- Design: ivory canvas, charcoal text; `periwinkle` (#A0A6C8) is decorative only — never text or meaningful icons; interactive colour is `periwinkle-deep` (#4C527A). Fonts (since 2026-11-09, three only): Newsreader (titles, work names), IBM Plex Sans (everything in the interface and body), Caveat Bold (notes and quick handwriting). No monospace, no all-caps labels, no single italic word in headings. Icons: lucide geometry, stroke 2 (`components/ui/Icon.tsx`). Minimum text 13px. Signature double frame only on the Rooms stage and Scene Card.
- Rooms: one fixed front view per scene, free drag placement (since v3), morning/afternoon/night light; no multiple angles, no true 3D. Catalog in `content/scenes.json`, types in `lib/types.ts`.
- Data: entries in localStorage key `olfia.atlas.v2` (v3 build), shape in `lib/types.ts`; no accounts, no server storage in this release.
- Do not add: accounts, databases, payments, social features, photo upload, health or safety claims, new product terms.
- Content strings are Tiffany's. If copy is missing, insert a clear `TODO(Tiffany)` placeholder rather than inventing brand copy.
- Keep `docs/DECISIONS.md` updated with one line per decision; log AI sessions in `docs/AI-USE-LOG.md`.
