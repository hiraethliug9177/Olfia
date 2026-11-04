# Decisions log

One line per decision: date · decision · why. Newest first. Proposals are not decisions until confirmed by Tiffany.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-11-03 | Basic v3 build ships on branch `v3-design` as a Vercel preview only; production stays on the 11/2 build until Tiffany approves | Presentation safety; canvas remains backup |
| 2026-11-03 | Visual direction v3: near-white Ivory ground, periwinkle interface, earthy photo cut-outs with white die-cut edge on cream paper; drawn SVG stand-ins until lovart assets arrive | Tiffany's review of the v2 mockup ("过头了", prefers whiter background) |
| 2026-11-03 | Free drag placement in Rooms is allowed (replaces preset slots); still one fixed front view per scene, no true 3D | Tiffany's request after the mockup review |
| 2026-11-03 | "Scene Card" is renamed **Scent Card**; share ratios 9:16 and portrait 3:4 | Tiffany's spec |
| 2026-11-03 | Seven scent families (floral, gourmand, spicy, woody, green, citrus, fresh) in wheel order with a colour each; scent aura + material stickers in scope for 11/10 | Research on fragrance-wheel families; Tiffany approved |
| 2026-11-03 | Home order: hero → 7 families → Capture invite → Rooms gallery → Scent Card gallery → footer; Home icon kept in nav; mobile header = Capture, Rooms, account icon + menu | Tiffany's answers on the canvas |
| 2026-11-03 | Selected nav state uses Periwinkle deep #4C527A, not charcoal | Tiffany: keeps the overall style consistent |
| 2026-11-03 | localStorage key moves to `olfia.atlas.v2` (schemaVersion 2) for the new Capture/Rooms shapes; v1 entries are not migrated in the preview | No real user data yet |
| 2026-11-03 | Scent Library is public; Instagram and 小红书 are icon placeholders until accounts exist | Tiffany's answers |
| 2026-11-02 | Fonts via the Google Fonts stylesheet link, not `next/font/google`, until the build is verified locally | First Vercel build failed inside the next/font loader (font-file URL parse error) |
| 2026-11-02 | Stack: Next.js (App Router) + TypeScript + Tailwind v4; GitHub → Vercel | Vercel-native, serverless route for AI, SEO/OG, accounts later without re-architecture |
| 2026-11-02 | Rooms scenes in 2D scrapbook/collage style; one fixed view per scene; preset slots; no free placement or multiple angles in 2026 | Collage tolerates mixed AI-generated assets; free placement and extra angles double assets and add drag/positioning complexity; the plan already deferred free movement |
| 2026-11-02 | Cut-outs generated with external AI image tools (lovart.ai or similar) using one locked style prompt, background removed afterwards; SVG silhouettes remain the fallback | No illustration budget; collage style absorbs variance |
| 2026-11-02 | Bounded AI for 11/10 = curated preset suggestions; an LLM route only if the core is stable by 11/7 | Zero cost and risk; LLM is additive |
| 2026-11-02 | Figma is not design-first; built pages are imported into Figma after 11/10 for the mobile prototype and presentation | 1.5 days to the first demo; Figma→code round-trip would not fit |
| 2026-11-02 | Saving = localStorage with schemaVersion/id/type/timestamps and JSON export; database in January | Matches the plan's same-browser saving; migration path kept |
| 2026-11-02 | Domain: Tiffany will buy one; not blocking; `olfia.vercel.app`-style URL until then | — |
| 2026-11-02 | Design tokens live in `docs/DESIGN-SPEC.md` and `app/globals.css`; the Notion colour/type page is retired | One source of truth |
| 2026-11-02 | GPT-era markdown files are archived, not used as build inputs; the 11/1 review drafts are background only | They describe process and status, not product |
| 2026-11-02 | Ask the instructor on 11/4 whether a custom-coded interactive site satisfies the syllabus "sophisticated CMS" clause; fallback options in ARCHITECTURE §8 | Syllabus wording; "alternative ideas acceptable with instructor approval" |
