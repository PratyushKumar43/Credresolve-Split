# Product Requirements Document (PRD)
## Expense Sharing Application - Credresolve

### 1. Project Overview

**Product Name:** Credresolve  
**Type:** Expense Sharing Application (Similar to Splitwise)  
**Tech Stack:** 
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Express.js, TypeScript, Neon PostgreSQL (raw SQL queries)
- **Database:** Neon PostgreSQL (serverless)
- **Authentication:** Clerk

### 2. Objectives

Design and implement a full-stack expense sharing application that allows users to:
- Create and manage groups
- Add shared expenses with multiple split types
- Track balances between users
- Settle dues
- View simplified balance summaries

### 3. Core Features

#### 3.1 User Management
- User registration and authentication via Clerk
- User profile management
- Email-based login system (handled by Clerk)

#### 3.2 Group Management
- Create groups with multiple members
- Add/remove members from groups
- View all groups user is part of
- Group details and member list

#### 3.3 Expense Management
- Add expenses to groups
- Support three split types:
  - **Equal Split**: Divide expense equally among selected members
  - **Exact Amount Split**: Specify exact amounts each member owes
  - **Percentage Split**: Divide expense by percentage among members
- Edit and delete expenses
- View expense history

#### 3.4 Balance Tracking
- Track who owes whom (simplified balances)
- View personal balance summary:
  - Total amount user owes
  - Total amount others owe user
- View balances within a group
- Balance simplification algorithm (minimize transactions)

#### 3.5 Settlement
- Mark expenses as settled
- Record settlement transactions
- Update balances after settlement

### 4. User Stories

#### 4.1 Authentication
- As a user, I want to register with email and password
- As a user, I want to login to access my account
- As a user, I want to logout securely

#### 4.2 Groups
- As a user, I want to create a new group
- As a user, I want to add members to my group
- As a user, I want to view all my groups
- As a user, I want to see group details and members

#### 4.3 Expenses
- As a user, I want to add an expense to a group
- As a user, I want to choose how to split the expense (equal/exact/percentage)
- As a user, I want to see all expenses in a group
- As a user, I want to edit or delete my expenses

#### 4.4 Balances
- As a user, I want to see how much I owe overall
- As a user, I want to see how much others owe me
- As a user, I want to see simplified balances (who owes whom)
- As a user, I want to see balances within a specific group

#### 4.5 Settlements
- As a user, I want to mark an expense as settled
- As a user, I want to record when I pay someone back

### 5. Technical Architecture

#### 5.1 Frontend (Next.js 14)
- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **Forms:** React Hook Form
- **Authentication:** Clerk (client-side)
- **UI Components:** Shadcn/ui or custom components

#### 5.2 Backend (Express.js)
- **Framework:** Express.js with TypeScript
- **Database:** Neon PostgreSQL (serverless driver with raw SQL queries)
- **Database Access:** Direct SQL queries using Neon's serverless driver (`@neondatabase/serverless`)
- **Validation:** Zod
- **Authentication:** Clerk (server-side)
- **Rate Limiting:** express-rate-limit
- **CORS:** Enabled for frontend communication

#### 5.3 Database Schema (PostgreSQL)

**Users Table:**
- id (TEXT, PRIMARY KEY - Clerk User ID), email (TEXT, UNIQUE), name (TEXT), created_at (TIMESTAMP), updated_at (TIMESTAMP)
- Note: Password authentication is handled by Clerk, not stored in database

**Groups Table:**
- id (TEXT, PRIMARY KEY), name (TEXT), description (TEXT), created_by (TEXT, FOREIGN KEY), created_at (TIMESTAMP), updated_at (TIMESTAMP)

**Group Members Table:**
- id (TEXT, PRIMARY KEY), group_id (TEXT, FOREIGN KEY), user_id (TEXT, FOREIGN KEY), role (TEXT - 'admin' or 'member'), joined_at (TIMESTAMP)
- Unique constraint on (group_id, user_id)

**Expenses Table:**
- id (TEXT, PRIMARY KEY), group_id (TEXT, FOREIGN KEY), paid_by (TEXT, FOREIGN KEY), amount (DECIMAL(10,2)), description (TEXT), split_type (TEXT - 'equal', 'exact', 'percentage'), created_at (TIMESTAMP), updated_at (TIMESTAMP)

**Expense Splits Table:**
- id (TEXT, PRIMARY KEY), expense_id (TEXT, FOREIGN KEY), user_id (TEXT, FOREIGN KEY), amount (DECIMAL(10,2)), percentage (DECIMAL(5,2), nullable)
- Unique constraint on (expense_id, user_id)

