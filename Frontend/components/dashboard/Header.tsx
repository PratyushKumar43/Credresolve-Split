'use client'

import { Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import NotificationDropdown from './NotificationDropdown'

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 md:gap-4 border-b bg-white px-3 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search groups, expenses..."
            className="pl-9 text-sm md:text-base"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <NotificationDropdown />
        <UserButton />
      </div>
    </header>
  )
}

