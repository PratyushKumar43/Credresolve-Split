import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { requireAuth, AuthRequest } from '../lib/auth'
import { query, queryOne } from '../lib/db'

const router = Router()
router.use(authenticate)

const expenseSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  paidBy: z.string(),
  splitType: z.enum(['equal', 'exact', 'percentage']),
  splits: z.array(z.object({
    userId: z.string(),
    amount: z.number().optional(),
    percentage: z.number().optional()
  }))
})

// Get expenses for a group
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

    // Get expenses with payer and splits
    const expenses = await query(`
      SELECT 
        e.id,
        e.group_id as "groupId",
        e.paid_by as "paidBy",
        e.amount,
        e.description,
        e.split_type as "splitType",
        e.created_at as "createdAt",
        e.updated_at as "updatedAt",
        json_build_object(
          'id', u_payer.id,
          'name', u_payer.name
        ) as payer
      FROM expenses e
      INNER JOIN users u_payer ON e.paid_by = u_payer.id
      WHERE e.group_id = $1
      ORDER BY e.created_at DESC
    `, [groupId])

    // Get splits for each expense
    const expensesWithSplits = await Promise.all(expenses.map(async (expense: any) => {
      const splits = await query(`
        SELECT 
          es.id,
          es.user_id as "userId",
          es.amount,
          es.percentage,
          json_build_object(
            'id', u.id,
            'name', u.name
          ) as user
        FROM expense_splits es
        INNER JOIN users u ON es.user_id = u.id
        WHERE es.expense_id = $1
      `, [expense.id])

      return {
        ...expense,
        payer: expense.payer,
        splits: splits.map((s: any) => ({
          id: s.id,
          userId: s.userId,
          amount: parseFloat(s.amount),
          percentage: s.percentage ? parseFloat(s.percentage) : null,
          user: s.user
        }))
      }
    }))

    res.json(expensesWithSplits)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create expense
router.post('/groups/:groupId', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { groupId } = req.params
    const data = expenseSchema.parse(req.body)

    // Verify membership
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [groupId, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' })
    }

    // Calculate splits
    let expenseSplits: any[]
    if (data.splitType === 'equal') {
      const memberIds = data.splits.map(s => s.userId)
      const splitAmount = data.amount / memberIds.length
      expenseSplits = memberIds.map(userId => ({
        userId,
        amount: parseFloat(splitAmount.toFixed(2)),
        percentage: null
      }))
    } else if (data.splitType === 'exact') {
      expenseSplits = data.splits.map(s => ({
        userId: s.userId!,
        amount: s.amount!,
        percentage: null
      }))
    } else {
      expenseSplits = data.splits.map(s => ({
        userId: s.userId!,
        amount: parseFloat((data.amount * s.percentage! / 100).toFixed(2)),
        percentage: s.percentage!
      }))
    }

    // Create expense
    const expenseResult = await queryOne(`
      INSERT INTO expenses (group_id, paid_by, amount, description, split_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, group_id as "groupId", paid_by as "paidBy", amount, description, split_type as "splitType", created_at as "createdAt", updated_at as "updatedAt"
    `, [groupId, data.paidBy, data.amount, data.description, data.splitType])

    // Create splits
    for (const split of expenseSplits) {
      await query(`
        INSERT INTO expense_splits (expense_id, user_id, amount, percentage)
        VALUES ($1, $2, $3, $4)
      `, [expenseResult.id, split.userId, split.amount, split.percentage])
    }

    // Get payer info
    const payer = await queryOne(`
      SELECT id, name FROM users WHERE id = $1
    `, [data.paidBy])

    // Get splits with user info
    const splits = await Promise.all(expenseSplits.map(async (split) => {
      const user = await queryOne(`
        SELECT id, name FROM users WHERE id = $1
      `, [split.userId])
      return {
        userId: split.userId,
        amount: split.amount,
        percentage: split.percentage,
        user: { id: user.id, name: user.name }
      }
    }))

    res.status(201).json({
      ...expenseResult,
      payer: { id: payer.id, name: payer.name },
      splits
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Get expense by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params

    // Check if user is member of the group
    const expense = await queryOne(`
      SELECT e.*, gm.id as membership_id
      FROM expenses e
      INNER JOIN group_members gm ON e.group_id = gm.group_id
      WHERE e.id = $1 AND gm.user_id = $2
    `, [id, user.id])

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // Get expense details
    const expenseDetail = await queryOne(`
      SELECT 
        e.id,
        e.group_id as "groupId",
        e.paid_by as "paidBy",
        e.amount,
        e.description,
        e.split_type as "splitType",
        e.created_at as "createdAt",
        e.updated_at as "updatedAt"
      FROM expenses e
      WHERE e.id = $1
    `, [id])

    // Get payer
    const payer = await queryOne(`
      SELECT id, name FROM users WHERE id = $1
    `, [expenseDetail.paidBy])

    // Get splits
    const splits = await query(`
      SELECT 
        es.id,
        es.user_id as "userId",
        es.amount,
        es.percentage,
        json_build_object(
          'id', u.id,
          'name', u.name
        ) as user
      FROM expense_splits es
      INNER JOIN users u ON es.user_id = u.id
      WHERE es.expense_id = $1
    `, [id])

    res.json({
      ...expenseDetail,
      payer: { id: payer.id, name: payer.name },
      splits: splits.map((s: any) => ({
        id: s.id,
        userId: s.userId,
        amount: parseFloat(s.amount),
        percentage: s.percentage ? parseFloat(s.percentage) : null,
        user: s.user
      }))
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update expense
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params
    const data = expenseSchema.partial().parse(req.body)

    const expense = await queryOne(`
      SELECT id, paid_by FROM expenses WHERE id = $1 AND paid_by = $2
    `, [id, user.id])

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or you are not the payer' })
    }

    // Update expense fields
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    if (data.amount !== undefined) {
      updateFields.push(`amount = $${paramIndex++}`)
      updateValues.push(data.amount)
    }
    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`)
      updateValues.push(data.description)
    }
    if (data.splitType !== undefined) {
      updateFields.push(`split_type = $${paramIndex++}`)
      updateValues.push(data.splitType)
    }

    if (updateFields.length > 0) {
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
      updateValues.push(id)
      await query(`
        UPDATE expenses 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
      `, updateValues)
    }

    // Delete and recreate splits if provided
    if (data.splits) {
      await query('DELETE FROM expense_splits WHERE expense_id = $1', [id])
      
      for (const split of data.splits) {
        await query(`
          INSERT INTO expense_splits (expense_id, user_id, amount, percentage)
          VALUES ($1, $2, $3, $4)
        `, [id, split.userId, split.amount || 0, split.percentage || null])
      }
    }

    // Get updated expense
    const updatedExpense = await queryOne(`
      SELECT * FROM expenses WHERE id = $1
    `, [id])

    // Get payer and splits
    const payer = await queryOne(`SELECT id, name FROM users WHERE id = $1`, [updatedExpense.paid_by])
    const splits = await query(`
      SELECT es.*, json_build_object('id', u.id, 'name', u.name) as user
      FROM expense_splits es
      INNER JOIN users u ON es.user_id = u.id
      WHERE es.expense_id = $1
    `, [id])

    res.json({
      ...updatedExpense,
      payer: { id: payer.id, name: payer.name },
      splits
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Delete expense
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params

    const expense = await queryOne(`
      SELECT id FROM expenses WHERE id = $1 AND paid_by = $2
    `, [id, user.id])

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or you are not the payer' })
    }

    await query('DELETE FROM expenses WHERE id = $1', [id])

    res.json({ message: 'Expense deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
