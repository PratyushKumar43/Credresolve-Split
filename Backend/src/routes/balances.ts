import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { requireAuth, AuthRequest } from '../lib/auth'
import { query, queryOne } from '../lib/db'
import { simplifyBalances } from '../lib/balanceSimplifier'

const router = Router()
router.use(authenticate)

// Get overall balances for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)

    // Get all groups user is part of
    const groups = await query(`
      SELECT DISTINCT group_id as id
      FROM group_members
      WHERE user_id = $1
    `, [user.id])

    const groupIds = groups.map((g: any) => g.id)

    if (groupIds.length === 0) {
      return res.json({
        totalOwed: 0,
        totalOwedToYou: 0,
        netBalance: 0
      })
    }

    // Get all expenses
    const expenses = await query(`
      SELECT e.id, e.paid_by, e.amount, es.user_id, es.amount as split_amount
      FROM expenses e
      INNER JOIN expense_splits es ON e.id = es.expense_id
      WHERE e.group_id = ANY($1::text[])
    `, [groupIds])

    // Get all settlements
    const settlements = await query(`
      SELECT paid_by, paid_to, amount
      FROM settlements
      WHERE group_id = ANY($1::text[])
    `, [groupIds])

    // Calculate balances
    let totalOwed = 0
    let totalOwedToYou = 0

    expenses.forEach((expense: any) => {
      if (expense.paid_by === user.id) {
        totalOwedToYou += Number(expense.amount)
      }
      if (expense.user_id === user.id) {
        totalOwed += Number(expense.split_amount)
      }
    })

    settlements.forEach((settlement: any) => {
      const amount = Number(settlement.amount)
      // Settlement reduces what user owes (if they paid) or reduces what's owed to them (if they received)
      if (settlement.paid_by === user.id) {
        totalOwed -= amount // User paid, so they owe less
      }
      if (settlement.paid_to === user.id) {
        totalOwedToYou -= amount // User received, so less is owed to them
      }
    })

    res.json({
      totalOwed: parseFloat(totalOwed.toFixed(2)),
      totalOwedToYou: parseFloat(totalOwedToYou.toFixed(2)),
      netBalance: parseFloat((totalOwedToYou - totalOwed).toFixed(2))
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get balances for a specific group
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

    // Get all expenses with splits
    const expenses = await query(`
      SELECT 
        e.id,
        e.paid_by,
        e.amount,
        u_payer.name as payer_name,
        es.user_id as split_user_id,
        es.amount as split_amount
      FROM expenses e
      INNER JOIN users u_payer ON e.paid_by = u_payer.id
      INNER JOIN expense_splits es ON e.id = es.expense_id
      WHERE e.group_id = $1
    `, [groupId])

    // Get all settlements
    const settlements = await query(`
      SELECT paid_by, paid_to, amount
      FROM settlements
      WHERE group_id = $1
    `, [groupId])

    // Calculate net balance per user
    const balances = new Map<string, { name: string; balance: number }>()

    expenses.forEach((expense: any) => {
      const paidBy = expense.paid_by
      if (!balances.has(paidBy)) {
        balances.set(paidBy, {
          name: expense.payer_name,
          balance: 0
        })
      }
      balances.get(paidBy)!.balance += Number(expense.amount)

      const splitUserId = expense.split_user_id
      if (!balances.has(splitUserId)) {
        balances.set(splitUserId, { name: '', balance: 0 })
      }
      balances.get(splitUserId)!.balance -= Number(expense.split_amount)
    })

    settlements.forEach((settlement: any) => {
      const paidBy = settlement.paid_by
      const paidTo = settlement.paid_to
      const amount = Number(settlement.amount)

      if (!balances.has(paidBy)) {
        balances.set(paidBy, { name: '', balance: 0 })
      }
      if (!balances.has(paidTo)) {
        balances.set(paidTo, { name: '', balance: 0 })
      }

      // Settlement: paidBy pays paidTo
      // paidBy's balance increases (reducing debt: -250 + 250 = 0)
      // paidTo's balance decreases (reducing credit: +250 - 250 = 0)
      balances.get(paidBy)!.balance += amount
      balances.get(paidTo)!.balance -= amount
    })

    // Get user names for users without names
    const userIds = Array.from(balances.keys())
    if (userIds.length > 0) {
      const users = await query(`
        SELECT id, name FROM users WHERE id = ANY($1::text[])
      `, [userIds])

      const userMap = new Map(users.map((u: any) => [u.id, u.name]))
      userIds.forEach(id => {
        if (balances.has(id) && !balances.get(id)!.name) {
          balances.get(id)!.name = userMap.get(id) || 'Unknown'
        }
      })
    }

    const balanceArray = Array.from(balances.entries()).map(([userId, data]) => ({
      userId,
      userName: data.name,
      netBalance: parseFloat(data.balance.toFixed(2))
    }))

    res.json(balanceArray)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get simplified balances for a group
router.get('/groups/:groupId/simplified', async (req: AuthRequest, res) => {
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

    // Get balances (reuse the logic from above)
    const expenses = await query(`
      SELECT 
        e.id,
        e.paid_by,
        e.amount,
        u_payer.name as payer_name,
        es.user_id as split_user_id,
        es.amount as split_amount
      FROM expenses e
      INNER JOIN users u_payer ON e.paid_by = u_payer.id
      INNER JOIN expense_splits es ON e.id = es.expense_id
      WHERE e.group_id = $1
    `, [groupId])

    const settlements = await query(`
      SELECT paid_by, paid_to, amount
      FROM settlements
      WHERE group_id = $1
    `, [groupId])

    const balances = new Map<string, { name: string; balance: number }>()

    expenses.forEach((expense: any) => {
      const paidBy = expense.paid_by
      if (!balances.has(paidBy)) {
        balances.set(paidBy, {
          name: expense.payer_name,
          balance: 0
        })
      }
      balances.get(paidBy)!.balance += Number(expense.amount)

      const splitUserId = expense.split_user_id
      if (!balances.has(splitUserId)) {
        balances.set(splitUserId, { name: '', balance: 0 })
      }
      balances.get(splitUserId)!.balance -= Number(expense.split_amount)
    })

    settlements.forEach((settlement: any) => {
      const paidBy = settlement.paid_by
      const paidTo = settlement.paid_to
      const amount = Number(settlement.amount)

      if (!balances.has(paidBy)) {
        balances.set(paidBy, { name: '', balance: 0 })
      }
      if (!balances.has(paidTo)) {
        balances.set(paidTo, { name: '', balance: 0 })
      }

      // Settlement: paidBy pays paidTo
      // paidBy's balance increases (reducing debt: -250 + 250 = 0)
      // paidTo's balance decreases (reducing credit: +250 - 250 = 0)
      balances.get(paidBy)!.balance += amount
      balances.get(paidTo)!.balance -= amount
    })

    const userIds = Array.from(balances.keys())
    if (userIds.length > 0) {
      const users = await query(`
        SELECT id, name FROM users WHERE id = ANY($1::text[])
      `, [userIds])

      const userMap = new Map(users.map((u: any) => [u.id, u.name]))
      userIds.forEach(id => {
        if (balances.has(id) && !balances.get(id)!.name) {
          balances.get(id)!.name = userMap.get(id) || 'Unknown'
        }
      })
    }

    const balanceArray = Array.from(balances.entries()).map(([userId, data]) => ({
      userId,
      userName: data.name,
      netBalance: parseFloat(data.balance.toFixed(2))
    }))

    // Simplify balances
    const simplified = simplifyBalances(balanceArray)

    res.json(simplified)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
