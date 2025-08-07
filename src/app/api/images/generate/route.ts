// src/app/api/images/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { imageService, ImageRequest } from '@/lib/ai/image-service';

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = text ? JSON.parse(text) : {};
    const { prompt, width, height, style, numImages } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const imageRequest: ImageRequest = {
      prompt,
      // width/height are not used by fal.ai payload currently; keep optional
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

  } catch (error: any) {
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