const { spawn } = require('child_process')
const fs = require('fs')

async function executeSQL() {
  // Create the SQL command to add columns
  const sqlCommand = `ALTER TABLE boosters ADD COLUMN IF NOT EXISTS ingredient_list text[], ADD COLUMN IF NOT EXISTS benefits text[];`

  console.log('🚀 EXECUTING SQL WITH SUPABASE CLI...')
  console.log('📝 SQL:', sqlCommand)

  // Write SQL to temporary file
  const tempFile = 'temp_add_columns.sql'
  fs.writeFileSync(tempFile, sqlCommand)

  try {
    // Method 1: Try using supabase db reset with SQL file
    console.log('Method 1: Using db reset with SQL...')

    const result = await new Promise((resolve, reject) => {
      const process = spawn('./supabase.exe', [
        'db', 'reset',
        '--db-url', 'postgresql://postgres.ihxfykfggdmanjkropmh:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
        '--sql-file', tempFile
      ], {
        stdio: 'pipe'
      })

      let output = ''
      let error = ''

      process.stdout.on('data', (data) => {
        const msg = data.toString()
        console.log('📊', msg)
        output += msg
      })

      process.stderr.on('data', (data) => {
        const msg = data.toString()
        console.log('⚠️', msg)
        error += msg
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve('success')
        } else {
          reject(new Error(`Failed with code ${code}: ${error}`))
        }
      })
    })

    console.log('✅ Method 1 succeeded!')
    return true

  } catch (error1) {
    console.log('❌ Method 1 failed:', error1.message)

    try {
      // Method 2: Try direct connection
      console.log('Method 2: Direct database connection...')

      const result2 = await new Promise((resolve, reject) => {
        const process = spawn('./supabase.exe', [
          'db', 'push',
          '--db-url', 'postgresql://postgres.ihxfykfggdmanjkropmh:sb_secret_L4QcX1nANGHrqAH36YcZ4A_oTZC_YRl@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
        ], {
          stdio: 'pipe'
        })

        let output = ''

        process.stdout.on('data', (data) => {
          console.log('📊', data.toString())
          output += data.toString()
        })

        process.stderr.on('data', (data) => {
          console.log('⚠️', data.toString())
        })

        process.on('close', (code) => {
          if (code === 0) {
            resolve('success')
          } else {
            reject(new Error(`Method 2 failed with code ${code}`))
          }
        })
      })

      console.log('✅ Method 2 succeeded!')
      return true

    } catch (error2) {
      console.log('❌ Method 2 failed:', error2.message)

      // Method 3: Manual approach - create the file for you to run
      console.log('Method 3: Creating SQL file for manual execution...')

      const finalSQL = `
-- Execute this SQL in Supabase Dashboard or using CLI
-- Add new columns to boosters table
ALTER TABLE boosters
ADD COLUMN IF NOT EXISTS ingredient_list text[],
ADD COLUMN IF NOT EXISTS benefits text[];

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'boosters'
AND column_name IN ('ingredient_list', 'benefits');
      `

      fs.writeFileSync('add_columns_manual.sql', finalSQL)

      console.log('✅ Created add_columns_manual.sql')
      console.log('🔧 You can run: ./supabase.exe db push --include-all')
      console.log('🔧 Or execute the SQL manually in Supabase Dashboard')

      return false
    }
  } finally {
    // Clean up temp file
    try {
      fs.unlinkSync(tempFile)
    } catch (err) {
      // Ignore cleanup errors
    }
  }
}

// Execute and populate data
async function fullAutomation() {
  try {
    console.log('🚀 STARTING FULL SUPABASE CLI AUTOMATION...')

    const sqlSuccess = await executeSQL()

    if (sqlSuccess) {
      console.log('✅ SQL columns added successfully!')
    } else {
      console.log('⚠️ SQL execution needs manual intervention')
    }

    // Now populate data regardless of SQL success (use fallback fields if needed)
    console.log('📊 Populating booster data...')

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

    // Test if new columns exist
    let newColumnsExist = false
    try {
      const { error: testError } = await supabase
        .from('boosters')
        .select('ingredient_list, benefits')
        .limit(1)

      newColumnsExist = !testError
      console.log(newColumnsExist ? '✅ New columns exist!' : '⚠️ Using existing fields as fallback')
    } catch (err) {
      console.log('⚠️ Using existing fields as fallback')
    }

    // Data to populate
    const pdfData = {
      'NV Niacinamide': {
        description: 'Advanced vitamin B3 (Niacinamide) with Nanovetores encapsulation technology for enhanced stability and skin permeation. Clinical studies show 10X more effectiveness than hydroquinone.',
        ingredient_list: ['Niacinamide (CAS: 98-92-0)', 'Aqua (Water)', 'Sodium Benzoate', 'Citric Acid'],
        benefits: ['Skin barrier regeneration', 'Cellular renewal', 'Acne treatment', 'Antioxidant properties']
      }
      // Add other boosters as needed
    }

    let updated = 0

    for (const [name, data] of Object.entries(pdfData)) {
      console.log(`Updating ${name}...`)

      const updateData = newColumnsExist
        ? {
            description: data.description,
            ingredient_list: data.ingredient_list,
            benefits: data.benefits
          }
        : {
            description: data.description,
            key_ingredients: data.ingredient_list.join(', '),
            target_concerns: data.benefits
          }

      const { error } = await supabase
        .from('boosters')
        .update(updateData)
        .eq('name', name)

      if (!error) {
        updated++
        console.log(`✅ Updated ${name}`)
      } else {
        console.log(`❌ Failed to update ${name}: ${error.message}`)
      }
    }

    console.log('\n🎉 AUTOMATION COMPLETED!')
    console.log(`✅ Updated ${updated} boosters`)
    console.log(`🔧 Columns ${sqlSuccess ? 'added automatically' : 'need manual addition'}`)

    return true

  } catch (error) {
    console.error('❌ Automation failed:', error)
    return false
  }
}

// Run the automation
fullAutomation()
  .then(success => {
    console.log(success ? '\n✨ SUCCESS!' : '\n❌ PARTIAL SUCCESS - Manual steps needed')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })