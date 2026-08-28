import Link from 'next/link'
import { CheckCircle, X } from 'lucide-react'

const FEATURES_TABLE = [
  { feature: 'Vendors', free: '5', professional: '50', business: 'Unlimited' },
  { feature: 'Team members', free: '1', professional: '5', business: 'Unlimited' },
  { feature: 'Vendor profiles', free: true, professional: true, business: true },
  { feature: 'Risk tracking', free: true, professional: true, business: true },
  { feature: 'Document management', free: true, professional: true, business: true },
  { feature: 'Evaluations', free: true, professional: true, business: true },
  { feature: 'Monitoring dashboard', free: true, professional: true, business: true },
  { feature: 'Activity logs', free: true, professional: true, business: true },
  { feature: 'Analytics dashboard', free: false, professional: true, business: true },
  { feature: 'AI insights', free: false, professional: true, business: true },
  { feature: 'AI assistant (Gemini)', free: false, professional: true, business: true },
  { feature: 'Advanced reporting', free: false, professional: true, business: true },
  { feature: 'Data export', free: false, professional: true, business: true },
  { feature: 'Priority support', free: false, professional: true, business: true },
  { feature: 'Custom integrations', free: false, professional: false, business: true },
  { feature: 'Dedicated account manager', free: false, professional: false, business: true },
  { feature: 'SLA guarantee', free: false, professional: false, business: true },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'string') return <td className="py-3 px-6 text-center text-sm font-medium text-slate-900">{value}</td>
  return (
    <td className="py-3 px-6 text-center">
      {value ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
    </td>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900">Compare Plans</h1>
          <p className="text-slate-500 mt-4">Every plan includes a 14-day trial of Professional features.</p>
        </div>

        {/* Plans header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-slate-500 w-2/5">Feature</th>
                {[
                  { name: 'Free', price: '$0', per: 'forever', href: '/signup', primary: false },
                  { name: 'Professional', price: '$47', per: '/month', href: '/signup', primary: true },
                  { name: 'Business', price: '$97', per: '/month', href: '/signup', primary: false },
                ].map(plan => (
                  <th key={plan.name} className="py-4 px-6 text-center">
                    <p className="font-bold text-slate-900">{plan.name}</p>
                    <div className="flex items-baseline justify-center gap-1 mt-1">
                      <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-sm text-slate-400">{plan.per}</span>
                    </div>
                    <Link
                      href={plan.href}
                      className={`mt-3 inline-block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${plan.primary ? 'bg-sky-500 text-white hover:bg-sky-600' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      Get started
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FEATURES_TABLE.map(row => (
                <tr key={row.feature} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 text-sm text-slate-700">{row.feature}</td>
                  <FeatureCell value={row.free} />
                  <FeatureCell value={row.professional} />
                  <FeatureCell value={row.business} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">Need a custom plan for your enterprise? <a href="mailto:hello@vendorlens.online" className="text-sky-600 hover:underline font-medium">Contact us</a></p>
        </div>
      </div>
    </div>
  )
}
