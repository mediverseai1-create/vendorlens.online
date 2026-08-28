'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Building2, ClipboardList, Shield, FileText,
  Activity, BarChart3, Lightbulb, FileBarChart, Bot, Users, Settings, LogOut,
  ChevronRight
} from 'lucide-react'

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendors', label: 'Vendors', icon: Building2 },
  { href: '/evaluations', label: 'Evaluations', icon: ClipboardList },
  { href: '/risk', label: 'Risk', icon: Shield },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
]

const bottomNav = [
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div className="flex flex-col h-full w-60 bg-slate-900 text-white">
      <div className="px-4 py-5 border-b border-slate-700/50">
        <Logo dark showText />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-0.5">
          {mainNav.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
                {active && <ChevronRight className="h-3 w-3 ml-auto" />}
              </Link>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 space-y-0.5">
          {bottomNav.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/50">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
