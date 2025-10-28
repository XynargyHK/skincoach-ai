import { NextRequest, NextResponse } from 'next/server'

/**
 * Process Email Sequences - Cron Job Handler
 *
 * This endpoint should be called by a cron job (e.g., Vercel Cron, Railway Cron)
 * to process email sequences and send follow-up emails automatically.
 *
 * Cron schedule: Run every hour
 *
 * Example cron config in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/leads/process-sequences",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Cron] Processing email sequences...')

    // 1. Find all active sequence enrollments that need emails sent
    const enrollmentsToProcess = await findEnrollmentsToProcess()

    // 2. Process each enrollment
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      completed: 0
    }

    for (const enrollment of enrollmentsToProcess) {
      try {
        const sent = await processEnrollment(enrollment)
        if (sent) {
          results.sent++
        }
        results.processed++

        // Check if sequence is complete
        if (enrollment.current_step >= enrollment.sequence.max_emails) {
          results.completed++
        }
      } catch (error) {
        console.error('Error processing enrollment:', enrollment.id, error)
        results.failed++
      }
    }

    console.log('[Cron] Sequence processing complete:', results)

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('[Cron] Process sequences error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process sequences' },
      { status: 500 }
    )
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Email sequence processor is running',
    instructions: 'Use POST method to trigger sequence processing',
    nextRun: 'Every hour (0 * * * *)'
  })
}

// Helper functions

async function findEnrollmentsToProcess() {
  // In production, query Supabase:
  // SELECT * FROM lead_sequence_enrollments
  // WHERE status = 'active'
  // AND next_email_at <= NOW()

  // For demo, return from localStorage
  const enrollments = JSON.parse(localStorage?.getItem('skincoach_enrollments') || '[]')
  const now = new Date()

  return enrollments.filter((enrollment: any) => {
    return (
      enrollment.status === 'active' &&
      enrollment.next_email_at &&
      new Date(enrollment.next_email_at) <= now
    )
  })
}

async function processEnrollment(enrollment: any) {
  try {
    // 1. Get the email template for current step
    const template = await getEmailTemplate(enrollment.sequence_id, enrollment.current_step)

    if (!template) {
      console.log('No template found for step:', enrollment.current_step)
      return false
    }

    // 2. Get lead details
    const lead = await getLead(enrollment.lead_id)

    if (!lead || !lead.email) {
      console.log('Lead not found or no email:', enrollment.lead_id)
      return false
    }

    // 3. Personalize email content
    const personalizedSubject = personalizeContent(template.subject, lead)
    const personalizedBody = personalizeContent(template.body, lead)

    // 4. Send email
    const response = await fetch('/api/leads/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: lead.id,
        templateId: template.id,
        to: lead.email,
        subject: personalizedSubject,
        body: personalizedBody
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    // 5. Update enrollment
    enrollment.current_step++
    enrollment.last_email_sent_at = new Date()

    // Calculate next email time
    const delayDays = enrollment.sequence.delay_days || 3
    const nextEmailDate = new Date()
    nextEmailDate.setDate(nextEmailDate.getDate() + delayDays)
    enrollment.next_email_at = nextEmailDate

    // Check if sequence is complete
    if (enrollment.current_step >= enrollment.sequence.max_emails) {
      enrollment.status = 'completed'
      enrollment.completed_at = new Date()
    }

    // Save enrollment
    await saveEnrollment(enrollment)

    // Log activity
    await logEmailActivity({
      lead_id: lead.id,
      enrollment_id: enrollment.id,
      template_id: template.id,
      subject: personalizedSubject,
      body: personalizedBody,
      sent_to: lead.email,
      status: 'sent'
    })

    return true

  } catch (error) {
    console.error('Process enrollment error:', error)
    return false
  }
}

async function getEmailTemplate(sequenceId: string, stepNumber: number) {
  // In production, query: SELECT * FROM email_templates WHERE sequence_id = ? AND step_number = ?
  const templates = JSON.parse(localStorage?.getItem('skincoach_email_templates') || '[]')
  return templates.find((t: any) => t.sequence_id === sequenceId && t.step_number === stepNumber)
}

async function getLead(leadId: string) {
  // In production, query: SELECT * FROM leads WHERE id = ?
  const leads = JSON.parse(localStorage?.getItem('skincoach_leads') || '[]')
  return leads.find((l: any) => l.id === leadId)
}

function personalizeContent(content: string, lead: any) {
  let personalized = content

  // Replace template variables
  personalized = personalized.replace(/\{\{firstName\}\}/g, lead.first_name || 'there')
  personalized = personalized.replace(/\{\{lastName\}\}/g, lead.last_name || '')
  personalized = personalized.replace(/\{\{company\}\}/g, lead.company || 'your company')
  personalized = personalized.replace(/\{\{title\}\}/g, lead.title || 'your role')

  // Add calendar link if configured
  const calendarLink = process.env.NEXT_PUBLIC_CALENDAR_LINK || 'https://calendly.com/your-calendar'
  personalized = personalized.replace(/\[Calendar Link\]/g, calendarLink)

  return personalized
}

async function saveEnrollment(enrollment: any) {
  // In production, UPDATE lead_sequence_enrollments
  const enrollments = JSON.parse(localStorage?.getItem('skincoach_enrollments') || '[]')
  const index = enrollments.findIndex((e: any) => e.id === enrollment.id)
  if (index >= 0) {
    enrollments[index] = enrollment
    localStorage.setItem('skincoach_enrollments', JSON.stringify(enrollments))
  }
}

async function logEmailActivity(activity: any) {
  // In production, INSERT INTO email_activities
  const activities = JSON.parse(localStorage?.getItem('skincoach_email_activities') || '[]')
  activities.push({
    ...activity,
    id: `activity-${Date.now()}`,
    sent_at: new Date()
  })
  localStorage.setItem('skincoach_email_activities', JSON.stringify(activities))
}
