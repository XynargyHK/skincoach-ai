import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET all canned messages
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('canned_messages')
      .select('*')
      .order('scenario', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      messages: data
    })
  } catch (error) {
    console.error('Error fetching canned messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch canned messages' },
      { status: 500 }
    )
  }
}

// POST - Create new canned message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenario, template, description, variables } = body

    if (!scenario || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('canned_messages')
      .insert([{
        scenario,
        template,
        description,
        variables,
        is_active: true
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: data
    })
  } catch (error) {
    console.error('Error creating canned message:', error)
    return NextResponse.json(
      { error: 'Failed to create canned message' },
      { status: 500 }
    )
  }
}

// PUT - Update canned message
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, scenario, template, description, variables, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('canned_messages')
      .update({
        scenario,
        template,
        description,
        variables,
        is_active
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: data
    })
  } catch (error) {
    console.error('Error updating canned message:', error)
    return NextResponse.json(
      { error: 'Failed to update canned message' },
      { status: 500 }
    )
  }
}

// DELETE - Delete canned message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('canned_messages')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Canned message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting canned message:', error)
    return NextResponse.json(
      { error: 'Failed to delete canned message' },
      { status: 500 }
    )
  }
}
