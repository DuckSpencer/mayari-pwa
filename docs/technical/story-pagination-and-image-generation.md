# Story Pagination & Multi-Image Generation Plan

Goal: Generate one image per story page and align `text_content[]` and `image_urls[]` arrays for the reader.

## Page Structure

- Page count options: 8, 12, 16 (as per PRD).
- Output arrays must have equal length: `text_content.length === image_urls.length === page_count`.

## Text Pagination (Claude via OpenRouter)

1. Prompt Claude to return structured JSON with pages.
2. Schema:
   ```json
   {
     "title": "...",
     "pages": [
       { "text": "1-3 sentences suitable for ages 2-5" },
       ...
     ]
   }
   ```
3. Validate length equals `page_count`. If mismatch, truncate or pad with empty strings and log.

## Image Generation (fal.ai)

1. For each page `pages[i].text`, build a scene prompt including selected art style and safety hints.
2. Call `falClient.generateImages` sequentially or in limited parallel (batch size 3–4) to respect provider rate limits.
3. Collect image URLs into `image_urls[i]`.

## API Contract Changes

- `POST /api/stories/generate`
  - Request: `{ userInput, storyContext: { storyType, artStyle, pageCount } }`
  - Response: `{ success, title, text_content: string[], image_urls: string[] }`
  - Behavior: Generates structured pages + images, saves to DB if `userId` provided.

## Fallbacks & Retries

- If image generation for a page fails: retry up to 2 times; on final failure, insert placeholder URL and continue.
- If Claude returns fewer pages: pad with empty text and generate generic background to keep arrays aligned.

## Rate Limiting & Cost Budgets

- Limit total images per story to `page_count`.
- Enforce server-side guard: `page_count <= 16`.
- Throttle concurrent fal.ai requests to 3–4.

## Reader Assumptions (Overlay)

- Reader overlays `text_content[i]` over `image_urls[i]` using rules in `offline-strategy.md`.


