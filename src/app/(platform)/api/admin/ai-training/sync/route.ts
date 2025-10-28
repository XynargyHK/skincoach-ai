import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface KnowledgeEntry {
  id: string
  category: string
  topic: string
  content: string
  keywords: string[]
  confidence: number
  createdAt: Date
  updatedAt: Date
}

interface TrainingData {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
  variations: string[]
  tone: 'professional' | 'friendly' | 'expert' | 'casual'
  priority: number
  active: boolean
  createdAt: Date
}

interface ConversationPattern {
  id: string
  pattern: string
  response: string
  context: string
  triggers: string[]
  followup: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { knowledge, training, patterns } = await request.json()

    // Validate admin access (in production, add proper authentication)
    const adminKey = request.headers.get('x-admin-key')
    if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Sync knowledge entries to database
    if (knowledge && Array.isArray(knowledge)) {
      try {
        // Clear existing data
        await supabase.from('ai_knowledge').delete().neq('id', '')

        // Insert new data
        const knowledgeForDB = knowledge.map((entry: KnowledgeEntry) => ({
          id: entry.id,
          category: entry.category,
          topic: entry.topic,
          content: entry.content,
          keywords: entry.keywords,
          confidence: entry.confidence,
          created_at: entry.createdAt,
          updated_at: new Date().toISOString()
        }))

        const { error: knowledgeError } = await supabase
          .from('ai_knowledge')
          .insert(knowledgeForDB)

        if (knowledgeError) {
          console.error('Knowledge sync error:', knowledgeError)
        }
      } catch (error) {
        console.error('Knowledge database error:', error)
      }
    }

    // Sync training data to database
    if (training && Array.isArray(training)) {
      try {
        // Clear existing data
        await supabase.from('ai_training').delete().neq('id', '')

        // Insert new data
        const trainingForDB = training.map((entry: TrainingData) => ({
          id: entry.id,
          question: entry.question,
          answer: entry.answer,
          category: entry.category,
          keywords: entry.keywords,
          variations: entry.variations,
          tone: entry.tone,
          priority: entry.priority,
          active: entry.active,
          created_at: entry.createdAt,
          updated_at: new Date().toISOString()
        }))

        const { error: trainingError } = await supabase
          .from('ai_training')
          .insert(trainingForDB)

        if (trainingError) {
          console.error('Training sync error:', trainingError)
        }
      } catch (error) {
        console.error('Training database error:', error)
      }
    }

    // Sync conversation patterns to database
    if (patterns && Array.isArray(patterns)) {
      try {
        await supabase.from('ai_patterns').delete().neq('id', '')

        const patternsForDB = patterns.map((pattern: ConversationPattern) => ({
          id: pattern.id,
          pattern: pattern.pattern,
          response: pattern.response,
          context: pattern.context,
          triggers: pattern.triggers,
          followup: pattern.followup,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        const { error: patternsError } = await supabase
          .from('ai_patterns')
          .insert(patternsForDB)

        if (patternsError) {
          console.error('Patterns sync error:', patternsError)
        }
      } catch (error) {
        console.error('Patterns database error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'AI training data synced successfully',
      synced: {
        knowledge: knowledge?.length || 0,
        training: training?.length || 0,
        patterns: patterns?.length || 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI training sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync training data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const adminKey = request.headers.get('x-admin-key')
    if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Load training data from database
    const [knowledgeResult, trainingResult, patternsResult] = await Promise.all([
      supabase.from('ai_knowledge').select('*').order('updated_at', { ascending: false }),
      supabase.from('ai_training').select('*').order('created_at', { ascending: false }),
      supabase.from('ai_patterns').select('*').order('created_at', { ascending: false })
    ])

    return NextResponse.json({
      success: true,
      data: {
        knowledge: knowledgeResult.data || [],
        training: trainingResult.data || [],
        patterns: patternsResult.data || []
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI training load error:', error)
    return NextResponse.json(
      { error: 'Failed to load training data' },
      { status: 500 }
    )
  }
}