'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/#platform" className="hover:text-slate-900 transition-colors">Platform</Link>
            <Link href="/#how" className="hover:text-slate-900 transition-colors">How it works</Link>
            <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white rounded-xl px-4 py-2 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', boxShadow: '0 2px 10px rgba(8,145,178,0.25)' }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  )
}
