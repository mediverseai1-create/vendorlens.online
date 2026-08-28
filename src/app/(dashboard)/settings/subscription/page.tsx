import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['Up to 5 vendors', '1 user', 'Basic risk tracking', 'Document management'],
    link: null,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$47/mo',
    features: ['Up to 50 vendors', '5 users', 'AI assistant', 'Advanced analytics', 'Priority support'],
    link: process.env.STARTER_PAYMENT_LINK || '#',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$97/mo',
    features: ['Unlimited vendors', 'Unlimited users', 'All features', 'Custom integrations', 'Dedicated support'],
    link: process.env.PRO_PAYMENT_LINK || '#',
  },
]

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  const { data: subscription } = membership
    ? await supabase.from('subscriptions').select('*').eq('organization_id', membership.organization_id).single()
    : { data: null }

  const currentPlan = subscription?.plan || 'free'

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Subscription</h1>
      </div>

      {subscription && (
        <Card className="border-sky-200 bg-sky-50">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-sky-900">Current plan: <span className="capitalize font-bold">{currentPlan}</span></p>
            <p className="text-xs text-sky-700 mt-0.5">
              {subscription.vendor_limit === -1 ? 'Unlimited' : subscription.vendor_limit} vendors · {subscription.user_limit === -1 ? 'Unlimited' : subscription.user_limit} users · Status: {subscription.status}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <Card key={plan.id} className={currentPlan === plan.id ? 'border-sky-400 shadow-md' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{plan.name}</CardTitle>
                {currentPlan === plan.id && <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-medium">Current</span>}
              </div>
              <p className="text-2xl font-bold text-slate-900">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id !== 'free' && currentPlan !== plan.id && plan.link && (
                <a href={plan.link} target="_blank" rel="noopener noreferrer" className="block mt-4 text-center rounded-md bg-sky-500 text-white px-4 py-2 text-sm font-medium hover:bg-sky-600 transition-colors">
                  Upgrade to {plan.name}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
