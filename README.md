# Olfia

Olfia is a website for capturing and creatively exploring scent experiences in living spaces — a USC DSM596 capstone project by Tiffany Liu. Two independent modes: **Capture** a Scent Scene from a real room, or **Explore & Play** with **Rooms** to compose the atmosphere of a real or imagined room. Both save to the **Scent Atlas** and can produce a **Scene Card**.

- Public URL: https://olfia-nine.vercel.app (placeholder landing + route shells; `olfia.vercel.app` was taken)
- Docs: [PRD](docs/PRD.md) · [Design spec](docs/DESIGN-SPEC.md) · [Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Acceptance checklist](docs/ACCEPTANCE.md) · [AI-use log](docs/AI-USE-LOG.md)

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values when you have them
npm run dev                  # http://localhost:3000
npm run typecheck            # before every push
npm run build                # what Vercel runs
```

Node 20+ (22 recommended). If this folder lives inside an iCloud-synced directory, consider moving it (e.g. `~/Developer/olfia`) so `node_modules` is not synced.

## First-time setup (once)

1. `git init && git add -A && git commit -m "Scaffold Olfia"`.
2. Create a GitHub repository named `olfia` and push `main`.
3. In Vercel, connect the existing `olfia` project to that repository (Project → Settings → Git). Production = `main`; every pull request gets a preview URL.
4. Add environment variables in Vercel (see `.env.example`).

## Working rules

- Product terms exactly: Scent Scene, Rooms, Scent Atlas, Scene Card. Retired: Scent Profile, Room Profile, Scent Direction, Experience Record.
- Tokens live in `app/globals.css` (`@theme`) and `docs/DESIGN-SPEC.md`; change both together.
- Content (scene names, labels, descriptors, notes, copy) is written by Tiffany; AI edits for length and consistency only.
- Every AI-assisted session is logged in `docs/AI-USE-LOG.md`.
