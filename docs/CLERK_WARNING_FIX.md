# Fixing Clerk Deprecation Warning

## Issue
You're seeing this warning in the console:
```
Clerk: The prop "afterSignInUrl" is deprecated and should be replaced with the new "fallbackRedirectUrl" or "forceRedirectUrl" props instead.
```

## Root Cause
This warning appears if you have these **deprecated environment variables** in your `Frontend/.env.local` file:
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

Clerk automatically reads these environment variables and shows a deprecation warning.

## Solution

### Step 1: Remove Deprecated Environment Variables

Open `Frontend/.env.local` and **remove** these lines if they exist:
```env
# Remove these lines:
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Step 2: Keep Only Required Variables

Your `Frontend/.env.local` should only have:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Clerk URLs (optional)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Environment
NODE_ENV=development
```

### Step 3: Restart Development Server

After removing the deprecated variables, restart your Next.js dev server:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd Frontend
npm run dev
```

## Why This Works

The redirect URLs are now handled by the `fallbackRedirectUrl` prop in the SignIn and SignUp components:
- `Frontend/app/(auth)/login/[[...rest]]/page.tsx` - Uses `fallbackRedirectUrl="/dashboard"`
- `Frontend/app/(auth)/register/[[...rest]]/page.tsx` - Uses `fallbackRedirectUrl="/dashboard"`

These component-level props take precedence over environment variables and use the new, non-deprecated API.

## Verification

After making these changes:
1. The deprecation warning should disappear
2. Sign-in and sign-up will still redirect to `/dashboard` correctly
3. No functionality is lost

## Note

The warning is **non-critical** - your app works fine even with it. However, removing the deprecated environment variables is the clean solution and follows Clerk's current best practices.


