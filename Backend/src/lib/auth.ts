import { clerkClient } from '@clerk/clerk-sdk-node'
import { Request } from 'express'

export interface AuthRequest extends Request {
  auth?: {
    userId: string | null
    sessionId: string | null
  }
}

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string | null
        sessionId: string | null
      }
    }
  }
}

export async function getCurrentUser(req: AuthRequest) {
  const userId = req.auth?.userId
  
  if (!userId) {
    return null
  }

  try {
    const user = await clerkClient.users.getUser(userId)
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User'
    }
  } catch (error) {
    console.error('Error fetching user from Clerk:', error)
    return null
  }
}

export async function requireAuth(req: AuthRequest) {
  const userId = req.auth?.userId
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await getCurrentUser(req)
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

