# Credresolve - Expense Sharing Application

<div align="center">

**Split expenses easily, settle up quickly**

A full-stack expense sharing application similar to Splitwise, built with modern web technologies.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Key Concepts](#key-concepts)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

Credresolve is a modern expense-sharing application that helps users track and split expenses among friends, family, or group members. The application simplifies the complex web of debts using a balance simplification algorithm, making it easy to see who owes whom and minimize the number of transactions needed to settle up.

### Key Highlights

- ✅ **Real-time Balance Tracking** - See who owes whom at a glance
- ✅ **Balance Simplification** - Minimize transactions with smart debt consolidation
- ✅ **Multiple Split Types** - Equal, exact amount, or percentage-based splits
- ✅ **Group Management** - Create and manage expense groups
- ✅ **Secure Authentication** - Built with Clerk for enterprise-grade security
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS and Shadcn/ui

## ✨ Features

### Core Functionality

- **User Authentication** - Secure sign-up and login via Clerk
- **Group Creation** - Create expense groups and invite members
- **Expense Management** - Add, edit, and delete expenses with:
  - **Equal Split** - Divide expenses equally among selected members
  - **Exact Amount** - Specify exact amounts each member owes
  - **Percentage Split** - Divide expenses by percentage
- **Balance Tracking** - Track balances across all groups
- **Balance Simplification** - Automatically minimize transactions using a greedy algorithm
- **Settlement Recording** - Record payments to settle debts
- **Dashboard** - Overview of groups, expenses, and balances

### User Experience

- 🎨 Modern, intuitive UI design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and optimized performance
- 🔒 Enterprise-grade security
- 📊 Real-time balance updates

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Authentication:** Clerk
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Neon PostgreSQL (serverless)
- **ORM:** Prisma
- **Authentication:** Clerk SDK
- **Validation:** Zod
- **Security:** express-rate-limit

### Infrastructure

- **Database:** Neon PostgreSQL (serverless, free tier available)
- **Authentication:** Clerk (managed authentication service)
- **Deployment:** Vercel (recommended for Next.js) / Railway / Render

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon PostgreSQL account ([Sign up free](https://neon.tech))
- Clerk account ([Sign up free](https://clerk.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Credresolve
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create .env file with your configuration
   # See docs/backend/SETUP.md for details
   
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   
   # Create .env.local file with Clerk keys
   # See docs/ENV_SETUP.md for details
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

> 📖 For detailed setup instructions, see [Quick Start Guide](./docs/QUICK_START.md)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

### Getting Started
- **[Quick Start Guide](./docs/QUICK_START.md)** - Step-by-step setup instructions
- **[Environment Setup](./docs/ENV_SETUP.md)** - Environment variable configuration
- **[Connection Summary](./docs/CONNECTION_SUMMARY.md)** - API connection details

### Project Documentation
- **[Product Requirements Document (PRD)](./docs/PRD.md)** - Complete product specifications
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)** - Development phases and roadmap
- **[Implementation Assessment](./docs/IMPLEMENTATION_ASSESSMENT.md)** - Project status and evaluation
- **[User Flows](./docs/USER_FLOWS.md)** - User interaction flows and wireframes

### Technical Documentation
- **[Technical Guide](./docs/TECHNICAL_GUIDE.md)** - Technical implementation details
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Complete database design and relationships
- **[API Connection Guide](./docs/frontend/API_CONNECTION_GUIDE.md)** - Frontend-backend integration

### Backend Documentation
- **[Backend Setup](./docs/backend/SETUP.md)** - Backend configuration and setup
- **[Database Setup](./docs/backend/DATABASE_SETUP.md)** - Database initialization and migrations

### Frontend Documentation
- **[Pages Summary](./docs/frontend/PAGES_SUMMARY.md)** - Frontend page structure and routing

### Troubleshooting
- **[Clerk Warning Fix](./docs/CLERK_WARNING_FIX.md)** - Common Clerk issues and solutions

## 📁 Project Structure

```
Credresolve/
├── Frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── (auth)/         # Authentication pages (login, register)
│   │   ├── (dashboard)/    # Protected dashboard pages
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── groups/     # Group management
│   │   │   └── balances/   # Balance overview
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── landing/       # Landing page components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── groups/        # Group management components
│   │   ├── expenses/      # Expense components
│   │   ├── balances/      # Balance display components
│   │   └── ui/            # Reusable UI components (Shadcn/ui)
│   ├── lib/               # Utilities and helpers
│   │   ├── api.ts         # API client functions
│   │   ├── api-client.ts  # API client configuration
│   │   ├── utils.ts       # Helper functions
│   │   └── validations/   # Zod validation schemas
│   └── middleware.ts      # Next.js middleware (Clerk)
│
├── Backend/                # Express.js backend API
│   ├── src/
│   │   ├── server.ts      # Express server entry point
│   │   ├── routes/        # API route handlers
│   │   │   ├── auth.ts    # Authentication routes
│   │   │   ├── groups.ts  # Group management routes
│   │   │   ├── expenses.ts # Expense routes
│   │   │   ├── balances.ts # Balance routes
│   │   │   └── settlements.ts # Settlement routes
│   │   ├── lib/           # Core utilities
│   │   │   ├── db.ts      # Prisma client instance
│   │   │   ├── auth.ts    # Authentication helpers
│   │   │   └── balanceSimplifier.ts # Balance simplification algorithm
│   │   └── middleware/    # Express middleware
│   │       └── auth.ts    # Authentication middleware
│   └── scripts/           # Utility scripts
│       ├── migrate.js     # Database migration scripts
│       └── verify-schema.js # Schema verification
│
└── docs/                   # Project documentation
    ├── backend/           # Backend-specific docs
    ├── frontend/          # Frontend-specific docs
    └── *.md              # General documentation files
```

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user information

### Groups
- `GET /api/groups` - List all groups for current user
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `GET /api/groups/:groupId/expenses` - List expenses in a group
- `POST /api/groups/:groupId/expenses` - Create a new expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get user's overall balances across all groups
- `GET /api/groups/:groupId/balances` - Get balances for a specific group
- `GET /api/groups/:groupId/balances/simplified` - Get simplified balances (minimized transactions)

### Settlements
- `POST /api/settlements` - Record a settlement/payment
- `GET /api/groups/:groupId/settlements` - Get settlement history for a group

> 📖 For detailed API documentation, see [Technical Guide](./docs/TECHNICAL_GUIDE.md)

## 💡 Key Concepts

### Balance Simplification

The application uses a greedy algorithm to minimize the number of transactions needed to settle all debts. Instead of tracking every individual debt, it calculates net balances and creates simplified transactions.

**Example:**
- User A owes User B: $50
- User B owes User C: $30
- User C owes User A: $20

**Simplified to:**
- User A owes User B: $30
- User C owes User B: $10

This reduces 3 transactions to just 2, making settlements more efficient.

### Expense Split Types

1. **Equal Split** - Divide expense equally among all selected members
   - Example: $100 expense split 3 ways = $33.33 each

2. **Exact Amount** - Specify exact amounts each member owes
   - Example: $100 expense → A pays $60, B pays $25, C pays $15

3. **Percentage Split** - Divide expense by percentage among members
   - Example: $100 expense → A: 50%, B: 30%, C: 20%

> 📖 For algorithm details, see [Technical Guide](./docs/TECHNICAL_GUIDE.md)

### Database Schema

The database consists of 6 main models:

- **User** - User accounts (managed by Clerk)
- **Group** - Expense groups
- **GroupMember** - Group membership (many-to-many relationship)
- **Expense** - Individual expenses
- **ExpenseSplit** - How expenses are split among members
- **Settlement** - Payment/settlement records

> 📖 For complete schema documentation, see [Database Schema](./docs/DATABASE_SCHEMA.md)

## 🔧 Development

### Available Scripts

**Backend:**
```bash
cd Backend

npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npx prisma studio    # Open Prisma Studio (database GUI)
```

**Frontend:**
```bash
cd Frontend

npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database Management

```bash
# Generate Prisma client after schema changes
cd Backend
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio to view/edit data
npx prisma studio
```

## 🐛 Troubleshooting

### Common Issues

**Prisma Client not found**
```bash
cd Backend
npx prisma generate
```

**Database connection error**
- Verify `DATABASE_URL` in Backend `.env` file
- Ensure SSL mode is set: `?sslmode=require` for Neon
- Check if database is accessible from your network

**Clerk authentication error**
- Verify `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are set correctly
- Ensure Clerk middleware is properly configured in `Frontend/middleware.ts`
- Check Clerk dashboard for API key validity

**Port already in use**
- Backend default port: 3001
- Frontend default port: 3000
- Change ports in respective configuration files if needed

> 📖 For more troubleshooting tips, see:
> - [Quick Start Guide](./docs/QUICK_START.md)
> - [Clerk Warning Fix](./docs/CLERK_WARNING_FIX.md)
> - [Environment Setup](./docs/ENV_SETUP.md)

## 🔒 Security

- **Authentication:** Clerk-managed authentication with JWT tokens
- **Input Validation:** Zod schemas for all API inputs
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
- **XSS Protection:** React's built-in XSS protection + input sanitization
- **Rate Limiting:** express-rate-limit on API endpoints
- **HTTPS:** Recommended for production deployment

## 📊 Implementation Status

- ✅ Project setup and configuration
- ✅ Database schema design and migrations
- ✅ Authentication system (Clerk integration)
- ✅ Landing page
- ✅ Dashboard
- ✅ Group management
- ✅ Expense management (all split types)
- ✅ Balance tracking and simplification
- ✅ Settlement system
- ✅ UI/UX polish
- 🔄 Testing (in progress)
- 🔄 Deployment configuration

> 📖 See [Implementation Assessment](./docs/IMPLEMENTATION_ASSESSMENT.md) for detailed status

## 📚 Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

### Related Documentation
- See [`docs/`](./docs) folder for project-specific documentation

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a design assignment.

---

<div align="center">

**Built with ❤️ using Next.js, Express, and PostgreSQL**

For questions or support, please refer to the [documentation](./docs) or open an issue.

**Happy Coding! 🚀**

</div>
