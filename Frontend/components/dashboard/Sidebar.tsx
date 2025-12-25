'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, DollarSign, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Groups', href: '/groups', icon: Users },
  { name: 'Balances', href: '/balances', icon: DollarSign },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex h-full md:h-screen w-64 flex-col border-r bg-white">
      <Link href="/" className="flex h-16 items-center gap-2 border-b px-4 md:px-6 hover:bg-neutral-50 transition-colors cursor-pointer">
        <div className="w-4 h-4 rounded-full bg-[#ccf32f] shrink-0"></div>
        <span className="text-base md:text-lg font-medium tracking-tight">Credresolve</span>
      </Link>
      <nav className="flex-1 space-y-1 px-2 md:px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 md:gap-3 rounded-lg px-2 md:px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#ccf32f] text-black'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              )}
            >
              <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-3 md:p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 md:gap-3 text-sm">
          <Settings className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
          <span>Settings</span>
        </Button>
        <SignOutButton redirectUrl="/">
          <Button variant="ghost" className="w-full justify-start gap-2 md:gap-3 mt-2 text-sm">
            <LogOut className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </SignOutButton>
      </div>
    </div>
  )
}

