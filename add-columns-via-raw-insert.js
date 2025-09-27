// Add columns by creating a test record with the new fields
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

async function addColumnsViaInsert() {
  try {
    console.log('🔧 Attempting to add columns by testing insert...')

    // Try to create a temporary record with the new fields
    const testRecord = {
      name: '__TEMP_TEST_RECORD__',
      description: 'Test record to add columns',
      category: 'General',
      key_ingredients: 'Test',
      concentration_percentage: 1,
      target_concerns: ['Test'],
      compatible_skin_types: ['Test'],
      price: 1.00,
      usage_notes: 'Test',
      active: false,
      ingredient_list: ['Test ingredient'],
      benefits: ['Test benefit']
    }

    const { data, error } = await supabase
      .from('boosters')
      .insert([testRecord])
      .select()

    if (error) {
      console.error('❌ Could not add columns via insert:', error.message)
      return false
    }

    console.log('✅ Columns appear to exist! Cleaning up test record...')

    // Delete the test record
    await supabase
      .from('boosters')
      .delete()
      .eq('name', '__TEMP_TEST_RECORD__')

    return true

  } catch (error) {
    console.error('❌ Error testing columns:', error)
    return false
  }
}

addColumnsViaInsert()
  .then(success => {
    if (success) {
      console.log('✅ New columns are available! You can now run the full update.')
      console.log('Run: node update-with-new-fields.js')
    } else {
      console.log('❌ Columns need to be added manually in Supabase SQL Editor:')
      console.log('ALTER TABLE boosters ADD COLUMN IF NOT EXISTS ingredient_list text[];')
      console.log('ALTER TABLE boosters ADD COLUMN IF NOT EXISTS benefits text[];')
    }
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })