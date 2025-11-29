// src/app/api/health/route.ts
// Health check endpoint for Docker container monitoring

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Minimal health check - avoid exposing sensitive system information
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(healthStatus, { status: 200 })
  } catch {
    return NextResponse.json(
      { status: 'unhealthy' },
      { status: 500 }
    )
  }
} 