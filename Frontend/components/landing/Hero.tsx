'use client'

import Link from 'next/link'
import { UserPlus, ArrowDown, Plus, Search, Users, Settings } from 'lucide-react'

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
      <div className="relative bg-[#ccf32f] rounded-[2.5rem] p-8 md:p-16 overflow-hidden min-h-[600px] md:min-h-[700px] flex flex-col md:block">
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-xl mt-8 md:mt-16">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6">
            Split Expenses <br />
            with Friends
            <span className="inline-block relative top-[-20px]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/80">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-normal text-neutral-800 mb-10 max-w-md leading-relaxed">
            Track shared expenses, split bills fairly, and settle up with ease. The simplest way to manage group expenses and never lose track of who owes what.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/register" className="bg-black text-white text-base font-medium px-7 py-3.5 rounded-full hover:bg-neutral-800 transition-transform hover:scale-105 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Get Started Free
            </Link>
            <a href="#features" className="text-base font-medium flex items-center gap-2 group">
              View Features 
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Decorative Arrow */}
          <div className="absolute right-0 top-1/4 hidden md:block">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="1.5">
              <path d="M10,10 Q50,10 50,50 T90,90" strokeLinecap="round"></path>
              <path d="M80,90 L90,90 L90,80" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>

        {/* Hero Phones Mockup */}
        <div className="relative md:absolute md:top-12 md:-right-20 mt-12 md:mt-0 flex justify-center md:block transform scale-90 md:scale-100">
          
          {/* Back Phone */}
          <div className="absolute top-0 -left-20 md:-left-32 w-[280px] h-[580px] bg-white rounded-[3rem] border-[8px] border-white shadow-2xl rotate-[-6deg] overflow-hidden hidden lg:block opacity-90 z-0">
            {/* Header */}
            <div className="px-6 py-6 bg-neutral-50 border-b border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium tracking-tight">Groups</span>
                <Plus className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="w-full bg-white h-10 rounded-xl border border-neutral-200 flex items-center px-3 gap-2">
                <Search className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-400">Search groups...</span>
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="bg-black text-white p-4 rounded-2xl">
                <span className="text-xs text-neutral-400 uppercase">Trip to Paris</span>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-2xl font-medium tracking-tight">Rs 1,245</span>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                    <div className="w-6 h-6 rounded-full bg-red-400"></div>
                    <div className="w-6 h-6 rounded-full bg-white text-[8px] flex items-center justify-center text-black font-bold">+3</div>
                  </div>
                </div>
              </div>
              {/* List Items */}
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Roommates</p>
                    <p className="text-xs text-neutral-500">5 members</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Rs 320</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Work Lunch</p>
                    <p className="text-xs text-neutral-500">8 members</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Rs 145</span>
              </div>
            </div>
          </div>

          {/* Front Phone */}
          <div className="relative w-[300px] h-[600px] bg-black rounded-[3.5rem] border-[10px] border-black shadow-2xl z-10 overflow-hidden">
            {/* Notch area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
            
            {/* Screen Content */}
            <div className="w-full h-full bg-black text-white pt-10 px-6 flex flex-col">
              {/* Group Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium leading-none">Weekend Trip</h3>
                    <span className="text-xs text-neutral-500">4 members</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <h2 className="text-3xl font-medium tracking-tight">Rs 245.50</h2>
                <span className="text-green-400 text-sm font-medium">You are owed</span>
              </div>

              {/* Expense Chart Visualization */}
              <div className="relative h-48 w-full mb-6">
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-rows-4 gap-4 opacity-10">
                  <div className="border-t border-white w-full"></div>
                  <div className="border-t border-white w-full"></div>
                  <div className="border-t border-white w-full"></div>
                  <div className="border-t border-white w-full"></div>
                </div>
                {/* Expense bars */}
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-2 gap-1">
                  <div className="w-2 h-[40%] bg-red-500 rounded-sm"></div>
                  <div className="w-2 h-[60%] bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-[55%] bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-[45%] bg-red-500 rounded-sm"></div>
                  <div className="w-2 h-[70%] bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-[85%] bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-[75%] bg-red-500 rounded-sm"></div>
                  <div className="w-2 h-[90%] bg-green-500 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <div className="w-2 h-[60%] bg-green-500 opacity-30 rounded-sm"></div>
                  <div className="w-2 h-[40%] bg-red-500 opacity-30 rounded-sm"></div>
                </div>
              </div>

              {/* Split Type Selector */}
              <div className="flex justify-between bg-neutral-900 rounded-xl p-1 mb-6">
                <button className="text-xs font-medium text-neutral-500 py-1.5 px-3">Equal</button>
                <button className="text-xs font-medium text-neutral-500 py-1.5 px-3">Exact</button>
                <button className="text-xs font-medium text-black bg-white rounded-lg py-1.5 px-3 shadow-sm">%</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">You Owe</p>
                  <p className="text-sm font-medium">Rs 125.00</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Owed to You</p>
                  <p className="text-sm font-medium">Rs 370.50</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pb-8 flex gap-3">
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors">Settle</button>
                <button className="flex-1 bg-[#ccf32f] hover:bg-[#bce325] text-black font-medium py-3 rounded-xl transition-colors">Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


