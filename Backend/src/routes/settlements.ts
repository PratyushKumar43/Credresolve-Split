import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { requireAuth, AuthRequest } from '../lib/auth'
import { query, queryOne } from '../lib/db'

const router = Router()
router.use(authenticate)

const settlementSchema = z.object({
  groupId: z.string(),
  paidBy: z.string(),
  paidTo: z.string(),
  amount: z.number().positive(),
  expenseId: z.string().optional()
})

// Create settlement
router.post('/', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const data = settlementSchema.parse(req.body)

    // Verify both users are members of the group
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [data.groupId, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' })
    }

    // Verify paidBy is the current user
    if (data.paidBy !== user.id) {
      return res.status(403).json({ error: 'You can only record settlements you made' })
    }

    const settlement = await queryOne(`
      INSERT INTO settlements (group_id, paid_by, paid_to, amount, expense_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id,
        group_id as "groupId",
        paid_by as "paidBy",
        paid_to as "paidTo",
        amount,
        expense_id as "expenseId",
        created_at as "createdAt"
    `, [data.groupId, data.paidBy, data.paidTo, data.amount, data.expenseId || null])

    // Get payer name for notification
    const payer = await queryOne<{ name: string }>(`
      SELECT name FROM users WHERE id = $1
    `, [data.paidBy])

    // Get group name for notification
    const group = await queryOne<{ name: string }>(`
      SELECT name FROM groups WHERE id = $1
    `, [data.groupId])

    // Create notification for the person who received the payment
    const payerName = payer?.name || 'Someone'
    const groupName = group?.name || 'the group'
    await query(`
      INSERT INTO notifications (user_id, type, title, message, related_id, group_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      data.paidTo,
      'settlement_received',
      'Payment Received',
      `${payerName} paid you Rs ${data.amount.toFixed(2)} in ${groupName}. No action needed.`,
      settlement.id,
      data.groupId
    ])

    res.status(201).json(settlement)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Get settlements for a group
router.get('/groups/:groupId', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { groupId } = req.params

    // Verify membership
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [groupId, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' })
    }

    const settlements = await query(`
      SELECT 
        s.id,
        s.group_id as "groupId",
        s.paid_by as "paidBy",
        s.paid_to as "paidTo",
        s.amount,
        s.expense_id as "expenseId",
        s.created_at as "createdAt",
        json_build_object(
          'id', u_payer.id,
          'name', u_payer.name
        ) as payer,
        json_build_object(
          'id', u_receiver.id,
          'name', u_receiver.name
        ) as receiver
      FROM settlements s
      INNER JOIN users u_payer ON s.paid_by = u_payer.id
      INNER JOIN users u_receiver ON s.paid_to = u_receiver.id
      WHERE s.group_id = $1
      ORDER BY s.created_at DESC
    `, [groupId])

    res.json(settlements)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
