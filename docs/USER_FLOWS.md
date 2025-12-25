# User Flows & Application Flow
## Expense Sharing Application - Credresolve

## 1. Authentication Flow

```
┌─────────────┐
│ Landing Page│
└──────┬──────┘
       │
       ├─── Click "Sign Up" ───┐
       │                        │
       └─── Click "Login" ──────┤
                                │
                    ┌───────────▼───────────┐
                    │  Clerk Sign In/Up     │
                    │  (Handled by Clerk)   │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Clerk Authentication│
                    │   - Email/Password   │
                    │   - OAuth (optional)  │
                    │   - Session Token    │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Backend: /api/auth/me │
                    │  - Validate token     │
                    │  - Get user from Clerk│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │     Dashboard         │
                    └──────────────────────┘
```

## 2. Group Creation Flow

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       └─── Click "Create Group" ───┐
                                    │
                    ┌───────────────▼───────────────┐
                    │   Create Group Form           │
                    │   - Group name                │
                    │   - Description (optional)     │
                    │   - Add members (email)       │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   Backend: POST /api/groups   │
                    │   - Create group              │
                    │   - Add creator as admin      │
                    │   - Add members               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   Redirect to Group Page      │
                    └───────────────────────────────┘
```

## 3. Add Expense Flow

```
┌─────────────────┐
│   Group Page    │
└────────┬────────┘
         │
         └─── Click "Add Expense" ───┐
                                     │
                    ┌────────────────▼────────────────┐
                    │   Expense Form                   │
                    │   - Amount                       │
                    │   - Description                  │
                    │   - Paid by (dropdown)           │
                    │   - Split type (radio)           │
                    │     ├─ Equal                     │
                    │     ├─ Exact Amount              │
                    │     └─ Percentage                │
                    │   - Member selection             │
                    │   - Amount/Percentage inputs     │
                    └────────────────┬─────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │   Validation                     │
                    │   - Amount > 0                  │
                    │   - Split sums match             │
                    │   - Percentages = 100            │
                    └────────────────┬─────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │   Backend: POST /api/groups/:id/members   │
                    │         expenses                │
                    │   - Create expense              │
                    │   - Create expense splits       │
                    │   - Update balances             │
                    └────────────────┬─────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │   Refresh Group Page            │
                    │   - Show new expense            │
                    │   - Update balance display      │
                    └─────────────────────────────────┘
```

## 4. Balance Calculation Flow

```
┌─────────────────┐
│   Group Page    │
└────────┬────────┘
         │
         └─── Click "View Balances" ───┐
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   API: GET /api/groups/[id]/        │
                    │         balances                     │
                    │   - Fetch all expenses              │
                    │   - Fetch all settlements           │
                    │   - Calculate net balance per user   │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   Balance Simplification             │
                    │   - Separate creditors/debtors       │
                    │   - Greedy matching algorithm        │
                    │   - Minimize transactions            │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │   Display Simplified Balances        │
                    │   - Who owes whom                    │
                    │   - Amount owed                      │
                    │   - Settlement buttons               │
                    └─────────────────────────────────────┘
```

## 5. Settlement Flow

```
┌──────────────────────┐
│  Balance View        │
└──────────┬───────────┘
           │
           └─── Click "Settle" ───┐
                                  │
                ┌─────────────────▼─────────────────┐
                │   Settlement Form                  │
                │   - Amount (pre-filled)            │
                │   - Paid to (pre-filled)           │
                │   - Optional: Link to expense      │
                └─────────────────┬─────────────────┘
                                  │
                ┌─────────────────▼─────────────────┐
                │   Backend: POST /api/settlements       │
                │   - Create settlement record       │
                │   - Update balances                │
                │   - Link to expense (if provided)  │
                └─────────────────┬─────────────────┘
                                  │
                ┌─────────────────▼─────────────────┐
                │   Refresh Balance View            │
                │   - Update balance display        │
                │   - Show settlement in history    │
                └───────────────────────────────────┘
```

## 6. Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE                             │
│  - Hero section                                             │
│  - Features showcase                                        │
│  - Sign Up / Login buttons                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────┐              ┌────▼────┐
   │ Register│              │  Login  │
   └────┬────┘              └────┬────┘
        │                        │
        └────────────┬───────────┘
                     │
        ┌────────────▼────────────┐
        │      DASHBOARD          │
        │  - Groups list          │
        │  - Quick balance        │
        │  - Recent expenses      │
        │  - Create group button  │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │      GROUP PAGE         │
        │  - Group info           │
        │  - Members list         │
        │  - Expenses list        │
        │  - Balance summary      │
        │  - Add expense button   │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │    EXPENSE FORM         │
        │  - Fill expense details │
        │  - Choose split type    │
        │  - Select members       │
        │  - Submit               │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │   BALANCE VIEW          │
        │  - Simplified balances  │
        │  - Who owes whom        │
        │  - Settlement options   │
        └─────────────────────────┘
```

