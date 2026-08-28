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
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #0d1b2e 0%, #0f2240 30%, #0c1a35 60%, #111827 100%)' }}>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-32 left-[15%] w-72 h-72 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
          <div className="absolute top-32 right-[15%] w-64 h-64 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-4 py-1.5 text-sm text-sky-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now with Gemini AI — ask anything about your vendors
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.07] tracking-tight">
            <span className="text-white">Know Your Vendors.</span>
            <br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #67e8f9, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Understand Your Risk.
            </span>
          </h1>

          <p className="text-lg mt-7 max-w-2xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
            VendorLens is the vendor intelligence platform for modern procurement teams. Manage vendor relationships, track risk, and make confident decisions — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', boxShadow: '0 8px 32px rgba(14,165,233,0.3)' }}
            >
              Start free — no card required
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-7 py-3.5 text-base font-medium transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#cbd5e1', background: 'rgba(255,255,255,0.04)' }}
            >
              Sign in
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: '#64748b' }}>Free plan includes up to 5 vendors. Upgrade anytime.</p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-14 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRUST_POINTS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                  <Icon className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{p.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748b' }}>{p.desc}</p>
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
            <p className="mt-4 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>From first contact to offboarding — manage risk, compliance, and performance in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl p-5 transition-all duration-300"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-[10px] flex items-center justify-center" style={{ background: '#0d1b2e' }}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: '#64748b' }}>{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Get started</p>
            <h2 className="text-4xl font-bold text-white">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl font-bold text-sky-400 mb-5 mx-auto"
                  style={{ border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.07)' }}
                >
                  {s.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px" style={{ background: 'rgba(14,165,233,0.15)' }} />
                )}
                <h3 className="font-semibold text-white text-sm">{s.title}</h3>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI callout */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-10 overflow-hidden" style={{ border: '1px solid rgba(14,165,233,0.2)', background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(15,34,64,0.8) 50%, rgba(109,40,217,0.06) 100%)' }}>
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, transparent 70%)' }} />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/8 px-3 py-1 text-xs text-sky-300 font-medium mb-4">
                  <Bot className="h-3 w-3" />
                  Powered by Gemini AI
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">Your vendor intelligence, on demand</h2>
                <p className="mt-4 leading-relaxed text-sm" style={{ color: '#94a3b8' }}>
                  Ask plain-English questions like "Which vendors are high risk and haven't been reviewed this quarter?" and get instant, data-driven answers from your real data.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ background: '#0ea5e9' }}
                >
                  Try it free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Mock chat */}
              <div className="rounded-2xl p-4 space-y-3 text-sm" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)' }}>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ background: '#1e293b', color: '#94a3b8' }}>U</div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-2.5 text-xs leading-relaxed" style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                    Which vendors have overdue risk assessments?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 text-white" style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none px-4 py-2.5 text-xs leading-relaxed" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)', color: '#cbd5e1' }}>
                    You have <span className="text-sky-400 font-medium">3 vendors</span> with overdue assessments: AWS (8 months ago), Accenture (never), and Salesforce (due last week). Start with AWS given its Critical status.
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
            <p className="mt-3" style={{ color: '#94a3b8' }}>Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free', price: '$0', per: 'forever',
                features: ['Up to 5 vendors', '1 user', 'Core vendor registry', 'Basic risk tracking', 'Document storage'],
                cta: 'Get started free', href: '/signup', highlight: false,
              },
              {
                name: 'Professional', price: '$47', per: '/month',
                features: ['Up to 50 vendors', '5 users', 'AI assistant & insights', 'Advanced analytics', 'Full evaluation engine', 'Priority support'],
                cta: 'Start free trial', href: '/signup', highlight: true, badge: 'Most popular',
              },
              {
                name: 'Business', price: '$97', per: '/month',
                features: ['Unlimited vendors', 'Unlimited users', 'Everything in Pro', 'Custom integrations', 'Dedicated onboarding', 'SLA support'],
                cta: 'Get Business', href: '/signup', highlight: false,
              },
            ].map(plan => (
              <div
                key={plan.name}
                className="relative rounded-2xl p-6 flex flex-col"
                style={plan.highlight
                  ? { border: '2px solid rgba(14,165,233,0.4)', background: 'linear-gradient(160deg, rgba(14,165,233,0.12) 0%, rgba(15,34,64,0.6) 100%)', boxShadow: '0 20px 60px rgba(14,165,233,0.1)' }
                  : { border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }
                }
              >
                {'badge' in plan && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white" style={{ background: 'linear-gradient(90deg, #0ea5e9, #06b6d4)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}>
                    {plan.badge}
                  </div>
                )}
                <p className="font-bold text-white text-lg">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm" style={{ color: '#64748b' }}>{plan.per}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`h-4 w-4 shrink-0 ${plan.highlight ? 'text-sky-400' : 'text-slate-600'}`} />
                      <span style={{ color: plan.highlight ? '#e2e8f0' : '#64748b' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="block text-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={plan.highlight
                    ? { background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: '#fff', boxShadow: '0 4px 20px rgba(14,165,233,0.3)' }
                    : { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: '#475569' }}>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">View full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white">Ready to take control of your vendor risk?</h2>
          <p className="mt-4 leading-relaxed" style={{ color: '#94a3b8' }}>Start managing your vendor relationships and third-party risk in minutes. Free forever for small teams.</p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02] mt-8"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', boxShadow: '0 8px 32px rgba(14,165,233,0.3)' }}
          >
            Create free account
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-xs mt-4" style={{ color: '#475569' }}>No credit card required. Up to 5 vendors free.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-white tracking-tight">VendorLens</p>
          <div className="flex gap-6 text-sm" style={{ color: '#475569' }}>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
            <Link href="/signin" className="hover:text-slate-300 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-300 transition-colors">Sign up</Link>
          </div>
          <p className="text-xs" style={{ color: '#334155' }}>© 2025 VendorLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
