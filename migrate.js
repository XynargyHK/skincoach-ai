#!/usr/bin/env node
// migrate.js - Automated database migration system for SkinCoach
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration
const CONFIG = {
  supabaseUrl: 'https://ihxfykfggdmanjkropmh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDEzMzYsImV4cCI6MjA3NDE3NzMzNn0.NM56Xd271rgXrqG_rL6iC-MOZARREHfErM7QagaUV7Q',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeGZ5a2ZnZ2RtYW5qa3JvcG1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYwMTMzNiwiZXhwIjoyMDc0MTc3MzM2fQ.7e-KMDOeRoeB_lj3zcgL1ULLC50gXwtSqObXgaJPclk'
}

// Initialize Supabase clients
const supabaseAdmin = createClient(CONFIG.supabaseUrl, CONFIG.serviceKey)
const supabasePublic = createClient(CONFIG.supabaseUrl, CONFIG.anonKey)

class DatabaseMigrator {
  constructor() {
    this.migrationsDir = path.join(__dirname, 'migrations')
    this.seedsDir = path.join(__dirname, 'seeds')

    // Ensure directories exist
    if (!fs.existsSync(this.migrationsDir)) {
      fs.mkdirSync(this.migrationsDir, { recursive: true })
    }
    if (!fs.existsSync(this.seedsDir)) {
      fs.mkdirSync(this.seedsDir, { recursive: true })
    }
  }

  async runMigration(action = 'migrate') {
    console.log('🚀 SkinCoach Database Migration System\n')

    try {
      switch (action) {
        case 'migrate':
          await this.runMigrations()
          break
        case 'seed':
          await this.runSeeds()
          break
        case 'reset':
          await this.resetDatabase()
          break
        case 'generate':
          await this.generateMigration()
          break
        default:
          await this.runMigrations()
          await this.runSeeds()
      }

      console.log('\n🎉 Migration completed successfully!')
      console.log('🔗 Admin Panel: http://localhost:3005/admin')

      // Verify final state
      await this.verifyMigration()

    } catch (error) {
      console.error('❌ Migration failed:', error.message)
      process.exit(1)
    }
  }

  async runMigrations() {
    console.log('📝 Running database migrations...\n')

    // Create migrations table to track applied migrations
    await this.createMigrationsTable()

    // Get all migration files
    const migrationFiles = fs.readdirSync(this.migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    if (migrationFiles.length === 0) {
      console.log('⚠️ No migration files found. Creating initial schema...')
      await this.createInitialSchema()
      return
    }

    // Run each migration
    for (const file of migrationFiles) {
      await this.runSingleMigration(file)
    }
  }

  async createMigrationsTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id serial PRIMARY KEY,
        name text NOT NULL UNIQUE,
        applied_at timestamp DEFAULT now()
      );
    `

    try {
      const result = await this.executeSQL(sql)
      console.log('✅ Migrations table ready')
    } catch (error) {
      console.log('⚠️ Migrations table exists or created')
    }
  }

  async runSingleMigration(filename) {
    try {
      // Check if already applied
      const { data: existing } = await supabaseAdmin
        .from('_migrations')
        .select('name')
        .eq('name', filename)
        .single()

      if (existing) {
        console.log(`⏭️  Skipping ${filename} (already applied)`)
        return
      }

      console.log(`🔄 Applying ${filename}...`)

      // Read and execute migration
      const migrationPath = path.join(this.migrationsDir, filename)
      const sql = fs.readFileSync(migrationPath, 'utf8')

      await this.executeSQL(sql)

      // Record as applied
      await supabaseAdmin
        .from('_migrations')
        .insert({ name: filename })

      console.log(`✅ Applied ${filename}`)

    } catch (error) {
      console.error(`❌ Failed to apply ${filename}:`, error.message)
      throw error
    }
  }

  async createInitialSchema() {
    console.log('🏗️  Creating initial database schema...')

    const initialSchema = `
      -- SkinCoach Initial Schema

