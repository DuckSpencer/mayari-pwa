# Offline Strategy & Text Overlay Spec

Decision: Text Overlay (preferred)

Rationale: Overlay is more reliable across providers, supports i18n and accessibility, enables late edits without regenerating images, and reduces token/image costs.

## Overlay Rules (Reader Composition)

- Typography: Georgia, 24px/32px for main story text; 20px/28px for longer pages. Weight Regular.
- Contrast: Ensure WCAG AA. Apply outline stroke (1.5–2px) in Primary Deep Navy (#2C3E50) behind white text or use soft dark gradient at bottom 30% of image.
- Shadow: Text shadow 0 2px 6px rgba(0,0,0,0.35) when background is bright; reduce on dark scenes.
- Safe Zones: 24px inner padding; avoid device notches; keep text within bottom 40% unless image is dark on top.
- Max Lines: 2–3 sentences per page, hard wrap to 6–8 lines; hyphenation off.
- Language: Large numerals and simple vocabulary suitable for ages 2–5.

## Data Model Alignment

- `stories.image_urls: text[]` — ordered list of page images
- `stories.text_content: text[]` — ordered list of page texts (same length as `image_urls`)
- Optional `stories.title: text`

## Rendering Pipeline

1. Load image (cache-first) and corresponding text.
2. Compute contrast over intended text area; if < 4.5:1, apply gradient overlay (linear, transparent to rgba(0,0,0,0.45)).
3. Render text with typographic rules; clamp lines and apply ellipsis only in creation preview, never in reader.
4. Respect `prefers-reduced-motion` for transitions.

## Workbox Caching Strategy

- App Shell (HTML, JS, CSS): `stale-while-revalidate` with revisioning.
- Story Images (`/storage/...` and external fal/bfl URLs): `cache-first`, maxEntries 200, maxAgeSeconds 30 days, cacheName `story-images-v1`.
- Story Metadata/API (`/api/stories*` GET): `network-first` with fallback to cache; background sync for writes where applicable.
- Fonts/Icons: `cache-first` with long maxAge and integrity.

## Versioning & Invalidation

- Bump cache names on breaking UI/overlay changes (e.g., `story-images-v2`).
- Provide a hidden settings action to clear caches for debugging.

## Error/Offline UX

- Offline Reader: Show previously cached stories seamlessly.
- Missing Page Image: Show soft placeholder with message and allow retry; keep text visible.
- Generation Timeout: Offer retry and suggest shorter story.

## Security & Safety

- Disallow third-party hotlinking by validating origin before caching when feasible.
- Respect content safety flags; if an image is flagged, blur and show safety message while keeping text.


