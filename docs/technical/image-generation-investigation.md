# Image Generation Investigation – Current State, Findings, and Next Steps

Status: working draft – updated after latest runs (rollback from FLUX Kontext to FLUX.1 schnell)

## 1) Scope and Goal

This document consolidates everything we’ve observed about text-to-image generation quality in Mayari: what’s bad, what improved, what we tried, what the logs show, and a concrete, model-agnostic plan to fix quality. No code changes are performed here – this is analysis and planning.

Target outcome: consistent characters across pages, matching each page’s scene, without unintended text/signage, with controlled variety in composition, lighting, and subject focus.

## 2) Current Pipeline (high level)

- Text model (OpenRouter): currently `anthropic/claude-sonnet-4` for paged story JSON and auxiliary planners.
- Image model (FAL): `fal-ai/flux/schnell` (FLUX.1 [schnell]) – current default.
  - Short experiment (2025‑08): `fal-ai/flux-pro/kontext/text-to-image` (Kontext [pro])
    - Outcome: better prompt following/typography suppression in T1, but identity still drifted and cost per 8pp story ~ $0.24. We rolled back to `schnell` (quality/cost trade‑off not acceptable yet).
- Relevant code paths:
  - Story generation endpoint: `src/app/api/stories/generate/route.ts`
  - OpenRouter client: `src/lib/ai/openrouter.ts`
  - FAL client: `src/lib/ai/fal.ts`

Processing steps today:
1. Generate paged story as JSON (title, pages[].text).
2. Extract summary + character sheet; extract recurring cast list (names, attributes).
3. Plan visuals per page (shot/camera/time_of_day/lighting/environment; include_characters flag).
4. Build image prompt per page and call FAL (Flux.1 schnell) to generate one image per page.
   - Prompt hardening (2025‑08):
     - Per‑page visibility rules: “EXACTLY N people visible …” bzw. “show only [subjects]; no other people visible.”
     - Bilinguale domänenspezifische Verbote (Shop: no price tags/signage/labels/sale signs/printed packaging text; „keine Preisschilder/Regaletiketten/…“).
     - Identity‑Ankerzeile (kurz) direkt nach Scene.
     - Fixed seed per story; aspect ratio 4:3; guidance_scale aktuell 4.0 (zuvor 4.5).
5. Save results and show in reader.

## 3) Problems Observed (from multiple sessions)

1. Character consistency not reliable
   - Faces/outfits drift across pages even with “appearance lock”.
   - Extra people appear (e.g., cashier, friendly worker) when not intended.

2. Unwanted text inside images
   - Signage, logos, random letters; the name “Mara” shows up on bags or labels.
   - Earlier runs showed frequent stickers/typography; recent negatives reduced but not eliminated.

3. Scene mismatch / collage-like artifacts
   - Freestanding heads or disembodied elements (e.g., heads or object panels) appeared in earlier runs.
   - Pages that should be object‑only sometimes still include characters.

4. Variety vs. consistency balance
   - Earlier: same image repeatedly (seed+prompt setup too similar, 1:1 size); later: better variety, but identity drifts and unwanted actors remain.

5. Style and quality uneven across pages
   - Some pages photoreal‑leaning vs. others cartoony; flux obeys style less consistently when prompts are long
   - Composition sometimes ignores “include_characters=false”.

## 4) Evidence from Logs (latest “shopping” story)

Highlights (trimmed for readability):
- Prompts now have this structure (we changed order to preserve core intent):
  - `Scene: …` (page text, compacted)
  - `Visual: shot=…, camera=…, time_of_day=…, lighting=… (+ environment). Subjects: …`
  - Base directives: style, kid‑safe, strong negatives, appearance lock, (compact) character sheet, allowed characters.
- Model payload shows: `image_size: 'landscape_4_3', num_inference_steps: 10, guidance_scale: 4.5, seed=<fixed per story>`
- Strong negatives include: “no speech bubbles, no talk balloons, no printed text, … no signatures, no names (including "Mara") … no butterflies/birds/insects”.

What improved in recent runs:
- Images are no longer identical; there is real variety per page (wide/medium/detail/closeup).
- Text overlays reduced vs. baseline; große Banner selten. In Shops weiterhin gelegentlich signage/labels (deutlich weniger, aber nicht null).
- Scene instructions appear at top of prompt (less truncation risk).

