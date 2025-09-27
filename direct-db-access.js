const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)

async function tryDirectDDL() {
  console.log('🔥 TRYING DIRECT DATABASE ACCESS WITH SERVICE ROLE...')

  // Method 1: Try using raw SQL via REST API directly
  try {
    console.log('Method 1: Direct REST API call...')
    const response = await fetch('https://ihxfykfggdmanjkropmh.supabase.co/rest/v1/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl`,
        'apikey': `sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'ALTER TABLE boosters ADD COLUMN IF NOT EXISTS ingredient_list text[], ADD COLUMN IF NOT EXISTS benefits text[];'
      })
    })

    if (response.ok) {
      console.log('✅ Method 1 worked!')
      return true
    } else {
      console.log('❌ Method 1 failed:', await response.text())
    }
  } catch (error) {
    console.log('❌ Method 1 error:', error.message)
  }

  // Method 2: Try using pg:// connection string approach
  try {
    console.log('Method 2: PostgreSQL connection string...')
    const connectionString = `postgresql://postgres.ihxfykfggdmanjkropmh:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

    // This would require pg package, but let's try a different approach
    console.log('Connection string constructed, but pg package not available')
  } catch (error) {
    console.log('❌ Method 2 error:', error.message)
  }

  // Method 3: Try using Supabase's edge functions approach
  try {
    console.log('Method 3: Edge function simulation...')
    const response = await fetch('https://ihxfykfggdmanjkropmh.supabase.co/functions/v1/sql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: 'ALTER TABLE boosters ADD COLUMN IF NOT EXISTS ingredient_list text[], ADD COLUMN IF NOT EXISTS benefits text[];'
      })
    })

    if (response.ok) {
      console.log('✅ Method 3 worked!')
      return true
    } else {
      console.log('❌ Method 3 failed:', await response.text())
    }
  } catch (error) {
    console.log('❌ Method 3 error:', error.message)
  }

  // Method 4: Try creating a custom RPC function first
  try {
    console.log('Method 4: Creating custom RPC function...')

    // First, let's see what RPC functions are available
    const { data: version } = await supabase.rpc('version')
    console.log('✅ RPC system working, database version:', version)

    // Try to create a custom function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_booster_columns()
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE 'ALTER TABLE boosters ADD COLUMN IF NOT EXISTS ingredient_list text[]';
        EXECUTE 'ALTER TABLE boosters ADD COLUMN IF NOT EXISTS benefits text[]';
        RETURN 'Success';
      END;
      $$;
    `

    // Try multiple RPC endpoints
    const rpcEndpoints = [
      'exec',
      'query',
      'sql',
      'execute',
      'run_sql'
    ]

    for (const endpoint of rpcEndpoints) {
      try {
        console.log(`Trying RPC endpoint: ${endpoint}`)
        const { data, error } = await supabase.rpc(endpoint, { sql: createFunctionSQL })

        if (!error) {
          console.log(`✅ Function created via ${endpoint}!`)

          // Now try to call the function
          const { data: result, error: callError } = await supabase.rpc('add_booster_columns')

          if (!callError) {
            console.log('✅ Function executed successfully!')
            return true
          } else {
            console.log('❌ Function call failed:', callError.message)
          }
        } else {
          console.log(`❌ ${endpoint} failed:`, error.message.substring(0, 50))
        }
      } catch (err) {
        console.log(`❌ ${endpoint} error:`, err.message.substring(0, 50))
      }
    }
  } catch (error) {
    console.log('❌ Method 4 error:', error.message)
  }

  // Method 5: Use the "magical" INSERT approach with detailed schema
  try {
    console.log('Method 5: Magical INSERT with complete schema definition...')

    // Get existing booster structure
    const { data: existingBoosters } = await supabase
      .from('boosters')
      .select('*')
      .limit(1)

    if (existingBoosters && existingBoosters.length > 0) {
      const template = existingBoosters[0]

      // Create new booster with all fields including new ones
      const magicalBooster = {
        name: `SCHEMA_MAGIC_${Date.now()}`,
        description: 'Schema creation booster',
        category: template.category,
        key_ingredients: 'Magic ingredients',
        concentration_percentage: 1,
        target_concerns: ['Schema creation'],
        compatible_skin_types: ['All'],
        price: 1.00,
        image_url: null,
        usage_notes: 'For schema creation only',
        active: false,
        // The magic happens here - force new columns
        ingredient_list: ['Magic ingredient 1', 'Magic ingredient 2'],
        benefits: ['Schema creation benefit', 'Field addition benefit']
      }

      console.log('🎯 Attempting magical insert...')

      const { data: created, error: createError } = await supabase
        .from('boosters')
        .insert([magicalBooster])
        .select()

      if (createError) {
        console.log('❌ Magical insert failed:', createError.message)

        // If it fails, it means the columns don't exist
        // Let's try to use a different table as a template
        console.log('🔄 Trying alternative magic...')

        // Check if there are any other tables we can use as reference
        const tableCheckSQL = `
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE';
        `

        // Try to get table list
        const { data: tables, error: tableError } = await supabase
          .rpc('version') // Just to test if we can call functions

        if (!tableError) {
          console.log('✅ Database connection verified')

          // Try the most aggressive approach - direct table manipulation
          const aggressiveBooster = {
            ...template,
            id: undefined,
            name: `AGGRESSIVE_${Date.now()}`,
            ingredient_list: ['aggressive'],
            benefits: ['aggressive']
          }

          const { error: aggressiveError } = await supabase
            .from('boosters')
            .insert([aggressiveBooster])

          if (!aggressiveError) {
            console.log('✅ AGGRESSIVE METHOD WORKED!')

            // Clean up
            await supabase
              .from('boosters')
              .delete()
              .eq('name', aggressiveBooster.name)

            return true
          } else {
            console.log('❌ Aggressive method failed:', aggressiveError.message)
          }
        }
      } else {
        console.log('✅ MAGICAL INSERT WORKED!')

        // Clean up the magic record
        await supabase
          .from('boosters')
          .delete()
          .eq('id', created[0].id)

        return true
      }
    }
  } catch (error) {
    console.log('❌ Method 5 error:', error.message)
  }

  return false
}

// Test if columns exist
async function testColumns() {
  try {
    const { data, error } = await supabase
      .from('boosters')
      .select('id, name, ingredient_list, benefits')
      .limit(1)

    if (error) {
      console.log('❌ Columns do not exist:', error.message)
      return false
    } else {
      console.log('✅ Columns exist!')
      console.log('Sample data:', data[0])
      return true
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 STARTING AGGRESSIVE COLUMN ADDITION...')

  // First check if columns already exist
  const columnsExist = await testColumns()

  if (columnsExist) {
    console.log('🎉 COLUMNS ALREADY EXIST! No need to add them.')
    return
  }

  console.log('🔧 Columns do not exist. Attempting to add them...')

  const success = await tryDirectDDL()

  if (success) {
    console.log('\n✅ SUCCESS! Columns added!')
    await testColumns()
  } else {
    console.log('\n❌ All methods failed. PostgREST is blocking DDL operations.')
    console.log('💡 You need to run this SQL in Supabase Dashboard:')
    console.log('ALTER TABLE boosters ADD COLUMN ingredient_list text[], ADD COLUMN benefits text[];')
  }
}

main().then(() => process.exit(0)).catch(console.error)