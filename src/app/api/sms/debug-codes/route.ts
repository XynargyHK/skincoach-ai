import { NextRequest, NextResponse } from 'next/server'
import { verificationCodes } from '../send-verification/route'

export async function GET(request: NextRequest) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Debug endpoint only available in development' },
        { status: 403 }
      )
    }

    // Convert Map to Object for JSON serialization
    const codesData: { [key: string]: any } = {}

    for (const [phone, data] of verificationCodes.entries()) {
      codesData[phone] = {
        code: data.code,
        timestamp: data.timestamp,
        attempts: data.attempts,
        timeLeft: Math.max(0, (data.timestamp + 15 * 60 * 1000) - Date.now()),
        expired: (Date.now() - data.timestamp) > (15 * 60 * 1000)
      }
    }

    return NextResponse.json({
      success: true,
      codes: codesData,
      totalCodes: verificationCodes.size,
      currentTime: Date.now()
    })

  } catch (error) {
    console.error('Debug codes error:', error)
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { status: 500 }
    )
  }
}