**Settlements Table:**
- id (TEXT, PRIMARY KEY), group_id (TEXT, FOREIGN KEY), paid_by (TEXT, FOREIGN KEY), paid_to (TEXT, FOREIGN KEY), amount (DECIMAL(10,2)), expense_id (TEXT, FOREIGN KEY, nullable), created_at (TIMESTAMP)

**Additional Schema Features:**
- Indexes on foreign keys and frequently queried columns for performance
- Triggers to automatically update `updated_at` timestamps
- Check constraints for data validation (split_type, role)

### 6. API Endpoints

#### 6.1 Authentication
- `GET /api/auth/me` - Get current user (requires Clerk authentication)
- `GET /api/auth/check` - Check authentication status
- Note: User registration and login are handled by Clerk on the frontend

#### 6.2 Groups
- `GET /api/groups` - Get all user's groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group (by email)
- `DELETE /api/groups/:id/members/:userId` - Remove member

#### 6.3 Expenses
- `GET /api/expenses/groups/:groupId` - Get all expenses in group
- `POST /api/expenses/groups/:groupId` - Create expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

#### 6.4 Balances
- `GET /api/balances` - Get user's overall balances
- `GET /api/balances/groups/:groupId` - Get balances in group
- `GET /api/balances/groups/:groupId/simplified` - Get simplified balances

#### 6.5 Settlements
- `POST /api/settlements` - Record a settlement
- `GET /api/settlements/groups/:groupId` - Get settlement history

### 7. Balance Simplification Algorithm

**Goal:** Minimize the number of transactions needed to settle all debts.

**Algorithm:**
1. Calculate net balance for each user (total owed - total owes)
2. Use a greedy algorithm to match creditors with debtors
3. Create simplified transactions that minimize total transfers

**Example:**
- A owes B: $50
- B owes C: $30
- C owes A: $20

**Simplified:**
- A owes B: $30
- C owes B: $10

### 8. UI/UX Requirements

#### 8.1 Landing Page
- Hero section with app description
- Features showcase
- Call-to-action buttons (Sign Up / Login)
- Modern, clean design

#### 8.2 Dashboard
- Overview of all groups
- Quick balance summary
- Recent expenses
- Quick actions (Create Group, Add Expense)

#### 8.3 Group Page
- Group information
- Member list
- Expense list
- Balance summary
- Add expense button

#### 8.4 Expense Form
- Amount input
- Description
- Paid by selector
- Split type selector (Equal/Exact/Percentage)
- Member selection
- Amount/percentage inputs based on split type

#### 8.5 Balance View
- List of simplified balances
- Visual representation (who owes whom)
- Settlement buttons

### 9. Data Flow

1. **User Registration/Login:**
   - User registers/logs in via Clerk → Clerk handles authentication → Frontend receives session token → API validates token → Returns user data

2. **Create Group:**
   - User fills form → API creates group → Adds creator as member → Returns group data

3. **Add Expense:**
   - User selects group → Fills expense form → API validates → Creates expense and splits → Updates balances → Returns updated data

4. **View Balances:**
   - User requests balances → API calculates from expenses → Simplifies balances → Returns simplified view

5. **Settle:**
   - User marks settlement → API creates settlement record → Updates balances → Returns updated balances

### 10. Security Considerations

- **Authentication:** Clerk handles password hashing, JWT tokens, and session management
- **Authorization:** Express.js middleware validates Clerk tokens on each request
- **Input Validation:** Zod schemas validate all API inputs
- **SQL Injection Prevention:** Parameterized SQL queries prevent SQL injection
- **XSS Prevention:** Input sanitization and proper Content-Type headers
- **CSRF Protection:** Clerk handles CSRF protection
- **Rate Limiting:** express-rate-limit on all API routes
- **CORS:** Configured to allow only frontend origin

### 11. Error Handling

- User-friendly error messages
- Validation errors displayed inline
- API error responses with proper status codes
- Logging for debugging

### 12. Success Metrics

- User can create and manage groups successfully
- Expenses are split correctly according to type
- Balances are calculated accurately
- Simplified balances reduce transaction count
- UI is intuitive and responsive

### 13. Future Enhancements (Out of Scope)

- Email notifications
- Recurring expenses
- Expense categories
- Receipt upload
- Mobile app
- Multi-currency support
- Expense reports and analytics

