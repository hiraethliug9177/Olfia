# Olfia — Design Specification (v0.9)

**Status:** v0.9. Owner: Tiffany Liu. Last updated 2026-11-02.

> Kept for the record. The current rules are in `CLAUDE.md`, `AGENTS.md` and `DECISIONS.md`: three fonts (Newsreader, IBM Plex Mono, Caveat Bold), interface colours only from the brand guide, family colours only where they stand for a scent, and Scent Card in place of Scene Card. Where this file differs, those win.

This file was the single source for colours, type, spacing, components, scene rules, Scene Card layout, and copy rules. The earlier Notion "Typography and Color Guide" is superseded by §2; do not consult it.

## 1. Direction

**Experimental editorial lifestyle.** Personality: **Observant, Imaginative, Approachable.** The visual reference is *The Afterimage*: the soft impression that lingers after looking away — motion-blurred and translucent botanicals, halftone and risograph textures, restrained film grain, cut-paper shapes, overlapping layers. Dusty Periwinkle frames are the recurring signature.

**Scene style:** 2D scrapbook / collage. Cut-out objects on a flat stage, three depth planes, light handled as colour washes and glows over the whole stage. Collage tolerates mixed sources; that is the point, so cut-outs do not need to match each other perfectly.

Principles (from the plan and research):
- Brief by default; detail is optional and visibly optional.
- Clear scent language; no unexplained fragrance jargon.
- Never imply that a screen can reproduce smell. Describe light, material, and association instead.
- Low-scent and fragrance-free are normal outcomes, not edge cases.
- Product interactions stay legible: decoration never sits under controls.

## 2. Design tokens

### 2.1 Colour

Brand palette (from the business plan and the retired Notion guide), with measured WCAG contrast on Warm Ivory:

| Token | Hex | Role | Contrast on ivory | Allowed for |
| --- | --- | --- | --- | --- |
| `ivory` | #F8F6F0 | Page background, editorial canvas | — | Backgrounds, text on deep periwinkle (6.95:1) |
| `charcoal` | #292A31 | Primary text | 13.22:1 | All text |
| `periwinkle` | #A0A6C8 | Signature colour | 2.21:1 | Frames, rules, decorative fills, display tints ≥ 32px, chart/illustration accents. **Never body text, labels, or icons that carry meaning.** |
| `periwinkle-deep` | #4C527A | Interactive accent | 6.95:1 | Links, primary buttons (ivory text), focus ring, selected states, small accent text |
| `apricot` | #E7B49F | Warm accent | 1.70:1 | Decorative fills, badges with charcoal text (7.77:1), glow layers. Never text. |

Semantic tokens (derived; measured):

| Token | Hex | Use |
| --- | --- | --- |
| `surface-0` | #F8F6F0 | Page (= ivory) |
| `surface-1` | #FFFFFF | Cards, inputs, sheets |
| `surface-2` / `lilac-mist` | #EEEDF5 | Chips at rest, hover fills, table stripes |
| `hairline` | #D5D7E6 | 1px borders, dividers |
| `ink-2` | #5C5E6B | Secondary text (5.95:1) |
| `interactive` | #4C527A | = periwinkle-deep |
| `interactive-hover` | #3E4366 | Hover/active (8.83:1) |
| `success` | #3E6A49 | Success text/icons |
| `danger` | #9A4B3F | Errors, destructive confirm (5.63:1) |
| `focus` | #4C527A | 2px ring + 2px ivory offset |

Rules: text contrast ≥ 4.5:1 everywhere; UI component boundaries ≥ 3:1 against adjacent colour; status never by colour alone (icon or word as well). Dark mode: not in this release (ivory canvas is the brand).

Light-preset washes (Rooms stage overlays; starting values, tune visually):

| Preset (content names TBD) | Wash colour | Blend | Opacity | Shadow tint | Glow (light-emitting options) |
| --- | --- | --- | --- | --- | --- |
| Morning | #EAF0F5 | soft-light | 0.6 | cool, #8F9BB3 at 0.25 | off |
| Golden hour | #F3D9B8 | multiply | 0.35 | warm, #B88A5C at 0.3 | soft apricot, 0.4 |
| Lamp-lit night | #2B2A3A | multiply | 0.45 | deep, #1E1E2A at 0.5 | apricot radial, 0.7 |

### 2.2 Typography

