# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mayari is an AI-powered children's storybook generator PWA that creates personalized stories for kids aged 2-5. It uses Claude Sonnet 4 for text generation and fal.ai FLUX.1 for illustrations.

**Current Status:** 87% complete. Core functionality is working with 9 stories successfully generated. See `docs/technical/status.md` for detailed status.

## Development Commands

### Essential Commands
```bash
# Development
pnpm dev              # Start dev server on :3000 with Turbopack
pnpm dev:api          # Start dev server on :3001
pnpm build            # Production build
pnpm start            # Production server on :3000
pnpm start:api        # Production server on :3001
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run Jest tests (--runInBand)

# Docker Development
docker-compose up --build -d      # Start all services
docker-compose logs mayari-api    # View API logs
docker-compose down               # Stop services
```

### Running Single Tests
```bash
pnpm test -- src/lib/ai/__tests__/openrouter.utils.test.ts
```

## Architecture Overview

### Tech Stack
- **Frontend:** Next.js 15.4 (App Router), React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS with Phantom UI design system
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (email/password)
- **AI Services:**
  - Text: OpenRouter + Claude Sonnet 4 (`anthropic/claude-3.5-sonnet`)
  - Images: fal.ai with model selection (FLUX.1 or Nano Banana)
    - Default: FLUX.1 schnell (`fal-ai/flux/schnell`) - $0.01/img, baseline
    - Alternative: Nano Banana (`fal-ai/nano-banana`) - Google's model, excellent character consistency
- **Package Manager:** pnpm 10.14.0

### Core Data Flow

**Story Generation Pipeline:**
1. User input → `/story/setup` → `/story/configure` → `/story/generate`
2. POST `/api/stories/generate` receives `{ userInput, storyContext: { storyType, artStyle, pageCount } }`
3. OpenRouter generates structured text via `generatePagedStory()` in `src/lib/ai/openrouter.ts`
4. Text is parsed into pages array, stored in `text_content[]`
5. For each page, fal.ai generates illustration with style-specific prompts
6. Images stored in `image_urls[]` array (parallel indices with text_content)
7. Story saved to Supabase with RLS policies ensuring user-only access
8. User redirected to `/story/read` for immersive full-screen reading

**Key Invariant:** `text_content[]` and `image_urls[]` arrays must have matching lengths and parallel indices.

### Directory Structure

```
src/
├── app/
│   ├── api/                 # Next.js API Routes
│   │   ├── stories/         # Story CRUD + generation
│   │   │   ├── generate/    # POST: Create new story
│   │   │   ├── continue/    # POST: Continue existing story
│   │   │   ├── [id]/        # GET/PUT/DELETE: Story operations
│   │   │   └── route.ts     # GET: List user stories
│   │   └── images/
│   │       └── generate/    # POST: Single image generation
│   ├── story/               # Story creation flow (protected)
│   │   ├── setup/           # Initial prompt input
│   │   ├── configure/       # Story type, art style, page count
│   │   ├── generate/        # AI generation in progress
│   │   ├── read/            # Immersive reading view
│   │   └── end/             # Story completion actions
│   ├── stories/             # Story library (protected)
│   ├── auth/                # Login/register pages
│   └── page.tsx             # Landing page
├── lib/
│   ├── ai/
│   │   ├── openrouter.ts    # Claude text generation client
│   │   ├── openrouter.utils.ts # JSON parsing/normalization
│   │   ├── fal.ts           # FLUX.1 image generation client
│   │   └── image-service.ts # High-level image service
│   └── supabase.ts          # Supabase client config
├── components/
│   └── auth/                # Auth components (UserButton, AuthProvider)
└── types/
    ├── database.ts          # Generated Supabase types
    ├── ai.ts                # AI service types
    └── index.ts             # Shared types
```

### Database Schema

**stories table:**
```sql
- id: uuid (PK)
- user_id: uuid (FK to auth.users)
- prompt: text (user's original input)
- story_type: 'realistic' | 'fantasy'
- art_style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
- page_count: 8 | 12 | 16
- image_urls: text[] (ordered array of image URLs)
- text_content: text[] (ordered array of page texts)
- is_public: boolean (default: false)
- created_at: timestamp
- updated_at: timestamp
```

**RLS Policies:** Users can only view/modify their own stories. Public stories can be viewed by anyone (future feature).

### AI Integration Details

**Text Generation (OpenRouter):**
- Client: `src/lib/ai/openrouter.ts` → `OpenRouterClient`
- Key method: `generatePagedStory(prompt, pageCount, storyType, artStyle)`
- Returns: `{ pages: Array<{pageNumber, text}>, totalPages }`
- Model: `anthropic/claude-3.5-sonnet`
- Structured pagination ensures consistent page counts

**Image Generation (fal.ai):**
- Client: `src/lib/ai/fal.ts` → `FalClient`
- Key method: `generateImages(request: FalImageRequest)`
- Model Selection (configure via `FAL_IMAGE_MODEL` env or per-request `model` parameter):
  - **FLUX.1 schnell** (default): `fal-ai/flux/schnell` - $0.01/img, ~1.6s, baseline quality
  - **FLUX.1 dev**: `fal-ai/flux/dev` - $0.03/img, ~3-4s, better character consistency
  - **FLUX.1 pro**: `fal-ai/flux/pro` - $0.04/img, ~4-5s, supports character references
  - **Nano Banana**: `fal-ai/nano-banana` - Google's model, excellent character consistency (user-reported)
