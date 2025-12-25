# Step-by-Step Implementation Plan
## Expense Sharing Application - Credresolve

### Phase 1: Project Setup & Configuration

#### Step 1.1: Initialize Frontend (Next.js)
```bash
cd Frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

#### Step 1.2: Initialize Backend (Express.js)
```bash
cd Backend
npm init -y
npm install express @clerk/clerk-sdk-node @prisma/client cors dotenv zod express-rate-limit
npm install -D typescript @types/express @types/cors @types/node tsx prisma
```

#### Step 1.3: Setup Environment Variables

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**Backend `.env`:**
```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
CLERK_SECRET_KEY="sk_test_..."
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

#### Step 1.4: Initialize Prisma (in Backend)
```bash
cd Backend
npx prisma init
```

#### Step 1.5: Configure Prisma Schema
- Define all models (User, Group, GroupMember, Expense, ExpenseSplit, Settlement)
- User model uses Clerk User ID (no password field)
- Setup relationships
- Add indexes for performance

---

### Phase 2: Database Schema Design

#### Step 2.1: Create Prisma Schema
File: `prisma/schema.prisma`

**Models to create:**
1. **User** - Authentication and user info
2. **Group** - Expense groups
3. **GroupMember** - Many-to-many relationship
4. **Expense** - Individual expenses
5. **ExpenseSplit** - How expense is split
6. **Settlement** - Payment records

#### Step 2.2: Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Step 2.3: Create Prisma Client Instance
File: `lib/prisma.ts` - Singleton pattern for Prisma client

---

### Phase 3: Authentication Setup

#### Step 3.1: Setup Clerk (Frontend)
- Install Clerk: `npm install @clerk/nextjs`
- Configure Clerk middleware in Next.js
- Setup sign-in and sign-up pages
- Configure Clerk environment variables

#### Step 3.2: Setup Clerk (Backend)
- Install Clerk SDK: `npm install @clerk/clerk-sdk-node`
- Configure Clerk middleware in Express.js
- Create authentication middleware
- Setup user sync with database

#### Step 3.3: Create Auth API Routes (Backend)
- `GET /api/auth/me` - Get current user from Clerk
- `GET /api/auth/check` - Check authentication status
- Note: Registration and login handled by Clerk on frontend

#### Step 3.4: Create Auth UI Components (Frontend)
- Clerk SignIn component
- Clerk SignUp component
- Protected route wrapper
- User profile component

---

### Phase 4: Landing Page

#### Step 4.1: Design Landing Page Layout
- Hero section with app name and tagline
- Features section
- How it works section
- Call-to-action buttons

#### Step 4.2: Create Landing Page Components
- `components/landing/Hero.tsx`
- `components/landing/Features.tsx`
- `components/landing/CTA.tsx`

#### Step 4.3: Style with Tailwind
- Responsive design
- Modern UI/UX
- Smooth animations

---

### Phase 5: Dashboard

#### Step 5.1: Create Dashboard Layout
- Sidebar navigation
- Header with user info
- Main content area

#### Step 5.2: Dashboard Components
- `components/dashboard/GroupCard.tsx` - Group summary card
- `components/dashboard/BalanceSummary.tsx` - Quick balance overview
- `components/dashboard/RecentExpenses.tsx` - Recent activity

#### Step 5.3: Dashboard API Integration
- Fetch user's groups
- Fetch balance summary
- Fetch recent expenses

---

### Phase 6: Group Management

#### Step 6.1: Groups API Routes (Backend Express.js)
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member by email
- `DELETE /api/groups/:id/members/:userId` - Remove member

#### Step 6.2: Group Management UI
- `app/groups/page.tsx` - Groups list page
- `app/groups/new/page.tsx` - Create group form
- `app/groups/[id]/page.tsx` - Group details page
- `components/groups/GroupForm.tsx` - Group form component
- `components/groups/GroupList.tsx` - Groups list component

#### Step 6.3: Member Management
- Add members to group
- Remove members
- Member list component

---

### Phase 7: Expense Management

#### Step 7.1: Expense API Routes (Backend Express.js)
- `GET /api/expenses/groups/:groupId` - List expenses
- `POST /api/expenses/groups/:groupId` - Create expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

#### Step 7.2: Expense Form Component
- Amount input
- Description input
- Paid by selector
- Split type selector (Radio buttons)
- Conditional rendering based on split type:
  - Equal: Show member checkboxes
  - Exact: Show amount inputs per member
  - Percentage: Show percentage inputs per member

