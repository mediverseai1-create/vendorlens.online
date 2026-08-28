import Link from 'next/link'
import { CheckCircle, Shield, Building2, BarChart3, FileText, Lightbulb, Bot, Activity, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: Building2, title: 'Vendor Registry', description: 'Centralize all vendor profiles with contacts, contracts, spend, and status in one searchable database.' },
  { icon: Shield, title: 'Risk Management', description: 'Score and classify vendors by risk level. Track findings, assign owners, and monitor remediation.' },
  { icon: FileText, title: 'Document Tracking', description: 'Never miss an expiring certification or contract. Get alerts 90 days before documents expire.' },
  { icon: BarChart3, title: 'Evaluation Engine', description: 'Conduct structured vendor evaluations with custom criteria, scoring, and recommendations.' },
  { icon: Activity, title: 'Monitoring', description: 'Stay on top of overdue reviews, expiring documents, and flagged vendors requiring attention.' },
  { icon: Lightbulb, title: 'AI-Powered Insights', description: 'Surface patterns and anomalies across your portfolio that human analysis would miss.' },
  { icon: Bot, title: 'AI Assistant', description: 'Ask natural language questions about your vendors. Get instant, context-aware answers from your data.' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'Generate executive-ready reports and visualize portfolio health with real-time dashboards.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Know Your Vendors.<br />Understand Your Risk.
          </h1>
          <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
            VendorLens is the vendor intelligence platform for modern procurement teams. Manage vendor relationships, track risk, and make confident decisions — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-base font-semibold text-white hover:bg-sky-600 transition-colors">
              Start free — no card required
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/signin" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">Free plan includes up to 5 vendors. No credit card needed.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to manage vendor risk</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">A complete platform for the full vendor lifecycle — from onboarding to offboarding.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="rounded-xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Get started in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Create your account', desc: 'Sign up free and set up your organization in under 5 minutes.' },
              { step: 2, title: 'Add your vendors', desc: 'Import or manually add vendors with all key details and contacts.' },
              { step: 3, title: 'Assess & evaluate', desc: 'Run evaluations, score risk, and track documents.' },
              { step: 4, title: 'Monitor & act', desc: 'Get alerts, insights, and AI-powered recommendations.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">{s.step}</div>
                <h3 className="font-semibold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="py-20 bg-slate-900 text-white px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="text-slate-400 mt-3">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', per: 'forever', features: ['5 vendors', '1 user', 'Core features'], cta: 'Get started', href: '/signup', highlight: false },
              { name: 'Professional', price: '$47', per: '/month', features: ['50 vendors', '5 users', 'AI assistant', 'Advanced analytics'], cta: 'Start free trial', href: '/signup', highlight: true },
              { name: 'Business', price: '$97', per: '/month', features: ['Unlimited vendors', 'Unlimited users', 'Everything', 'Custom integrations'], cta: 'Contact sales', href: '/signup', highlight: false },
            ].map(plan => (
              <div key={plan.name} className={`rounded-xl p-6 ${plan.highlight ? 'bg-sky-500 text-white' : 'bg-slate-800'}`}>
                <p className="font-bold text-lg">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-70">{plan.per}</span>
                </div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 opacity-80" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center rounded-lg py-2.5 text-sm font-semibold transition-colors ${plan.highlight ? 'bg-white text-sky-600 hover:bg-slate-50' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">
            <Link href="/pricing" className="hover:text-white transition-colors">View full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to get control of your vendor risk?</h2>
          <p className="text-slate-500 mt-4">Start managing your vendor relationships and third-party risk in minutes.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-8 py-3.5 text-base font-semibold text-white hover:bg-sky-600 transition-colors mt-8">
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900">VendorLens</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-slate-700">Pricing</Link>
            <Link href="/signin" className="hover:text-slate-700">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-700">Sign up</Link>
          </div>
          <p className="text-xs text-slate-400">© 2025 VendorLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
