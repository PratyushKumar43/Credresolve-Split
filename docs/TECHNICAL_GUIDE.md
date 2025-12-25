# Technical Implementation Guide
## Expense Sharing Application - Credresolve

## 1. Balance Simplification Algorithm

### Problem
When multiple users have expenses, we get a complex web of debts:
- A owes B: $50
- B owes C: $30
- C owes A: $20

### Solution: Greedy Algorithm

```typescript
// lib/balanceSimplifier.ts

interface Balance {
  userId: string;
  userName: string;
  netBalance: number; // Positive = owed to user, Negative = user owes
}

interface SimplifiedTransaction {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export function simplifyBalances(balances: Balance[]): SimplifiedTransaction[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.netBalance > 0)
    .sort((a, b) => b.netBalance - a.netBalance);
  
  const debtors = balances
    .filter(b => b.netBalance < 0)
    .map(b => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const transactions: SimplifiedTransaction[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const amount = Math.min(creditor.netBalance, debtor.netBalance);

    transactions.push({
      from: debtor.userId,
      fromName: debtor.userName,
      to: creditor.userId,
      toName: creditor.userName,
      amount: parseFloat(amount.toFixed(2))
    });

    creditor.netBalance -= amount;
    debtor.netBalance -= amount;

    if (creditor.netBalance === 0) creditorIndex++;
    if (debtor.netBalance === 0) debtorIndex++;
  }

  return transactions;
}
```

## 2. Expense Split Calculation

### Equal Split
```typescript
function calculateEqualSplit(amount: number, memberIds: string[]) {
  const splitAmount = amount / memberIds.length;
  return memberIds.map(userId => ({
    userId,
    amount: parseFloat(splitAmount.toFixed(2))
  }));
}
```

### Exact Amount Split
```typescript
function validateExactSplit(amount: number, splits: { userId: string; amount: number }[]) {
  const total = splits.reduce((sum, s) => sum + s.amount, 0);
  if (Math.abs(total - amount) > 0.01) {
    throw new Error('Exact amounts must sum to expense total');
  }
  return splits;
}
```

### Percentage Split
```typescript
function calculatePercentageSplit(
  amount: number,
  splits: { userId: string; percentage: number }[]
) {
  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Percentages must sum to 100');
  }

  return splits.map(split => ({
    userId: split.userId,
    amount: parseFloat((amount * split.percentage / 100).toFixed(2)),
    percentage: split.percentage
  }));
}
```

## 3. API Route Structure

### Authentication Middleware
```typescript
// Backend/src/lib/auth.ts
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Request } from 'express';

export interface AuthRequest extends Request {
  auth?: {
    userId: string | null;
    sessionId: string | null;
  };
}

export async function getCurrentUser(req: AuthRequest) {
  const userId = req.auth?.userId;
  
  if (!userId) {
    return null;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User'
    };
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
    return null;
  }
}

export async function requireAuth(req: AuthRequest) {
  const userId = req.auth?.userId;
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await getCurrentUser(req);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
```

### API Route Example: Create Expense (Express.js Backend)
```typescript
// Backend/src/routes/expenses.ts
import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { requireAuth, AuthRequest } from '../lib/auth';
import { prisma } from '../lib/prisma';

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
});

router.post('/groups/:groupId', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req);
    const { groupId } = req.params;
    const data = expenseSchema.parse(req.body);

    // Verify user is member of group
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: user.id
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    // Calculate splits based on type
    let expenseSplits;
    if (data.splitType === 'equal') {
      const memberIds = data.splits.map(s => s.userId);
      const splitAmount = data.amount / memberIds.length;
      expenseSplits = memberIds.map(userId => ({
        userId,
        amount: parseFloat((splitAmount).toFixed(2))
      }));
    } else if (data.splitType === 'exact') {
      expenseSplits = data.splits.map(s => ({
        userId: s.userId!,
        amount: s.amount!
      }));
    } else {
      expenseSplits = data.splits.map(s => ({
        userId: s.userId!,
        amount: parseFloat((data.amount * s.percentage! / 100).toFixed(2)),
        percentage: s.percentage!
      }));
    }

    // Create expense with splits
    const expense = await prisma.expense.create({
      data: {
        groupId,
        paidBy: data.paidBy,
        amount: data.amount,
        description: data.description,
        splitType: data.splitType,
        splits: {
          create: expenseSplits
        }
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true
          }
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(expense);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});
```

## 4. Balance Calculation

