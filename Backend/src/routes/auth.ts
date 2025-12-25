import { Router } from 'express'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { getCurrentUser, requireAuth, AuthRequest } from '../lib/auth'

const router = Router()

// Get current user
router.get('/me', async (req: AuthRequest, res) => {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    res.json(user)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Check authentication status
router.get('/check', async (req: AuthRequest, res) => {
  try {
    const userId = req.auth?.userId
    res.json({ authenticated: !!userId, userId })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router



