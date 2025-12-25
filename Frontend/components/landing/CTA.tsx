'use client'

import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
      <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">
        Start Splitting Expenses <br /> for Free Today
      </h2>
      <Link href="/register" className="bg-black text-white text-base font-medium px-8 py-4 rounded-full hover:bg-neutral-800 transition-colors inline-flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        Get Started Free
      </Link>
    </section>
  )
}



