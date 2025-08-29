// src/app/api/stories/generate/__tests__/route.test.ts
import { POST } from '@/app/api/stories/generate/route'

// Mock next/server minimal API
jest.mock('next/server', () => ({
  NextResponse: {
    json: (obj: any, init?: any) => ({ status: init?.status || 200, body: obj }),
  },
}))

// Mock OpenRouter client
jest.mock('@/lib/ai/openrouter', () => {
  return {
    openRouterClient: {
      generatePagedStory: jest.fn(async (userInput: string, pageCount: number) => ({
        title: userInput.slice(0, 20),
        pages: Array.from({ length: pageCount }, (_, i) => ({ text: `Page ${i + 1} text.` })),
      })),
      extractStoryMetadata: jest.fn(async () => ({ summary: 'Summary', character_sheet: '' })),
      extractCast: jest.fn(async () => []),
      planVisuals: jest.fn(async (paged: { pages: Array<{ text: string }> }) =>
        Array.from({ length: paged.pages.length }, () => ({
          include_characters: true,
          subjects: 'main characters',
          shot: 'medium',
          camera: 'eye-level',
          environment: '',
          time_of_day: 'day',
          lighting: 'soft natural light',
        }))
      ),
    },
  }
})

// Mock fal.ai client
const falMockImpl = {
  generateImages: jest.fn(async ({ prompt }: { prompt: string }) => ({
    success: true,
    images: [`https://img.local/${Buffer.from(prompt).toString('base64').slice(0, 8)}.jpg`],
  })),
}
jest.mock('@/lib/ai/fal', () => {
  const falMockImpl = {
    generateImages: jest.fn(async ({ prompt }: { prompt: string }) => ({
      success: true,
      images: [`https://img.local/${Buffer.from(prompt).toString('base64').slice(0, 8)}.jpg`],
    })),
  }
  return { falClient: falMockImpl }
})

// Mock Supabase client
const supabaseInsertMock = jest.fn(async () => ({ error: null }))
jest.mock('@/lib/supabase', () => ({
  createServerSupabaseClient: jest.fn(async () => ({
    auth: { getUser: jest.fn(async () => ({ data: { user: { id: 'user-1' } }, error: null })) },
    from: () => ({ insert: supabaseInsertMock }),
  })),
}))

function makeRequest(body: any): any {
  return {
    json: async () => body,
  } as any
}

describe('POST /api/stories/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('generates a paginated story with one image per page and stores it', async () => {
    const req = makeRequest({
      userInput: 'A magical forest',
      storyContext: { storyType: 'fantasy', artStyle: 'comic', pageCount: 3 },
      userId: 'user-1',
    })

    const res: any = await POST(req)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.text_content).toHaveLength(3)
    expect(res.body.image_urls).toHaveLength(3)

    // fal.ai called once per page
    const { falClient } = require('@/lib/ai/fal')
    expect(falClient.generateImages).toHaveBeenCalledTimes(3)
    // First call prompt should be a non-empty string
    const firstCallArg = (falClient.generateImages as jest.Mock).mock.calls[0][0]
    expect(typeof firstCallArg.prompt).toBe('string')
    expect(firstCallArg.prompt.length).toBeGreaterThan(0)

    // DB insert performed with aligned arrays
    expect(supabaseInsertMock).toHaveBeenCalledTimes(1)
    const inserted = (supabaseInsertMock as jest.Mock).mock.calls[0][0]
    expect(inserted.text_content.length).toBe(3)
    expect(inserted.image_urls.length).toBe(3)
  })

  it('returns 400 on missing userInput', async () => {
    const req = makeRequest({ userInput: '' })
    const res: any = await POST(req)
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})


