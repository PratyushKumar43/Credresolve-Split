'use client'

import Link from 'next/link'
import { UserPlus, MoreHorizontal, User } from 'lucide-react'

export default function DarkPulse() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
      <div className="bg-black rounded-[2.5rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[400px]">
        
        <div className="relative z-10 w-full md:w-1/2">
          <svg className="absolute -top-16 left-0 w-32 h-10 text-white/20" viewBox="0 0 100 20" fill="none" stroke="currentColor">
            <path d="M0,20 Q20,0 50,10 T100,20"></path>
          </svg>
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-8 leading-tight">
            Keep Track of Every <br />
            Expense in Real Time
          </h2>
          <Link href="/register" className="bg-white text-black text-sm font-medium px-6 py-3 rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 inline-flex">
            <UserPlus className="w-4 h-4" />
            Start Tracking Now
          </Link>
        </div>

        {/* Floating UI Card */}
        <div className="relative z-10 mt-12 md:mt-0 w-full max-w-xs transform md:translate-x-10">
          <div className="bg-white rounded-3xl p-5 shadow-2xl relative">
            <div className="text-center mb-4">
              <span className="text-xs text-neutral-400 uppercase tracking-widest">Group Balance</span>
              <h3 className="text-3xl font-medium tracking-tight">Rs 1,245.80</h3>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold mt-1">
                You are owed
              </span>
            </div>
            <div className="bg-black rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center text-white mb-2">
                <span className="text-xs font-medium">Weekend Trip</span>
                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </div>
              <div className="text-white text-lg font-medium">Rs 245.50</div>
              <div className="flex gap-2 mt-3">
                <Link href="/analytics" className="flex-1 bg-neutral-800 text-white text-[10px] py-1.5 rounded-lg border border-neutral-700 text-center">
                  View Analytics
                </Link>
                <button className="flex-1 bg-neutral-800 text-white text-[10px] py-1.5 rounded-lg border border-neutral-700">
                  Settle Up
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium">Alex owes you</span>
                </div>
                <span className="text-xs font-medium text-green-600">Rs 125.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium">Sarah owes you</span>
                </div>
                <span className="text-xs font-medium text-green-600">Rs 120.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Abstract */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-neutral-900">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-800/30 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  )
}


