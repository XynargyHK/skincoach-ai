import { NextRequest, NextResponse } from 'next/server'
import twilioService from '@/lib/twilio'
import { devStorage } from '@/lib/dev-storage'

// In-memory store for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; timestamp: number; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, name } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // For development mode, always use mock codes with persistent storage
    if (process.env.NODE_ENV === 'development') {
      // Clean up expired codes first
      devStorage.cleanup()

      const mockCode = '123456' // Fixed code for easy testing in dev
      const codeData = {
        code: mockCode,
        timestamp: Date.now(),
        attempts: 0
      }

      // Store in both memory and file for reliability
      verificationCodes.set(phoneNumber, codeData)
      devStorage.set(phoneNumber, codeData)

      console.log('📱 Generated DEV verification code:', {
        phoneNumber,
        code: mockCode,
        message: 'Using fixed code 123456 for development'
      })

      return NextResponse.json({
        success: true,
        message: 'Verification code sent (development mode)',
        code: mockCode // Always show in development
      })
    }

    // Check if Twilio is configured for production
    if (!twilioService.isConfigured()) {
      return NextResponse.json(
        { error: 'SMS service not configured' },
        { status: 500 }
      )
    }

    // Production mode - generate and send real SMS
    const code = twilioService.generateVerificationCode()

    // Store the code with timestamp (expires in 15 minutes)
    verificationCodes.set(phoneNumber, {
      code,
      timestamp: Date.now(),
      attempts: 0
    })

    try {
      // Send verification code via SMS
      await twilioService.sendVerificationCode(phoneNumber, code, name)

      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully'
      })

    } catch (twilioError) {
      console.error('Twilio send error:', twilioError)
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}

// Clean up expired codes periodically
setInterval(() => {
  const now = Date.now()
  const fifteenMinutes = 15 * 60 * 1000

  for (const [phoneNumber, data] of verificationCodes.entries()) {
    if (now - data.timestamp > fifteenMinutes) {
      verificationCodes.delete(phoneNumber)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes

export { verificationCodes }