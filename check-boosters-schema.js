// Check boosters table schema
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihxfykfggdmanjkropmh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NsPte3bdGwWEwoqQiWK8MQ_ntCdT8pg'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkBoostersSchema() {
  try {
    console.log('Checking boosters table...')

    const { data, error } = await supabase
      .from('boosters')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error querying boosters:', error)
      return
    }

    if (data.length > 0) {
      console.log('First booster record:', data[0])
      console.log('Available columns:', Object.keys(data[0]))
    } else {
      console.log('No boosters found in table')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkBoostersSchema()