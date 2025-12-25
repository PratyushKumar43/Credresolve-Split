import { neon, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

// Configure Neon for Node.js environment
neonConfig.webSocketConstructor = ws

if (!process.env.DATABASE_URL) {
  console.error('⚠️  DATABASE_URL environment variable is not set')
  console.error('Please create a .env file in the Backend directory with:')
  console.error('DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require')
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create Neon client
export const sql = neon(process.env.DATABASE_URL)

// Helper function to execute queries
export async function query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql(queryText, params)
    return result as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function for single row queries
export async function queryOne<T = any>(queryText: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(queryText, params)
  return results[0] || null
}

export default sql

