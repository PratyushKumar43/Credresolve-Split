const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Helper to split SQL into individual statements
function splitSQL(sql) {
  const statements = []
  let current = ''
  let inString = false
  let stringChar = null
  let inFunction = false
  let functionDepth = 0

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i]
    const nextChar = sql[i + 1]

    // Handle string literals
    if ((char === "'" || char === '"') && sql[i - 1] !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
        stringChar = null
      }
      current += char
      continue
    }

    // Handle function bodies ($$ delimiters)
    if (!inString && char === '$' && nextChar === '$') {
      if (!inFunction) {
        inFunction = true
        functionDepth = 1
      } else {
        functionDepth--
        if (functionDepth === 0) {
          inFunction = false
        }
      }
      current += char + nextChar
      i++ // Skip next char
      continue
    }

    // Only split on semicolons outside strings and functions
    if (!inString && !inFunction && char === ';') {
      const trimmed = current.trim()
      if (trimmed && !trimmed.startsWith('--')) {
        statements.push(trimmed)
      }
      current = ''
      continue
    }

    current += char
  }

  // Add last statement if any
  const trimmed = current.trim()
  if (trimmed && !trimmed.startsWith('--')) {
    statements.push(trimmed)
  }

  return statements.filter(s => s.length > 0)
}

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const schemaPath = path.join(__dirname, '../src/lib/db-schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  try {
    console.log('🔄 Running database migrations...')
    console.log('📝 Reading schema file...')
    
    // Split SQL into individual statements
    const statements = splitSQL(schema)
    console.log(`📋 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue
      }

      try {
        await sql(statement)
        successCount++
      } catch (err) {
        // Ignore "already exists" errors for IF NOT EXISTS statements
        const errorMsg = err.message?.toLowerCase() || ''
        if (
          errorMsg.includes('already exists') ||
          errorMsg.includes('duplicate') ||
          errorMsg.includes('relation') && errorMsg.includes('already')
        ) {
          skipCount++
          // Silently skip - these are expected for IF NOT EXISTS
        } else {
          errorCount++
          console.error(`❌ Error in statement ${i + 1}:`, err.message)
          console.error('Statement preview:', statement.substring(0, 150) + '...')
        }
      }
    }
    
    console.log('\n✅ Database migrations completed!')
    console.log(`   ✓ Successfully executed: ${successCount} statements`)
    console.log(`   ⊘ Skipped (already exists): ${skipCount} statements`)
    if (errorCount > 0) {
      console.log(`   ✗ Errors: ${errorCount} statements`)
    }
    console.log('\n📊 Tables: users, groups, group_members, expenses, expense_splits, settlements')
    console.log('📈 Indexes and triggers created')
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some statements had errors. Check the output above.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

