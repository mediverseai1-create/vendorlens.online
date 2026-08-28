import Link from 'next/link'
import { CheckCircle, Shield, Building2, BarChart3, FileText, Lightbulb, Bot, Activity, ArrowRight, Zap, Lock, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: Building2, title: 'Vendor Registry', description: 'Centralize all vendor profiles with contacts, contracts, spend, and status in one searchable database.', color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, title: 'Risk Management', description: 'Score and classify vendors by risk level. Track findings, assign owners, and monitor remediation.', color: 'from-red-500 to-orange-500' },
  { icon: FileText, title: 'Document Tracking', description: 'Never miss an expiring certification or contract. Get alerts 90 days before documents expire.', color: 'from-violet-500 to-purple-500' },
  { icon: BarChart3, title: 'Evaluation Engine', description: 'Conduct structured vendor evaluations with custom criteria, scoring, and recommendations.', color: 'from-emerald-500 to-teal-500' },
  { icon: Activity, title: 'Monitoring', description: 'Stay on top of overdue reviews, expiring documents, and flagged vendors requiring attention.', color: 'from-yellow-500 to-amber-500' },
  { icon: Lightbulb, title: 'AI-Powered Insights', description: 'Surface patterns and anomalies across your portfolio that human analysis would miss.', color: 'from-pink-500 to-rose-500' },
  { icon: Bot, title: 'AI Assistant', description: 'Ask natural language questions about your vendors. Get instant, context-aware answers from your data.', color: 'from-sky-500 to-indigo-500' },
  { icon: TrendingUp, title: 'Analytics & Reports', description: 'Generate executive-ready reports and visualize portfolio health with real-time dashboards.', color: 'from-lime-500 to-green-500' },
]

const STEPS = [
  { num: '01', title: 'Create your account', desc: 'Sign up free and set up your organization in under 5 minutes. No credit card required.' },
  { num: '02', title: 'Add your vendors', desc: 'Import or manually add vendors with all key details, contacts, and documents.' },
  { num: '03', title: 'Assess & score', desc: 'Run structured evaluations, score risk, and track certifications and contracts.' },
  { num: '04', title: 'Act on insights', desc: 'Get AI-powered alerts and recommendations. Never be surprised by a vendor risk again.' },
]

