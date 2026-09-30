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
    <header className="h-14 flex items-center justify-between px-6 shrink-0" style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
      <div>
        {title && <p className="text-sm font-semibold text-slate-700">{title}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-700">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-semibold" style={{ background: '#e0f2fe', color: '#0369a1' }}>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