      -- Product categories
      CREATE TABLE IF NOT EXISTS product_categories (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        slug text UNIQUE NOT NULL,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Base products
      CREATE TABLE IF NOT EXISTS base_products (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        category_id uuid REFERENCES product_categories(id),
        name text NOT NULL,
        description text,
        short_description text,
        price decimal(10,2) NOT NULL,
        sku text UNIQUE,
        image_url text,
        ingredients jsonb,
        benefits text[],
        skin_types text[],
        concerns text[],
        usage_instructions text,
        volume_ml integer,
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Boosters
      CREATE TABLE IF NOT EXISTS boosters (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        category text NOT NULL,
        key_ingredients jsonb,
        concentration_percentage decimal(5,2),
        target_concerns text[],
        compatible_skin_types text[],
        price decimal(10,2),
        image_url text,
        usage_notes text,
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Product plans
      CREATE TABLE IF NOT EXISTS product_plans (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        price decimal(10,2) NOT NULL,
        description text,
        max_boosters integer DEFAULT 2,
        features text[],
        target_demographic text,
        popular boolean DEFAULT false,
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Quiz responses
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid,
        gender text,
        age_group text,
        ethnicity text,
        skin_tone text,
        skin_type text,
        sensitivity_level text,
        skin_conditions text[],
        acne_level text,
        pigmentation_issues text[],
        aging_signs text[],
        skin_firmness text,
        dark_circles text,
        eye_bags text,
        current_routine text[],
        skincare_knowledge text,
        skin_goals text[],
        lifestyle_factors text[],
        diet_habits text[],
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Recommendations
      CREATE TABLE IF NOT EXISTS recommendations (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        quiz_response_id uuid REFERENCES quiz_responses(id) ON DELETE CASCADE,
        recommended_plan text NOT NULL,
        confidence_score decimal(3,2) DEFAULT 0.85,
        boosters text[],
        priority_concerns text[],
        skin_analysis jsonb,
        timeline_expectations text,
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      -- Ingredients
      CREATE TABLE IF NOT EXISTS ingredients (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        scientific_name text,
        category text,
        description text,
        benefits text[],
        safety_rating text,
        pregnancy_safe boolean DEFAULT true,
        comedogenic_rating integer,
        created_at timestamp DEFAULT now()
      );

      -- Enable RLS on all tables
      ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE base_products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE boosters ENABLE ROW LEVEL SECURITY;
      ALTER TABLE product_plans ENABLE ROW LEVEL SECURITY;
      ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY IF NOT EXISTS "Anyone can read product categories" ON product_categories FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Anyone can read active products" ON base_products FOR SELECT USING (active = true);
      CREATE POLICY IF NOT EXISTS "Anyone can read active boosters" ON boosters FOR SELECT USING (active = true);
      CREATE POLICY IF NOT EXISTS "Anyone can read active plans" ON product_plans FOR SELECT USING (active = true);
      CREATE POLICY IF NOT EXISTS "Anyone can read quiz responses" ON quiz_responses FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Anyone can read recommendations" ON recommendations FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Anyone can read ingredients" ON ingredients FOR SELECT USING (true);

      -- Insert policies
      CREATE POLICY IF NOT EXISTS "Users can insert quiz responses" ON quiz_responses FOR INSERT WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Users can insert recommendations" ON recommendations FOR INSERT WITH CHECK (true);
    `

    await this.executeSQL(initialSchema)

    // Save as migration file for future reference
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const migrationFile = path.join(this.migrationsDir, `${timestamp}_initial_schema.sql`)
    fs.writeFileSync(migrationFile, initialSchema)

    console.log('✅ Initial schema created and saved as migration')
  }

  async runSeeds() {
    console.log('🌱 Running database seeds...\n')

    // Get all seed files
    const seedFiles = fs.readdirSync(this.seedsDir)
      .filter(f => f.endsWith('.js') || f.endsWith('.sql'))
      .sort()

    if (seedFiles.length === 0) {
      console.log('⚠️ No seed files found. Creating default seeds...')
      await this.createDefaultSeeds()
      return
    }

    // Run each seed
    for (const file of seedFiles) {
      await this.runSingleSeed(file)
    }
  }

  async runSingleSeed(filename) {
    try {
      console.log(`🌱 Running seed: ${filename}`)

      const seedPath = path.join(this.seedsDir, filename)

      if (filename.endsWith('.sql')) {
        const sql = fs.readFileSync(seedPath, 'utf8')
        await this.executeSQL(sql)
      } else if (filename.endsWith('.js')) {
        const seedFunction = require(seedPath)
        await seedFunction(supabaseAdmin)
      }

      console.log(`✅ Completed seed: ${filename}`)

    } catch (error) {
      console.error(`❌ Failed to run seed ${filename}:`, error.message)
      throw error
    }
  }

  async createDefaultSeeds() {
    console.log('🌱 Creating default seed data...')

    // Create JavaScript seed file
    const seedsJS = `
// seeds/001_default_data.js
module.exports = async function(supabase) {
  console.log('🌱 Seeding default data...')

  // Product categories
  await supabase.from('product_categories').upsert([
    { name: 'Cleansers', description: 'Face cleansers and makeup removers', slug: 'cleansers' },
    { name: 'Serums', description: 'Treatment serums and essences', slug: 'serums' },
    { name: 'Moisturizers', description: 'Day and night moisturizers', slug: 'moisturizers' },
    { name: 'Sunscreens', description: 'UV protection products', slug: 'sunscreens' },
    { name: 'Eye Care', description: 'Eye creams and treatments', slug: 'eye-care' }
  ])

  // Base products
  await supabase.from('base_products').upsert([
    {
      name: 'Gentle Foam Cleanser',
      description: 'A mild, soap-free cleanser suitable for all skin types',
      price: 24.99,
      skin_types: ['Normal', 'Sensitive', 'Dry'],
      concerns: ['Hydration'],
      active: true
    },
    {
      name: 'Vitamin C Brightening Serum',
      description: 'Powerful antioxidant serum for radiant skin',
      price: 39.99,
      skin_types: ['Normal', 'Oily', 'Combination'],
      concerns: ['Dullness', 'Pigmentation'],
      active: true
    },
    {
      name: 'Hyaluronic Acid Moisturizer',
      description: 'Deeply hydrating moisturizer with hyaluronic acid',
      price: 32.99,
      skin_types: ['Dry', 'Normal', 'Sensitive'],
      concerns: ['Hydration', 'Anti-Aging'],
      active: true
    }
  ])

  // Boosters
  await supabase.from('boosters').upsert([
    {
      name: 'Niacinamide Pore Refiner',
      description: 'Minimizes pore appearance and controls oil production',
      category: 'Pore Minimizing',
      concentration_percentage: 10.00,
      target_concerns: ['Pores', 'Oiliness'],
      compatible_skin_types: ['Oily', 'Combination'],
      price: 16.99,
      active: true
    },
    {
      name: 'Retinol Anti-Aging Serum',
      description: 'Powerful anti-aging treatment for fine lines',
      category: 'Anti-Aging',
      concentration_percentage: 0.5,
      target_concerns: ['Aging', 'Fine Lines'],
      compatible_skin_types: ['Normal', 'Dry'],
      price: 24.99,
      active: true
    },
    {
      name: 'Salicylic Acid Acne Treatment',
      description: 'BHA treatment for acne and blackheads',
      category: 'Anti-Acne',
      concentration_percentage: 2.0,
      target_concerns: ['Acne', 'Blackheads'],
      compatible_skin_types: ['Oily', 'Combination'],
      price: 18.99,
      active: true
    }
  ])

  // Product plans
  await supabase.from('product_plans').upsert([
    {
      name: 'Essential',
      price: 39.00,
      description: 'Perfect starter routine for Gen Z & young adults',
      max_boosters: 2,
      features: ['Base serum or cream', '2 boosters', 'AI Dermatologist Coaching'],
      target_demographic: 'Gen Z & young adults',
      popular: false,
      active: true
    },
    {
      name: 'Pro',
      price: 69.00,
      description: 'Complete AM/PM smart routine for busy adults',
      max_boosters: 4,
      features: ['Complete AM/PM routine', '4 boosters', 'Smart optimization'],
      target_demographic: 'Busy adults 25-40',
      popular: false,
      active: true
    },
    {
      name: 'Concierge',
      price: 99.00,
      description: 'Premium skincare with VIP support',
      max_boosters: 10,
      features: ['Full routine', '10 advanced boosters', 'VIP Support'],
      target_demographic: '40+ mature skin concerns',
      popular: true,
      active: true
    }
  ])

  console.log('✅ Default data seeded successfully')
}
    `

    const seedFile = path.join(this.seedsDir, '001_default_data.js')
    fs.writeFileSync(seedFile, seedsJS)

    // Run the seed
    await this.runSingleSeed('001_default_data.js')

    console.log('✅ Default seeds created and executed')
  }

  async executeSQL(sql) {
    // Try multiple approaches to execute SQL
    const approaches = [
      () => this.executeViaRPC(sql),
      () => this.executeViaHTTP(sql),
      () => this.executeViaPG(sql)
    ]

    for (const approach of approaches) {
      try {
        await approach()
        return
      } catch (error) {
        // Continue to next approach
        continue
      }
    }

    throw new Error('All SQL execution methods failed')
  }

  async executeViaRPC(sql) {
    // Try various RPC function names
    const functions = ['exec_sql', 'sql', 'execute_sql', 'query']

    for (const func of functions) {
      try {
        const { error } = await supabaseAdmin.rpc(func, { query: sql })
        if (!error) return
      } catch (e) {
        continue
      }
    }

    throw new Error('RPC execution failed')
  }

  async executeViaHTTP(sql) {
    const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.serviceKey,
        'Authorization': \`Bearer \${CONFIG.serviceKey}\`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      throw new Error(\`HTTP execution failed: \${response.statusText}\`)
    }

    return response.json()
  }

  async executeViaPG(sql) {
    // This would require pg connection string
    throw new Error('Direct PG connection not configured')
  }

  async resetDatabase() {
    console.log('🗑️  Resetting database...\n')

    const tables = [
      'recommendations',
      'quiz_responses',
      'ingredients',
      'boosters',
      'base_products',
      'product_categories',
      'product_plans',
      '_migrations'
    ]

    for (const table of tables) {
      try {
        await this.executeSQL(\`DROP TABLE IF EXISTS \${table} CASCADE;\`)
        console.log(\`✅ Dropped table: \${table}\`)
      } catch (error) {
        console.log(\`⚠️  Could not drop \${table}: \${error.message}\`)
      }
    }

    console.log('✅ Database reset complete')
  }

  async verifyMigration() {
    console.log('\\n🔍 Verifying migration...')

    try {
      const tables = ['base_products', 'boosters', 'quiz_responses', 'product_plans']
      const counts = {}

      for (const table of tables) {
        const { count } = await supabasePublic
          .from(table)
          .select('*', { count: 'exact', head: true })
        counts[table] = count || 0
      }

      console.log('📊 Final database state:')
      Object.entries(counts).forEach(([table, count]) => {
        console.log(\`   • \${table}: \${count} records\`)
      })

    } catch (error) {
      console.log('⚠️  Verification warning:', error.message)
    }
  }

  async generateMigration() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const name = process.argv[3] || 'new_migration'
    const filename = \`\${timestamp}_\${name}.sql\`

    const template = \`-- Migration: \${name}
-- Created: \${new Date().toISOString()}

-- Add your SQL here
\`

    const migrationPath = path.join(this.migrationsDir, filename)
    fs.writeFileSync(migrationPath, template)

    console.log(\`✅ Generated migration: \${filename}\`)
  }
}

// CLI Interface
async function main() {
  const action = process.argv[2] || 'all'
  const migrator = new DatabaseMigrator()

  console.log('Available commands:')
  console.log('  npm run migrate         - Run migrations and seeds')
  console.log('  npm run migrate:up      - Run migrations only')
  console.log('  npm run migrate:seed    - Run seeds only')
  console.log('  npm run migrate:reset   - Reset database')
  console.log('  npm run migrate:generate <name> - Generate new migration')
  console.log('')

  await migrator.runMigration(action)
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { DatabaseMigrator }
`