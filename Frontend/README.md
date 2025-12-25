# Credresolve Frontend

Next.js 14 landing page for the Credresolve expense sharing application.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Frontend/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Landing page (main entry point)
│   └── globals.css         # Global styles and scrollbar
├── components/
│   └── landing/
│       ├── Navigation.tsx  # Top navigation bar
│       ├── Hero.tsx        # Hero section with phone mockups
│       ├── Features.tsx    # Features section
│       ├── Advantages.tsx # Why Credresolve section
│       ├── Partners.tsx   # Trusted by section
│       ├── DarkPulse.tsx  # Dark section with balance card
│       ├── RealTimeFeature.tsx # Real-time tracking feature
│       ├── GroupsFeature.tsx   # Groups feature section
│       ├── CTA.tsx         # Call-to-action section
│       └── Footer.tsx      # Footer component
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Features

- ✅ Fully responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript support
- ✅ Next.js 14 App Router
- ✅ Lucide React icons
- ✅ Plus Jakarta Sans font
- ✅ Custom scrollbar styling
- ✅ Smooth animations and transitions

## Components

All landing page components are located in `components/landing/` and are properly typed with TypeScript.

## Styling

- Uses Tailwind CSS for styling
- Custom color: `#ccf32f` (Credresolve yellow)
- Custom scrollbar styling in `globals.css`
- Responsive breakpoints: sm, md, lg

## Next Steps

1. Set up authentication pages (`/login`, `/register`)
2. Create dashboard layout
3. Implement group management pages
4. Add expense tracking features



