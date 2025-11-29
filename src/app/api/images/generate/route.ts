// src/app/api/images/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { imageService, ImageRequest } from '@/lib/ai/image-service';
import { createServerSupabaseClient } from '@/lib/supabase';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { safeJsonParse } from '@/lib/utils/safe-json';

export async function POST(request: NextRequest) {
  try {
    // Authentication check - require logged-in user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    // Rate limiting check - image generation is expensive
    const rateLimit = checkRateLimit(user.id, 'image-generation', RATE_LIMITS.imageGeneration);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter), 'X-RateLimit-Remaining': '0' } }
      );
    }

    // Parse request body safely
    const text = await request.text();
    const body = safeJsonParse<{ prompt?: string; style?: string; numImages?: number }>(text, {});
    const { prompt, style, numImages } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate prompt length to prevent abuse
    if (typeof prompt !== 'string' || prompt.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Invalid prompt. Maximum 2000 characters allowed.' },
        { status: 400 }
      );
    }

    // Validate numImages to prevent excessive generation
    const imageCount = Math.min(Math.max(1, numImages || 1), 4);

    // Validate style (only allow 'realistic' or 'fantasy')
    const validStyle: 'realistic' | 'fantasy' = style === 'realistic' ? 'realistic' : 'fantasy';

    const imageRequest: ImageRequest = {
      prompt,
      style: validStyle,
      numImages: imageCount,
    };

    const result = await imageService.generateImages(imageRequest);

    if (result.success) {
      return NextResponse.json({
        success: true,
        images: result.images,
        provider: result.provider,
        metadata: result.metadata,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Image generation failed. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Image generation endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
} 