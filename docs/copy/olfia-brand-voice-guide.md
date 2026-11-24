# Olfia · Brand Voice & Copywriting Guide v1

Status: project-specific editorial guidelines accompanying the approved-direction v1 website copy. English consumer copy; Chinese implementation notes. This is a working guide, not a change to product features.

## 1. Positioning and copy anchors

**Hero H1:** Life, through scent.

**Hero lead (approved, exact):** A personal home fragrance platform to explore scents, design room atmospheres, and document your sensory experiences.

Keep the hero compact: one positioning sentence, three short feature lines, two CTAs. Move cultural and conceptual discussion to About Olfia and Scentpedia.

| Role | Approved / retained language |
|---|---|
| Brand tagline | For the rooms you live in, and the ones you imagine. |
| Brand concept | Scent is an afterimage. |
| Supporting statements | There’s more to a room than what you see. / Make your scent, create your rooms. |
| Rooms | Imagine a room, down to its scent. |
| Capture | That scent you loved? Save it for later. |
| Share | A little piece of your world, ready to share. |
| Atlas | Your rooms, ideas, and scent notes, all in one place. |
| Editorial | Culture, fragrance, and the art of living. |
| Fragrance Wheel lead | Turn the dial, explore the fragrance wheel. |

## 2. Voice principles

- Curious: start from a tangible question, object or observation. The existing seven Little Stories are the strongest in-project examples of this voice.
- Thoughtful: connect specific details to a wider concept; give the reader a reason to care.
- Sensory: describe how materials differ. Use dry cedar, a tart citrus peel, powdery iris, washed cotton, roasted coffee, or a familiar room instead of vague adjectives.
- Culturally literate: treat traditions and places as situated experiences; cite specific research and avoid sweeping cultural generalizations.
- Playful: invite comparison and experimentation. Let users discover their own preferences.
- Personal: use conversational English, contractions where natural, and varied sentence lengths. Use first person only in a creator-approved letter or explicitly fictional examples.

Olfia is a home fragrance platform with an independent editorial voice. It is a creative studio, personal journal, cultural reading space, and growing archive. Avoid language that sounds like generic luxury advertising, a wellness promise or a clinical assessment.

## 3. Writing by surface

| Surface | Target | Tone and structure |
|---|---|---|
| Hero | One positioning sentence + one line per feature | Direct; no additional narrative |
| Homepage wheel | Compact sections; one actionable example | Sensory descriptors, notes, at home, pairing, recipe |
| About / Concept | Four sections, roughly 120–180 words each | Observational, researched, reflective; clear paragraphs |
| Creator letter | About 250–350 words | Personal first-person narrative grounded in supplied facts |
| How it Works | One heading, short paragraph and CTA per entry | User intent first; no numbered flow or required sequence |
| Scentpedia | 180–220 words per family + separate Little Story | Definition, wheel relationship, home application; avoid duplicated story content |
| Quiz results | 80–120 words per character | Distinct scenes, fragrance vocabulary, exploratory language |
| Forms and UI labels | 1–6 words where practical | Clear action or object; no metaphor that obscures intent |
| Empty states | One short sentence + next action where supported | Reassuring, practical, specific |
| Error and deletion | Explain what happened, consequence and recovery if available | Plain, accurate, never blame the user |
| Privacy / plans | As long as clarity requires | Factual; explicit about current vs planned functionality |

## 4. Terminology

| Use | Avoid / legacy display label | Notes |
|---|---|---|
| Capture a scent | Start the capture / Record a scent (as CTA) | Capture is product name |
| Scent Atlas | Atlas alone in navigation | Formal product name |
| Scent Journal | Calendar / Scent journals | Calendar is still the view type |
| Favorites | — | Saved / starred content |
| My Scentprint | Tags & profile / Tags & Preferences | Existing tags and profile display only |
| Fragrance Shelf | My shelf / My Shelf | Keep original storage keys |
| Fragrance Matches | Matches this room | Shared-family recommendations |
| Scent Card / Scent Cards | Inconsistent case | Singular when making one, plural for collection |
| The Olfia Edit | Official Recommendations | The Edit acceptable navigation shorthand |
| For myself / For someone else | For me / For someone | Gifts filters |
| Scent personality quiz | Scientific personality assessment | A playful discovery tool |
| Join the waitlist | Join Olfia Plus | Until Plus launches; confirm email implementation |
| No specific source | none | Preserve the distinct existing option and key |

Families (canonical display): Floral; Gourmand; Warm & Spicy; Woody & Earthy; Green & Herbal; Citrus & Fruit; Fresh & Clean. Preserve programmatic family IDs, MBTI keys and scoring mappings. Do not translate family names differently across pages.

## 5. Editorial technique and examples

Prefer: “Try a cedar-led fragrance with a bergamot accent. Notice whether the citrus makes the wood feel brighter.”

Avoid: “Unlock the power of scent to elevate your everyday.”

Prefer: “Your journal is waiting for its first entry. Capture a scent or save a room to begin.”

Avoid: “Your sensory journey starts here” without a concrete next step.

Prefer: “Shares the Woody & Earthy scent family with your design.”

Avoid: “Perfect for your room” or “These fragrances always blend well.”

Use sentence case for buttons and form labels, consistent title case for feature names, US spelling (color, cozy, favorites), natural contractions, and restrained punctuation. Lowercase handwritten seed titles may remain intentional. Avoid repeated “little,” “quiet,” “soft,” and “moment”; choose a detail that actually carries the intended meaning. Not every scent needs to be calming or pleasant.

## 6. Knowledge and claims

- Michael Edwards’ wheel is a reference classification, adapted by Olfia for seven home-fragrance families. Explicitly identify overlap and the independent gourmand category; avoid implying endorsement or a one-to-one correspondence.
- A fragrance note is a perceived character and may be an accord. Do not assume an ingredient is actually present.
- Use peer-reviewed research for general olfactory phenomena, industry references for classification and note vocabulary, and original editorial guidance for home examples. Keep sources adjacent in research notes; never present recipes as experimentally proven effects.
- Scent recipes are examples of scent directions, not chemical formulas. Encourage comparison of finished products as directed; do not provide universal ratios or imply air purification, mood treatment or guaranteed effects.
- Keep the quiz playful. No diagnostic or scientifically validated personality claims.
- Clearly distinguish a recorded frequency, selected preference, and suggested family in statistics.
- No invented product capabilities, prices, release dates, subscriptions, or technical privacy claims. Privacy and account text needs developer verification before launch.

## 7. Implementation protocol

Use `olfia-site-copy-v1-draft.md` as copy source of truth. `[NEW COPY]` adds visible text; `[NEW UI]` defines layout work; `[RESEARCH SOURCES]` maps to source links in §13; `[VERIFY]` is an internal check. Do not render these markers or Chinese implementation notes. Keep v0 unchanged as comparison baseline. Preserve routes, handlers, keys, template values, counts, image assets and dynamic variable order; localize the visible string only. Check responsive line wrapping, keyboard focus, accessible names, contrast and screen reader behavior. Use expandable blocks for long knowledge copy rather than forcing it into existing short cards.
