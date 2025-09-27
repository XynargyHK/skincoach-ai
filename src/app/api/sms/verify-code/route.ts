import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import twilioService from '@/lib/twilio'
import { verificationCodes } from '../send-verification/route'
import { devStorage } from '@/lib/dev-storage'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code, name, userId } = await request.json()

    if (!phoneNumber || !code || !name) {
      return NextResponse.json(
        { error: 'Phone number, code, and name are required' },
        { status: 400 }
      )
    }

    // Get stored verification data - try both memory and dev storage
    let storedData = verificationCodes.get(phoneNumber)

    // In development, also try file storage
    if (!storedData && process.env.NODE_ENV === 'development') {
      storedData = devStorage.get(phoneNumber)
    }

    console.log('🔍 Verification attempt:', {
      phoneNumber,
      code,
      storedData: storedData ? { code: storedData.code, attempts: storedData.attempts, age: Date.now() - storedData.timestamp } : 'NOT_FOUND',
      developmentMode: process.env.NODE_ENV === 'development'
    })

    if (!storedData) {
      console.log('❌ No stored data for phone:', phoneNumber)
      return NextResponse.json(
        { error: 'Verification code not found or expired' },
        { status: 400 }
      )
    }

    // Check if code is expired (15 minutes)
    const fifteenMinutes = 15 * 60 * 1000
    if (Date.now() - storedData.timestamp > fifteenMinutes) {
      verificationCodes.delete(phoneNumber)
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if too many attempts
    if (storedData.attempts >= 3) {
      verificationCodes.delete(phoneNumber)
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code' },
        { status: 400 }
      )
    }

    // Verify the code
    if (storedData.code !== code) {
      storedData.attempts++
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Code is valid - clean up the verification data
    verificationCodes.delete(phoneNumber)
    if (process.env.NODE_ENV === 'development') {
      devStorage.delete(phoneNumber)
    }

    try {
      // Try to update user profile in Supabase (if profiles table exists)
      let userData = null
      try {
        const { data, error: userError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: userId,
              name: name,
              phone: phoneNumber,
              phone_verified: true,
              updated_at: new Date().toISOString()
            }
          ])
          .select()

        if (!userError) {
          userData = data
        } else {
          console.log('Profiles table not available:', userError.message)
        }
      } catch (profileError) {
        console.log('Profile storage skipped:', profileError)
      }

      // Send welcome message via SMS (optional)
      try {
        if (twilioService.isConfigured()) {
          await twilioService.sendWelcomeMessage(phoneNumber, name)
        }
      } catch (smsError) {
        console.error('Welcome SMS failed:', smsError)
        // Don't fail verification if welcome SMS fails
      }

      return NextResponse.json({
        success: true,
        message: 'Phone number verified successfully',
        user: userData?.[0] || null,
        name: name,
        phone: phoneNumber
      })

    } catch (dbError) {
      console.error('Database error during verification:', dbError)

      // Even if database update fails, we can still proceed
      return NextResponse.json({
        success: true,
        message: 'Phone number verified (profile update pending)',
        warning: 'Profile update failed - please contact support if needed'
      })
    }

  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    )
  }
}