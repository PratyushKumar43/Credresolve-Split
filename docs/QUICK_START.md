# Quick Start Guide
## Expense Sharing Application - Credresolve

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon PostgreSQL account (free tier available)
- Git (optional)

## Step 1: Project Setup

### 1.1 Setup Frontend (Next.js)
```bash
cd Frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @clerk/nextjs
npm install react-hook-form @hookform/resolvers zod
npm install zustand
```

### 1.2 Setup Backend (Express.js)
```bash
cd Backend
npm init -y
npm install express @clerk/clerk-sdk-node @prisma/client cors dotenv zod express-rate-limit
npm install -D typescript @types/express @types/cors @types/node tsx prisma
```

### 1.3 Setup Clerk
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys (Publishable Key and Secret Key)

## Step 2: Neon Database Setup

### 2.1 Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string

### 2.2 Configure Environment Variables

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

## Step 3: Database Schema

### 3.1 Initialize Prisma (in Backend)
```bash
cd Backend
npx prisma init
```

### 3.2 Update Prisma Schema
Copy the schema from `DATABASE_SCHEMA.md` to `Backend/prisma/schema.prisma`
Note: User model uses Clerk User ID (no password field)

### 3.3 Run Migrations
```bash
cd Backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3.4 Verify Database
```bash
cd Backend
npx prisma studio
```
This opens a GUI to view your database.

## Step 4: Project Structure

The project has the following structure:
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
│   │   │   └── balances/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── groups/
│   │   ├── expenses/
│   │   └── ui/
│   └── lib/
│       └── utils.ts
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
    └── prisma/
        └── schema.prisma
```

## Step 5: Core Files Setup

### 5.1 Backend Server Setup
The Express.js server is already configured in `Backend/src/server.ts` with:
- Clerk authentication middleware
- CORS configuration
- Rate limiting
- API routes for groups, expenses, balances, and settlements

### 5.2 Frontend Clerk Setup
Configure Clerk in `Frontend/middleware.ts`:
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### 5.3 Start Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

## Step 6: Development Workflow

### 6.1 Start Development Servers
**Backend (Terminal 1):**
```bash
cd Backend
npm run dev
# Server runs on http://localhost:3001
```

**Frontend (Terminal 2):**
```bash
cd Frontend
npm run dev
# App runs on http://localhost:3000
```

### 6.2 Development Checklist
- [ ] Landing page with hero section
- [ ] Clerk authentication (login/register)
- [ ] Dashboard with groups list
- [ ] Create group functionality
- [ ] Add expense with split types
- [ ] View balances
- [ ] Balance simplification
- [ ] Settlement functionality

## Step 7: Testing

### 7.1 Test User Flow
1. Register a new user via Clerk (frontend)
2. Create a group (API call to backend)
3. Add members to group by email
4. Add expenses with different split types
5. View balances
6. Test settlement

### 7.2 Test Edge Cases
- Empty groups
- Single member groups
- Expenses with zero amounts
- Percentage splits that don't sum to 100
- Exact splits that don't sum to expense total

## Step 8: Deployment

### 8.1 Prepare for Production

**Frontend:**
1. Update Clerk environment variables for production
2. Set `NEXT_PUBLIC_API_URL` to production backend URL
3. Run production build: `npm run build`

**Backend:**
1. Update `CLERK_SECRET_KEY` to production key
2. Update `FRONTEND_URL` to production frontend URL
3. Set `NODE_ENV=production`
4. Run production build: `npm run build`

### 8.2 Deploy

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Backend (Railway/Render/Heroku):**
1. Push code to GitHub
2. Create new service
3. Add environment variables
4. Deploy

### 8.3 Database Migration
```bash
cd Backend
npx prisma migrate deploy
```

## Common Issues & Solutions

### Issue: Prisma Client not found
**Solution:** Run `npx prisma generate`

### Issue: Database connection error
**Solution:** Check DATABASE_URL in .env file, ensure SSL mode is set

### Issue: Clerk authentication error
**Solution:** Verify CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY are set correctly

### Issue: Type errors
**Solution:** Restart TypeScript server in VS Code, run `npm run build` to check

## Next Steps

1. Follow `IMPLEMENTATION_PLAN.md` for detailed step-by-step implementation
2. Refer to `TECHNICAL_GUIDE.md` for code examples
3. Check `DATABASE_SCHEMA.md` for database structure
4. Review `PRD.md` for feature requirements

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Clerk Documentation](https://clerk.com/docs)

