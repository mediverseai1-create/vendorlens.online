import Link from 'next/link'
import { CheckCircle, TrendingDown, AlertTriangle, TrendingUp, BarChart2, Users, ArrowRight, Shield, Database, Lock } from 'lucide-react'

const SIGNALS = [
  {
    icon: BarChart2,
    title: 'Trends and patterns',
    desc: 'Where your account revenue is heading, which orders drove the change, and whether shifts are a dip or a direction.',
    accent: '#0891b2',
  },
  {
    icon: TrendingUp,
    title: 'High-value opportunities',
    desc: 'Accounts buying one product line who could buy more, and regions where the same motion could be repeated.',
    accent: '#0d9488',
  },
  {
    icon: TrendingDown,
    title: 'Underperformance',
    desc: 'Products, accounts and regions falling behind the rest — how far, since when, and whether it is getting worse.',
    accent: '#7c3aed',
  },
  {
    icon: Users,
    title: 'Declining customers',
    desc: 'Accounts placing smaller orders or going longer between them, surfaced before they say anything or leave.',
    accent: '#dc2626',
  },
  {
    icon: AlertTriangle,
    title: 'Revenue at risk',
    desc: 'The exposure hiding behind a total that still looks healthy: concentration, slowing repeat business, single-account dependency.',
    accent: '#ea580c',
  },
  {
    icon: TrendingUp,
    title: 'Room to grow',
    desc: 'Your best-performing motions named, with the accounts and regions where the same approach is most likely to work again.',
    accent: '#059669',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Connect your data.',
    desc: 'Upload your sales exports and call recordings. VendorLens reads the full picture across every account.',
  },
  {
    num: '02',
    title: 'The briefing is written for you.',
    desc: 'What changed, what is at risk, and why — with the figures behind every statement, not a dashboard to interpret.',
  },
  {
    num: '03',
    title: 'Your team works the queue.',
    desc: 'Every recommendation arrives with its reason and a way to act on it. One click to mark it done.',
  },
]

