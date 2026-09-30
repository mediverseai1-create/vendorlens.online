import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { addDays, isBefore, parseISO, subMonths } from 'date-fns'
import { TrendingDown, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'

interface Signal {
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  actionLabel?: string
  actionHref?: string
}

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', dot: '#dc2626', bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d', labelColor: '#dc2626', labelBg: '#fee2e2' },
  high:     { label: 'High',     dot: '#ea580c', bg: '#fff7ed', border: '#fed7aa', text: '#7c2d12', labelColor: '#ea580c', labelBg: '#ffedd5' },
  medium:   { label: 'Medium',   dot: '#ca8a04', bg: '#fefce8', border: '#fde68a', text: '#713f12', labelColor: '#ca8a04', labelBg: '#fef9c3' },
  low:      { label: 'Low',      dot: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d', labelColor: '#16a34a', labelBg: '#dcfce7' },
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

  if (!vendors || vendors.length < 1) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Revenue Intelligence</p>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Signals</h1>
          <p className="text-sm text-slate-500 mt-1">What VendorLens found when it read your account data.</p>
        </div>
        <div className="rounded-2xl p-12 text-center bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <TrendingDown className="h-10 w-10 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
          <p className="font-semibold text-slate-700">Add accounts to unlock revenue signals</p>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">VendorLens reads every account and surfaces which ones are slipping — but it needs data to work from.</p>
          <Link href="/vendors/new" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-white rounded-xl px-5 py-2.5 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}>
            Add first account <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const signals: Signal[] = []
  const total = vendors.length

  // Accounts at high/critical risk
  const highRisk = vendors.filter(v => ['critical', 'high'].includes(v.risk_level))
  if (highRisk.length > 0) {
    const pct = Math.round((highRisk.length / total) * 100)
    signals.push({
      title: `${highRisk.length} account${highRisk.length > 1 ? 's' : ''} classified as high or critical risk`,
      description: `${pct}% of your accounts carry elevated risk. Each one represents revenue exposure that compounds the longer it goes unaddressed.`,
      severity: pct >= 30 ? 'critical' : 'high',
      actionLabel: 'View revenue at risk',
      actionHref: '/risk',
    })
  }

  // Not assessed in 12 months
  const withRecentEval = new Set(evaluations?.filter(e => e.created_at && new Date(e.created_at) > twelveMonthsAgo).map(e => e.vendor_id))
  const noEval = vendors.filter(v => !withRecentEval.has(v.id))
  if (noEval.length > 0) {
    signals.push({
      title: `${noEval.length} account${noEval.length > 1 ? 's' : ''} not assessed in the past 12 months`,
      description: `Without a recent assessment, changes in these accounts — declining orders, shifting contacts, tighter budgets — are not captured in your risk picture.`,
      severity: 'medium',
      actionLabel: 'Run evaluations',
      actionHref: '/evaluations',
    })
  }

  // Documents expiring
  const expiringVendors = new Set(documents?.filter(d => d.expiration_date && d.status === 'active' && isBefore(parseISO(d.expiration_date), in60Days)).map(d => d.vendor_id))
  if (expiringVendors.size > 0) {
    signals.push({
      title: `Documents expiring within 60 days across ${expiringVendors.size} account${expiringVendors.size > 1 ? 's' : ''}`,
      description: `Expired documents create compliance gaps and can stall renewals. These accounts need attention before the documents lapse.`,
      severity: 'high',
      actionLabel: 'View documents',
      actionHref: '/documents',
    })
  }

  // Open critical findings
  const openCritical = findings?.filter(f => ['critical', 'high'].includes(f.severity)).length ?? 0
  if (openCritical > 0) {
    signals.push({
      title: `${openCritical} open critical risk finding${openCritical > 1 ? 's' : ''} without a resolution`,
      description: `These findings represent material exposure. Each day they remain open is a day the risk compounds without any team action behind it.`,
      severity: 'critical',
      actionLabel: 'View risk findings',
      actionHref: '/risk',
    })
  }

  // Review required
  const reviewRequired = vendors.filter(v => v.status === 'review_required')
  if (reviewRequired.length > 0) {
    signals.push({
      title: `${reviewRequired.length} account${reviewRequired.length > 1 ? 's' : ''} flagged and waiting for a decision`,
      description: `These accounts have been flagged but no action has been taken. A decision — in either direction — closes the loop and keeps your data accurate.`,
      severity: 'high',
      actionLabel: 'View flagged accounts',
      actionHref: '/vendors?status=review_required',
    })
  }

  // No NDA
  const noNda = vendors.filter(v => !v.has_nda && !['archived', 'draft'].includes(v.status))
  if (noNda.length > 0) {
    signals.push({
      title: `${noNda.length} active account${noNda.length > 1 ? 's' : ''} without a signed NDA`,
      description: `Operating without NDAs in place leaves your organisation's information unprotected and creates a compliance gap that regulators or auditors may flag.`,
      severity: 'medium',
    })
  }

  const severityOrder: Signal['severity'][] = ['critical', 'high', 'medium', 'low']
  signals.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity))

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Revenue Intelligence</p>
        <h1 className="text-2xl font-bold text-slate-900">Revenue Signals</h1>
        <p className="text-sm text-slate-500 mt-1">
          {signals.length > 0
            ? `${signals.length} signal${signals.length > 1 ? 's' : ''} found across ${total} account${total > 1 ? 's' : ''}. Most severe first.`
            : `VendorLens read ${total} account${total > 1 ? 's' : ''} and found no signals requiring attention.`
          }
        </p>
      </div>

      {signals.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white" style={{ border: '1px solid #e2e8f0' }}>
          <CheckCircle className="h-10 w-10 mx-auto mb-3" style={{ color: '#16a34a' }} />
          <p className="font-semibold text-slate-900">No signals found</p>
          <p className="text-sm text-slate-400 mt-2">All accounts look healthy at this point in time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {signals.map((signal, i) => {
            const cfg = SEVERITY_CONFIG[signal.severity]
            return (
              <div
                key={i}
                className="rounded-2xl p-5"
                style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: cfg.dot }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold leading-snug" style={{ color: cfg.text }}>{signal.title}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: cfg.labelBg, color: cfg.labelColor }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: cfg.text, opacity: 0.75 }}>{signal.description}</p>
                    {signal.actionLabel && signal.actionHref && (
                      <Link
                        href={signal.actionHref}
                        className="inline-flex items-center gap-1 text-xs font-semibold mt-3"
                        style={{ color: '#0891b2' }}
                      >
                        {signal.actionLabel} <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: '#0891b2' }} />
        <p className="text-xs text-slate-500 leading-relaxed">
          Signals are read from your account data each time this page loads. Add more accounts and run evaluations to give VendorLens a fuller picture to work from.
        </p>
      </div>
    </div>
  )
}
