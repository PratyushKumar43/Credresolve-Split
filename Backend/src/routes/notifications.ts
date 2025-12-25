import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { requireAuth, AuthRequest } from '../lib/auth'
import { query, queryOne } from '../lib/db'

const router = Router()
router.use(authenticate)

// Get all notifications for current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { unreadOnly } = req.query

    let sql = `
      SELECT 
        n.id,
        n.type,
        n.title,
        n.message,
        n.related_id as "relatedId",
        n.group_id as "groupId",
        n.is_read as "isRead",
        n.created_at as "createdAt",
        g.name as "groupName"
      FROM notifications n
      LEFT JOIN groups g ON n.group_id = g.id
      WHERE n.user_id = $1
    `

    const params: any[] = [user.id]

    if (unreadOnly === 'true') {
      sql += ' AND n.is_read = FALSE'
    }

    sql += ' ORDER BY n.created_at DESC LIMIT 50'

    const notifications = await query(sql, params)

    res.json(notifications)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get unread notification count
router.get('/unread-count', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    
    const result = await queryOne(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
    `, [user.id])

    res.json({ count: parseInt(result.count) || 0 })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Mark notification as read
router.put('/:id/read', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params

    // Verify notification belongs to user
    const notification = await queryOne(`
      SELECT id FROM notifications 
      WHERE id = $1 AND user_id = $2
    `, [id, user.id])

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    await query(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1
    `, [id])

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Mark all notifications as read
router.put('/read-all', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)

    await query(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = $1 AND is_read = FALSE
    `, [user.id])

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router


