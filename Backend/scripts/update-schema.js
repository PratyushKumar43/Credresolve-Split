const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

function splitSQL(sql) {
  const statements = []
  let current = ''
  let inString = false
  let stringChar = null
  let inFunction = false
  let functionDepth = 0
  let inComment = false

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i]
    const nextChar = sql[i + 1]
    const prevChar = sql[i - 1]

    // Handle comments
    if (!inString && !inFunction && char === '-' && nextChar === '-') {
      inComment = true
      current += char
      continue
    }
    if (inComment) {
      current += char
      if (char === '\n') {
        inComment = false
        current = current.replace(/--.*\n/, '')
      }
      continue
    }

    // Handle string literals
    if ((char === "'" || char === '"') && prevChar !== '\\') {
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

    // Handle $$ delimiters (for DO blocks and functions)
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
      i++
      continue
    }

    // Split on semicolon when not in string or function
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

  const trimmed = current.trim()
  if (trimmed && !trimmed.startsWith('--')) {
    statements.push(trimmed)
  }

  return statements.filter(s => s.length > 0)
}

async function updateSchema() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const updatesPath = path.join(__dirname, '../src/lib/db-schema-updates.sql')
  const updatesSQL = fs.readFileSync(updatesPath, 'utf8')

  try {
    console.log('🔄 Running database schema updates...')
    
    const statements = splitSQL(updatesSQL)
    console.log(`📋 Found ${statements.length} update statements`)
    
    let successCount = 0
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
        const errorMsg = err.message?.toLowerCase() || ''
        if (
          errorMsg.includes('already exists') ||
          errorMsg.includes('duplicate') ||
          errorMsg.includes('relation') && errorMsg.includes('already')
        ) {
          // Expected for IF NOT EXISTS
          successCount++
        } else {
          errorCount++
          console.error(`❌ Error in statement ${i + 1}:`, err.message)
        }
      }
    }
    
    console.log(`\n✅ Updates completed!`)
    console.log(`   ✓ Successfully executed: ${successCount} statements`)
    if (errorCount > 0) {
      console.log(`   ✗ Errors: ${errorCount} statements`)
    }
  } catch (error) {
    console.error('❌ Update failed:', error)
    process.exit(1)
  }
}

updateSchema()


