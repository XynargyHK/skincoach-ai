const { createClient } = require('@supabase/supabase-js')

// Use service role key with full DDL access
const supabaseAdmin = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
)

async function addColumnsDDL() {
  try {
    console.log('🚀 Using service role key to execute DDL commands...')

    // Method 1: Direct SQL execution using rpc with DDL
    console.log('📝 Attempting to add columns using direct SQL...')

    const ddlQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'boosters' AND column_name = 'ingredient_list') THEN
          ALTER TABLE boosters ADD COLUMN ingredient_list text[];
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'boosters' AND column_name = 'benefits') THEN
          ALTER TABLE boosters ADD COLUMN benefits text[];
        END IF;
      END
      $$;
    `

    // Try using direct query
    const { data, error } = await supabaseAdmin.rpc('query', { query: ddlQuery })

    if (error) {
      console.log('RPC query failed, trying alternative approach...')

      // Method 2: Use pg-connection-string and node-postgres
      const connectionString = `postgresql://postgres.ihxfykfggdmanjkropmh:${process.env.DB_PASSWORD || 'your-db-password'}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

      try {
        const { Client } = require('pg')
        const client = new Client({ connectionString })

        await client.connect()
        console.log('✅ Connected to PostgreSQL directly')

        await client.query(ddlQuery)
        console.log('✅ DDL executed successfully!')

        await client.end()
      } catch (pgError) {
        console.log('Direct PG connection not available, using HTTP API...')

        // Method 3: HTTP API with service role
        const response = await fetch(`https://ihxfykfggdmanjkropmh.supabase.co/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
          },
          body: JSON.stringify({
            sql: `
              ALTER TABLE boosters
              ADD COLUMN IF NOT EXISTS ingredient_list text[],
              ADD COLUMN IF NOT EXISTS benefits text[];
            `
          })
        })

        if (response.ok) {
          console.log('✅ HTTP API DDL executed successfully!')
        } else {
          throw new Error(`HTTP API failed: ${await response.text()}`)
        }
      }
    } else {
      console.log('✅ RPC DDL executed successfully!')
    }

    // Verify columns were added
    console.log('🔍 Verifying new columns...')

    const { data: testData, error: testError } = await supabaseAdmin
      .from('boosters')
      .select('id, name, ingredient_list, benefits')
      .limit(1)

    if (testError) {
      console.log('❌ Columns not yet available:', testError.message)
      return false
    }

    console.log('✅ New columns verified!')
    console.log('📊 Sample record:', testData[0])

    return true

  } catch (error) {
    console.error('❌ DDL execution failed:', error)
    return false
  }
}

// Run the DDL
addColumnsDDL()
  .then((success) => {
    if (success) {
      console.log('\n🎉 SUCCESS! New columns added to boosters table!')
      console.log('✨ ingredient_list and benefits fields are now available!')
    } else {
      console.log('\n❌ Failed to add columns')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })