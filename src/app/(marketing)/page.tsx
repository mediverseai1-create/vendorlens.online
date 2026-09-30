import Link from 'next/link'
import { CheckCircle, TrendingDown, AlertTriangle, TrendingUp, BarChart2, Users, ArrowRight, Shield, Database, Lock, FileText, Zap, Bell } from 'lucide-react'

const MODULES = [
  {
    icon: FileText,
    title: 'Revenue Briefings',
    desc: 'Every run, VendorLens writes a plain-language briefing for your team: which accounts changed, what the change means, and what to do about it. A document you read in five minutes — not a dashboard you have to interpret.',
    accent: '#0891b2',
  },
  {
    icon: AlertTriangle,
    title: 'Account Risk Scoring',
    desc: 'Every account is scored for risk based on order frequency, order size trend, and time since last order. Scores update each run. High-risk accounts are surfaced at the top of every briefing.',
    accent: '#ea580c',
  },
  {
    icon: Users,
    title: 'Call Intelligence',
    desc: 'Upload a recording or transcript from any customer call — sales call, account review, renewal conversation. VendorLens extracts buying intent, objections raised, commitments your team made, and competitors mentioned, then attaches them to that account record.',
    accent: '#0d9488',
  },
  {
    icon: Zap,
    title: 'Action Queue',
    desc: 'Every insight the AI generates becomes a task in your team\'s queue. Each task shows the account name, the reason it was flagged, and what to do next. Your team works through it. One click marks it done and logs the action.',
    accent: '#7c3aed',
  },
  {
    icon: TrendingDown,
    title: 'Decline Detection',
    desc: 'Accounts placing smaller orders or going longer between orders are flagged automatically — with the order trend behind the flag. Catch the signal early enough to make a call, not after the customer has already moved on.',
    accent: '#dc2626',
  },
  {
    icon: BarChart2,
    title: 'Expansion Intelligence',
    desc: 'Accounts buying from one product category but not others, and regions where a product is selling well but has barely been introduced — identified from your own order history, no manual analysis required.',
    accent: '#059669',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Upload your order data.',
    desc: 'Export from your ERP, distribution platform, accounting software, or spreadsheets. Upload as CSV or Excel. VendorLens reads your account structure and order history automatically — no custom integration required.',
  },
  {
    num: '02',
    title: 'Add your customer call recordings.',
    desc: 'Drop in recordings or transcripts from your team\'s customer calls: sales conversations, account check-ins, renewal calls, follow-ups. Supported: MP3, MP4, WAV, PDF, TXT. Each file is matched to the right account.',
  },
  {
    num: '03',
    title: 'Get your revenue briefing.',
    desc: 'VendorLens reads everything, scores every account for risk, and writes your first revenue briefing. First run takes a few minutes. Scheduled runs update on a cadence you set — daily on Professional and Business plans.',
  },
  {
    num: '04',
    title: 'Work the action queue.',
    desc: 'The briefing resolves into a prioritised action queue. Every item has an account name, a reason, and a suggested next action. Your team works through it in the platform. Completed items are logged automatically.',
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
    desc: 'Three roles: Owner, Admin, and Member. Every person on your team can use the platform — each with the right level of control.',
  },
  {
    icon: Shield,
    title: 'Your data is never used to train models',
    desc: 'Your order exports and call recordings are used to run your workspace and nothing else. They are never used to train shared models or improve the AI for other customers.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 70%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(8,145,178,0.10) 0%, transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-8" style={{ borderColor: '#bae6fd', background: '#f0f9ff', color: '#0369a1' }}>
            AI-native revenue intelligence platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[4.25rem] font-bold leading-[1.06] tracking-tight text-slate-900">
            AI reads your accounts.
            <br />
            <span style={{ background: 'linear-gradient(90deg, #0369a1 0%, #0891b2 50%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Your team works the queue.
            </span>
          </h1>

          <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            VendorLens connects to your order history and your team&apos;s customer call recordings. It scores every account for risk, writes a daily revenue briefing, and hands your team a prioritised action queue — so every rep knows exactly who to call and why.
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
            CSV and Excel order exports &nbsp;·&nbsp; Call recordings and transcripts &nbsp;·&nbsp; No CRM required
          </p>
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0c2d4a 0%, #0f3d5e 50%, #0c3a52 100%)' }} className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
            Built for suppliers, distributors, and wholesalers.
          </h2>
          <p className="text-slate-300 mt-5 text-lg leading-relaxed max-w-2xl mx-auto">
            Your reps manage dozens of repeat-order accounts. Most revenue tools are built for SaaS companies tracking monthly subscriptions. VendorLens is built for how your business actually works: order cycles, seasonal patterns, and account relationships managed through direct customer calls.
          </p>
        </div>
      </section>

      {/* ── Platform modules ───────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>Platform</p>
            <h2 className="text-4xl font-bold text-slate-900">Six intelligence modules. One workspace.</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Every plan includes every module. No add-ons, no feature tiers. Credits determine how often you run the AI — not what it can see.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.title}
                  className="group rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                  style={{
                    border: '1px solid #e2e8f0',
                    background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${m.accent}14`, border: `1px solid ${m.accent}30` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: m.accent }} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
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
            <h2 className="text-4xl font-bold text-slate-900">From data upload to action queue in four steps.</h2>
            <p className="text-slate-500 mt-4 max-w-lg mx-auto">No data engineering. No integration project. Upload your exports and call files and VendorLens handles the rest.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mb-4 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', color: '#fff', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}
                >
                  {s.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call intelligence callout ───────────────────────────── */}
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
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#0891b2' }}>Call Intelligence</p>
              <h2 className="text-3xl font-bold text-slate-900 leading-snug">
                What your team hears on customer calls sits beside what those customers actually buy.
              </h2>
              <p className="text-slate-600 mt-5 leading-relaxed">
                Upload a recording or transcript from any customer call and VendorLens automatically extracts four things: what the customer wants to buy next, what objections are holding them back, what your rep committed to do, and which competitors came up. Everything is written to that account&apos;s record alongside their full order history — so your team has the complete picture before every call.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {['Buying intent extracted', 'Objections logged', 'Commitments tracked', 'Competitors flagged'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: '#0891b2' }} />
                    {item}
                  </div>
                ))}
              </div>
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

      {/* ── Security ───────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#0891b2' }}>Security</p>
            <h2 className="text-4xl font-bold text-slate-900">Your workspace is yours. Completely.</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Every workspace is isolated at the database level with row-level security. No shared tables, no cross-tenant queries.</p>
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
            <h2 className="text-4xl font-bold text-slate-900">Every module. Every plan. Pay for usage.</h2>
            <p className="text-slate-500 mt-3">Credits are consumed when the AI runs an analysis. Every plan includes all six modules, unlimited team members, and unlimited historical data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                per: 'per month',
                credits: '200 analysis credits / month',
                features: ['All six intelligence modules', 'Unlimited team members', 'Unlimited historical data', '200 analysis credits'],
                highlight: false,
                badge: null,
              },
              {
                name: 'Professional',
                price: '$47',
                per: 'per month',
                credits: '4,000 analysis credits / month',
                features: ['All six intelligence modules', 'Unlimited team members', 'Unlimited historical data', '4,000 analysis credits', 'Daily briefing cadence', 'Priority support'],
                highlight: true,
                badge: 'Most popular',
              },
              {
                name: 'Business',
                price: '$97',
                per: 'per month',
                credits: '11,000 analysis credits / month',
                features: ['All six intelligence modules', 'Unlimited team members', 'Unlimited historical data', '11,000 analysis credits', 'Highest-frequency cadences', 'Priority support'],
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
            Your first briefing, ready in minutes.
          </h2>
          <p className="text-slate-300 mt-5 leading-relaxed">
            Upload your order exports and your team&apos;s call recordings. VendorLens scores every account, writes the briefing, and builds the queue. Your team can start working it the same day.
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
            <Link href="/#platform" className="hover:text-slate-300 transition-colors">Platform</Link>
            <Link href="/#how" className="hover:text-slate-300 transition-colors">How it works</Link>
            <Link href="/#pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
            <Link href="/signin" className="hover:text-slate-300 transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-slate-600">© 2025 VendorLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
