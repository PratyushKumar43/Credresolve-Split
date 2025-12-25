# Frontend-Backend API Connection Guide

This document shows how all frontend pages are connected to the backend API with Clerk authentication.

## Authentication Setup

### Clerk Configuration
- **Middleware:** `Frontend/middleware.ts` - Protects all routes except public ones
- **Provider:** `Frontend/app/layout.tsx` - Wraps app with ClerkProvider
- **Auth Pages:** Use Clerk's `<SignIn />` and `<SignUp />` components

### API Client
- **Location:** `Frontend/lib/api-client.ts`
- **Hook:** `useApi()` - Provides authenticated API methods
- **Features:**
  - Automatically includes Clerk token in Authorization header
  - Points to backend URL from `NEXT_PUBLIC_API_URL`
  - Handles errors consistently

## Page-to-API Mappings

### 1. Authentication Pages

#### `/login` → Clerk SignIn Component
- **Component:** `Frontend/app/(auth)/login/page.tsx`
- **Uses:** Clerk's `<SignIn />` component
- **Backend:** No direct API call (handled by Clerk)
- **Redirect:** `/dashboard` after sign-in

#### `/register` → Clerk SignUp Component
- **Component:** `Frontend/app/(auth)/register/page.tsx`
- **Uses:** Clerk's `<SignUp />` component
- **Backend:** No direct API call (handled by Clerk)
- **Redirect:** `/dashboard` after sign-up

### 2. Dashboard Pages

#### `/dashboard` → Dashboard Overview
- **Component:** `Frontend/app/(dashboard)/dashboard/page.tsx`
- **API Calls:**
  - `GET /api/groups` - Fetch user's groups
  - `GET /api/balances` - Fetch balance summary
- **Uses:** `useApi()` hook

#### `/groups` → Groups List
- **Component:** `Frontend/app/(dashboard)/groups/page.tsx`
- **API Calls:**
  - `GET /api/groups` - Fetch all groups
- **Uses:** `useApi()` hook

#### `/groups/new` → Create Group
- **Component:** `Frontend/app/(dashboard)/groups/new/page.tsx`
- **API Calls:**
  - `POST /api/groups` - Create new group
- **Uses:** `useApi()` hook
- **Redirect:** `/groups/{groupId}` after creation

#### `/groups/[id]` → Group Details
- **Component:** `Frontend/app/(dashboard)/groups/[id]/page.tsx`
- **API Calls:**
  - `GET /api/groups/:id` - Fetch group details
- **Uses:** `useApi()` hook
- **Sub-components:**
  - `ExpenseList` - Shows expenses
  - `BalanceCard` - Shows balances
  - `MemberList` - Shows/manages members

#### `/groups/[id]/expenses/new` → Add Expense
- **Component:** `Frontend/app/(dashboard)/groups/[id]/expenses/new/page.tsx`
- **API Calls:**
  - `GET /api/groups/:id` - Fetch group members
  - `POST /api/expenses/groups/:groupId` - Create expense
- **Uses:** `useApi()` hook
- **Redirect:** `/groups/{groupId}` after creation

#### `/balances` → Overall Balances
- **Component:** `Frontend/app/(dashboard)/balances/page.tsx`
- **API Calls:**
  - `GET /api/balances` - Fetch overall balances
- **Uses:** `useApi()` hook

### 3. Components

#### ExpenseList Component
- **Location:** `Frontend/components/expenses/ExpenseList.tsx`
- **API Calls:**
  - `GET /api/expenses/groups/:groupId` - Fetch expenses
  - `DELETE /api/expenses/:id` - Delete expense
- **Uses:** `useApi()` hook

#### BalanceCard Component
- **Location:** `Frontend/components/balances/BalanceCard.tsx`
- **API Calls:**
  - `GET /api/balances/groups/:groupId/simplified` - Fetch simplified balances
  - `POST /api/settlements` - Record settlement
- **Uses:** `useApi()` hook

#### MemberList Component
- **Location:** `Frontend/components/groups/MemberList.tsx`
- **API Calls:**
  - `POST /api/groups/:id/members` - Add member
  - `DELETE /api/groups/:id/members/:userId` - Remove member
- **Uses:** `useApi()` hook

## Complete API Endpoint Mapping

| Frontend Page/Component | Backend Endpoint | Method | Purpose |
|------------------------|------------------|--------|---------|
| Dashboard | `/api/groups` | GET | Get user's groups |
| Dashboard | `/api/balances` | GET | Get balance summary |
| Groups List | `/api/groups` | GET | Get all groups |
| Create Group | `/api/groups` | POST | Create new group |
| Group Details | `/api/groups/:id` | GET | Get group info |
| Add Member | `/api/groups/:id/members` | POST | Add member to group |
| Remove Member | `/api/groups/:id/members/:userId` | DELETE | Remove member |
| Expense List | `/api/expenses/groups/:groupId` | GET | Get group expenses |
| Add Expense | `/api/expenses/groups/:groupId` | POST | Create expense |
| Delete Expense | `/api/expenses/:id` | DELETE | Delete expense |
| Group Balances | `/api/balances/groups/:groupId` | GET | Get group balances |
| Simplified Balances | `/api/balances/groups/:groupId/simplified` | GET | Get simplified balances |
| Overall Balances | `/api/balances` | GET | Get user's overall balances |
| Record Settlement | `/api/settlements` | POST | Record settlement |

## Authentication Flow

1. **User visits protected route** → Clerk middleware checks authentication
2. **If not authenticated** → Redirects to `/login`
3. **User signs in via Clerk** → Clerk handles authentication
4. **Frontend gets session token** → Stored by Clerk automatically
5. **API calls include token** → `useApi()` hook adds `Authorization: Bearer <token>` header
6. **Backend validates token** → ClerkExpressWithAuth middleware validates
7. **Request proceeds** → User data available in `req.auth.userId`

## Environment Variables Required

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```env
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Testing the Connection

1. **Start Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Test Flow:**
   - Visit `http://localhost:3000`
   - Click "Sign Up" → Register with Clerk
   - Should redirect to `/dashboard`
   - Dashboard should fetch groups and balances from backend
   - All API calls should include Clerk token automatically

## Troubleshooting

### "Unauthorized" errors
- Check that Clerk keys are set correctly
- Verify token is being sent (check Network tab)
- Ensure backend has `CLERK_SECRET_KEY` set

### CORS errors
- Verify `FRONTEND_URL` in backend matches frontend URL
- Check CORS configuration in `Backend/src/server.ts`

### API not found
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend is running on correct port
- Ensure API routes are registered in `Backend/src/server.ts`



