// src/app/api/images/flux-generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fluxClient } from '@/lib/ai/flux';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      width = 1024, 
      height = 768, 
      steps = 28, 
      prompt_upsampling = false,
      seed = null,
      guidance = 3,
      safety_tolerance = 2,
      output_format = 'jpeg'
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating FLUX.1 images with prompt:', prompt);

    const response = await fluxClient.generateImages({
      prompt,
      width,
      height,
      steps,
      prompt_upsampling,
      seed,
      guidance,
      safety_tolerance,
      output_format,
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
      id: response.id,
    });

  } catch (error: any) {
    console.error('FLUX.1 image generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate images' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'FLUX.1 image generation endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
} 