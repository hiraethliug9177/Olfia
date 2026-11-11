# Olfia

**Scent is an afterimage.** Olfia is a website for keeping the scents of the rooms you live in and designing the ones you imagine. A USC DSM596 capstone project by Tiffany Liu.

**Live site:** https://olfia-nine.vercel.app

## What you can do

- **Scent quiz.** Twenty questions about how you live. The result is one of sixteen characters and the scent family that fits you, with a button that opens a room in that style.
- **Capture.** Save a real scent moment in a few taps: where you noticed it, the time and season, what it came from, and how it felt. A travel-postcard preview builds as you answer.
- **Rooms.** Design a Reading Corner, a Kitchen or a Bathroom.
  - Drag furniture and scent sources into place.
  - Pick up to three scent families. The room's light, colour, materials and air follow.
  - Start from one of six ready-made presets on Home.
- **Scent Atlas.** Everything you saved, in four views:
  - a jigsaw calendar with a monthly record;
  - favourites;
  - tags, and your scents at a glance;
  - **My shelf**, where you add the products you love by link or photo.
- **Scent Card.** Turn any room or captured moment into a card to share. There are three templates (Film, Instant, Postcard) and two sizes (9:16 and 3:4). Export is a 1080 px PNG.
- **The Olfia Edit.** Stories about scent, culture, history and places. The **Scent Library** explains the seven scent families.
- **My Account.** Your profile, preferences, quiz result and settings.

A first visit opens with sample pages, so every view has something to show. They stay in that browser only and can be cleared in My Account → Settings.

## How it is built

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4.
- Saving: zustand with the browser's localStorage. There are no accounts and no server storage in this version, so everything a visitor saves stays in their own browser.
- Scent Card export: html-to-image. Analytics: Google Analytics 4. Hosting: Vercel (production from `main`).

## Run it locally

```bash
npm install
cp .env.example .env.local   # optional values (analytics id, site URL)
npm run dev                  # http://localhost:3000
npm run typecheck
npm run build
```

Node 22.

## Project map

| Folder | What is in it |
|---|---|
| `app/` | The pages: Home, Capture, Rooms, Scent Atlas, Scent Card, The Olfia Edit, Scent Library, quiz, My Account, About, Privacy |
| `components/` | The parts of each page; `scene/` holds the collage engine shared by Rooms, Capture and the Scent Card |
| `lib/` | Data and logic: scent families, materials and furniture (`catalog.ts`), products, quiz, articles, room presets, sample pages |
| `public/assets/` | Furniture and material cut-outs, textures, quiz characters, article images, footer artwork |
| `scripts/` | Image tools: character cut-outs, footer artwork, drawn room pieces |
| `docs/` | Product requirements, design spec, architecture, decisions log, AI-use log, progress log |

## Design in short

- Interface colours come from the Olfia brand guide: Ivory, White, Mist, Charcoal, Slate, Periwinkle deep, Periwinkle and Apricot. The seven scent-family colours appear only where they stand for a scent.
- Fonts: Newsreader (titles), IBM Plex Mono (interface and text), Caveat (handwritten notes). Icons: Lucide.
- Product terms: Scent Scene, Rooms, Scent Atlas, Scent Card.

## Credits

Concept, brand, content, articles and the character and cut-out images are Tiffany's. The site was built with AI assistance (Claude), recorded session by session in [`docs/AI-USE-LOG.md`](docs/AI-USE-LOG.md). Article images are credited on each article.

Docs: [PRD](docs/PRD.md) · [Design spec](docs/DESIGN-SPEC.md) · [Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Acceptance checklist](docs/ACCEPTANCE.md) · [AI-use log](docs/AI-USE-LOG.md) · [Progress](docs/PROGRESS.md)
