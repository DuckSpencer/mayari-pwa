// src/app/api/images/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { imageService, ImageRequest } from '@/lib/ai/image-service';
import { createServerSupabaseClient } from '@/lib/supabase';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(user.id, 'image-generation', RATE_LIMITS.imageGeneration);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTime)
          }
        }
      );
    }

    const text = await request.text();
    const body = text ? JSON.parse(text) : {};
    const { prompt, style, numImages } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const imageRequest: ImageRequest = {
      prompt,
      style: style || 'fantasy',
      numImages: numImages || 1,
    };

    console.log('API: Generating images with multi-provider service');
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
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('API Error:', error);
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