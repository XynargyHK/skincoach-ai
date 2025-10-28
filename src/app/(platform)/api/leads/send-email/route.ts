import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { leadId, templateId, subject, body, to } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email provider configuration
    const emailProvider = process.env.EMAIL_PROVIDER || 'resend' // resend, sendgrid, ses

    let result
    if (emailProvider === 'resend') {
      result = await sendEmailViaResend({ to, subject, body })
    } else if (emailProvider === 'sendgrid') {
      result = await sendEmailViaSendGrid({ to, subject, body })
    } else {
      return NextResponse.json(
        { error: 'Email provider not configured' },
        { status: 500 }
      )
    }

    // Log the email activity to database
    // In production, insert into email_activities table
    console.log('Email sent:', { leadId, templateId, to, status: 'sent' })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      provider: emailProvider
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Resend integration (https://resend.com)
async function sendEmailViaResend({ to, subject, body }: { to: string, subject: string, body: string }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'noreply@skincoach.ai',
      to: [to],
      subject,
      html: body
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Resend API error: ${error.message}`)
  }

  const data = await response.json()
  return { messageId: data.id }
}

// SendGrid integration (alternative)
async function sendEmailViaSendGrid({ to, subject, body }: { to: string, subject: string, body: string }) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not configured')
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        subject
      }],
      from: {
        email: process.env.EMAIL_FROM || 'noreply@skincoach.ai',
        name: 'SkinCoach Team'
      },
      content: [{
        type: 'text/html',
        value: body
      }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid API error: ${error}`)
  }

  // SendGrid doesn't return message ID in response body
  const messageId = response.headers.get('X-Message-Id') || 'unknown'
  return { messageId }
}
