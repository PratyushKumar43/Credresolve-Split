# Database Setup Guide

This guide explains how to set up and verify your Neon PostgreSQL database for Credresolve.

## Quick Setup

### 1. Run Initial Migration

```bash
cd Backend
npm run db:migrate
```

This will create all tables, indexes, and triggers.

### 2. Verify Schema

```bash
npm run db:verify
```

This checks if all tables, indexes, and constraints are properly created.

### 3. Update Schema (if needed)

If you need to add missing columns or constraints:

```bash
npm run db:update
```

## Database Schema

The database consists of 6 main tables:

1. **users** - User accounts (Clerk User IDs)
2. **groups** - Expense groups
3. **group_members** - Group membership (many-to-many)
4. **expenses** - Individual expenses
5. **expense_splits** - How expenses are split
6. **settlements** - Payment records

## Manual Setup (Alternative)

If you prefer to run SQL manually:

1. Go to your [Neon Dashboard](https://neon.tech)
2. Open the SQL Editor
3. Copy and paste the contents of `Backend/src/lib/db-schema.sql`
4. Execute the SQL

## Verification Queries

### Check if all tables exist:

```sql
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
ORDER BY table_name;
```

### Check table structures:

```sql
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'groups', 'group_members', 'expenses', 'expense_splits', 'settlements')
ORDER BY table_name, ordinal_position;
```

## Troubleshooting

### Tables already exist
If you get "already exists" errors, that's fine - the schema uses `IF NOT EXISTS` clauses.

### Foreign key errors
Make sure tables are created in order:
1. users (no dependencies)
2. groups (depends on users)
3. group_members (depends on groups and users)
4. expenses (depends on groups and users)
5. expense_splits (depends on expenses and users)
6. settlements (depends on groups, users, and expenses)

### Migration script errors
If the migration script fails:
1. Check your `DATABASE_URL` in `.env`
2. Ensure you have proper permissions
3. Try running the SQL manually in Neon dashboard

## Files

- `Backend/src/lib/db-schema.sql` - Main schema file
- `Backend/src/lib/db-schema-verification.sql` - Verification queries
- `Backend/src/lib/db-schema-updates.sql` - Update scripts for existing databases
- `Backend/scripts/migrate.js` - Migration script
- `Backend/scripts/verify-schema.js` - Verification script