const GOVERNANCE = [
  {
    icon: Database,
    title: 'Workspace isolation, enforced in the database',
    desc: 'Row-level security scopes every query to your organisation. Access control is not a frontend check that can be bypassed.',
  },
  {
    icon: Lock,
    title: 'Role-based access for the whole team',
    desc: 'Owners, admins and members see the same system — with the right level of control for each.',
  },
  {
    icon: Shield,
    title: 'Your data stays yours',
    desc: 'Uploaded files and call recordings are used to run your workspace and nothing else. They are never used to train shared models.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 70%)' }}>
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(8,145,178,0.10) 0%, transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-8" style={{ borderColor: '#bae6fd', background: '#f0f9ff', color: '#0369a1' }}>
            Revenue intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[4.25rem] font-bold leading-[1.06] tracking-tight text-slate-900">
            Your accounts are already
            <br />
            <span style={{ background: 'linear-gradient(90deg, #0369a1 0%, #0891b2 50%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              telling you who is leaving.
            </span>
          </h1>

          <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            VendorLens reads every order, every call and every account across your business, then tells your team which customers are slipping, how much revenue is exposed, and exactly who to contact first.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', boxShadow: '0 4px 24px rgba(8,145,178,0.30)' }}
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-medium text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all duration-200"
              style={{ borderColor: '#cbd5e1' }}
            >
              Sign in
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-5 tracking-wide">
            Order data analysis &nbsp;·&nbsp; Call intelligence &nbsp;·&nbsp; Workspace-level security
          </p>
        </div>
      </section>

      {/* ── Statement strip ────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0c2d4a 0%, #0f3d5e 50%, #0c3a52 100%)' }} className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
            A healthy total can hide a shrinking base.
          </h2>
          <p className="text-slate-300 mt-5 text-lg leading-relaxed max-w-xl mx-auto">
            Averages hide the accounts that matter. VendorLens watches each one continuously, so a customer buying less is found in weeks, not after they are gone.
          </p>
        </div>
      </section>

      {/* ── What it finds ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>What it finds</p>
            <h2 className="text-4xl font-bold text-slate-900">Six signals, read from your own data, every run.</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">VendorLens does not average or aggregate. It reads every account and surfaces each one that needs your attention.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIGNALS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                  style={{
                    border: '1px solid #e2e8f0',
                    background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${s.accent}14`, border: `1px solid ${s.accent}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: s.accent }} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>How it works</p>
            <h2 className="text-4xl font-bold text-slate-900">One system that reads, remembers and recommends.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[calc(16.7%+20px)] right-[calc(16.7%+20px)] h-px" style={{ background: 'linear-gradient(90deg, transparent, #0891b2, #0d9488, transparent)' }} />

            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col items-center md:items-start text-center md:text-left">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold mb-5 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', color: '#fff', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}
                >
                  {s.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conversations ──────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 60%, #f0fdf4 100%)',
              border: '1px solid #bae6fd',
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(8,145,178,0.08) 0%, transparent 70%)' }} />
            <div className="relative max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0891b2' }}>Conversations</p>
              <h2 className="text-3xl font-bold text-slate-900 leading-snug">
                What customers say on calls joins what they buy.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Upload a recording or transcript and the intent, objections, commitments and competitor mentions are extracted automatically and added to the account record. Nothing is filled in by hand.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 mt-8 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Governed by design ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>Security</p>
            <h2 className="text-4xl font-bold text-slate-900">Built so your data stays yours.</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Every workspace is isolated at the database level. Role-based access keeps each person to the right level of control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GOVERNANCE.map((g) => {
              const Icon = g.icon
              return (
                <div
                  key={g.title}
                  className="rounded-2xl p-6"
                  style={{
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                    <Icon className="h-5 w-5" style={{ color: '#0369a1' }} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2">{g.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>Pricing</p>
            <h2 className="text-4xl font-bold text-slate-900">One platform. Credits for how much you use it.</h2>
            <p className="text-slate-500 mt-3">Every plan includes every module. Credits refresh each billing cycle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                per: 'per month',
                credits: '200 credits / month',
                features: ['Every module included', 'Unlimited team members', 'Unlimited historical data', '200 analysis credits'],
                highlight: false,
                badge: null,
              },
              {
                name: 'Professional',
                price: '$47',
                per: 'per month',
                credits: '4,000 credits / month',
                features: ['Every module included', 'Unlimited team members', 'Unlimited historical data', '4,000 analysis credits', 'Daily briefing cadence', 'Priority support'],
                highlight: true,
                badge: 'Most popular',
              },
              {
                name: 'Business',
                price: '$97',
                per: 'per month',
                credits: '11,000 credits / month',
                features: ['Every module included', 'Unlimited team members', 'Unlimited historical data', '11,000 analysis credits', 'Heaviest-use cadences', 'Priority support'],
                highlight: false,
                badge: null,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-2xl p-6 flex flex-col"
                style={plan.highlight
                  ? {
                      border: '2px solid #0891b2',
                      background: 'linear-gradient(160deg, #f0f9ff 0%, #ffffff 100%)',
                      boxShadow: '0 8px 40px rgba(8,145,178,0.14)',
                    }
                  : {
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                    }
                }
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(90deg, #0369a1, #0891b2)' }}
                  >
                    {plan.badge}
                  </div>
                )}
                <p className="font-bold text-slate-900 text-lg">{plan.name}</p>
                <p className="text-xs mt-1 mb-4" style={{ color: '#0891b2' }}>{plan.credits}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.per}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: plan.highlight ? '#0891b2' : '#94a3b8' }} />
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={plan.highlight
                    ? { background: 'linear-gradient(135deg, #0369a1, #0891b2)', color: '#fff', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }
                    : { border: '1px solid #cbd5e1', color: '#475569', background: 'white' }
                  }
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'linear-gradient(135deg, #0c2d4a 0%, #0f3d5e 50%, #0c3a52 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white leading-snug">
            See the accounts your totals are hiding.
          </h2>
          <p className="text-slate-300 mt-5 leading-relaxed">
            VendorLens reads your order data, flags the accounts quietly slipping, and tells your team who to contact this week and why.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', boxShadow: '0 4px 24px rgba(8,145,178,0.35)' }}
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.25)' }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-10 px-4 sm:px-6" style={{ background: '#0c1a2e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-sm font-bold text-white tracking-tight">VendorLens</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="/#features" className="hover:text-slate-300 transition-colors">What it finds</Link>
            <Link href="/#how" className="hover:text-slate-300 transition-colors">How it works</Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
            <Link href="/signin" className="hover:text-slate-300 transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-slate-600">© 2025 VendorLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
