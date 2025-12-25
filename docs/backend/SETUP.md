# Backend Setup Instructions

## Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Clerk account with API keys

## Installation

1. Install dependencies:
```bash
cd Backend
npm install
```

2. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
CLERK_SECRET_KEY="sk_test_..."
PORT=3001
FRONTEND_URL="http://localhost:3000"
NODE_ENV=development
```

3. Setup Database:
```bash
npm run db:migrate
```

This will create all necessary tables in your Neon database using the SQL schema.

4. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

All endpoints require Clerk authentication. Include the Clerk session token in requests:

```
Authorization: Bearer <clerk-session-token>
```

### Authentication
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check authentication status

### Groups
- `GET /api/groups` - Get all user's groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group (by email)
- `DELETE /api/groups/:id/members/:userId` - Remove member

### Expenses
- `GET /api/expenses/groups/:groupId` - Get all expenses in group
- `POST /api/expenses/groups/:groupId` - Create expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get user's overall balances
- `GET /api/balances/groups/:groupId` - Get balances in group
- `GET /api/balances/groups/:groupId/simplified` - Get simplified balances

### Settlements
- `POST /api/settlements` - Record a settlement
- `GET /api/settlements/groups/:groupId` - Get settlement history


