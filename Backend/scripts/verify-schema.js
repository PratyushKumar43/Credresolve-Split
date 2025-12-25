const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function verifySchema() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const verificationPath = path.join(__dirname, '../src/lib/db-schema-verification.sql')
  const verificationSQL = fs.readFileSync(verificationPath, 'utf8')

  try {
    console.log('🔍 Verifying database schema...\n')

    // Check tables
    const tables = await sql(`
      SELECT table_name
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
      ORDER BY table_name
    `)

    const requiredTables = ['users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements']
    const existingTables = tables.map(t => t.table_name)
    
    console.log('📊 Tables Status:')
    requiredTables.forEach(table => {
      const exists = existingTables.includes(table)
      console.log(`   ${exists ? '✅' : '❌'} ${table}`)
    })

    if (existingTables.length !== requiredTables.length) {
      console.log('\n⚠️  Some tables are missing!')
      const missing = requiredTables.filter(t => !existingTables.includes(t))
      console.log('Missing tables:', missing.join(', '))
      console.log('\nRun: npm run db:migrate')
    } else {
      console.log('\n✅ All required tables exist!')
    }

    // Check indexes
    const indexes = await sql(`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
    `)
    console.log(`\n📈 Indexes: ${(indexes[0] && indexes[0].count) || 0} found`)

    // Check foreign keys
    const foreignKeys = await sql(`
      SELECT COUNT(*) as count
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY'
        AND table_schema = 'public'
        AND table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
    `)
    console.log(`🔗 Foreign Keys: ${(foreignKeys[0] && foreignKeys[0].count) || 0} found`)

    // Check triggers
    const triggers = await sql(`
      SELECT COUNT(*) as count
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
        AND event_object_table IN ('users', 'groups', 'expenses')
    `)
    console.log(`⚡ Triggers: ${(triggers[0] && triggers[0].count) || 0} found`)

    console.log('\n✅ Schema verification complete!')
  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

verifySchema()