const TRUST_POINTS = [
  { icon: Lock, title: 'Enterprise-grade security', desc: 'Row-level security, encrypted at rest, SOC 2-ready infrastructure.' },
  { icon: Zap, title: 'Instant setup', desc: 'Go from sign-up to your first vendor profile in under 5 minutes.' },
  { icon: Shield, title: 'Built for compliance', desc: 'Audit trails, document tracking, and evaluation records built in.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-28 px-4 sm:px-6">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-slate-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now with Gemini AI — ask anything about your vendors
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.07] tracking-tight">
            <span className="text-white">Know Your Vendors.</span>
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Understand Your Risk.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mt-7 max-w-2xl mx-auto leading-relaxed">
            VendorLens is the vendor intelligence platform for modern procurement teams. Manage vendor relationships, track risk, and make confident decisions — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition-all duration-200"
            >
              Start free — no card required
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-7 py-3.5 text-base font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">Free plan includes up to 5 vendors. Upgrade anytime.</p>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative max-w-5xl mx-auto mt-20 px-4">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
            {/* Fake window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-4 flex-1 rounded-md bg-white/5 h-5 max-w-xs" />
            </div>
            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Vendors', value: '47', color: 'text-sky-400' },
                { label: 'High Risk', value: '3', color: 'text-red-400' },
                { label: 'Expiring Soon', value: '8', color: 'text-amber-400' },
                { label: 'Avg Risk Score', value: '62', color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/5 p-4">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fake chart bar */}
              <div className="md:col-span-2 rounded-xl border border-white/8 bg-white/5 p-4 h-32 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-sky-600/80 to-sky-400/40" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-white/5 p-4 space-y-3">
                {['AWS — Critical', 'Salesforce — High', 'Accenture — Medium'].map((v, i) => (
                  <div key={v} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-red-400' : i === 1 ? 'bg-amber-400' : 'bg-sky-400'}`} />
                    <span className="text-xs text-slate-400 truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0f1e] to-transparent" />
          </div>
          {/* Glow under the card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-sky-500/15 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-14 px-4 sm:px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_POINTS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Platform</p>
            <h2 className="text-4xl font-bold text-white">Everything for the full vendor lifecycle</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">From first contact to offboarding — manage risk, compliance, and performance in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle hover glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04]`} />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-[10px] bg-[#0d1424] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Get started</p>
            <h2 className="text-4xl font-bold text-white">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-white/10 bg-white/5 text-2xl font-bold text-sky-400 mb-5 mx-auto">
                  {s.num}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20">›</div>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI callout */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-[#0d1830] to-violet-950/30 p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs text-sky-300 font-medium mb-4">
                  <Bot className="h-3 w-3" />
                  Powered by Gemini AI
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">Your vendor intelligence, on demand</h2>
                <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                  Ask plain-English questions like "Which vendors are high risk and haven't been reviewed this quarter?" and get instant, data-driven answers.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 mt-6 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
                >
                  Try it free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Fake chat UI */}
              <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur p-4 space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0 mt-0.5">U</div>
                  <div className="rounded-2xl rounded-tl-none bg-white/8 px-4 py-2.5 text-slate-300 text-xs leading-relaxed">
                    Which vendors have overdue risk assessments?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-sky-500/10 border border-sky-500/20 px-4 py-2.5 text-slate-300 text-xs leading-relaxed">
                    You have <span className="text-sky-400 font-medium">3 vendors</span> with overdue risk assessments: AWS (last reviewed 8 months ago), Accenture (never assessed), and Salesforce (due last week). I'd recommend starting with AWS given its Critical tier status.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-white">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-3">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free',
                price: '$0',
                per: 'forever',
                features: ['Up to 5 vendors', '1 user', 'Core vendor registry', 'Basic risk tracking', 'Document storage'],
                cta: 'Get started free',
                href: '/signup',
                highlight: false,
              },
              {
                name: 'Professional',
                price: '$47',
                per: '/month',
                features: ['Up to 50 vendors', '5 users', 'AI assistant & insights', 'Advanced analytics', 'Full evaluation engine', 'Priority support'],
                cta: 'Start free trial',
                href: '/signup',
                highlight: true,
                badge: 'Most popular',
              },
              {
                name: 'Business',
                price: '$97',
                per: '/month',
                features: ['Unlimited vendors', 'Unlimited users', 'Everything in Pro', 'Custom integrations', 'Dedicated onboarding', 'SLA support'],
                cta: 'Get Business',
                href: '/signup',
                highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-sky-500/20 to-sky-600/10 border-2 border-sky-500/40 shadow-xl shadow-sky-500/10'
                    : 'border border-white/10 bg-white/[0.03]'
                }`}
              >
                {'badge' in plan && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-sky-500/30">
                    {plan.badge}
                  </div>
                )}
                <p className="font-bold text-white text-lg">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.per}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-sky-400' : 'text-slate-500'}`} />
                      <span className={plan.highlight ? 'text-slate-200' : 'text-slate-400'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02]'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8">
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">View full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-950/30 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white">Ready to take control of your vendor risk?</h2>
          <p className="text-slate-400 mt-4 leading-relaxed">Start managing your vendor relationships and third-party risk in minutes. Free forever for small teams.</p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition-all duration-200 mt-8"
          >
            Create free account
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-xs text-slate-500 mt-4">No credit card required. Up to 5 vendors free.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-white tracking-tight">VendorLens</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
            <Link href="/signin" className="hover:text-slate-300 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-300 transition-colors">Sign up</Link>
          </div>
          <p className="text-xs text-slate-600">© 2025 VendorLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
