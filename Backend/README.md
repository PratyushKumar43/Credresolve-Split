# Credresolve Backend API

Express.js backend API for the Credresolve expense sharing application with Clerk authentication and Neon database.

## Tech Stack

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Neon PostgreSQL (serverless driver)
- **Authentication:** Clerk
- **Validation:** Zod
- **Rate Limiting:** express-rate-limit

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database
- Clerk account and API keys

### Installation

```bash
cd Backend
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Clerk Authentication
CLERK_SECRET_KEY="sk_test_..."

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"
```

### Database Setup

1. **Create tables:**
```bash
npm run db:migrate
```

This will run the SQL schema from `src/lib/db-schema.sql` to create all necessary tables.

Alternatively, you can run the SQL file directly in your Neon dashboard SQL editor.

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check` - Check authentication status

### Groups
- `GET /api/groups` - Get all user's groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group
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

## Authentication

All routes (except `/health`) require Clerk authentication. Include the Clerk session token in the Authorization header:

```
Authorization: Bearer <clerk-session-token>
```

## Project Structure

```
Backend/
├── src/
│   ├── server.ts              # Express server setup
│   ├── routes/                 # API routes
│   │   ├── auth.ts
│   │   ├── groups.ts
│   │   ├── expenses.ts
│   │   ├── balances.ts
│   │   └── settlements.ts
│   ├── lib/                    # Utilities
│   │   ├── db.ts              # Neon database connection
│   │   ├── db-schema.sql      # SQL schema
│   │   ├── auth.ts
│   │   └── balanceSimplifier.ts
│   └── middleware/
│       └── auth.ts
├── scripts/
│   └── migrate.js             # Database migration script
└── package.json
```

## Database Schema

The database uses PostgreSQL with the following tables:
- `users` - User information (Clerk User IDs)
- `groups` - Expense groups
- `group_members` - Group membership
- `expenses` - Expenses
- `expense_splits` - How expenses are split
- `settlements` - Settlement records

See `src/lib/db-schema.sql` for the complete schema.

## Notes

- Uses Neon's serverless driver for database connections
- All queries use parameterized SQL to prevent SQL injection
- User data is synced from Clerk when needed
- Database migrations are run via SQL script