## 7. Data Flow Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │────────▶│ Next.js  │────────▶│  Prisma  │
│ (Browser)│         │ API Route│         │   ORM     │
└──────────┘         └──────────┘         └─────┬─────┘
                                                │
                                         ┌──────▼──────┐
                                         │   Neon DB   │
                                         │ PostgreSQL  │
                                         └─────────────┘

Flow:
1. User action in browser
2. React component calls API route
3. API route validates request
4. Prisma queries database
5. Database returns data
6. Prisma formats response
7. API route processes data
8. Response sent to client
9. React component updates UI
```

## 8. Split Type Decision Tree

```
                    Expense Amount: $100
                            │
            ┌───────────────┼───────────────┐
            │               │               │
      ┌─────▼─────┐   ┌────▼────┐   ┌─────▼─────┐
      │   Equal   │   │  Exact  │   │Percentage │
      └─────┬─────┘   └────┬────┘   └─────┬─────┘
            │              │              │
    ┌───────▼───────┐ ┌───▼────┐   ┌─────▼──────┐
    │ Select 3      │ │ User A:│   │ User A: 40%│
    │ members       │ │ $40    │   │ = $40      │
    │               │ │        │   │            │
    │ Each gets:    │ │ User B:│   │ User B: 35%│
    │ $100 / 3      │ │ $35    │   │ = $35      │
    │ = $33.33      │ │        │   │            │
    │               │ │ User C:│   │ User C: 25%│
    │               │ │ $25    │   │ = $25      │
    └───────────────┘ └────────┘   └────────────┘
```

## 9. Balance Simplification Example

```
Initial State:
┌─────────────────────────────────────┐
│ A owes B: $50                       │
│ B owes C: $30                       │
│ C owes A: $20                       │
└─────────────────────────────────────┘
         │
         │ Calculate Net Balances
         ▼
┌─────────────────────────────────────┐
│ A: -$50 + $20 = -$30 (owes $30)    │
│ B: +$50 - $30 = +$20 (owed $20)    │
│ C: +$30 - $20 = +$10 (owed $10)    │
└─────────────────────────────────────┘
         │
         │ Simplify
         ▼
┌─────────────────────────────────────┐
│ A owes B: $30                       │
│ C owes B: $10                       │
└─────────────────────────────────────┘
```

## 10. Error Handling Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Form Validation │
│  (Client-side)   │
└──────┬───────────┘
       │
       ├─── Invalid ───▶ Show inline errors
       │
       └─── Valid ───▶
                     │
                     ▼
            ┌──────────────────┐
            │  API Request      │
            └──────┬────────────┘
                   │
                   ▼
            ┌──────────────────┐
            │  Server Validation│
            │  (Zod)            │
            └──────┬────────────┘
                   │
                   ├─── Invalid ───▶ Return 400 with errors
                   │
                   └─── Valid ───▶
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Database    │
                          │  Operation   │
                          └──────┬───────┘
                                 │
                                 ├─── Error ───▶ Return 500
                                 │
                                 └─── Success ───▶ Return 200/201
```

## 11. Component Hierarchy

```
App Layout
├── Landing Page
│   ├── Hero
│   ├── Features
│   └── CTA
│
├── Auth Layout
│   ├── Login Page
│   └── Register Page
│
└── Dashboard Layout
    ├── Sidebar
    ├── Header
    └── Main Content
        ├── Dashboard Page
        │   ├── GroupList
        │   ├── BalanceSummary
        │   └── RecentExpenses
        │
        ├── Groups Page
        │   ├── GroupCard
        │   └── CreateGroupForm
        │
        ├── Group Detail Page
        │   ├── GroupInfo
        │   ├── MemberList
        │   ├── ExpenseList
        │   ├── BalanceCard
        │   └── AddExpenseForm
        │
        └── Balances Page
            ├── SimplifiedBalances
            └── SettlementForm
```

## 12. State Management Flow

```
┌─────────────────────────────────────┐
│   Server State (Database)           │
│   - Groups, Expenses, Balances      │
└──────────────┬──────────────────────┘
               │
               │ Fetch on mount/refresh
               ▼
┌─────────────────────────────────────┐
│   Client State (React State/Zustand)│
│   - UI state, form data, cache      │
└──────────────┬──────────────────────┘
               │
               │ User interactions
               ▼
┌─────────────────────────────────────┐
│   API Mutations                      │
│   - Create, Update, Delete           │
└──────────────┬──────────────────────┘
               │
               │ Optimistic updates
               ▼
┌─────────────────────────────────────┐
│   UI Updates                         │
│   - Re-render components             │
│   - Show success/error messages      │
└─────────────────────────────────────┘
```

---

These flows provide a comprehensive view of how users interact with the application and how data flows through the system.

