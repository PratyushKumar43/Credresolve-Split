'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ccf32f]"></div>
          <span className="text-lg font-medium tracking-tight">Credresolve</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-base font-medium text-neutral-500">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="#help" className="hover:text-black transition-colors">Help</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-base font-medium hover:text-neutral-600 transition-colors">
            Log In
          </Link>
          <Link href="/register" className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Get Started</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}



