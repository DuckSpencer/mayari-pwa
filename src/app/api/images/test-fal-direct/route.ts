// src/app/api/images/test-fal-direct/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { falClient } from '@/lib/ai/fal';

export async function GET() {
  try {
    console.log('Direct fal.ai test...');
    
    const result = await falClient.generateImages({
      prompt: 'test',
      num_inference_steps: 1,
      sync_mode: true,
    });
    
    console.log('Direct fal.ai result:', result);
    
    return NextResponse.json({
      success: true,
      result,
      message: 'Direct fal.ai test completed',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('Direct fal.ai test error:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
} 