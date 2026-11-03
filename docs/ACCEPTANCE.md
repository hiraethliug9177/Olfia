# Acceptance checklist — Nov 10 submission

Tick each item on 11/8–11/9. Record device, browser, and date next to failures.

## Access and pages
- [ ] Public URL opens in a private window with no login wall or Vercel protection
- [ ] `/`, `/rooms`, `/rooms/[scene]`, `/capture`, `/atlas`, `/about`, `/privacy`, 404 all render; titles and descriptions set; favicon and OG image present; link preview renders in Instagram and WeChat

## Rooms
- [ ] 2 scenes; each slot swappable (≥ 5 slots per scene); light presets change wash and glow; save appears in Atlas
- [ ] Compose and save in under 2 minutes on a phone (timed)
- [ ] Suggestions (Should): mood chip applies a combination that can then be edited

## Capture
- [ ] Only 3 required fields; "Fragrance-free / none" works without a label; entry in under 2 minutes
- [ ] Validation messages in words; required stated in the label

## Scent Atlas
- [ ] Capture and Rooms entries visibly distinct; filter works; detail opens; delete confirms
- [ ] Entries survive reload and browser restart; clearing site data removes them and the notice explains this
- [ ] Empty state shows both mode buttons

## Scene Card
- [ ] Both entry types export a 1080×1350 PNG; desktop download works; mobile Web Share works; export failure shows a retry message
- [ ] Card carries the signature frame, wordmark, title, visual, descriptors, date, site URL; looks sharp in an Instagram post

## Responsive and accessibility
- [ ] 375 / 768 / 1280: no horizontal scroll; both journeys completed on iOS Safari, Android Chrome, macOS Safari, desktop Chrome; link opened once in WeChat's in-app browser
- [ ] Keyboard operates every control; focus visible; sheet traps and returns focus; Escape closes
- [ ] Text contrast ≥ 4.5:1; status not by colour alone; cut-outs have alt text; reduced-motion honoured
- [ ] Lighthouse Accessibility ≥ 90 and Performance ≥ 80 on `/`, a scene, `/capture`, `/atlas`

## Analytics and feedback
- [ ] GA4 realtime shows `page_view`, `creation_complete` (with `mode`), `scene_card_export`; a UTM-tagged link attributes correctly
- [ ] Feedback form link works and receives a test submission

## Content and copy
- [ ] Terms exactly: Scent Scene, Rooms, Scent Atlas, Scene Card; no retired terms
- [ ] No health, therapeutic, or pet-safety claims; no placeholder text
- [ ] About and Privacy written by Tiffany

## Repository and submission
- [ ] README has the public URL, local run steps, and doc links; no secrets committed
- [ ] Demo recording (2–3 min), AI-use statement (with prompt log), key screenshots uploaded to Brightspace by 11/9
