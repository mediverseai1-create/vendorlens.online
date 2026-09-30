'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, TrendingDown, AlertTriangle, FileText,
  BarChart3, FileBarChart, Bot, Settings, LogOut, Zap, Activity
} from 'lucide-react'

const mainNav = [
  { href: '/dashboard',   label: 'Overview',         icon: LayoutDashboard },
  { href: '/vendors',     label: 'Accounts',          icon: Users },
  { href: '/insights',    label: 'Revenue Signals',   icon: TrendingDown },
  { href: '/risk',        label: 'Revenue at Risk',   icon: AlertTriangle },
  { href: '/monitoring',  label: 'Monitoring',        icon: Activity },
  { href: '/ai-assistant',label: 'Ask VendorLens',    icon: Bot },
  { href: '/analytics',   label: 'Analytics',         icon: BarChart3 },
  { href: '/documents',   label: 'Documents',         icon: FileText },
  { href: '/reports',     label: 'Reports',           icon: FileBarChart },
  { href: '/evaluations', label: 'Evaluations',       icon: Zap },
]

const bottomNav = [
  { href: '/team',     label: 'Team',     icon: Users },
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
    <div className="flex flex-col h-full w-56 shrink-0" style={{ background: '#0c1f35', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Logo dark showText />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2.5">
        <div className="space-y-0.5">
          {mainNav.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
                style={active ? { background: 'linear-gradient(90deg, rgba(8,145,178,0.25), rgba(8,145,178,0.08))', borderLeft: '2px solid #0891b2', paddingLeft: '10px' } : {}}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-6 pt-4 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {bottomNav.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  active ? 'text-white bg-white/8' : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="px-2.5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