What’s still wrong:
- Extra characters: planners/character sheet include “friendly supermarket worker”, “smiling cashier” → model adds them even when not explicit in a given page.
- Name “Mara” can still appear on packaging/bags despite negatives; likely due to strong scene priors for shopping (bags with brand/label) and the cast name in prompt context.
- Identity drift persists in some pages (mom/child look changes), especially when camera/shot changes are large.

## 5) Timeline of Attempts (what we tried and the impact)

1) Early baseline
- FLUX.1 schnell with tiny steps (4), square HD → fast but inconsistent, repeated motifs, frequent text overlays.

2) Hard negatives + move to 4:3
- Explicit `negative_prompt` added; switched to `landscape_4_3`; steps raised (8–10), CFG ≈ 4.5 → fewer text overlays, nicer compositions.

3) Imagen4 preview/fast trial
- Higher text/label/sticker bias and inconsistent negatives; more typography; overall quality worse for our use case → reverted to FLUX.

4) Visual plan per page (shot/camera/time/lighting/environment)
- Adds needed variety; object‑only pages possible. Improvement: less repetition. Issue: “include_characters=false” not always honored by model.

5) Character sheet + cast lock
- Goal: identity and allowed cast. Side effect: introducing roles (cashier/worker) gave the model permission to add more people on many pages.

6) Seed handling
- Seed per page (varied): variety ↑, identity ↓.
- Seed fixed per story: identity ↑, variety must come from Visual plan; more stable overall.

7) Prompt ordering and compaction
- Put `Scene` and `Visual` first; compress character sheet; reduce truncation → better page matching.

8) Stronger negatives (names/signatures/logos)
- Many overlays gone; occasional signage or labeled bag still occurs.

9) Per‑page visibility rules (2025‑08)
- “EXACTLY N people visible …; no background people/partial figures” bzw. “show only [subject] …” → merklich weniger unbeabsichtigte Personen; nicht vollständig.

10) Model spike: FLUX.1 Kontext [pro] (2025‑08)
- Pros: gute Prompt‑Adhärenz/Typografie, aber Identität weiter nicht stabil genug; Kosten ~ $0.24 pro 8 Bilder; Rollback zu `schnell`.

## 6) Root-Cause Hypotheses

H1. Character sheet and cast list introduce extra actors
- By listing “worker/cashier”, the model sees them as allowed recurring characters and adds them broadly. Even when a page doesn’t call for them, their presence is reinforced by the sheet.

H2. Long prompts with mixed intents weaken instruction priority
- With many blocks (style, negatives, cast, appearance lock), the model may balance constraints inconsistently; some negatives get overridden by scene priors (shopping signage, brand labels, bags).

H3. FLUX.1 negative_prompt limits
- While supported, negatives are not absolute constraints. Some text‑like signage still slips in, especially in environments associated with text (shops, price tags).

H4. Identity lock without reference imagery is fragile
- Prompt‑only appearance locks help but do not fully fix faces/outfits across significant variation of composition/lighting.

H5. “include_characters=false” insufficiently explicit
- The phrasing may need to be stronger and earlier, and subjects must be concrete (e.g., “only a pretzel on a wooden table; absolutely no people anywhere in the frame”).

## 7) What’s Good Now (keep)

- Deterministic stories (fixed seed per story) and 4:3 output.
- Prompt structure: Scene/Visual first, then directives.
- Strong negatives (inkl. bilinguale shop‑Verbote) – Textartefakte deutlich reduziert.
- Real per‑page variety from visual planning.
- Per‑page visibility rules reduzieren unbeabsichtigte Personen signifikant.

## 8) What’s Still Bad (prioritized)

P1. Extra, unintended people (cashier/worker) appear too often.
P2. Occasional labels/signage (e.g., bag text) despite negatives.
P3. Character identity still drifts across pages (hair/outfit/face details change).
P4. Object‑only pages sometimes include people.

P5. Universal requirement: Qualität muss über Kontexte (Shop, Park, Schule, Nacht, Innen/Außen, Nah/Fern) stabil bleiben – ohne dass man pro Story manuell kuratiert.

## 9) Non‑code Experiment Plan (next sessions)

All steps are designed to run via configuration/prompt edits and manual A/B runs before we touch code again.

E1. Remove secondary cast from the character sheet (test)
- Use a sheet with only the core duo (child + mom). No cashier/worker roles. Hypothesis: fewer unintended people.
- Keep appearance lock for these two only.

E2. Subject‑only phrasing stress test
- For object‑only pages, phrase Scene as: “Only [SUBJECT]. Absolutely no people, no hands, no faces, no characters, no body parts, no reflections.”
- Add positive count constraints: “single pretzel on table, centered; empty background”.

