'use client'

import { Zap, ShieldCheck, DollarSign, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Advantages() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">Why Credresolve</h2>
      <p className="text-lg text-neutral-500 max-w-md mb-16 leading-relaxed">
        We make splitting expenses simple, fair, and hassle-free. No more awkward conversations about money.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {/* Item 1 */}
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ccf32f] flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Quick Setup</h3>
            <p className="text-lg text-neutral-500 leading-relaxed mb-4">
              Create a group and start splitting expenses in minutes. No complicated setup or lengthy onboarding process.
            </p>
            <Link href="/register" className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors inline-block">
              Get Started
            </Link>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ccf32f]/40 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
            <p className="text-lg text-neutral-500 leading-relaxed mb-4">
              Your financial data is encrypted and secure. We never share your information with third parties.
            </p>
            <button className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ccf32f]/40 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Free Forever</h3>
            <p className="text-lg text-neutral-500 leading-relaxed mb-4">
              Split expenses with friends and groups completely free. No hidden fees, no subscriptions, no limits.
            </p>
            <button className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              View Pricing
            </button>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ccf32f]/40 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Easy Settlements</h3>
            <p className="text-lg text-neutral-500 leading-relaxed mb-4">
              Mark expenses as settled with one click. Track payment history and keep everyone in the loop.
            </p>
            <button className="bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              Try It Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}



