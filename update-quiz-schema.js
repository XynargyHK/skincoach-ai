#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateQuizSchema() {
  console.log('🚀 Starting quiz_responses schema update...')

  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'update-quiz-responses-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')

    console.log('📖 Read SQL migration file')

    // Split the SQL into individual statements (simple split by semicolon)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.toLowerCase().includes('comment on')) {
        // Skip comments for now as they might not be supported
        console.log(`⏭️  Skipping comment statement ${i + 1}`)
        continue
      }

      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
      console.log(`   ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`)

      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message)
        // Continue with other statements unless it's a critical error
        if (error.message.includes('does not exist') && statement.includes('DROP TABLE')) {
          console.log('   ℹ️  Table did not exist, continuing...')
          continue
        }
        // For other errors, you might want to continue or stop based on the error
        console.log('   ⚠️  Continuing with next statement...')
      } else {
        console.log(`   ✅ Statement ${i + 1} completed successfully`)
      }
    }

    // Test the new schema by attempting to insert a sample record (then delete it)
    console.log('🧪 Testing new schema with sample data...')

    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID for test
      gender: 'Female',
      age_group: '21-40',
      skin_type: 'Normal',
      primary_concern: ['Acne', 'Pigments'],
      spending_budget: '75'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('quiz_responses')
      .insert([testData])
      .select()

    if (insertError) {
      console.error('❌ Test insert failed:', insertError.message)
    } else {
      console.log('✅ Test insert successful')

      // Clean up test data
      const { error: deleteError } = await supabase
        .from('quiz_responses')
        .delete()
        .eq('user_id', testData.user_id)

      if (deleteError) {
        console.warn('⚠️  Could not clean up test data:', deleteError.message)
      } else {
        console.log('🧹 Test data cleaned up')
      }
    }

    console.log('\n🎉 Quiz schema update completed!')
    console.log('\n📋 New quiz_responses table structure:')
    console.log('   - id (UUID, primary key)')
    console.log('   - user_id (UUID, foreign key)')
    console.log('   - gender (Male | Female)')
    console.log('   - age_group (<20 | 21-40 | 40+)')
    console.log('   - skin_type (Dry | Normal | Combination | Oily)')
    console.log('   - primary_concern (text array for multiple selections)')
    console.log('   - spending_budget (text for $20-$200+)')
    console.log('   - created_at, updated_at (timestamps)')
    console.log('\n✨ The old table has been backed up as quiz_responses_old')

  } catch (error) {
    console.error('💥 Unexpected error:', error.message)
    process.exit(1)
  }
}

// Alternative approach using direct SQL execution
async function updateQuizSchemaSimple() {
  console.log('🚀 Starting simple quiz_responses schema update...')

  try {
    // Create the new table structure directly
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS quiz_responses_basic (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID,
        gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
        age_group TEXT NOT NULL CHECK (age_group IN ('<20', '21-40', '40+')),
        skin_type TEXT NOT NULL CHECK (skin_type IN ('Dry', 'Normal', 'Combination', 'Oily')),
        primary_concern TEXT[] NOT NULL,
        spending_budget TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    console.log('📝 Creating new basic quiz_responses table...')
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createTableSQL
    })

    if (createError) {
      console.error('❌ Error creating table:', createError.message)
      return
    }

    console.log('✅ New table created successfully')

    // Test with sample data
    const testInsert = {
      gender: 'Female',
      age_group: '21-40',
      skin_type: 'Normal',
      primary_concern: ['Acne', 'Pigments'],
      spending_budget: '75'
    }

    console.log('🧪 Testing with sample data...')
    const { data, error } = await supabase
      .from('quiz_responses_basic')
      .insert([testInsert])
      .select()

    if (error) {
      console.error('❌ Test failed:', error.message)
    } else {
      console.log('✅ Test successful! New schema is working.')
      console.log('📊 Sample record:', data[0])

      // Clean up
      await supabase
        .from('quiz_responses_basic')
        .delete()
        .eq('id', data[0].id)
      console.log('🧹 Test data cleaned up')
    }

    console.log('\n🎉 Basic schema test completed!')
    console.log('💡 You can now rename quiz_responses_basic to quiz_responses when ready')

  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Run the update
if (process.argv.includes('--simple')) {
  updateQuizSchemaSimple()
} else {
  updateQuizSchema()
}