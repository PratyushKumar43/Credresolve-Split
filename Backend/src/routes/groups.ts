import { Router } from 'express'
import { z } from 'zod'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { authenticate } from '../middleware/auth'
import { requireAuth, AuthRequest } from '../lib/auth'
import { query, queryOne } from '../lib/db'

const router = Router()

// All routes require authentication
router.use(authenticate)

const groupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
  description: z.string().optional(),
})

// Get all groups for current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    
    const groups = await query(`
      SELECT 
        g.id,
        g.name,
        g.description,
        g.created_at as "createdAt",
        g.updated_at as "updatedAt",
        COUNT(DISTINCT gm.id) as member_count,
        COUNT(DISTINCT e.id) as expense_count
      FROM groups g
      INNER JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN expenses e ON g.id = e.group_id
      WHERE gm.user_id = $1
      GROUP BY g.id, g.name, g.description, g.created_at, g.updated_at
      ORDER BY g.created_at DESC
    `, [user.id])

    const groupsWithCounts = groups.map((group: any) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: parseInt(group.member_count),
      expenseCount: parseInt(group.expense_count),
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    }))

    res.json(groupsWithCounts)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get group by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params

    // Check membership
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [id, user.id])

    if (!membership) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // Get group details
    const group = await queryOne(`
      SELECT 
        g.id,
        g.name,
        g.description,
        g.created_by as "createdBy",
        g.created_at as "createdAt",
        g.updated_at as "updatedAt"
      FROM groups g
      WHERE g.id = $1
    `, [id])

    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // Get members
    const members = await query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        gm.role
      FROM group_members gm
      INNER JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = $1
    `, [id])

    // Get current user's role
    const userMembership = await queryOne(`
      SELECT role FROM group_members
      WHERE group_id = $1 AND user_id = $2
    `, [id, user.id])

    res.json({
      id: group.id,
      name: group.name,
      description: group.description,
      members: members,
      userRole: userMembership?.role || null,
      createdBy: group.createdBy,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create new group
router.post('/', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const data = groupSchema.parse(req.body)

    // Ensure user exists in database
    await query(`
      INSERT INTO users (id, email, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP
    `, [user.id, user.email, user.name])

    // Create group
    const groupResult = await queryOne(`
      INSERT INTO groups (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_at as "createdAt", updated_at as "updatedAt"
    `, [data.name, data.description || null, user.id])

    // Add creator as admin member
    await query(`
      INSERT INTO group_members (group_id, user_id, role)
      VALUES ($1, $2, 'admin')
    `, [groupResult.id, user.id])

    // Get members
    const members = await query(`
      SELECT 
        u.id,
        u.name,
        u.email
      FROM group_members gm
      INNER JOIN users u ON gm.user_id = u.id
      WHERE gm.group_id = $1
    `, [groupResult.id])

    res.status(201).json({
      id: groupResult.id,
      name: groupResult.name,
      description: groupResult.description,
      members: members
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Update group
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params
    const data = groupSchema.parse(req.body)

    // Check if user is admin of the group
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2 AND role = 'admin'
    `, [id, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'Only admins can update groups' })
    }

    const group = await queryOne(`
      UPDATE groups
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, name, description, created_at as "createdAt", updated_at as "updatedAt"
    `, [data.name, data.description || null, id])

    res.json(group)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
})

// Delete group
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params

    // Check if user is admin of the group
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2 AND role = 'admin'
    `, [id, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'Only admins can delete groups' })
    }

    await query('DELETE FROM groups WHERE id = $1', [id])

    res.json({ message: 'Group deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Add member to group
router.post('/:id/members', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id } = req.params
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if user is member of the group
    const membership = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [id, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'You must be a member to add others' })
    }

    // Find user by email in Clerk
    let clerkUsers: any[] = []
    try {
      // Clerk getUserList returns a paginated response
      const response = await clerkClient.users.getUserList({
        emailAddress: [email.toLowerCase().trim()]
      })
      
      // Handle paginated response - Clerk returns { data: [...], totalCount: ... }
      clerkUsers = Array.isArray(response) ? response : (response.data || [])
      
      // If no results, try searching through all users (fallback)
      if (clerkUsers.length === 0) {
        const allUsersResponse = await clerkClient.users.getUserList({ limit: 500 })
        const allUsers = Array.isArray(allUsersResponse) ? allUsersResponse : (allUsersResponse.data || [])
        clerkUsers = allUsers.filter((u: any) => 
          u.emailAddresses?.some((e: any) => 
            e.emailAddress?.toLowerCase() === email.toLowerCase().trim()
          )
        )
      }
    } catch (clerkError: any) {
      console.error('Clerk API error:', clerkError)
      return res.status(500).json({ 
        error: 'Failed to search for user. Please check if the email is correct and the user has signed up.',
        details: process.env.NODE_ENV === 'development' ? clerkError.message : undefined
      })
    }

    if (clerkUsers.length === 0) {
      return res.status(404).json({ error: 'User not found with this email. They need to sign up first.' })
    }

    const clerkUser = clerkUsers[0]
    const memberUserId = clerkUser.id
    const memberName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'User'
    const memberEmail = clerkUser.emailAddresses[0]?.emailAddress || email

    // Ensure user exists in database
    try {
      await query(`
        INSERT INTO users (id, email, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          name = EXCLUDED.name,
          updated_at = CURRENT_TIMESTAMP
      `, [memberUserId, memberEmail, memberName])
    } catch (dbError: any) {
      console.error('Database error inserting user:', dbError)
      return res.status(500).json({ 
        error: 'Failed to add user to database',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      })
    }

    // Check if already a member
    const existingMember = await queryOne(`
      SELECT id FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [id, memberUserId])

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member' })
    }

    // Add member
    try {
      await query(`
        INSERT INTO group_members (group_id, user_id, role)
        VALUES ($1, $2, 'member')
      `, [id, memberUserId])
    } catch (dbError: any) {
      console.error('Database error adding member:', dbError)
      return res.status(500).json({ 
        error: 'Failed to add member to group',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      })
    }

    res.json({ message: 'Member added successfully' })
  } catch (error: any) {
    console.error('Error adding member:', error)
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Remove member from group
router.delete('/:id/members/:userId', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req)
    const { id, userId } = req.params

    // Check if user is admin or removing themselves
    const membership = await queryOne(`
      SELECT id, role FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [id, user.id])

    if (!membership) {
      return res.status(403).json({ error: 'You must be a member' })
    }

    if (membership.role !== 'admin' && userId !== user.id) {
      return res.status(403).json({ error: 'Only admins can remove other members' })
    }

    await query(`
      DELETE FROM group_members 
      WHERE group_id = $1 AND user_id = $2
    `, [id, userId])

    res.json({ message: 'Member removed successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
