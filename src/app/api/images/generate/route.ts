// src/app/api/images/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openAIClient } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, n = 1, size = '1024x1024', model = 'dall-e-3', quality = 'standard', style = 'vivid' } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating images with prompt:', prompt);

    const response = await openAIClient.generateImages({
      prompt,
      n,
      size,
      model,
      quality,
      style,
    });

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: response.images,
      usage: response.usage,
    });

  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate images' },
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