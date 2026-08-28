'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(13,27,46,0.85)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Compare Plans</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-sky-500/20">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  )
}
