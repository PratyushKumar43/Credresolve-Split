# Environment Variables Setup Guide

This guide explains how to set up all environment variables for the Credresolve application.

## 📋 Overview

The application requires environment variables in two locations:
1. **Frontend** - `.env.local` file in the `Frontend/` directory
2. **Backend** - `.env` file in the `Backend/` directory

## 🔧 Frontend Environment Variables

### Location
Create `Frontend/.env.local` (this file is gitignored and won't be committed)

### Required Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Clerk URLs (optional - component-level props handle redirects)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
# Note: Do NOT use NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL or NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
# These are deprecated. Redirects are handled by fallbackRedirectUrl in SignIn/SignUp components.

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### How to Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select an existing one
3. Navigate to **API Keys** in the sidebar
4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Paste it into `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Setup Steps

```bash
cd Frontend
cp .env.example .env.local
# Edit .env.local with your actual values
```

## 🔧 Backend Environment Variables

### Location
Create `Backend/.env` (this file is gitignored and won't be committed)

### Required Variables

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...

# Server Configuration
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### How to Get Database URL

1. Go to [Neon Dashboard](https://neon.tech)
2. Create a new project or select an existing one
3. Go to your project dashboard
4. Click on **Connection Details**
5. Copy the **Connection String**
6. Make sure it includes `?sslmode=require` at the end
7. Paste it into `DATABASE_URL`

### How to Get Clerk Secret Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **API Keys** in the sidebar
4. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
5. **⚠️ IMPORTANT:** This is a secret key - never commit it to version control!
6. Paste it into `CLERK_SECRET_KEY`

### Setup Steps

```bash
cd Backend
cp .env.example .env
# Edit .env with your actual values
```

## 🚀 Quick Setup

### Step 1: Copy Example Files

```bash
# Frontend
cd Frontend
cp .env.example .env.local

# Backend
cd Backend
cp .env.example .env
```

### Step 2: Fill in Values

1. **Clerk Setup:**
   - Create account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy Publishable Key → `Frontend/.env.local`
   - Copy Secret Key → `Backend/.env`

2. **Database Setup:**
   - Create account at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy connection string → `Backend/.env`

3. **Update URLs:**
   - Frontend: Update `NEXT_PUBLIC_API_URL` if backend runs on different port
   - Backend: Update `FRONTEND_URL` if frontend runs on different port

### Step 3: Verify Setup

```bash
# Check Frontend env
cd Frontend
cat .env.local

# Check Backend env
cd Backend
cat .env
```

## 🔒 Security Best Practices

1. **Never commit `.env` or `.env.local` files**
   - These files are already in `.gitignore`
   - Double-check before committing

2. **Use different keys for development and production**
   - Development: Use `pk_test_` and `sk_test_` keys
   - Production: Use `pk_live_` and `sk_live_` keys

3. **Rotate keys if exposed**
   - If you accidentally commit a secret key, rotate it immediately in Clerk dashboard

4. **Use environment-specific values**
   - Development: `http://localhost:3000` and `http://localhost:3001`
   - Production: Your actual domain URLs

## 📝 Environment Variable Reference

### Frontend Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (public) | `pk_test_abc123...` | ✅ Yes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Route for sign-in page | `/login` | ⚠️ Optional |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Route for sign-up page | `/register` | ⚠️ Optional |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` | ✅ Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | ⚠️ Optional |

**Note:** `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` are **deprecated**. Do not use them. Redirects are handled by `fallbackRedirectUrl` prop in SignIn/SignUp components.

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `CLERK_SECRET_KEY` | Clerk secret key (private) | `sk_test_xyz789...` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🐛 Troubleshooting

### "Clerk key not found" error
- Verify the key is correctly copied (no extra spaces)
- Check if you're using the right key type (publishable vs secret)
- Ensure the key matches your Clerk environment (test vs live)

### "Database connection failed" error
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check if database is accessible from your network
- Verify credentials are correct

### "CORS error" in browser
- Verify `FRONTEND_URL` in backend matches your frontend URL
- Check if both servers are running
- Ensure no trailing slashes in URLs

### Environment variables not loading
- **Frontend:** Restart Next.js dev server after changing `.env.local`
- **Backend:** Restart Express server after changing `.env`
- Ensure file names are exactly `.env.local` (frontend) and `.env` (backend)

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Express.js Environment Variables](https://expressjs.com/en/advanced/best-practice-performance.html#use-environment-variables)