Fonts loaded from the Google Fonts stylesheet (see ARCHITECTURE §1 for why not `next/font` yet): **Lora** (display/headings), **Newsreader** (body), **Source Sans 3** (UI: buttons, labels, chips, tables, captions). Fallbacks: Georgia, serif / system-ui, sans-serif.

| Style | Font / weight | Size (mobile → ≥md) | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| display | Lora 400 | 2rem → 2.75rem | 1.1 | −0.01em | Landing H1, Scene Card title |
| h1 | Lora 400 | 1.75rem → 2rem | 1.15 | −0.005em | Page titles |
| h2 | Lora 600 | 1.375rem → 1.5rem | 1.2 | 0 | Section titles, Atlas entry titles |
| h3 | Lora 600 | 1.125rem → 1.25rem | 1.3 | 0 | Card titles, sheet titles |
| body | Newsreader 400 | 1.0625rem (17px) | 1.6 | 0 | Paragraphs, notes, descriptions |
| body-sm | Newsreader 400 | 0.9375rem (15px) | 1.5 | 0 | Secondary descriptions |
| quote | Newsreader 400 italic | 1.25rem | 1.4 | 0 | The user's note on Scene Card |
| ui | Source Sans 3 600 | 0.9375rem (15px) | 1.4 | +0.01em | Buttons, labels, chips, nav |
| ui-sm | Source Sans 3 400/600 | 0.875rem (14px) | 1.4 | +0.01em | Table text, helper text |
| caption | Source Sans 3 400 | 0.8125rem (13px) | 1.4 | +0.01em | Captions, dates, footer. Minimum size in the product |
| eyebrow | Source Sans 3 600, uppercase | 0.8125rem (13px) | 1.2 | +0.08em | "OLFIA · SCENT SCENE", section eyebrows |

Reading width: 68ch max for prose. Headings in sentence case (brand lines keep their original capitalization).

### 2.3 Spacing, layout, radii, borders, elevation

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Component padding uses 12/16/24; section spacing 48/64/96.
- Page gutter: 16px (<640), 24px (≥640). Content max-width 1120px; prose 68ch.
- Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Radii: chip 4px, button/input 8px, card 16px, stage frame 24px, Scene Card 12px (inner image 8px).
- Borders: hairline 1px `hairline`. **Signature frame:** 2px `periwinkle` outer line + 6px ivory gap + 1px `periwinkle` inner line (double rule). Used on the Rooms stage and Scene Card only, so it stays special.
- Elevation: cards have no shadow (border only). Floating sheet/dialog: `0 8px 24px rgba(41,42,49,0.12)`. Toast: `0 4px 12px rgba(41,42,49,0.14)`.
- Texture: a 3–4% opacity grain overlay (tiling PNG/SVG noise) on the Rooms stage and Scene Card only; never on text blocks.

### 2.4 Motion

| Token | Value | Use |
| --- | --- | --- |
| `fast` | 120ms | Hover, focus, chip toggle |
| `base` | 200ms | Sheet open/close, toast |
| `swap` | 320ms | Option crossfade in a slot |
| `light` | 600ms | Light preset transition (wash + glow) |
| easing | cubic-bezier(0.2, 0, 0, 1) | All |
| parallax | ≤ 6px translate per depth plane, desktop pointer only | Stage ambience |

`prefers-reduced-motion: reduce` → no parallax, no drift; crossfades become ≤120ms opacity changes.

### 2.5 Z-order

Stage planes: back (1) → mid (2) → front (3) → glow (4) → light wash (5) → grain (6) → frame (7). UI: header 50, sheet/dialog 60, toast 70.

## 3. Components

Each component: states **rest / hover / focus-visible / active / disabled** (+ **selected** where applicable), keyboard operable, 44×44px minimum touch target.

