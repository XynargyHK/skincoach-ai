const { Client } = require('pg')

async function addColumnsDirectly() {
  // Construct the connection string using the service role key
  const connectionString = `postgresql://postgres.ihxfykfggdmanjkropmh:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

  const client = new Client({ connectionString })

  try {
    console.log('🚀 Connecting directly to PostgreSQL with service role...')

    await client.connect()
    console.log('✅ Connected to PostgreSQL!')

    // Add the columns using raw SQL
    console.log('📝 Adding ingredient_list and benefits columns...')

    const addColumnsSQL = `
      ALTER TABLE boosters
      ADD COLUMN IF NOT EXISTS ingredient_list text[],
      ADD COLUMN IF NOT EXISTS benefits text[];
    `

    const result = await client.query(addColumnsSQL)
    console.log('✅ Columns added successfully!')

    // Verify the columns exist
    console.log('🔍 Verifying columns exist...')

    const verifySQL = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'boosters'
      AND column_name IN ('ingredient_list', 'benefits');
    `

    const verification = await client.query(verifySQL)
    console.log('📊 Column verification:', verification.rows)

    // Test selecting with new columns
    const testSQL = `
      SELECT id, name, ingredient_list, benefits
      FROM boosters
      LIMIT 1;
    `

    const testResult = await client.query(testSQL)
    console.log('✅ Test query successful!')
    console.log('Sample data:', testResult.rows[0])

    console.log('\n🎉 SUCCESS! Columns added successfully!')

    return true

  } catch (error) {
    console.error('❌ Error:', error.message)

    // Try alternative connection approaches
    if (error.message.includes('ENOTFOUND') || error.message.includes('connection')) {
      console.log('🔄 Trying alternative connection methods...')

      // Method 2: Try different port or host
      const alternativeConnections = [
        `postgresql://postgres.ihxfykfggdmanjkropmh:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@db.ihxfykfggdmanjkropmh.supabase.co:5432/postgres`,
        `postgresql://postgres:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@db.ihxfykfggdmanjkropmh.supabase.co:5432/postgres`,
      ]

      for (const connStr of alternativeConnections) {
        try {
          const altClient = new Client({ connectionString: connStr })
          await altClient.connect()
          console.log('✅ Alternative connection successful!')

          await altClient.query(addColumnsSQL)
          console.log('✅ Columns added via alternative connection!')

          await altClient.end()
          return true

        } catch (altError) {
          console.log(`❌ Alternative connection failed: ${altError.message.substring(0, 50)}`)
        }
      }
    }

    return false

  } finally {
    await client.end()
  }
}

// Execute
addColumnsDirectly()
  .then((success) => {
    if (success) {
      console.log('\n✨ DIRECT POSTGRESQL SUCCESS!')
      console.log('🔧 ingredient_list and benefits columns are now available!')
      console.log('📊 You can now populate them with PDF data!')
    } else {
      console.log('\n❌ Direct PostgreSQL connection failed')
      console.log('💡 Manual SQL execution in Supabase Dashboard is still needed')
    }
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })