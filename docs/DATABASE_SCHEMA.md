# Database Schema Design
## Expense Sharing Application - Credresolve

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id // Clerk User ID
  email         String    @unique
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  groupsCreated Group[]           @relation("GroupCreator")
  groupMembers  GroupMember[]
  expensesPaid  Expense[]         @relation("ExpensePayer")
  expenseSplits ExpenseSplit[]
  settlementsPaid Settlement[]    @relation("SettlementPayer")
  settlementsReceived Settlement[] @relation("SettlementReceiver")

  @@map("users")
}

model Group {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  creator     User          @relation("GroupCreator", fields: [createdBy], references: [id], onDelete: Cascade)
  members     GroupMember[]
  expenses    Expense[]
  settlements Settlement[]

  @@map("groups")
}

model GroupMember {
  id        String   @id @default(cuid())
  groupId   String
  userId    String
  role      String   @default("member") // "admin" | "member"
  joinedAt  DateTime @default(now())

  // Relations
  group     Group  @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
  @@map("group_members")
}

model Expense {
  id          String   @id @default(cuid())
  groupId     String
  paidBy      String
  amount      Decimal  @db.Decimal(10, 2)
  description String
  splitType   String   // "equal" | "exact" | "percentage"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  group       Group         @relation(fields: [groupId], references: [id], onDelete: Cascade)
  payer       User          @relation("ExpensePayer", fields: [paidBy], references: [id])
  splits      ExpenseSplit[]
  settlements Settlement[]

  @@map("expenses")
}

model ExpenseSplit {
  id         String   @id @default(cuid())
  expenseId  String
  userId     String
  amount     Decimal  @db.Decimal(10, 2)
  percentage Float?   // Only for percentage split type

  // Relations
  expense    Expense  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id])

  @@unique([expenseId, userId])
  @@map("expense_splits")
}

model Settlement {
  id        String    @id @default(cuid())
  groupId   String
  paidBy    String
  paidTo    String
  amount    Decimal   @db.Decimal(10, 2)
  expenseId String?   // Optional: link to specific expense
  createdAt DateTime  @default(now())

  // Relations
  group     Group     @relation(fields: [groupId], references: [id], onDelete: Cascade)
  payer     User      @relation("SettlementPayer", fields: [paidBy], references: [id])
  receiver  User      @relation("SettlementReceiver", fields: [paidTo], references: [id])
  expense   Expense?  @relation(fields: [expenseId], references: [id], onDelete: SetNull)

  @@map("settlements")
}
```

### Schema Relationships

```
User
├── Creates Groups (1:N)
├── Member of Groups (N:M via GroupMember)
├── Pays Expenses (1:N)
├── Has Expense Splits (1:N)
└── Makes/Receives Settlements (1:N)

Group
├── Has Members (N:M via GroupMember)
├── Has Expenses (1:N)
└── Has Settlements (1:N)

Expense
├── Belongs to Group (N:1)
├── Paid by User (N:1)
├── Has Splits (1:N)
└── Can have Settlements (1:N)

ExpenseSplit
├── Belongs to Expense (N:1)
└── Assigned to User (N:1)

Settlement
├── Belongs to Group (N:1)
├── Paid by User (N:1)
├── Paid to User (N:1)
└── Linked to Expense (N:1, optional)
```

### Indexes for Performance

```prisma
// Add these indexes to optimize queries

model User {
  // ... existing fields
  @@index([email])
}

model Group {
  // ... existing fields
  @@index([createdBy])
}

model GroupMember {
  // ... existing fields
  @@index([groupId])
  @@index([userId])
}

model Expense {
  // ... existing fields
  @@index([groupId])
  @@index([paidBy])
  @@index([createdAt])
}

model ExpenseSplit {
  // ... existing fields
  @@index([expenseId])
  @@index([userId])
}

model Settlement {
  // ... existing fields
  @@index([groupId])
  @@index([paidBy])
  @@index([paidTo])
  @@index([createdAt])
}
```

### Data Types Explanation

1. **Decimal for Money**: Using `Decimal(10, 2)` for all monetary values to avoid floating-point precision issues
2. **CUID for IDs**: Using Prisma's default CUID for unique, URL-safe identifiers
3. **Timestamps**: Automatic `createdAt` and `updatedAt` tracking
4. **Cascade Deletes**: When group is deleted, all related data is cleaned up

### Sample Queries

#### Get User's Groups with Member Count
```typescript
const groups = await prisma.group.findMany({
  where: {
    members: {
      some: {
        userId: currentUserId
      }
    }
  },
  include: {
    members: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    },
    _count: {
      select: {
        expenses: true
      }
    }
  }
});
```

#### Get Group Expenses with Splits
```typescript
const expenses = await prisma.expense.findMany({
  where: {
    groupId: groupId
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
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

#### Calculate User Balance in Group
```typescript
// Get all expenses where user paid
const paidExpenses = await prisma.expense.findMany({
  where: {
    groupId: groupId,
    paidBy: userId
  },
  include: {
    splits: {
      where: {
        userId: userId
      }
    }
  }
});

// Get all expense splits where user owes
const owedSplits = await prisma.expenseSplit.findMany({
  where: {
    userId: userId,
    expense: {
      groupId: groupId
    }
  },
  include: {
    expense: true
  }
});

// Calculate net balance
const totalPaid = paidExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
const totalOwed = owedSplits.reduce((sum, s) => sum + Number(s.amount), 0);
const netBalance = totalPaid - totalOwed;
```

### Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name add_settlements

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client after schema changes
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