| Component | Spec |
| --- | --- |
| Button primary | `interactive` fill, ivory text (ui), radius 8, padding 12×20; hover `interactive-hover`; focus ring 2px + offset |
| Button secondary | Ivory/white fill, 1px `interactive` border, `interactive` text |
| Button ghost | Text only `interactive`, underline on hover |
| Chip (filter / mood / intention) | `surface-2` fill, charcoal ui-sm text, radius 4, 8×12 padding; selected: `interactive` fill + ivory text; multi-select chips show a check mark, not colour alone |
| Slot chip (Rooms) | Like chip, with the current option's thumbnail (24px) + slot label; selected slot gets a 2px `periwinkle` outline |
| Option tile | 1:1 thumbnail on `surface-1`, label (ui-sm), descriptor (caption, `ink-2`); selected: 2px `interactive` border + check |
| Light preset switch | Segmented control, 3 segments, icon + name; selected segment `interactive` fill |
| Sheet (mobile) / Panel (desktop) | Bottom sheet 70vh max with drag handle; desktop: right panel 360px; title h3, close button, scrollable body |
| Form field | Label (ui, above), input 48px tall, radius 8, 1px hairline → `interactive` on focus; helper (ui-sm `ink-2`); error (ui-sm `danger` + icon); required marked in label text ("required"), not by asterisk alone |
| Select | Native `<select>` styled like input (mobile reliability) |
| Textarea | Counter "x / 140" |
| Card (Atlas entry) | `surface-1`, hairline border, radius 16, padding 16; type badge (eyebrow style) top-left; thumbnail 4:5 for Rooms, descriptor chips for Capture; title h3; date caption |
| Badge | Eyebrow text on `surface-2` (Capture) or `apricot` with charcoal text (Rooms) |
| Toast | Bottom-centre, 200ms, auto-dismiss 4s, one action link max |
| Dialog (confirm delete) | Title, one sentence, Cancel (secondary) + Delete (danger fill) |
| Empty state | Illustration-free: eyebrow + h2 + one sentence + two buttons |
| Header | Wordmark (Lora) left; nav Rooms · Capture · Atlas (ui); mobile: same items as a bottom bar is **not** used — keep a top header with 3 text links |
| Footer | About · Privacy · Feedback · "Saved in this browser" notice; cover line *Make your scent, create your rooms.* |

## 4. Page specs

**Landing `/`.** Eyebrow "Olfia"; display H1 *There's more to a room than what you see.*; lede *For the rooms you live in, and the ones you imagine.*; two mode cards side by side ≥md, stacked <md: each with eyebrow (CAPTURE / EXPLORE & PLAY), key message line, one-sentence explanation, primary button; "How it works" 3 steps; footer. Hero visual: a signature-framed block with a translucent botanical layer and light wash (CSS/SVG, no photo needed for Nov 10).

**Rooms picker `/rooms`.** h1, one sentence, scene cards (4:5 thumbnail of the default composition, name, atmosphere line, "Open").

**Rooms composer `/rooms/[sceneId]`.** <lg: stage full width (4:5), then light preset switch, then mood chips row (Should), then slot chips row (horizontal scroll), Save button sticky bottom. ≥lg: stage left (60%), controls right (40%) in a panel: moods, slots, light, Save. Option sheet opens from the selected slot. Save → name dialog (prefilled "{Scene name} · {light preset}") → toast with "View in Atlas" and "Scene Card".

**Capture `/capture`.** h1 *That scent you loved? Save it for later*; form per PRD §7.2 in one column (max 560px); "Add detail" disclosure; Save; after save → toast + card preview link.

**Atlas `/atlas`.** h1 *Your rooms, ideas, and scent notes, all in one place*; filter chips; grid (1 col <sm, 2 cols ≥sm, 3 cols ≥lg); persistence notice; empty state.

**Entry `/atlas/[id]`.** Title, badge, date; content block; Scene Card preview (scaled) with Export (Save image / Share); secondary actions Reopen/Edit, Delete.

**About, Privacy.** Prose pages, 68ch, h1 + body; no imagery needed.

**404.** h1 "This room doesn't exist (yet)." + links to Rooms and Capture.

## 5. Rooms scene specification