#### Step 7.3: Expense List Component
- Display all expenses in a group
- Show expense details (amount, paid by, split info)
- Edit/Delete actions
- Sort by date

#### Step 7.4: Expense Calculation Logic
- Equal split calculation
- Exact amount validation
- Percentage split validation (must sum to 100%)
- Create ExpenseSplit records

---

### Phase 8: Balance Tracking

#### Step 8.1: Balance Calculation API (Backend Express.js)
- `GET /api/balances` - Overall user balances
- `GET /api/balances/groups/:groupId` - Group balances
- `GET /api/balances/groups/:groupId/simplified` - Simplified balances

#### Step 8.2: Balance Calculation Logic
- Calculate net balance per user from expenses
- Implement balance simplification algorithm
- Return simplified transaction list

#### Step 8.3: Balance Display Components
- `components/balances/BalanceCard.tsx` - Individual balance card
- `components/balances/BalanceList.tsx` - List of balances
- `components/balances/SimplifiedBalances.tsx` - Simplified view

#### Step 8.4: Balance Simplification Algorithm
File: `lib/balanceSimplifier.ts`
- Calculate net balances
- Greedy matching algorithm
- Minimize transactions

---

### Phase 9: Settlement

#### Step 9.1: Settlement API Routes (Backend Express.js)
- `POST /api/settlements` - Record settlement
- `GET /api/settlements/groups/:groupId` - Settlement history

#### Step 9.2: Settlement Logic
- Create settlement record
- Update balances
- Link to expense (optional)

#### Step 9.3: Settlement UI
- Settlement button on balance cards
- Settlement form (amount, paid to)
- Settlement history view

---

### Phase 10: UI/UX Polish

#### Step 10.1: Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly interactions

#### Step 10.2: Loading States
- Skeleton loaders
- Spinner components
- Optimistic UI updates

#### Step 10.3: Error Handling
- Error boundaries
- Toast notifications
- Form validation messages

#### Step 10.4: Animations
- Page transitions
- Button hover effects
- List animations

---

### Phase 11: Testing & Optimization

#### Step 11.1: API Testing
- Test all endpoints
- Validate calculations
- Test edge cases

#### Step 11.2: UI Testing
- Test all user flows
- Cross-browser testing
- Mobile device testing

#### Step 11.3: Performance Optimization
- Database query optimization
- Image optimization
- Code splitting
- Caching strategies

#### Step 11.4: Security Audit
- Input validation
- SQL injection prevention
- XSS prevention
- Authentication security

---

### Phase 12: Deployment

#### Step 12.1: Neon Database Setup
- Create Neon project
- Get connection string
- Update DATABASE_URL

#### Step 12.2: Environment Configuration
- Production environment variables
- NextAuth URL configuration
- API route configuration

#### Step 12.3: Deploy to Vercel
- Connect GitHub repository
- Configure build settings
- Deploy and test

---

## Implementation Order Summary

1. ✅ Project setup and Prisma configuration
2. ✅ Database schema and migrations
3. ✅ Authentication system
4. ✅ Landing page
5. ✅ Dashboard
6. ✅ Group management
7. ✅ Expense management
8. ✅ Balance tracking
9. ✅ Settlement system
10. ✅ UI polish and optimization
11. ✅ Testing
12. ✅ Deployment

---

## File Structure

```
credresolve/
├── Frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── groups/
│   │   │   │   ├── [id]/
│   │   │   │   └── new/
│   │   │   └── balances/
│   │   ├── layout.tsx
│   │   └── page.tsx (landing)
│   ├── components/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── expenses/
│   │   ├── balances/
│   │   └── ui/
│   ├── lib/
│   │   └── utils.ts
│   └── package.json
│
└── Backend/
    ├── src/
    │   ├── server.ts
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── groups.ts
    │   │   ├── expenses.ts
    │   │   ├── balances.ts
    │   │   └── settlements.ts
    │   ├── lib/
    │   │   ├── prisma.ts
    │   │   ├── auth.ts
    │   │   └── balanceSimplifier.ts
    │   └── middleware/
    │       └── auth.ts
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── .env
    └── package.json
```

---

## Key Implementation Notes

1. **Balance Simplification:** Implement greedy algorithm to minimize transactions
2. **Split Validation:** Ensure exact amounts sum to expense total, percentages sum to 100%
3. **Real-time Updates:** Consider using React Query or SWR for data fetching
4. **Type Safety:** Use TypeScript strictly, leverage Prisma types
5. **Error Handling:** Comprehensive error handling at API and UI level
6. **Security:** Always validate and sanitize inputs, use Prisma for safe queries

