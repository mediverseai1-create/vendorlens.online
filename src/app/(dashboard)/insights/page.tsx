import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react'
import { addDays, isBefore, parseISO, subMonths } from 'date-fns'

interface Insight {
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  count: number
  action?: string
  actionHref?: string
}

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  const now = new Date()
  const in60Days = addDays(now, 60)
  const twelveMonthsAgo = subMonths(now, 12)

  const [
    { data: vendors },
    { data: evaluations },
    { data: documents },
    { data: findings },
  ] = await Promise.all([
    supabase.from('vendors').select('id, name, risk_level, status, next_review_date, has_nda, has_contract').eq('organization_id', orgId),
    supabase.from('vendor_evaluations').select('vendor_id, status, created_at').eq('organization_id', orgId),
    supabase.from('vendor_documents').select('vendor_id, status, expiration_date').eq('organization_id', orgId),
    supabase.from('risk_findings').select('vendor_id, severity, status').eq('organization_id', orgId).eq('status', 'open'),
  ])

  if (!vendors || vendors.length < 2) {
    return (
      <div className="max-w-3xl space-y-6">
        <h1 className="text-xl font-semibold text-slate-900">Insights</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <p className="font-medium text-slate-700">Add more vendors to unlock insights</p>
            <p className="text-sm text-slate-400 mt-1">Insights are generated once you have at least 2 vendors in your portfolio.</p>
            <Link href="/vendors/new" className="mt-4 inline-block text-sm text-sky-600 hover:underline">Add a vendor</Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const insights: Insight[] = []
  const totalVendors = vendors.length

  // High risk vendors
  const highRiskCount = vendors.filter(v => ['critical', 'high'].includes(v.risk_level)).length
  if (highRiskCount > 0) {
    const pct = Math.round((highRiskCount / totalVendors) * 100)
    insights.push({
      title: `${highRiskCount} vendor${highRiskCount > 1 ? 's' : ''} with high or critical risk`,
      description: `${pct}% of your vendor portfolio is classified as high or critical risk. Review and mitigate these risks promptly.`,
      severity: pct >= 30 ? 'critical' : 'high',
      count: highRiskCount,
      action: 'View risk dashboard',
      actionHref: '/risk',
    })
  }

  // Vendors with no evaluations in 12 months
  const vendorsWithRecentEval = new Set(evaluations?.filter(e => e.created_at && new Date(e.created_at) > twelveMonthsAgo).map(e => e.vendor_id))
  const noRecentEvalCount = vendors.filter(v => !vendorsWithRecentEval.has(v.id)).length
  if (noRecentEvalCount > 0) {
    insights.push({
      title: `${noRecentEvalCount} vendor${noRecentEvalCount > 1 ? 's' : ''} not evaluated in the past 12 months`,
      description: `Regular evaluations are key to maintaining an accurate picture of vendor risk. Schedule evaluations for these vendors.`,
      severity: 'medium',
      count: noRecentEvalCount,
      action: 'View evaluations',
      actionHref: '/evaluations',
    })
  }

  // Documents expiring in 60 days
  const expiringDocVendors = new Set(documents?.filter(d => d.expiration_date && d.status === 'active' && isBefore(parseISO(d.expiration_date), in60Days)).map(d => d.vendor_id))
  if (expiringDocVendors.size > 0) {
    insights.push({
      title: `Documents expiring within 60 days for ${expiringDocVendors.size} vendor${expiringDocVendors.size > 1 ? 's' : ''}`,
      description: `Expired documents create compliance gaps. Renew these documents before they expire.`,
      severity: 'high',
      count: expiringDocVendors.size,
      action: 'View documents',
      actionHref: '/documents',
    })
  }

  // Open critical/high risk findings
  const criticalFindings = findings?.filter(f => ['critical', 'high'].includes(f.severity)).length ?? 0
  if (criticalFindings > 0) {
    insights.push({
      title: `${criticalFindings} open critical or high-severity risk finding${criticalFindings > 1 ? 's' : ''}`,
      description: `These findings represent significant risk exposure and should be prioritized for remediation.`,
      severity: 'critical',
      count: criticalFindings,
      action: 'View risk findings',
      actionHref: '/risk',
    })
  }

  // Vendors missing NDA
  const noNdaCount = vendors.filter(v => !v.has_nda && !['archived', 'draft'].includes(v.status)).length
  if (noNdaCount > 0) {
    insights.push({
      title: `${noNdaCount} active vendor${noNdaCount > 1 ? 's' : ''} without an NDA`,
      description: `Non-disclosure agreements protect your organization. Ensure all active vendors have signed NDAs.`,
      severity: 'medium',
      count: noNdaCount,
    })
  }

  // Review required vendors
  const reviewRequiredCount = vendors.filter(v => v.status === 'review_required').length
  if (reviewRequiredCount > 0) {
    insights.push({
      title: `${reviewRequiredCount} vendor${reviewRequiredCount > 1 ? 's' : ''} flagged for review`,
      description: `These vendors have been flagged and require your attention. Complete the review process to update their status.`,
      severity: 'high',
      count: reviewRequiredCount,
      action: 'View vendors',
      actionHref: '/vendors?status=review_required',
    })
  }

  const severityOrder = ['critical', 'high', 'medium', 'low', 'info']
  insights.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity))

  const severityStyles: Record<string, { border: string; bg: string; icon: string; text: string }> = {
    critical: { border: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-900' },
    high: { border: 'border-orange-200', bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-900' },
    medium: { border: 'border-yellow-200', bg: 'bg-yellow-50', icon: 'text-yellow-600', text: 'text-yellow-900' },
    low: { border: 'border-blue-200', bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-900' },
    info: { border: 'border-slate-200', bg: 'bg-slate-50', icon: 'text-slate-500', text: 'text-slate-700' },
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Insights</h1>
        <p className="text-sm text-slate-500">AI-driven analysis of your vendor portfolio data</p>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <p className="font-medium text-slate-900">Your portfolio looks healthy!</p>
            <p className="text-sm text-slate-500 mt-1">No significant issues detected at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, i) => {
            const style = severityStyles[insight.severity]
            return (
              <Card key={i} className={`${style.border} ${style.bg}`}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${style.icon}`} />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${style.text}`}>{insight.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                      {insight.action && insight.actionHref && (
                        <Link href={insight.actionHref} className="text-xs text-sky-600 hover:underline mt-2 inline-block font-medium">{insight.action} →</Link>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${style.bg} ${style.text} border ${style.border}`}>{insight.severity}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