### Calculate Group Balances (Express.js Backend)
```typescript
// Backend/src/routes/balances.ts
router.get('/groups/:groupId', async (req: AuthRequest, res) => {
  try {
    const user = await requireAuth(req);
    const { groupId } = req.params;

    // Verify membership
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: user.id
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    // Get all expenses in group
    const expenses = await prisma.expense.findMany({
      where: { groupId },
    include: {
      splits: true,
      payer: {
        select: { id: true, name: true }
      }
    }
  });

  // Get all settlements
  const settlements = await prisma.settlement.findMany({
    where: { groupId: params.groupId }
  });

  // Calculate net balance per user
  const balances = new Map<string, { name: string; balance: number }>();

  // Process expenses
  expenses.forEach(expense => {
    // User who paid gets credited
    const paidBy = expense.paidBy;
    if (!balances.has(paidBy)) {
      balances.set(paidBy, {
        name: expense.payer.name,
        balance: 0
      });
    }
    balances.get(paidBy)!.balance += Number(expense.amount);

    // Users who owe get debited
    expense.splits.forEach(split => {
      if (!balances.has(split.userId)) {
        balances.set(split.userId, { name: '', balance: 0 });
      }
      balances.get(split.userId)!.balance -= Number(split.amount);
    });
  });

  // Process settlements
  settlements.forEach(settlement => {
    const paidBy = settlement.paidBy;
    const paidTo = settlement.paidTo;

    if (!balances.has(paidBy)) {
      balances.set(paidBy, { name: '', balance: 0 });
    }
    if (!balances.has(paidTo)) {
      balances.set(paidTo, { name: '', balance: 0 });
    }

    balances.get(paidBy)!.balance -= Number(settlement.amount);
    balances.get(paidTo)!.balance += Number(settlement.amount);
  });

  // Get user names
  const userIds = Array.from(balances.keys());
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true }
  });

  const userMap = new Map(users.map(u => [u.id, u.name]));
  userIds.forEach(id => {
    if (balances.has(id)) {
      balances.get(id)!.name = userMap.get(id) || 'Unknown';
    }
  });

    // Convert to array
    const balanceArray = Array.from(balances.entries()).map(([userId, data]) => ({
      userId,
      userName: data.name,
      netBalance: parseFloat(data.balance.toFixed(2))
    }));

    res.json(balanceArray);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

## 5. Form Validation with Zod

### Expense Form Schema
```typescript
// lib/validations/expense.ts
import { z } from 'zod';

export const expenseFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  paidBy: z.string().min(1, 'Please select who paid'),
  splitType: z.enum(['equal', 'exact', 'percentage']),
  memberIds: z.array(z.string()).min(1, 'Select at least one member'),
  exactSplits: z.record(z.number()).optional(),
  percentageSplits: z.record(z.number()).optional()
}).refine((data) => {
  if (data.splitType === 'exact') {
    const total = Object.values(data.exactSplits || {}).reduce((a, b) => a + b, 0);
    return Math.abs(total - data.amount) < 0.01;
  }
  return true;
}, {
  message: 'Exact amounts must sum to expense total',
  path: ['exactSplits']
}).refine((data) => {
  if (data.splitType === 'percentage') {
    const total = Object.values(data.percentageSplits || {}).reduce((a, b) => a + b, 0);
    return Math.abs(total - 100) < 0.01;
  }
  return true;
}, {
  message: 'Percentages must sum to 100',
  path: ['percentageSplits']
});
```

## 6. React Hook Form Integration

### Expense Form Component
```typescript
// components/expenses/ExpenseForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseFormSchema } from '@/lib/validations/expense';

export function ExpenseForm({ groupId, members, onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(expenseFormSchema)
  });

  const splitType = watch('splitType');

  const onSubmitForm = async (data) => {
    // Transform form data to API format
    const splits = splitType === 'equal'
      ? data.memberIds.map(id => ({ userId: id }))
      : splitType === 'exact'
      ? Object.entries(data.exactSplits).map(([userId, amount]) => ({
          userId,
          amount: Number(amount)
        }))
      : Object.entries(data.percentageSplits).map(([userId, percentage]) => ({
          userId,
          percentage: Number(percentage)
        }));

    await onSubmit({
      ...data,
      splits
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {/* Form fields */}
    </form>
  );
}
```

## 7. Error Handling Pattern

### API Error Handler
```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## 8. Database Query Optimization

### Use Prisma Select
```typescript
// Only fetch needed fields
const groups = await prisma.group.findMany({
  select: {
    id: true,
    name: true,
    _count: {
      select: {
        members: true,
        expenses: true
      }
    }
  }
});
```

### Batch Operations
```typescript
// Use transaction for multiple operations
await prisma.$transaction(async (tx) => {
  const expense = await tx.expense.create({ data: expenseData });
  await tx.expenseSplit.createMany({ data: splitsData });
  return expense;
});
```

## 9. Type Safety with Prisma

### Generate Types
```typescript
// types/prisma.ts
import { Prisma } from '@prisma/client';

export type ExpenseWithSplits = Prisma.ExpenseGetPayload<{
  include: {
    splits: {
      include: {
        user: true
      }
    }
  }
}>;
```

## 10. Environment Variables

### .env.example
```env
# Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
NODE_ENV="production"
```

