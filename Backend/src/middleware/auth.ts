import { Request, Response, NextFunction } from 'express'
import { requireAuth, AuthRequest } from '../lib/auth'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await requireAuth(req as AuthRequest)
    ;(req as AuthRequest).auth = {
      userId: user.id,
      sessionId: null // Clerk handles sessions differently
    }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}



