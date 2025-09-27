// Verify boosters in database
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihxfykfggdmanjkropmh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_NsPte3bdGwWEwoqQiWK8MQ_ntCdT8pg'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyBoosters() {
  try {
    console.log('Checking all boosters in database...')

    const { data, error } = await supabase
      .from('boosters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error querying boosters:', error)
      return
    }

    console.log(`Found ${data.length} boosters:`)

    data.forEach((booster, index) => {
      console.log(`\n${index + 1}. ${booster.name}`)
      console.log(`   Category: ${booster.category}`)
      console.log(`   Price: $${booster.price}`)
      console.log(`   Created: ${booster.created_at}`)
    })

    // Check specifically for Ascorbic Acid
    const ascorbicBooster = data.find(b => b.name.toLowerCase().includes('ascorbic'))
    if (ascorbicBooster) {
      console.log('\n✅ Found Ascorbic Acid booster!')
    } else {
      console.log('\n❌ Ascorbic Acid booster not found')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

verifyBoosters()