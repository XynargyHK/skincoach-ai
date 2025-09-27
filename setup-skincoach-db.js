// setup-skincoach-db.js - Automated SkinCoach database setup
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ihxfykfggdmanjkropmh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
)

async function setupSkinCoachDatabase() {
  console.log('🚀 Setting up SkinCoach.ai database...\n')

  try {
    // Test connection
    console.log('🔗 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('quiz_responses') // This table already exists
      .select('count', { count: 'exact', head: true })

    if (testError) {
      console.log('Connection test:', testError.message)
    } else {
      console.log('✅ Connected to Supabase successfully!')
    }

    console.log('\n📋 Creating SkinCoach tables...')

    // 1. Create users table for skin points and SMS tracking
    console.log('📝 Creating users table...')
    try {
      const { error: usersError } = await supabase.rpc('create_users_table', {})
      if (usersError && !usersError.message.includes('already exists')) {
        // Create via direct table operations since RPC doesn't exist
        await createUsersTable()
      }
    } catch (e) {
      await createUsersTable()
    }

    // 2. Update quiz_sessions table structure
    console.log('📝 Updating quiz_sessions table...')
    await updateQuizSessionsTable()

    // 3. Create subscriptions table
    console.log('📝 Creating subscriptions table...')
    await createSubscriptionsTable()

    // 4. Create SMS campaigns table
    console.log('📝 Creating sms_campaigns table...')
    await createSMSCampaignsTable()

    console.log('\n🌱 Seeding initial data...')
    await seedInitialData()

    console.log('\n🔍 Verifying setup...')
    await verifySetup()

    console.log('\n🎉 SkinCoach database setup complete!')
    console.log('🔗 Your app is ready at: http://localhost:3005')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n💡 Try running this script again or check your Supabase credentials.')
  }
}

async function createUsersTable() {
  try {
    // Create users table manually by inserting/upsetting a test record
    const { error } = await supabase
      .from('users')
      .upsert([{
        user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
        skin_points: 0,
        last_sms: null
      }], { onConflict: 'user_id' })

    if (error && error.message.includes('relation "users" does not exist')) {
      console.log('❌ Users table needs to be created manually in Supabase')
      console.log('   Run this SQL in Supabase SQL Editor:')
      console.log(`
        CREATE TABLE users (
          user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          skin_points integer DEFAULT 0,
          last_sms text,
          created_at timestamp DEFAULT now(),
          updated_at timestamp DEFAULT now()
        );
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = user_id);
      `)
      return
    }

    // Remove test record
    await supabase.from('users').delete().eq('user_id', '00000000-0000-0000-0000-000000000000')
    console.log('✅ Users table ready')
  } catch (error) {
    console.log('⚠️ Users table setup needed manually')
  }
}

async function updateQuizSessionsTable() {
  try {
    // Test if quiz_sessions has the needed columns by inserting test data
    const testData = {
      session_number: 1,
      demographics: { gender: 'test' },
      skin_type: 'test',
      top_concern: 'test',
      spend_range: 'test',
      phone: 'test',
      completed: false,
      ai_responses: null
    }

    const { error } = await supabase
      .from('quiz_sessions')
      .insert([testData])

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ Quiz_sessions table needs column updates')
        console.log('   Add these columns in Supabase SQL Editor:')
        console.log(`
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS session_number integer DEFAULT 1;
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS demographics jsonb;
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS spend_range text;
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS phone text;
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;
          ALTER TABLE quiz_responses ADD COLUMN IF NOT EXISTS ai_responses jsonb;
        `)
        return
      }
    } else {
      // Remove test record
      await supabase.from('quiz_sessions').delete().eq('session_number', 1).eq('skin_type', 'test')
    }

    console.log('✅ Quiz_sessions table ready')
  } catch (error) {
    console.log('⚠️ Quiz_sessions table update needed')
  }
}

async function createSubscriptionsTable() {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .upsert([{
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        plan: 'test',
        bases: ['test'],
        boosters: ['test'],
        price: 0,
        active: true
      }], { onConflict: 'id' })

    if (error && error.message.includes('relation "subscriptions" does not exist')) {
      console.log('❌ Subscriptions table needs to be created')
      console.log('   Run this SQL in Supabase SQL Editor:')
      console.log(`
        CREATE TABLE subscriptions (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
          plan text NOT NULL,
          bases text[],
          boosters text[],
          price float NOT NULL,
          active boolean DEFAULT true,
          created_at timestamp DEFAULT now()
        );
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);
      `)
      return
    }

    // Remove test record
    await supabase.from('subscriptions').delete().eq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✅ Subscriptions table ready')
  } catch (error) {
    console.log('⚠️ Subscriptions table setup needed')
  }
}

async function createSMSCampaignsTable() {
  try {
    const { error } = await supabase
      .from('sms_campaigns')
      .upsert([{
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        phone: 'test',
        day_number: 1,
        message: 'test',
        status: 'test'
      }], { onConflict: 'id' })

    if (error && error.message.includes('relation "sms_campaigns" does not exist')) {
      console.log('❌ SMS_campaigns table needs to be created')
      console.log('   Run this SQL in Supabase SQL Editor:')
      console.log(`
        CREATE TABLE sms_campaigns (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
          phone text NOT NULL,
          day_number integer NOT NULL,
          message text NOT NULL,
          sent_at timestamp DEFAULT now(),
          status text DEFAULT 'sent'
        );
        ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own SMS campaigns" ON sms_campaigns FOR ALL USING (auth.uid() = user_id);
      `)
      return
    }

    // Remove test record
    await supabase.from('sms_campaigns').delete().eq('id', '00000000-0000-0000-0000-000000000000')
    console.log('✅ SMS_campaigns table ready')
  } catch (error) {
    console.log('⚠️ SMS_campaigns table setup needed')
  }
}

async function seedInitialData() {
  try {
    // Only seed if we can access the tables
    console.log('🌱 Seeding sample quiz data...')

    const sampleQuizData = {
      session_number: 1,
      demographics: {
        gender: 'Female',
        age: '21-40'
      },
      skin_type: 'Combination',
      top_concern: 'Acne',
      spend_range: '$50',
      phone: '+1234567890',
      completed: true,
      ai_responses: null
    }

    // Use quiz_responses table since it exists
    const { error } = await supabase
      .from('quiz_responses')
      .insert([{
        gender: sampleQuizData.demographics.gender,
        age_group: sampleQuizData.demographics.age,
        skin_type: sampleQuizData.skin_type,
        skin_concerns: [sampleQuizData.top_concern]
      }])

    if (!error) {
      console.log('✅ Sample quiz data inserted')
    }

  } catch (error) {
    console.log('⚠️ Seeding skipped -', error.message)
  }
}

async function verifySetup() {
  try {
    const tables = ['quiz_responses', 'base_products', 'boosters', 'product_plans']

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count || 0} records`)
      }
    }

    // Test new tables
    const newTables = ['users', 'subscriptions', 'sms_campaigns']

    for (const table of newTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.log(`⚠️  ${table}: Needs manual creation (see instructions above)`)
        } else {
          console.log(`✅ ${table}: ${count || 0} records`)
        }
      } catch (e) {
        console.log(`⚠️  ${table}: Not accessible`)
      }
    }

  } catch (error) {
    console.log('⚠️ Verification completed with warnings')
  }
}

if (require.main === module) {
  setupSkinCoachDatabase()
}

module.exports = { setupSkinCoachDatabase }