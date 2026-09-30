import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor } from '@/lib/utils'
import { TrendingDown, AlertTriangle, Users, ArrowRight, Bot, ChevronRight, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(name)')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  const [
    { count: totalAccounts },
    { count: highRiskAccounts },
    { count: reviewRequired },
    { data: recentAccounts },
    { data: recentActivity },
    { data: riskDist },
  ] = await Promise.all([
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'active'),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).in('risk_level', ['critical', 'high']),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'review_required'),
    supabase.from('vendors').select('id, name, status, risk_level, category_name, updated_at').eq('organization_id', orgId).order('updated_at', { ascending: false }).limit(6),
    supabase.from('activity_logs').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(6),
    supabase.from('vendors').select('risk_level').eq('organization_id', orgId),
  ])

  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0 }
  riskDist?.forEach(v => {
    const k = v.risk_level as keyof typeof riskCounts
    if (k in riskCounts) riskCounts[k]++
  })

  const orgName = (membership.organizations as unknown as Record<string, string> | null)?.name ?? 'Your organisation'
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'

  const SIGNAL_LEVELS = [
    { key: 'critical', label: 'Critical', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    { key: 'high',     label: 'High',     color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { key: 'medium',   label: 'Medium',   color: '#ca8a04', bg: '#fefce8', border: '#fde68a' },
    { key: 'low',      label: 'Low',      color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  ] as const

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Revenue Intelligence</p>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}.</h1>
          <p className="text-sm text-slate-500 mt-1">{orgName} &mdash; {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link
          href="/ai-assistant"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)', boxShadow: '0 4px 16px rgba(8,145,178,0.25)' }}
        >
          <Bot className="h-4 w-4" />
          Ask VendorLens
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Accounts tracked',
            value: totalAccounts ?? 0,
            icon: Users,
            accent: '#0891b2',
            lightBg: '#f0f9ff',
            lightBorder: '#bae6fd',
            href: '/vendors',
          },
          {
            label: 'Accounts at risk',
            value: highRiskAccounts ?? 0,
            icon: AlertTriangle,
            accent: '#dc2626',
            lightBg: '#fef2f2',
            lightBorder: '#fecaca',
            href: '/risk',
          },
          {
            label: 'Require review',
            value: reviewRequired ?? 0,
            icon: Activity,
            accent: '#ea580c',
            lightBg: '#fff7ed',
            lightBorder: '#fed7aa',
            href: '/monitoring',
          },
          {
            label: 'Revenue signals',
            value: (riskCounts.critical + riskCounts.high + riskCounts.medium),
            icon: TrendingDown,
            accent: '#7c3aed',
            lightBg: '#faf5ff',
            lightBorder: '#e9d5ff',
            href: '/insights',
          },
        ].map(s => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
              style={{ border: `1px solid ${s.lightBorder}`, background: s.lightBg }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                  <p className="text-3xl font-bold mt-1.5" style={{ color: s.accent }}>{s.value}</p>
                </div>
                <div className="rounded-xl p-2" style={{ background: `${s.accent}14`, border: `1px solid ${s.accent}25` }}>
                  <Icon className="h-5 w-5" style={{ color: s.accent }} />
                </div>
              </div>
              <p className="text-xs mt-3 font-medium flex items-center gap-1" style={{ color: s.accent }}>
                View all <ChevronRight className="h-3 w-3" />
              </p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Accounts list */}
        <div className="lg:col-span-2 rounded-2xl bg-white" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <p className="text-sm font-semibold text-slate-900">Recent accounts</p>
            <Link href="/vendors" className="flex items-center gap-1 text-xs font-medium" style={{ color: '#0891b2' }}>
              All accounts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {!recentAccounts?.length ? (
              <div className="text-center py-12">
                <Users className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">No accounts yet</p>
                <Link href="/vendors/new" className="text-xs mt-1 block" style={{ color: '#0891b2' }}>Add your first account</Link>
              </div>
            ) : (
              recentAccounts.map(v => (
                <Link
                  key={v.id}
                  href={`/vendors/${v.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{v.name}</p>
                    <p className="text-xs text-slate-400">{v.category_name || 'No category'} &middot; {formatDate(v.updated_at, 'MMM d')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ml-4 shrink-0 ${getRiskColor(v.risk_level)}`}>
                    {v.risk_level}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Risk distribution */}
          <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-sm font-semibold text-slate-900 mb-4">Risk distribution</p>
            <div className="space-y-3">
              {SIGNAL_LEVELS.map(({ key, label, color, bg, border }) => {
                const count = riskCounts[key as keyof typeof riskCounts]
                const total = Object.values(riskCounts).reduce((a, b) => a + b, 0) || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium" style={{ color }}>{label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="/insights" className="flex items-center gap-1 text-xs font-medium mt-4" style={{ color: '#0891b2' }}>
              View revenue signals <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Activity */}
          <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-sm font-semibold text-slate-900 mb-4">Recent activity</p>
            {!recentActivity?.length ? (
              <p className="text-xs text-slate-400 py-2">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map(log => (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                    <div>
                      <p className="text-xs text-slate-700 leading-snug capitalize">{log.action?.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-400">{log.entity_name && `${log.entity_name} · `}{formatDate(log.created_at, 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI nudge if no accounts */}
      {(totalAccounts ?? 0) === 0 && (
        <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '1px solid #bae6fd' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Add your accounts to get started</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Once you add accounts, VendorLens reads every record and surfaces which customers are at risk, what revenue is exposed, and exactly who your team should contact first.
              </p>
              <Link
                href="/vendors/new"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-white rounded-lg px-4 py-2 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}
              >
                Add first account <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
