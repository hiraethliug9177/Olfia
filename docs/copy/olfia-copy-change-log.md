# Olfia · v0 → v1 Copy Change Log & Implementation Notes

Baseline: `olfia-site-copy-v0-current.md`, GitHub v3-design f063bf7. Deliverable: `olfia-site-copy-v1-draft.md`. This change set updates the copy specification only. No website source files, deployed site, or functional logic have been changed.

## Confirmed decisions

- Hero Option A verbatim; no additional hero narrative.
- Wheel lead verbatim: “Turn the dial, explore the fragrance wheel.” Delete the automatic neighboring-family layering claim.
- Add substantive first-time-use knowledge and seven scent recipes, supported by research and industry references.
- Expand About to four concept sections; new UI permitted. Replace the loop diagram with independent, visually intimate entry points.
- Adopt My Scentprint as the v1 display name for the former Tags & profile tab.
- Seven Scentpedia family introductions around 200 words each; retain the seven original Little Stories; no comprehensive fact-check of those original stories in this round.
- All other previously proposed copy revisions included.

## Page-by-page changes

| Scope | Main change | Implementation impact |
|---|---|---|
| §0 Global | SEO description, newsletter, nav terminology, previews, storage and error copy | String replacements; sync footer/nav and repeated toasts. Verify privacy and waitlist claims. |
| §1.1 Hero | Approved concise lead and three feature lines | Text only; preserve hero layout |
| §1.2 Wheel | 7 unique profiles, notes, use contexts, pairing guidance and starter recipes | Expand reactive card; use shared recipe data; mobile accordion or stacked sections; remove old adjacency hint |
| §1.3–1.5 | Editorial positioning, gifts, room presets | Add one short Edit description; keep current preview cards |
| §1.6 Concept | 4 researched blocks on memory, space, everyday aesthetics, culture; expanded creator letter | Add 2 concept sections, paragraph support, optional image/collage and expandable sources; creator approves letter before publication |
| §1.6 How it Works | Five user-intent introductions | Replace loop/center arrows with five independent illustrated entry points; keep destinations; no forced sequence |
| §1.7 Closing | Retained core brand statement | Check CTA consistency |
| §2 Capture | Natural questions and helper text, record both liked and disliked scents | Preserve nine steps and choice values; check Skip behavior; add lead and step 9 hint |
| §3 Scent Card | Intro, aspect ratio, stickers and export language | Small lead above editor; no change to export or sharing |
| §4 Rooms | Intro and scent-strength explanation, matching transparency | Add compact intro and match lead; no new physical modeling |
| §5 Atlas | Scent Journal, My Scentprint, Fragrance Shelf, stronger empty states | Rename visible labels only; no new analytics; retain calendar/profile/shelf behavior |
| §6 Gifts | Recipient-based context, clearer recommendation and card copy | Switch explanatory copy by existing mode; no new recommendation algorithm |
| §7 Scentpedia | Seven new 206–219 word guides; wheel mapping; linked recipes; source notes | Add long-form sections, preserve material images and Little Stories; render research links |
| §8 The Edit | Editorial mission, filters and article chrome | No changes to actual article titles, body, intro or references |
| §9 Quiz | Rephrase 20 question prompts, retain choices and mapping; 16 new 87–96 word character profiles | Add result detail by existing MBTI ID; preserve signature quote, family mapping, card export, scoring, option order |
| §10 My Page | Clear distinction between recorded frequency and preference; planned Plus, waitlist, export and deletion | Validate all stats, states, limits, email destination and preview account behavior |
| §11 Privacy | Organize by local data, analytics, cookies, email, deletion | Technical verification is a launch gate. Internal checklist replaces public TODO; not a legal review |
| §12 404 | Retain playful heading, refine next action | Text only |
| Appendices A–C | Display vocabulary, selected object label refinements, six optional fictional seed records | Keep data keys/asset IDs; add new seed entries only with complete field mapping and separate approval if needed |
| §13 Research | 19 linked source groups; source mapping for new educational and conceptual copy | Render relevant links per section; no internal R identifiers in UI |

## Development handoff sequence

1. Commit a backup of current copy and identify shared strings/constants. Apply display-only changes across all surfaces first. Keep v0 for comparison.
2. Implement homepage Wheel and Scentpedia using a common family metadata/recipe source keyed by current family IDs. Keep independent long-form descriptions. Check all seven selections and existing Rooms/Scentpedia links.
3. Expand About Concept and replace How it Works with five independent editorial feature blocks. Keep navigation anchors. Use actual collage materials or UI screenshots, not placeholder claims of functionality.
4. Add intro/empty-state copy to product pages and bind each quiz profile to its existing result key. Ensure longer copy wraps cleanly on mobile.
5. Verify current browser storage, GA event payloads, consent rules, Kit behavior, account preview, waitlist, export/deletion, third-party requests and recommendation logic. Change copy where implementation differs; keep unverified content out of the published site.
6. Test desktop and mobile, keyboard and screen reader access, all existing routes, capture and quiz choices, save/delete/replace flows, link export, sample mode and non-sample mode. Review long-form content and references before launch.

## Acceptance checklist

- [ ] Hero lead exact match with approved Option A; wheel lead exact match.
- [ ] All seven family cards display correct notes, at-home context, pairing guidance and recipe; no old “neighbours layer well” copy.
- [ ] All seven Scentpedia main introductions present; seven Little Stories untouched; relevant sources available.
- [ ] About has four concept sections, no circular diagram, five independent CTA links.
- [ ] My Scentprint / Scent Journal / Fragrance Shelf / Fragrance Matches consistent across nav and page headings.
- [ ] Twenty quiz questions preserve choice semantics, IDs, order, scoring; sixteen original character names, family mappings, signature quotes preserved; detail copy present.
- [ ] All placeholder tokens, link targets, existing asset IDs and storage keys remain functional.
- [ ] No sample records appear as the creator’s actual experiences.
- [ ] No unsupported current feature, account, price or privacy claim. Privacy checklist verified, not visible to users.
- [ ] Responsive and accessible UI; no raw implementation tags or research IDs rendered.

## Copy-spec QA completed

All original numbered sections 0–12 and appendices are represented. Verified by text comparison that the seven original story bodies and source labels are unchanged, the 20 original quiz option rows are unchanged, and all 16 original character mapping rows are unchanged. All new family introductions are within 180–220 words and character profiles within 80–120 words. Source code and deployed behavior have not been tested because they were not supplied for this task.
