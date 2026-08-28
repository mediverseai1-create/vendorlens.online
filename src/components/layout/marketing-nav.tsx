'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">Compare Plans</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started free</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
