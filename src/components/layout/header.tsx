'use client'

import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
  user?: { full_name?: string | null; email?: string | null } | null
}

export function Header({ title, user }: HeaderProps) {
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div>
        {title && <h1 className="text-base font-semibold text-slate-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-sky-100 text-sky-700">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
