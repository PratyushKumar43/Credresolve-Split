import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import rateLimit from 'express-rate-limit'

// Import routes
import authRoutes from './routes/auth'
import groupRoutes from './routes/groups'
import expenseRoutes from './routes/expenses'
import balanceRoutes from './routes/balances'
import settlementRoutes from './routes/settlements'
import notificationRoutes from './routes/notifications'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check (public)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API info endpoint (public)
app.get('/api', (req, res) => {
  res.json({
    message: 'Credresolve API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      groups: '/api/groups',
      expenses: '/api/expenses',
      balances: '/api/balances',
      settlements: '/api/settlements',
      notifications: '/api/notifications',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  })
})

// Clerk middleware for authentication (applied after public routes)
app.use(ClerkExpressWithAuth())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/balances', balanceRoutes)
app.use('/api/settlements', settlementRoutes)
app.use('/api/notifications', notificationRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})

