// src/app/api/images/flux-story-illustration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fluxClient } from '@/lib/ai/flux';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyTitle, storyContent, style = 'fantasy' } = body;

    if (!storyTitle || !storyContent) {
      return NextResponse.json(
        { success: false, error: 'Story title and content are required' },
        { status: 400 }
      );
    }

    console.log('Generating FLUX.1 story illustration for:', storyTitle);

    const response = await fluxClient.generateStoryIllustration(
      storyTitle,
      storyContent,
      style
    );

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
    console.error('FLUX.1 story illustration generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate story illustration' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'FLUX.1 story illustration endpoint is healthy',
    timestamp: new Date().toISOString(),
  });
} 