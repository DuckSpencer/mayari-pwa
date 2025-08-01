// src/app/api/images/test-fal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { imageService } from '@/lib/ai/image-service';

export async function GET() {
  try {
    console.log('Testing fal.ai availability...');
    
    // Check fal.ai availability
    const availability = await imageService.checkProviderAvailability();
    
    console.log('fal.ai availability:', availability);
    
    return NextResponse.json({
      success: true,
      availability,
      message: 'fal.ai availability check completed',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Test fal.ai error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 