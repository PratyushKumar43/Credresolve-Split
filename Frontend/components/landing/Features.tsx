'use client'

import { ArrowRight } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-16 max-w-lg">
        Split Expenses <br /> Your Way
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="bg-neutral-50 rounded-[2rem] p-10 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10 max-w-sm">
            <h3 className="text-xl font-medium mb-3">Multiple Split Types</h3>
            <p className="text-lg text-neutral-500 mb-8 leading-relaxed">
              Split expenses equally, by exact amounts, or by percentage. Choose the method that works best for your group.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {/* Abstract Doodle */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#ccf32f] rounded-full mix-blend-multiply opacity-80"></div>
            <div className="absolute bottom-4 right-16 w-24 h-40 bg-black rounded-full mix-blend-multiply opacity-90 rotate-12"></div>
            <svg className="absolute bottom-10 right-4 w-20 h-20 text-black z-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,50 C30,20 70,80 90,50"></path>
              <circle cx="85" cy="45" r="5" fill="none"></circle>
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-neutral-50 rounded-[2rem] p-10 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
          <div className="relative z-10 max-w-sm">
            <h3 className="text-xl font-medium mb-3">Simplified Balances</h3>
            <p className="text-lg text-neutral-500 mb-8 leading-relaxed">
              Our smart algorithm minimizes transactions. See who owes whom with simplified balances that make settling up easy.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {/* Abstract Chart */}
          <div className="absolute bottom-8 right-8 w-40 h-40">
            <div className="absolute inset-0 border-[12px] border-red-400/20 rounded-full border-t-red-400 border-r-transparent rotate-45"></div>
            <div className="absolute inset-0 border-[12px] border-[#ccf32f]/20 rounded-full border-l-[#ccf32f] border-b-transparent -rotate-12 scale-75"></div>
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 text-black" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="0,50 20,40 40,45 60,10 80,20 100,5" strokeLinejoin="round" strokeLinecap="round"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}



