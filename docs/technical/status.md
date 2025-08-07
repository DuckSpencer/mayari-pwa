# Mayari Project Status

Last Updated: 2025-08-07

Owner: Core Team

## Traffic Lights

- Text AI (OpenRouter / Claude 3.5 Sonnet): GREEN — Implemented in `src/lib/ai/openrouter.ts`; structured pagination via `generatePagedStory` used in `POST /api/stories/generate`.
- Image AI (fal.ai FLUX.1 [schnell]): AMBER — Implementiert in `src/lib/ai/fal.ts`. Parameter bereinigt (kein guidance_scale/sync_mode). Qualität und No-Text-Priorisierung werden weiter optimiert.
- Multi-image per page/scene: GREEN — Eine Illustration pro Seite wird mit begrenzter Parallelität generiert; Arrays `text_content[]`/`image_urls[]` sind konsistent (Fallback-Placeholder bei Fehlern).
- Data model (stories): AMBER — `stories` enthält `image_urls`/`text_content` Arrays; Overlay-Ansatz dokumentiert. README/SDD-Details werden als Nächstes harmonisiert.
- Offline/PWA: AMBER — Manifest and SW exist; documented strategy pending. See `docs/technical/offline-strategy.md` (this version).
- Accessibility (WCAG AA target): AMBER — Spec documented; automated checks pending in CI.
- Testing: RED — Unit-Tests für JSON-Parsing/Normalisierung geplant; API-Route-Tests in Arbeit.
- Observability/Rate Limiting/Content Safety: RED — Not specified or implemented; to be added.

## Key Links

- Style Guide (Canonical): `docs/design/style-guide-phantom-ui_based.md` (historical guides referenced as such)
- Text Overlay Spec and Offline Strategy: `docs/technical/offline-strategy.md`
- Story Pagination & Image Generation: `docs/technical/story-pagination-and-image-generation.md`
- System Design (SDD): `docs/technical/sdd.md`

## Next Actions

1. Wire multi-image generation per page into `POST /api/stories/generate` (see the plan in `story-pagination-and-image-generation.md`).
2. Align `SDD` and README with overlay data model and endpoint behaviors.
3. Add tests: unit (prompting/parsing), integration (API routes), E2E (creation + reading), accessibility audit.
4. Implement observability: request metrics, error categories, cost budgets, rate limits.
5. Finalize and enforce design tokens in Tailwind.


