// auto-create-tables.js - Automated table creation using REST API
const { createClient } = require('@supabase/supabase-js')

// Using service role key would be ideal, but let's try with anon key first
const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q'
)

async function createTablesAutomated() {
  console.log('🚀 Attempting automated table creation...\n')

  try {
    // Try multiple approaches to create tables

    console.log('📝 Approach 1: Using rpc with different function names...')

    const approaches = [
      'exec_sql',
      'sql',
      'execute_sql',
      'run_sql',
      'query'
    ]

    for (const func of approaches) {
      try {
        console.log(`Trying: supabase.rpc('${func}', ...)`)

        const result = await supabase.rpc(func, {
          query: `
            CREATE TABLE IF NOT EXISTS base_products (
              id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
              name text NOT NULL,
              description text,
              price decimal(10,2) NOT NULL,
              skin_types text[],
              concerns text[],
              active boolean DEFAULT true,
              created_at timestamp DEFAULT now()
            );
          `
        })

        if (!result.error) {
          console.log(`✅ Success with ${func}!`)
          break
        } else {
          console.log(`❌ ${func}: ${result.error.message}`)
        }
      } catch (err) {
        console.log(`❌ ${func}: ${err.message}`)
      }
    }

    console.log('\n📝 Approach 2: Using direct HTTP POST to REST API...')

    // Try direct REST API call
    const response = await fetch('https://ihxfykfggdmanjkropmh.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS base_products (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name text NOT NULL,
            description text,
            price decimal(10,2) NOT NULL,
            skin_types text[],
            concerns text[],
            active boolean DEFAULT true,
            created_at timestamp DEFAULT now()
          );
        `
      })
    })

    const restResult = await response.json()
    console.log('REST API result:', restResult)

    console.log('\n📝 Approach 3: Using database migration style...')

    // Try creating a function first, then calling it
    try {
      await supabase.rpc('create_function', {
        name: 'create_tables',
        definition: `
          BEGIN
            CREATE TABLE IF NOT EXISTS base_products (
              id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
              name text NOT NULL,
              description text,
              price decimal(10,2) NOT NULL,
              skin_types text[],
              concerns text[],
              active boolean DEFAULT true,
              created_at timestamp DEFAULT now()
            );
            RETURN 'success';
          END;
        `
      })

      console.log('Function created, now calling it...')
      const callResult = await supabase.rpc('create_tables')
      console.log('Function call result:', callResult)

    } catch (funcError) {
      console.log('Function approach failed:', funcError.message)
    }

    console.log('\n❌ All automated approaches failed.')
    console.log('💡 The issue is that Supabase requires SERVICE ROLE key for DDL operations.')
    console.log('💡 Your current key is ANON key which can only do SELECT, INSERT, UPDATE, DELETE.')
    console.log('\n🔧 Solutions:')
    console.log('1. Find your SERVICE ROLE key in Supabase Dashboard → Settings → API')
    console.log('2. Or copy/paste the SQL manually in Supabase SQL Editor')
    console.log('3. Or enable the postgres direct connection')

  } catch (error) {
    console.error('❌ Automated creation failed:', error.message)
  }
}

createTablesAutomated()