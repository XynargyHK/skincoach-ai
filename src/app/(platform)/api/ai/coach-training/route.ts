import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { matchFAQ, getCannedMessage, determineResponseType } from '@/lib/faq-library'

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface TrainingRequest {
  prompt: string
  customerMessage: string
  conversationHistory: Array<{
    sender: 'user' | 'customer'
    message: string
    timestamp: string
  }>
  customerPersona?: string
  scenario?: string
}

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      customerMessage,
      conversationHistory,
      customerPersona,
      scenario
    }: TrainingRequest = await request.json()

    if (!prompt || !customerMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ===== COST-SAVING STRATEGY: Check FAQ First =====
    // Try to match customer message against FAQ database
    const faqMatch = matchFAQ(customerMessage)

    if (faqMatch) {
      // Return FAQ answer instantly without calling OpenAI (saves $$$)
      return NextResponse.json({
        success: true,
        response: faqMatch.answer,
        metadata: {
          model: 'faq-template',
          tokens: 0, // No AI tokens used!
          timestamp: new Date().toISOString(),
          source: 'faq',
          category: faqMatch.category
        }
      })
    }

    // Check if this is a first message (use greeting canned message)
    if (conversationHistory.length === 0) {
      const greetingMessage = getCannedMessage('greeting')
      if (greetingMessage) {
        return NextResponse.json({
          success: true,
          response: greetingMessage.template,
          metadata: {
            model: 'canned-message',
            tokens: 0, // No AI tokens used!
            timestamp: new Date().toISOString(),
            source: 'canned',
            scenario: 'greeting'
          }
        })
      }
    }

    // Check for common canned message scenarios
    const messageLower = customerMessage.toLowerCase()
    let cannedMessageId: string | null = null

    if (messageLower.includes('too expensive') || messageLower.includes('too much') || messageLower.includes('can\'t afford')) {
      cannedMessageId = 'price-objection-general'
    } else if (messageLower.includes('amazon') || messageLower.includes('cheaper') || messageLower.includes('walmart')) {
      cannedMessageId = 'amazon-comparison'
    }

    if (cannedMessageId) {
      const cannedMsg = getCannedMessage(cannedMessageId)
      if (cannedMsg) {
        return NextResponse.json({
          success: true,
          response: cannedMsg.template,
          metadata: {
            model: 'canned-message',
            tokens: 0, // No AI tokens used!
            timestamp: new Date().toISOString(),
            source: 'canned',
            scenario: cannedMsg.scenario
          }
        })
      }
    }

    // ===== No FAQ/Canned match - Use AI =====

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender === 'user' ? 'Dr. Sakura' : 'Customer'}: ${msg.message}`)
      .join('\n')

    // Create system prompt with custom instructions
    const systemPrompt = `${prompt}

CURRENT TRAINING CONTEXT:
${customerPersona ? `Customer Persona: ${customerPersona}` : ''}
${scenario ? `Training Scenario: ${scenario}` : ''}

CONVERSATION HISTORY:
${conversationContext}

INSTRUCTIONS:
- You are in a training environment helping to improve your responses
- Respond as Dr. Sakura based on the instructions above
- Be helpful, professional, and follow your configured personality
- Keep responses between 50-150 words for training purposes
- Always end with a relevant follow-up question when appropriate`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the faster, cost-effective model
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Customer says: "${customerMessage}"\n\nPlease respond as Dr. Sakura according to your training instructions.`
        }
      ],
      max_tokens: 250,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()

    if (!aiResponse) {
      throw new Error('No response generated from OpenAI')
    }

    // Return the AI response with metadata
    return NextResponse.json({
      success: true,
      response: aiResponse,
      metadata: {
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
        source: 'ai', // Indicates this used AI (cost money)
        cost: ((completion.usage?.prompt_tokens || 0) * 0.15 / 1000000) + ((completion.usage?.completion_tokens || 0) * 0.60 / 1000000)
      }
    })

  } catch (error) {
    console.error('AI Coach Training API Error:', error)

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'AI Coach Training API is running',
    model: 'gpt-4o-mini',
    status: 'ready'
  })
}