E3. Negatives wording variants
- Add German duplicates of negatives: „kein Text, keine Schrift, keine Logos, keine Namen“ alongside English.
- Add “no price tags, no signage boards, no shop labels, no sale signs, no printed packaging text”.

E4. Parameter sweeps (small)
- CFG: 3.8, 4.2, 4.8
- Steps: 8, 10, 12
- Record: text artifacts rate, identity drift rate, scene match rate.

E5. Seed policy A/B
- A (current): fixed per story.
- B: fixed per story but add tiny deterministic jitter to latent via wording (e.g., camera micro-variation) while keeping appearance lock. Measure identity vs. variety.

E6. Style anchor tightening
- Move color tokens for outfits and hair earlier: “brown curly hair, red dress with white trim, green hair tie”.
- Repeat short appearance line right after Scene for pages with people.

E7. Environment textual bias mitigation
- Explicitly say: “no readable signs, no price tags, blank store labels”.
- Avoid using the character’s name in Scene when possible; refer as “the child” to reduce leakage of the name onto props.

E8. Reference‑image feasibility check (no code yet)
- FLUX Kontext / IP‑Adapter‑like approaches (if accessible via provider) to truly lock identity.
- If provider lacks it: consider a single neutral anchor image for main character (front view) and test image‑conditioning where available.

E9. Style robustness (universal)
- Compare styles available in UI (mapped): `peppa-pig`, `pixi-book` (incl. “ghibli”→`pixi-book`), `comic` (UI “cartoon”→`comic`).
- Expect fewer text artifacts with `peppa-pig` vs. `pixi-book`/`comic`; identity may benefit slightly from flatter styles.

## 10) Acceptance Criteria & Metrics (manual first)

- Text‑in‑image rate ≤ 5% pages.
- Extra‑people rate ≤ 10% pages.
- Identity consistency ≥ 90% (face/hair/outfit recognizable across pages).
- Scene match ≥ 90% (human raters agree picture matches page text).

## 11) Open Questions / Risks

- Provider constraints: whether FLUX negative prompts can fully suppress signage in store scenes.
- Availability of reference‑image conditioning (Kontext) via fal.ai; might require different endpoint or provider.
- Trade‑off between long prompts (more constraints) and adherence (model may ignore some items when prompt is too dense).

## 12) Current Model & Configuration (2025‑08)

- Model (default): `fal-ai/flux/schnell` (FLUX.1 schnell)
  - aspect ratio: 4:3 (`image_size: landscape_4_3`)
  - guidance_scale: 4.0 (vorher 4.5)
  - num_inference_steps: 10 (Batch‑Bilder, 1 pro Seite)
  - negative_prompt: harte Verbote inkl. zweisprachiger Shop‑Verbote
  - seed: fixed per story
  - per‑page: visibility rule (EXACTLY/ONLY), Identity‑Kurzanker, Visual‑Plan
- Styles (UI→Backend Mapping):
  - Peppa Pig Style → `peppa-pig`
  - Pixiebook Style → `pixi-book`
  - Ghibli Style → `pixi-book`
  - Cartoon Style → `comic`
- Tried & Reverted: `fal-ai/flux-pro/kontext/text-to-image` (Kontext [pro])
  - Pros: gute Prompt‑Adhärenz/Typografie
  - Cons: Identitätsdrift weiterhin sichtbar, Kosten ~ $0.24 pro 8 Seiten → nicht tragfähig für Universal‑Anforderung

## 13) Universal Requirement – Guiding Principle

The pipeline must perform consistently across arbitrary topics and scenes (indoor/outdoor, shop/park/school, day/night, few/many objects) without per‑story hand‑tuning. All recommendations and changes above are evaluated primarily on universal robustness (not cherry‑picked stories). Where specialized approaches (e.g., reference images) are considered, they must degrade gracefully when references are unavailable and keep cost/latency within target budgets.

## 12) Summary

We fixed repetition and reduced typography artifacts, but still fight three issues: unintended extra people, occasional labels/names, and residual identity drift. The likely root causes are permissive cast lists, environment priors (shops → signage), and the limitations of prompt‑only identity locking. The next step is a controlled, no‑code A/B plan focusing on tighter cast scope, stronger subject‑only wording, bilingual negatives, small parameter sweeps, and style anchor tightening. If needed, we will escalate to reference‑based identity locking (Kontext‑style) after validating prompt‑only ceilings.


