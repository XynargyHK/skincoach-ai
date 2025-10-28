import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CustomerBrainRequest {
  scenario: {
    name: string
    description: string
    customerType: string
    objectives: string[]
  }
  coachMessage: string
  conversationHistory: Array<{
    sender: 'user' | 'customer'
    message: string
    timestamp: string
  }>
  turn: number
}

export async function POST(request: NextRequest) {
  try {
    const {
      scenario,
      coachMessage,
      conversationHistory,
      turn
    }: CustomerBrainRequest = await request.json()

    if (!scenario || !coachMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Build conversation context for the AI Customer
    const conversationContext = conversationHistory
      .slice(-4) // Last 4 messages for context
      .map(msg => `${msg.sender === 'user' ? 'Dr. Sakura' : 'Customer'}: ${msg.message}`)
      .join('\n')

    // Create AI Customer personality prompt based on customer type
    const customerPersonalities = {
      angry: `You are a VERY FRUSTRATED customer who had a bad experience with skincare products. You're demanding, skeptical, and need to be convinced through concrete actions (refunds, guarantees, expert consultation). You gradually become less hostile if the coach shows genuine effort to fix the problem.`,

      confused: `You are a CONFUSED customer who feels overwhelmed by skincare. You ask lots of clarifying questions, need simple explanations, and worry about making mistakes. You become more confident as the coach provides clear, step-by-step guidance.`,

      'price-sensitive': `You are a BUDGET-CONSCIOUS customer looking for affordable skincare that actually works. You question costs, ask about value, and need proof that expensive products are worth it. You're interested but need to see clear financial value.`,

      'tech-savvy': `You are a RESEARCH-ORIENTED customer who knows about ingredients and wants scientific proof. You ask technical questions about formulations, concentrations, studies, and data. You respect expertise and detailed scientific explanations.`,

      enthusiastic: `You are an EXCITED customer who loves trying new skincare innovations. You're eager to try advanced products, ask about cutting-edge ingredients, and want the most comprehensive routines. You're ready to invest in premium options.`
    }

    const customerPersonality = customerPersonalities[scenario.customerType as keyof typeof customerPersonalities] || customerPersonalities.confused

    // Create system prompt for AI Customer
    const systemPrompt = `${customerPersonality}

CURRENT SCENARIO: ${scenario.name}
SCENARIO CONTEXT: ${scenario.description}

CONVERSATION PROGRESS: This is turn ${turn} of the conversation.

RECENT CONVERSATION:
${conversationContext}

DR. SAKURA'S LATEST RESPONSE: "${coachMessage}"

INSTRUCTIONS FOR YOUR RESPONSE:
- Respond naturally as a ${scenario.customerType} customer would
- React to what Dr. Sakura just said in a realistic way
- Progress the conversation naturally (don't repeat the same concerns)
- Show character development - gradually move toward resolution if the coach is doing well
- Ask follow-up questions that challenge the coach to meet the scenario objectives
- Keep responses conversational and realistic (1-3 sentences)
- Don't be too easy to convince, but don't be impossibly difficult either
- Use natural customer language, not marketing speak

Generate a realistic customer response that moves the conversation forward naturally.`

    // Call OpenAI API for AI Customer response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `As a ${scenario.customerType} customer, how do you respond to Dr. Sakura's message: "${coachMessage}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.8, // Higher temperature for more varied responses
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    })

    const aiCustomerResponse = completion.choices[0]?.message?.content?.trim()

    if (!aiCustomerResponse) {
      throw new Error('No response generated from OpenAI for AI Customer')
    }

    // Return the AI Customer response
    return NextResponse.json({
      success: true,
      response: aiCustomerResponse,
      metadata: {
        model: 'gpt-4o-mini',
        customerType: scenario.customerType,
        turn: turn,
        tokens: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Customer Brain API Error:', error)

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
      { error: 'Failed to generate AI Customer response' },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'AI Customer Brain API is running',
    model: 'gpt-4o-mini',
    status: 'ready'
  })
}