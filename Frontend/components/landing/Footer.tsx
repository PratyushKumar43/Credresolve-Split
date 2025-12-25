'use client'

import Link from 'next/link'
import { ArrowRight, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 rounded-t-[3rem] mt-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-neutral-800 pb-16">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-4 h-4 rounded-full bg-[#ccf32f]"></div>
              <span className="text-lg font-medium">Credresolve</span>
            </Link>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Features</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><a href="#features" className="hover:text-white transition-colors">Split Expenses</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Groups</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Balance Tracking</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Settlements</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-6">Stay Updated</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your e-mail" 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-[#ccf32f]"
              />
              <button className="absolute right-2 top-1.5 w-9 h-9 bg-[#ccf32f] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-8 text-neutral-500 text-sm">
          <p>© 2024 Credresolve. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}



