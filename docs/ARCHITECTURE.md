# Olfia — Architecture (v0.9)

**Status:** v0.9. Last updated 2026-11-02. Keep this under two pages; decisions go to `DECISIONS.md`.

## 1. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript | Vercel-native, SEO/OG for public pages, serverless routes for the optional AI suggestion, accounts later without re-architecture |
| Styling | Tailwind CSS v4 with tokens in `app/globals.css` (`@theme`) | Tokens in one place; utilities everywhere |
| Fonts | Google Fonts stylesheet (Lora, Newsreader, Source Sans 3) linked in `app/layout.tsx`; CSS variables `--font-lora` etc. in `globals.css` | `next/font/google` failed on Vercel's first build (font-file URL parse error in the loader); the stylesheet link is deterministic. Revisit `next/font` once verified locally |
| State | `zustand` store persisted to `localStorage` (`persist` middleware), hydrated client-side | Simple, SSR-safe, migration hook |
| Export | `html-to-image` (`toPng`) on an offscreen 540×675 node, `pixelRatio: 2` | Pure client; same-origin assets only |
| Analytics | GA4 via `@next/third-parties/google` (`GoogleAnalytics`, `sendGAEvent`) | Official, minimal |
| Hosting | Vercel (Hobby), GitHub → auto deploy; `main` = production, PRs = preview | First push is live |
| Content | JSON in `content/`, strings in `lib/strings.ts` | No CMS needed for one editor; i18n-ready |

Node 22. Package manager: npm. No ESLint in the build path for Nov 10 (`eslint.ignoreDuringBuilds`); type errors still fail the build.

## 2. Repository layout

```
olfia/ (repo root)
  app/                 routes (App Router)
    layout.tsx         fonts, header/footer, GA
    page.tsx           landing
    rooms/page.tsx     scene picker
    rooms/[sceneId]/page.tsx   composer (client component inside)
    capture/page.tsx
    atlas/page.tsx
    atlas/[entryId]/page.tsx
    about/page.tsx  privacy/page.tsx  not-found.tsx
    api/suggest/route.ts       (Could)
    globals.css        tokens + base styles
  components/          ui/ (Button, Chip, Sheet, Field…), rooms/ (Stage, SlotChips, OptionSheet, LightSwitch), card/ (SceneCard), atlas/
  content/             scenes.json, moods.json (Should), notes/*.md (Should)
  lib/                 types.ts, store.ts, catalog.ts, export.ts, analytics.ts, strings.ts
  public/              scenes/<sceneId>/<slotId>/<optionId>.webp, og.png, favicon
  docs/                PRD, DESIGN-SPEC, ARCHITECTURE, DECISIONS, ACCEPTANCE, AI-USE-LOG
```

## 3. Data model

```ts
// lib/types.ts (authoritative copy lives in code)
export type EntryType = "capture" | "rooms";

interface EntryBase {
  id: string;             // crypto.randomUUID()
  schemaVersion: 1;
  type: EntryType;
  title: string;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
}

export interface CaptureEntry extends EntryBase {
  type: "capture";
  room: string;                               // from a fixed list or free text
  scentSource: { kind: ScentSourceKind; label?: string };
  note: string;                               // <= 140 chars
  intention?: IntentionId[];
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  verdict?: "not-for-me" | "fine" | "keep";
  descriptors?: string[];                     // <= 3
}

export interface RoomsEntry extends EntryBase {
  type: "rooms";
  sceneId: string;
  selections: Record<string, string | null>;  // slotId -> optionId | null (none)
  light: string;                              // lightPresetId
  mood?: string;                              // moodId if a suggestion was used
}

export type Entry = CaptureEntry | RoomsEntry;
```

Catalog types (`Scene`, `Slot`, `Option`, `LightPreset`, `Mood`) mirror `DESIGN-SPEC.md` §5 and are loaded from `content/scenes.json` (typed at import).

**Storage:** key `olfia.atlas.v1` → `{ schemaVersion: 1, entries: Entry[] }`. The store exposes `add`, `update`, `remove`, `getById`, `exportJson`. A `migrate(fromVersion)` hook runs on load; v1 is the first version. Quota or unavailable storage (private mode) → in-memory fallback + persistent notice.

**January path:** entries move to Supabase (`entries` table with the same JSON shape in a `payload` column + `user_id`); magic-link email sign-in; a one-time "import entries from this browser" action. No change to components.

## 4. Key flows

- **Composer state** is local component state until Save; Save builds a `RoomsEntry` and calls `store.add`.
- **Scene rendering** is one `Stage` component: `scene` + `selections` + `light` → three absolutely positioned planes of `<img>` cut-outs (next/image with fixed dimensions), glow layer for `emitsLight` options, wash layer with CSS `mix-blend-mode`, grain layer, frame. The same component renders the Scene Card at 2× for export (`variant="card"`).
- **Export:** render `<SceneCard>` in an offscreen container (fixed 540×675, fonts loaded via `document.fonts.ready`), `toPng(node, { pixelRatio: 2, cacheBust: true })` → Blob → `navigator.share({ files })` when `canShare` supports files, else `<a download>`. Errors → toast with retry. Assets must be same-origin (they are).
- **Suggestions (Should):** `moods.json` → apply `selections` + `light`; `from_suggestion` recorded on the entry.
- **LLM route (Could):** `POST /api/suggest` with `{ sceneId, moodText }`; server builds a prompt from the scene catalog, calls the model with a JSON schema that only allows known option/preset ids, validates with `zod`, returns `{ selections, light, line }`. Rate limit by IP (simple in-memory token bucket, 10/min), daily cost cap via env, fallback to presets on any failure. Key in `OLFIA_LLM_API_KEY` (server only).
- **Analytics:** `lib/analytics.ts` wraps `sendGAEvent` with the typed events from PRD §9; no-ops when `NEXT_PUBLIC_GA_ID` is unset.

## 5. Environment and secrets

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | public | GA4 measurement id (G-…) |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URL for OG and Scene Card footer |
| `NEXT_PUBLIC_FEEDBACK_URL` | public | Feedback form link |
| `OLFIA_LLM_API_KEY` | server | Only if the LLM route ships |

Set in Vercel project settings; never committed. `.env.example` lists them.

## 6. Deployment

- GitHub repo `olfia` (private is fine; the site is public). Vercel project `olfia` connected to the repo; production = `main`; every PR gets a preview URL.
- Until the GitHub connection exists, deployments go through the Vercel API from source files (how the first placeholder was published).
- Release tags: `v0.1-preview` (11/4), `v0.9-submission` (11/9), `v1.0-public` (after revision week).
- Custom domain: add in Vercel → Domains when bought; set `NEXT_PUBLIC_SITE_URL`.

## 7. Performance and quality budgets

- Scene assets ≤ 1.5 MB per scene; cut-outs ≤ 80 KB WebP; `next/image` with explicit `width/height`.
- First screen interactive < 3 s on 4G; Lighthouse Performance ≥ 80, Accessibility ≥ 90 on key routes.
- Manual acceptance per `ACCEPTANCE.md` on iOS Safari, Android Chrome, macOS Safari, desktop Chrome, plus one WeChat in-app browser open.
- Optional later: Playwright smoke test for the two journeys.

## 8. Options held in reserve

- **Instructor wants a CMS:** add Sanity (free tier) for Notes and scene descriptions; Next.js fetches at build/ISR. +0.5–1 day. Alternative: Notion as a headless source via its API.
- **Instructor insists on WordPress:** WordPress.com for editorial pages on the main domain, this app on `app.` subdomain, shared header links. +1.5–2 days.