- **API Parameter Mapping:**
  - FLUX uses `image_size` (e.g., `landscape_4_3`, `portrait_3_4`)
  - Nano Banana uses `aspect_ratio` (e.g., `4:3`, `3:4`)
  - `mapAspectRatio()` automatically converts between formats
- Style mapping:
  - `peppa-pig` → "Peppa Pig style, simple shapes, flat colors"
  - `pixi-book` → "Pixi book style, soft watercolors, whimsical"
  - `watercolor` → "Watercolor painting, soft edges, dreamy"
  - `comic` → "Comic book style, bold lines, vibrant colors"
- All images include: "child-friendly, safe for children, warm colors, no scary elements"
- **A/B Testing:** Set `FAL_IMAGE_MODEL=fal-ai/nano-banana` in `.env` to test Nano Banana globally

### Middleware & Auth

`middleware.ts` handles:
- Session refresh via Supabase SSR
- Protected routes: `/stories/*`, `/story/*` → redirect to `/auth/login` if unauthenticated
- Auth routes: `/auth/login`, `/auth/register` → redirect to `/` if authenticated

### Environment Variables

Required in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rohgprasvvelqsbxvnqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# AI Services
OPENROUTER_API_KEY=<key>
FAL_KEY=<key>

# Optional
NODE_ENV=development
PORT=3001  # For Docker
```

## Design System (Phantom UI)

### Color Palette
- Primary Warm: `#FFF8F0` (main background)
- Primary Soft Blue: `#7B9AE0` (interactive)
- Primary Deep Navy: `#2C3E50` (text/headers)
- Secondary Peach: `#FFB4A1` (warm accents)
- Secondary Lavender: `#D4C5F0` (gentle backgrounds)
- Accent Gold: `#F4D03F` (magical elements)
- Accent Coral: `#FF8A65` (primary CTAs)

### Typography
- UI Font: Poppins (300, 400, 500, 600, 700)
- Story Text: Georgia (reading experience)
- Playful: Comic Neue

See `docs/design/style-guide-phantom-ui_based.md` for full design tokens.

## Development Workflow Guidance

### When Adding New Features

1. **Check Status:** Review `docs/technical/status.md` for current implementation state
2. **Follow Patterns:** Study existing API routes and components for consistency
3. **Type Safety:** Use strict TypeScript. Reference `src/types/database.ts` for DB types
4. **Path Aliases:** Use `@/` for imports (configured in `tsconfig.json`)
5. **Testing:** Write tests in `__tests__/` subdirectories. Use Jest + ts-jest
6. **RLS Awareness:** All DB operations must respect Supabase RLS policies

### Testing Strategy

Current test coverage is minimal (RED status). When adding tests:

- **Unit Tests:** AI utilities (`openrouter.utils.ts`), prompt builders, style mapping
- **Integration Tests:** API routes (`/api/stories/generate`, `/api/images/generate`)
- **Test Structure:** Place in `__tests__/` folders next to source files
- **Mock Pattern:** Mock Supabase client and AI service calls
- **Run Config:** Tests use Jest with `ts-jest` preset, `node` environment

Example test location: `src/lib/ai/__tests__/openrouter.utils.test.ts`

### Common Pitfalls

1. **Array Length Mismatch:** Always ensure `text_content.length === image_urls.length`
2. **RLS Violations:** Never query stories without proper user_id filtering
3. **Missing Auth Check:** API routes must verify authentication before DB operations
4. **Style Consistency:** All new components must use Tailwind classes from Phantom UI palette
5. **Docker Compatibility:** Use Axios for HTTP requests (not `fetch()`) when deploying to Docker

### Key Files to Reference

- **PRD:** `docs/technical/prd.md` - Product requirements
- **SDD:** `docs/technical/sdd.md` - System design document
- **Frontend Spec:** `docs/technical/frontend-spec.md`
- **Story Pagination:** `docs/technical/story-pagination-and-image-generation.md`
- **Offline Strategy:** `docs/technical/offline-strategy.md`
- **Status:** `docs/technical/status.md` - Current implementation state

## Known Outstanding Work

From `docs/technical/status.md`:

1. **PDF Export** (Story 2.5) - `POST /api/stories/{id}/export-pdf` not implemented
2. **Share Functionality** (Story 2.6) - Public URLs, Web Share API, social meta tags
3. **Testing** (Story 3.4) - Comprehensive unit/integration/E2E test suite
4. **Observability** (Epic 3) - Metrics, rate limiting, content safety hooks
5. **Rich Previews** (Story 3.3) - Open Graph meta tags for shared stories

## BMAD Agent System

This project uses a custom agent orchestration system located in `.bmad-core/`. Key agents:

- **@dev** - Development agent for implementation tasks
- **@pm** - Product management agent
- **@qa** - Quality assurance agent
- **@architect** - System architecture agent

When activating agents via `@<agent-name>`, they load specific workflows and configurations from `.bmad-core/`. The system uses a story-driven development approach with tasks, checklists, and templates.

**Note:** Do NOT load story files during general development unless explicitly requested. Stories are managed by the BMAD orchestrator.
