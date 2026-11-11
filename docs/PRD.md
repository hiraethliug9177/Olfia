# Olfia — Product Requirements (MVP, v0.9)

**Status:** v0.9 — enough to build from. Owner: Tiffany Liu. Last updated 2026-11-09 (addendum §0).
**Source of truth for product intent:** `Submitted_Items/04_Business_Plan.pdf` (Parts 01, 05, 06, 09). This PRD translates it into buildable requirements; where they differ, the plan's intent wins and this file gets fixed.
**Companion docs:** `DESIGN-SPEC.md` (tokens, components, scene spec, copy rules), `ARCHITECTURE.md` (stack, data model, deployment), `ACCEPTANCE.md` (release checklist), `DECISIONS.md` (log).

## 0. Addendum 2026-11-09 — response to the 11/4 feedback (supersedes §4–§7 where they conflict)

Design v3 (2026-11-03) already replaced slots with free drag, renamed Scene Card → Scent Card and added Account, Scent Library and About. This addendum adds what the 11/4 progress-report feedback asked for. Tiers: **A** works by 11/10; **B** is clickable with sample data; **C** after 11/10. Full map: `claude/olfia-feedback-and-changes.md` in the Capstone project.

| Area | Requirement | Tier |
| --- | --- | --- |
| Atmosphere | One reusable layer per scent family (colour wash + one slow ambient motion: dust motes, sun spots, petals, leaf shadows, steam, ember glow, water light) behind Rooms scenes, the Capture preview, quiz result and article covers. Stops under `prefers-reduced-motion`. Ambient sound: C | A |
| Capture | One question per screen with a progress bar: season · time of day · room/space · occasion (optional) · scent source · product or method · 1–2 families · up to 2 emotions · keep/let go + moment name (suggested, editable) + optional line + tags. Season and time pre-selected from the clock. The preview reacts to every answer (paper tint, light, source cut-out, material stickers, emotion word, stamp); two families play a colour-blend. Hashtags are generated from the choices plus up to 3 custom tags | A |
| Stamps | Seven SVG postmarks (ring with family name, material silhouette, optional date) on the Capture preview, quiz result, article covers, Atlas tag cards and the summary panel | A |
| Scent quiz | `/quiz`: 20 questions in two layers (12 personality → 16 archetypes; 8 scent → family). Result card (archetype name, Tiffany's line, family colour, stamp, three materials, second note) saved in `olfia.quiz.v1`; Save image / Share via html-to-image; "Open a room with this scent" → `/rooms?family=`. Home shows the invite or the saved result | A |
| The Olfia Edit | `/edit` and `/edit/[slug]`: article list and pages with atmosphere covers, notes & sources, a Rooms link and "Recreate this at home" product cards. Three articles for 11/10 (film × fragrance; hotel signature scents; Christmas 2026). Body text is Tiffany's; TODO box until written | A page · B content |
| Recommended products | Cards from an approved candidate list (`lib/products.ts`): brand, name, type, families, price tier, notes, outbound link. Filters: season, time of day, matches this room (families), similar to this. Shown under Rooms, under articles and in the summary panel. No photos, no affiliate codes yet | B |
| Summary panel ("Your scents at a glance") | Family share, how it felt (emotions), time of day, product types, your tags, "try next" (wheel neighbours not yet used + a fixed pairing) and three matching products. Sample-data switch when the browser is empty. In Account and the Atlas "Tags & profile" tab | B |
| Atlas tags | Tag chips with counts; filter captures by tag; `/atlas?tag=` deep link | A |
| Photo cut-outs | 34 lovart test images in `public/assets` (4 chairs, 5 sources, 18 materials, 7 textures); drawn stand-ins remain for missing items | A |
| Rooms | New tray items: lounge, rocking and slipper chairs; `?family=` start parameter | A |
| Monetization (shown, not live) | Outbound product links; the Edit page as the future home for sponsored stories; premium templates/stamp packs as later options. Explained in the final presentation | B/C |
| Later | Photo upload and product recognition; ambient sound; the other four atmosphere refinements; affiliate links; CMS for the Edit page | C |

> Sections 1–12 below are the original plan of 2026-11-02, kept for the record. Since then Scene Card became **Scent Card**, preset slots became free drag, and the look and the page set grew (see §0, `DECISIONS.md` and the README).

## 1. What Olfia is

Olfia is a consumer-facing website for capturing and creatively exploring scent experiences in living spaces. It connects three things: scent, space, and experience recording. Two independent modes:

- **Capture** — document a current room, its fragrance habits, and a short observation as a **Scent Scene**, with minimal input.
- **Explore & Play** — use **Rooms** to compose the atmosphere of a real or imagined room from prepared visual elements, then save the concept.

Both modes save into the personal **Scent Atlas** and can produce a **Scene Card**, a consistent visual export for keeping or sharing.

**Product terms (use exactly these):** Scent Scene, Rooms, Scent Atlas, Scene Card. Retired terms that must not appear in UI or code identifiers: Scent Profile, Room Profile, Scent Direction, Experience Record.

**Brand lines (verbatim from the plan):**
- Awareness: *There's more to a room than what you see.*
- Invitation: *For the rooms you live in, and the ones you imagine.*
- Explore & Play: *Imagine a room, down to its scent*
- Capture: *That scent you loved? Save it for later*
- Scent Atlas: *Your rooms, ideas, and scent notes, all in one place*
- Scene Card: *A little piece of your world, ready to share*
- Hero creative concept: *Same Room, Different Feelings*

## 2. MVP goal and dates

Deliver a public, responsive website MVP by **Mon 2026-11-10 23:59** (Brightspace), with a one-week revision window before public grading and launch. A preview URL with one playable Rooms scene, Capture, and Scent Atlas is demoed **Wed 2026-11-04 2pm**.

Success measures after launch (plan Part 06, window Nov 11–30, start date pending instructor confirmation):
- 100 new website users; 20 of them complete a first creation (Rooms concept or Capture entry) **and** export a Scene Card.
- 50 new users first-attributed to Instagram, 50 to Pinterest.
- Feedback review by 11/20: ≥5 actionable responses, one revised promotional round.

These require GA4 with the events in §9 and UTM-tagged links from day one.

## 3. Users

- **Primary — fragrance-engaged home-atmosphere explorers.** Use or are interested in home fragrance; want to explore how scent fits their rooms, activities, and taste. Barrier: composing a room must feel rewarding for the effort.
- **Secondary — established scent users with a recall need.** Have familiar habits; occasionally want to retain a product name, room context, or observation. Memory, notes, and photos are the alternatives, so recording must be nearly effortless and retrieval obvious.

Research-informed rules (6 interviews, 46-response survey; directions, not validation):
1. Start from the room and the intention, not from a fragrance format. Allow low-scent and fragrance-free outcomes.
2. Guidance is optional and offered at the moment of use, never a gate.
3. Help people evaluate and revise; never promise to predict how a scent will feel.
4. Default to a brief record (product/method, room, one note); detail is opt-in.

## 4. Scope for Nov 10

| Feature | Priority | Acceptance (summary — full list in ACCEPTANCE.md) |
| --- | --- | --- |
| Landing | Must | Hero + the two brand lines + two mode entries; understandable on a phone's first screen |
| Rooms — 2 scenes, 5–6 slots each, 3 light presets, light motion | Must | Compose and save in under 2 minutes on a phone; one fixed view per scene; preset slots only |
| Capture — 3 required fields, optional detail collapsed | Must | Fragrance-free is a first-class option; entry in under 2 minutes |
| Scent Atlas — list, detail, delete, empty state | Must | Capture and Rooms entries visibly distinct; delete confirms |
| Scene Card — one layout for both entry types, PNG export | Must | Desktop download and mobile Web Share both work; export is Instagram-ready (4:5) |
| Saving — localStorage, survives reload, "saved in this browser" notice | Must | Entries persist across sessions; clear-data loss is explained |
| Responsive + baseline accessibility | Must | 375–1440px; keyboard operable; focus visible; text contrast ≥ 4.5:1; Lighthouse a11y ≥ 90 |
| Analytics — GA4 + custom events + UTM | Must | Events visible in GA4 realtime |
| About, Privacy note, Feedback link, 404, favicon, OG image, titles | Must | Link previews render in Instagram/WeChat |
| Submission package — demo recording, AI-use statement, screenshots | Must | Uploaded to Brightspace by 11/9 |
| Suggestions — preset "Start from a mood" | Should | One tap yields an editable starting combination |
| Notes on Scent & Space — 2–3 short pieces (Tiffany writes) | Should | 150–250 words each, ending with a Rooms or Capture entry point |
| Third Rooms scene | Should | Reuses controls; only new assets |
| Empty/loading/error/success states polished | Should | Export failure, save success, empty Atlas all have messages |
| LLM suggestions via serverless route (schema-constrained) | Could | Only if core is stable by 11/7; falls back to presets |
| Chinese UI toggle | Could | Strings externalized now; translation later |
| Scene motion refinement; custom domain | Could | — |
| Accounts, database, 2-entry free tier, membership, affiliate | Later | January 2027 per plan; data model leaves room (see ARCHITECTURE) |
| Functional mobile app, free placement, true 3D, AI-generated rooms/objects | Later | Not in 2026 |

**Non-goals for Nov 10:** accounts and server storage, payments, social features, comments, public galleries, photo upload, multi-language, free drag-and-drop placement, multiple camera angles per scene, any health/pet-safety/therapeutic claims.

## 5. Information architecture

| Route | Purpose |
| --- | --- |
| `/` | Landing: hero, two mode entries, short explanation, latest notes (Should) |
| `/rooms` | Scene picker (2–3 scene cards with one-line atmosphere descriptions) |
| `/rooms/[sceneId]` | Rooms composer: stage + slot controls + light presets + suggestions + save |
| `/capture` | Capture form → saves a Scent Scene |
| `/atlas` | Scent Atlas: list of entries, filter by type, empty state |
| `/atlas/[entryId]` | Entry detail: content, Scene Card preview, export, edit (Capture) / reopen (Rooms), delete |
| `/about` | What Olfia is, who made it, course context, how data is handled (short) |
| `/privacy` | Privacy note: local-only storage, analytics, no accounts |
| `/notes`, `/notes/[slug]` | Should: Notes on Scent & Space |
| `/api/suggest` | Could: LLM suggestions |

Global: header (wordmark, Rooms, Capture, Atlas), footer (about, privacy, feedback link, "saved in this browser" notice where relevant).

## 6. Journeys

**J1 — Explore & Play.** Landing → `/rooms` → pick a scene → stage loads with a default composition → (optional) tap a mood suggestion → tap a slot → choose an option from a sheet → repeat → change light preset → tap Save → name it (prefilled) → saved toast → "View in Atlas" / "Make a Scene Card". Target: under 2 minutes to first save on a phone.

**J2 — Capture.** Landing → `/capture` → room, scent source (kind + label), one-sentence note → (optional "Add detail": intention, time of day, verdict, up to 3 descriptors) → Save → saved toast → "View in Atlas" / "Make a Scene Card". Target: under 2 minutes.

**J3 — Revisit.** `/atlas` → list shows type badge, title, date, thumbnail (Rooms) or descriptor chips (Capture) → open → Scene Card preview → Export (download / share) → or Delete (confirm) → or Reopen in Rooms / Edit Capture.

## 7. Functional requirements

### 7.1 Rooms
- Each scene: one fixed view, a 4:5 stage, three depth planes (back / mid / front), 5–6 **slots** at preset positions, each with 3–4 **options** (one option per slot active at a time; "none" allowed where meaningful, e.g., scent source → fresh air).
- Controls: slot chips below/beside the stage; tapping opens an option sheet (mobile bottom sheet, desktop side panel) with image tiles and labels; selecting swaps the cutout with a ≤320ms crossfade.
- **Light presets** (3 per scene; names are content): change wash colour, shadow tint, and glow of light-emitting options. Transition ≤600ms.
- **Suggestions (Should):** "Start from a mood" chips (6–8 moods per scene) apply a predefined combination + light preset; user can change anything afterwards. Copy frames them as *suggested starting points*, never as recommendations of products.
- Save produces a Rooms entry (see ARCHITECTURE §Data model) with the selected option ids, light preset, mood (if used), title.
- Light motion: parallax ≤6px per plane on desktop pointer move; subtle ambient drift on glow layers; all disabled under `prefers-reduced-motion`.
- Scene 1 proposal: **Reading Corner** (matches the plan's hero concept). Scene 2 proposal: **Living Room, Late Afternoon**. Scene 3 (Should): **Bedroom at Dusk**. Names, descriptions, option labels and scent descriptors are written by Tiffany.

### 7.2 Capture
- Required: **Room** (select: Bedroom, Living room, Kitchen, Bathroom, Study / workspace, Entryway, Other → text), **Scent source kind** (Candle, Diffuser, Incense, Room spray, Essential oil, Fragrance-free / none, Other) + **label** (free text; optional when fragrance-free), **Note** (≤140 characters, placeholder: *One sentence worth keeping*).
- Optional (collapsed under "Add detail"): intention chips (Wind down, Focus, Welcome guests, Fresh start, Cozy, Clear the air), time of day (Morning, Afternoon, Evening, Night), verdict (Not for me / Fine / Keep), up to 3 descriptor tags (free text, e.g., "dry cedar", "cool daylight").
- Title auto-generated as `{Room} · {label or "fragrance-free"}`, editable.
- Validation inline; errors in words, not colour alone.

### 7.3 Scent Atlas
- Lists all entries newest first; type badge (Capture / Rooms); filter chips All / Captured / Rooms.
- Empty state explains both modes with two buttons.
- Detail: all fields; Rooms detail renders the saved composition; actions: Scene Card, Reopen/Edit, Delete (confirm dialog).
- Persistence notice: "Saved in this browser only. Clearing site data removes entries. Export a Scene Card to keep a copy." Shown once per session and on Atlas.

### 7.4 Scene Card
- One template, two variants (Rooms: composed scene render; Capture: abstract Afterimage block in the entry's mood palette). Spec in DESIGN-SPEC §Scene Card.
- Export: PNG 1080×1350 via DOM render (see ARCHITECTURE); "Save image" (download) and "Share" (Web Share API when available). Failure shows a message with a retry.
- Contains: Olfia wordmark, type eyebrow, title, visual, up to 3 descriptor chips, note (Capture) or scene name + light preset (Rooms), date, site URL. No personal data beyond what the user typed.

### 7.5 Landing, About, Privacy, Feedback
- Landing: eyebrow, awareness line as H1, invitation line as lede, two mode cards with the mode key messages, "How it works" in three short steps, footer.
- About: 150–250 words (Tiffany writes), course context sentence, contact via feedback form.
- Privacy note: what is stored (entries in this browser), what is measured (GA4 events, anonymous), no accounts, no sale of data, how to delete (clear site data or delete entries), contact.
- Feedback: external form link (Google Form or Tally) in footer and after first save.

## 8. Content Tiffany writes (AI may edit for length/consistency only)

| Item | Count | Length |
| --- | --- | --- |
| Scene names + one-line atmosphere descriptions | 2–3 | ≤ 90 characters each |
| Slot labels | 10–18 | 1–2 words |
| Option labels + scent/atmosphere descriptor | 30–48 | label 1–3 words; descriptor ≤ 60 characters |
| Light preset names | 6–9 | 1–3 words |
| Mood names + one-line intent | 12–16 | ≤ 60 characters |
| Microcopy: buttons, empty states, toasts, errors, persistence notice | ~40 strings | per DESIGN-SPEC voice rules |
| About page | 1 | 150–250 words |
| Privacy note | 1 | 150–250 words |
| Notes on Scent & Space (Should) | 2–3 | 150–250 words each |

All strings live in `content/*.json` and `lib/strings.ts` so Chinese can be added later without touching components.

## 9. Analytics events (GA4)

| Event | Params | When |
| --- | --- | --- |
| `mode_entered` | `mode` (capture\|rooms) | Opening `/capture` or a scene |
| `creation_complete` | `mode`, `scene_id?`, `from_suggestion?` (bool) | Entry saved |
| `scene_card_export` | `mode`, `method` (download\|share) | Export succeeded |
| `suggestion_used` | `scene_id`, `mood` | Mood chip applied |
| `entry_deleted` | `mode` | Delete confirmed |
| `feedback_click` | `location` | Feedback link clicked |

Acquisition attribution uses GA4 defaults; all social links carry `utm_source`, `utm_medium=social`, `utm_campaign=mvp-nov`.

## 10. Constraints and policies

- **Accessibility:** keyboard operable; visible focus; labels on every field; status not by colour alone; alt text on cutouts (option label + descriptor); `prefers-reduced-motion` respected; minimum text 13px.
- **Performance:** first screen interactive < 3s on 4G; total scene assets < 1.5 MB per scene; images as WebP with explicit dimensions.
- **Privacy:** no accounts, no server storage of entries in this release; GA4 only; privacy note linked in footer.
- **Safety copy:** no health, pet-safety, or therapeutic claims; fragrance-free options preserved; product-use guidance only from manufacturer or authoritative sources, and not in this release.
- **Academic integrity:** AI use logged in `AI-USE-LOG.md`; AI-use statement submitted with the product; all brand copy, scene content, and notes written by Tiffany.
- **Terms:** product terms exactly as §1; retired terms banned in UI and identifiers.

## 11. Open questions

1. Instructor's answer to the syllabus CMS clause (asked 11/4). If "must show a CMS": add a headless CMS for notes (ARCHITECTURE §Options).
2. Whether public promotion may start during the revision week (11/11) or after public launch (~11/17).
3. Domain purchase (Tiffany will buy; not blocking).
4. Final names of scenes, slots, options, light presets, moods (content).
5. Whether Scene 3 ships on 11/10 or in the revision week.

## 12. After Nov 10 (from the plan's Part 05)

Revision week 11/11–17 → public launch and marketing to 11/30 → feedback review 11/20 → presentation draft with creative executions 11/24 → final presentation 12/1–2 → email sign-in and database collections 1/15 → formal free release with two saved entries per user 1/31 → membership and affiliate pilots Feb → mobile platform brief May 2027.
