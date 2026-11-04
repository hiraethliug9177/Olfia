# AI-use log

The DSM596 syllabus requires a closing paragraph on every assignment that used AI, explaining how and why it was used and the prompts involved. This log is the source for that paragraph. One row per session or asset batch. Prompts: paste the key prompt or a faithful summary.

| Date | Tool | Purpose | Key prompt(s) | What was kept / changed by Tiffany |
| --- | --- | --- | --- | --- |
| 2026-11-02 | Claude (claude.ai, Fable 5.1) | Evaluated existing project materials, syllabus, and business plan; produced the MVP evaluation and development plan; drafted PRD, DESIGN-SPEC, ARCHITECTURE v0.9 and the repository scaffold | "评估整体内容，分析哪些可取哪些不可取，告诉我接下来应该做的事情 step by step… scope: PRD, UI/UX spec, architecture, Figma, backend/data, testing, GitHub deployment" | Decisions confirmed by Tiffany: Next.js stack; collage-style scenes with single view + preset slots; preset suggestions; Figma after 11/10; localStorage saving. Content and copy remain Tiffany's |
| 2026-11-03 | Claude (Claude Code, Opus 5.5) | Visual rework mockups (canvas), then an overnight basic v3 build on branch v3-design: new tokens/fonts, header/footer, Home, Capture, Rooms editor with free drag, Scent Atlas jigsaw calendar, Scent Card studio with PNG export, Account/Library/About/Privacy | "如果我今天晚上给你开放权限让你通宵干呢，能不能做一个比较基础的版本给我呢？" plus Tiffany's page-by-page spec and canvas comments | Brand lines, page structure, naming and visual direction are Tiffany's; missing copy left as TODO(Tiffany); production untouched pending her review |
| | lovart.ai (planned) | Scene cut-out generation with one locked style prompt | see DESIGN-SPEC §5.1 | Selection, art direction, and all labels by Tiffany |

## Statement template (for Brightspace)

"AI tools were used in building this product as follows. Claude (Anthropic) was used to evaluate project materials, draft planning documents (PRD, design specification, architecture) from my business plan, and generate and refactor website code under my direction; representative prompts included: [list]. [Image tool] was used to generate cut-out illustrations for the Rooms scenes from a style prompt I wrote: [prompt]; I selected, edited, and arranged all assets. All product concepts, brand copy, scene content, notes, and this statement were written by me. A full prompt log is kept in the repository (docs/AI-USE-LOG.md)."
