# Progress log — 11/10 night round

Working notes so any session can pick up where the last one stopped. Newest last.
Workflow: commit to `v3-design` → Vercel preview build passes → `git push origin HEAD:main` → production READY.

## Asked by Tiffany (11/10, ~4:40 pm PT)

1. Screenshot fixes: header menus overlap (only the hovered tab's menu may show); remove the hero slide chips and pause button; My Account shows the user's quiz result (or a quiz CTA) instead of the quiz/About cards; "Most used: …" on one line; remove the sentence in the Scent Library block on The Edit.
2. Add the 12 new Edit articles (file "The_Edit_12_Editorial_Features_Complete.md").
3. 16 quiz archetype illustrations — original chibi characters (big head, short body), each in a room corner tinted by its family colour; not copies of Animal Crossing's design.
4. Kitchen and bathroom rooms.
5. Scent Card templates redone (inherit the real room / capture; Film, Postcard, Polaroid).
6. Monthly record (Atlas) redesigned.
7. Footer background: original dithered sky + hills in Olfia colours (her two reference images are not used directly).

## Status

- [x] 1 Screenshot fixes (menus: only the hovered tab opens; hero chips + pause removed, a picked reference pauses autoplay 12 s; Account quiz section; profile line; library block line)
- [x] 2 Twelve articles (19 in total; topics Culture/History/Science/Design/Places/Rituals; Unsplash covers with credit; rail: Most read / In season / Try this)
- [x] 3 Archetype illustrations (scripts/archetypes.py → public/assets/archetypes/*.svg; on the quiz result card and a 'Sixteen characters' gallery on /quiz; regenerate with `python3 scripts/archetypes.py`)
- [x] 4 Kitchen + bathroom (14 drawn pieces + simmer pot source in components/scene/Cutout.tsx; layouts in lib/catalog.ts baseLayout(source, sceneId); room tabs in RoomEditor; presets kitchen-morning and bath-evening; presets open with ?preset=)
- [x] 5 Scent Card templates (components/card/CardStudio.tsx: Film strip / Instant print / Postcard; picture = saved room stage cropped to fill, or the Capture picture via components/capture/CaptureScene.tsx; family colour when opened without a page)
- [x] 6 Monthly record (components/atlas/MonthRecord.tsx: ticket with stub — totals with singular/plural, one stamp per recorded day, most-used family; stub: families, time of day, tags; empty month shows a Capture button)
- [x] 7 Footer (scripts/footer.py → public/assets/footer/sky.webp: halftone sky with bare-paper clouds, sage hills, cross-stitch sprigs; links on a paper panel)

Note 11/10 ~5:50 pm PT: Tiffany's laptop is closed, so the Mac type-check and her browser pane are unavailable. Vercel preview builds are the type check; new visuals are checked as local static mockups rendered with Playwright in the container.

Note 11/10 ~5:30 pm PT: a local preview harness renders the real components without the laptop: scratchpad `harness/` (esbuild + stand-ins for next/link, next/navigation, zustand, lucide-react, html-to-image; `node build.mjs`, serve `www/` on :8765, `python3 shot2.py URL OUT W H [actions]`).
Live: main = 6b30ee3 (characters, footer, monthly record, Scent Card templates).
Next: kitchen + bathroom (drawn items in components/scene/Cutout.tsx, scene layouts in lib/catalog.ts, scene tabs in RoomEditor, `?scene=` and `?preset=`), then docs and the report to Tiffany.

Done 11/10 ~6:45 pm PT: all seven items are live on olfia-nine.vercel.app (main fast-forwarded after each preview build passed). Nothing is left half-done; open, optional items are in the project doc `claude/olfia-content-brief.md` §5.

## 11/10 late — brand-colour pass (Tiffany's annotated screenshots)

- [x] Interface colours only from the 11/3 brand guide; family colours only for scents (rule in CLAUDE.md)
- [x] The Edit: Most read = 3 on white; Try this removed; Scent Library block = title + seven families on one line
- [x] Home Edit section white with a Periwinkle deep button; Matches this room on white
- [x] Account: Settings on Mist, primary button; Quiz result = character only + result details in place, no link out
- [x] /quiz: the Sixteen characters gallery removed
- [x] Footer narrower and shorter; hills apricot (scripts/footer.py)
- [x] Quiz characters: Tiffany's 14 figures matched and cut out (public/assets/archetypes/<code>.webp); INFJ and ENFJ still use the drawn stand-ins (svg, no background) until she sends those two
- [x] INFJ and ENFJ figures from Tiffany cut out and in place: all sixteen characters are hers

## 11/10 night — ready to submit

- [x] Sample data on by default: 30 pages over about six weeks, four My shelf products and preferences, once per browser (`lib/demo.ts`, `lib/sample.ts`)
- [x] README rewritten; GitHub checked: `main` = `v3-design`, no missing assets, no stray files
- [x] Summary panel renamed "Your scents at a glance" (Scent Profile is a retired term); PRD and design spec marked as the 11/2 record
- [x] User guide: Claude Docs document "Olfia User Guide" (features and design logic, for the presentation handout)
- [x] Feedback history in one note: `claude/olfia-feedback-and-changes.md` (Capstone project and the Mac's `Olfia notes/`)
- [x] Mac folder sorted: `Olfia notes/`, `Research and references/` (was `GPT/`); old copies in `_to_delete/` until Tiffany confirms

## 11/17

- [x] Footer: Tiffany's halftone image as the background; "Entries are saved in this browser only." removed; Privacy in the bottom row beside © 2026 Olfia; the found-us menu in the same row as the email field (stacked on phones)
- [x] Footer panel full width, shorter, smaller type
- [x] Footer image fades in from the page in halftone dots; panel edges checked against the page content (laptop and phone)
- [x] Review 1: made-up read counts removed; Editor's Picks (Tiffany chose two for now: Barbie Land, Coffee)
- [x] Review 2: site icon, share picture, story covers as share pictures; [ ] quiz result picture (needs a link per result)
- [x] Review 3: all 31 product links go to the product's own page
- [x] Review 4: Rooms on phones: room first, tray as a bottom drawer
- [x] Review 5 decided: the story text stays IBM Plex Mono; headings and the line under the title bold; story tags as icon pills
- [x] The Edit: "Editor’s Picks" and "In Season" in title case, two stories each; on story pages the tag, date and read time share one line above the title
- [x] Review 7: Picks page (/picks), filters by family, room and price
- [x] Review 8: Gifts (/gifts) by scent family, three price tiers (Tiffany chose families over characters)
- [x] Review 9: story share row, "Recreate this at home" (families + three products), sign-up box, related "Keep reading"
- [ ] Check every price tier on the brand sites (several look off: Diptyque classic candles, Otherland, the Vitruvi diffuser, Aesop room spray); Gifts picks may move with them
- [ ] Tiffany: sign-up heading; any intro lines for Picks and Gifts; reword the new labels if wanted
- [ ] 11–14 wait for Tiffany's decisions and words