- Stage: 4:5, coordinates in percent of stage width/height so one layout serves all screen sizes. Rendered at up to 560px wide on desktop, full width on mobile.
- Planes: `back` (wall, window, large furniture silhouettes), `mid` (seat, table, lamp body), `front` (tabletop objects, textile, botanical). Each plane is a positioned layer; objects inside are absolutely positioned cut-outs.
- Slot definition: `id`, `label`, `plane`, `anchor` {x%, y%} (bottom-centre of the cut-out), `width%`, `z`, `options[]`, `allowNone`.
- Option definition: `id`, `label`, `descriptor` (scent/atmosphere words), `asset` (WebP path), `emitsLight` (bool → gets a glow layer in warm presets), `alt`.
- Light presets per scene: three `LightPreset` objects (§2.1 table) with `name`, `wash`, `blend`, `opacity`, `shadowTint`, `glow`.
- Moods (Should): `id`, `name`, `line`, `selections` {slotId: optionId}, `light`.
- Scene 1 proposal — **Reading Corner**, slots: `seat` (armchair / floor cushion / window seat), `lamp` (paper lantern / brass reading lamp / candle cluster — emitsLight), `scent` (pillar candle — emitsLight / reed diffuser / incense holder / fresh air = none), `botanical` (eucalyptus bunch / dried flowers / potted fern / none), `textile` (wool throw / linen blanket / knit cushion), `tabletop` (book stack / tea cup / vinyl record). 6 slots, 20 options. Wednesday build: 5 slots × 2 options.
- Depth cues: back plane blur 1px + 92% scale, mid none, front 1.03 scale + drop shadow `0 6px 14px rgba(41,42,49,0.18)`; parallax per §2.4.

### 5.1 Asset specification (cut-outs)

- Format: WebP with alpha, long side 1000px, ≤ 80 KB each; backgrounds 1200×1500 WebP ≤ 200 KB. Keep PNG masters outside the repo.
- Naming: `public/scenes/<sceneId>/<slotId>/<optionId>.webp` (e.g., `reading-corner/lamp/paper-lantern.webp`). Manifest: `content/scenes.json`.
- Generation (lovart.ai or similar): one prompt skeleton, only the object changes:
  `cut-paper collage illustration of a [OBJECT], risograph texture, soft film grain, palette of dusty periwinkle, warm ivory and muted apricot, frontal view, soft diffuse light, isolated on a plain light background, no text, no watermark`
  Lock the style with a reference image / seed if the tool supports it. Generate on a plain background; remove the background afterwards (Canva or Figma background removal). Rough edges are acceptable in collage; optionally add a 6px ivory "sticker" edge for consistency.
- Never generate recognisable real products or brands. Record every prompt and date in `AI-USE-LOG.md`; check the tool's commercial-use terms.
- Alt text = option label + descriptor.

## 6. Scene Card

- Canvas 540×675 CSS px (4:5), exported at 2× → 1080×1350 PNG.
- Background `ivory`; signature double frame inset 18px; grain overlay 3%.
- Top row: eyebrow left "OLFIA · ROOM" or "OLFIA · SCENT SCENE"; date right (caption).
- Title: display (Lora) 34px, max 2 lines.
- Visual (full width inside frame, 4:3): Rooms → the composed stage render at the saved light preset; Capture → an *Afterimage* block: translucent botanical silhouette + light wash chosen by intention/time of day (defaults to Morning), with the scent-source kind as a small cut-paper icon.
- Descriptor row: up to 3 chips (room, scent source, intention / light preset).
- Note (Capture): quote style, max 2 lines. Rooms: one line "{scene name} · {light preset}".
- Footer: wordmark left, site URL right (caption).
- All text charcoal or `ink-2`; periwinkle only in the frame and visual.

## 7. Copy and tone

- Warm, clear, sensory-specific: *cool daylight*, *a dry cedar scent*. Short friendly questions for prompts; direct wording for instructions, privacy, and errors.
- Use the key messages from the plan where the context matches (PRD §1). Never rewrite them.
- Suggestions are "starting points", never "recommendations"; never claim an outcome.
- No health, pet-safety, or therapeutic claims. Fragrance-free framed positively ("fresh air", "clear the air").
- Buttons are verbs: Save, Make a Scene Card, Share, Open, Delete. Toasts confirm in one line.
- Terms exactly: Scent Scene, Rooms, Scent Atlas, Scene Card.

## 8. Accessibility checklist (build-time)

- [ ] Every control reachable and operable by keyboard; visible focus ring everywhere.
- [ ] Form fields have visible labels; errors in text; required stated in words.
- [ ] Text contrast ≥ 4.5:1; UI boundaries ≥ 3:1; periwinkle never used for text.
- [ ] Status, selection, and validation never conveyed by colour alone.
- [ ] Cut-outs have alt text; decorative layers `aria-hidden`.
- [ ] Option sheet traps focus, closes on Escape, returns focus to the slot chip.
- [ ] `prefers-reduced-motion` honoured.
- [ ] Touch targets ≥ 44px; no horizontal scroll at 375px.
- [ ] Lighthouse Accessibility ≥ 90 on `/`, `/rooms/[scene]`, `/capture`, `/atlas`.
