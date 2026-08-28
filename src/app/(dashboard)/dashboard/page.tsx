import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getRiskColor, getStatusColor, formatStatus } from '@/lib/utils'
import { Building2, Shield, ClipboardList, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react'

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

  // Fetch stats in parallel
  const [
    { count: totalVendors },
    { count: activeVendors },
    { count: highRiskVendors },
    { count: pendingEvals },
    { data: recentVendors },
    { data: recentActivity },
    { data: riskDist },
  ] = await Promise.all([
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'active'),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).in('risk_level', ['critical', 'high']),
    supabase.from('vendor_evaluations').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'draft'),
    supabase.from('vendors').select('id, name, status, risk_level, category_name, updated_at').eq('organization_id', orgId).order('updated_at', { ascending: false }).limit(5),
    supabase.from('activity_logs').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(8),
    supabase.from('vendors').select('risk_level').eq('organization_id', orgId),
  ])

  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 }
  riskDist?.forEach(v => { riskCounts[v.risk_level as keyof typeof riskCounts]++ })

  const stats = [
    { label: 'Total Vendors', value: totalVendors ?? 0, icon: Building2, color: 'text-sky-600', bg: 'bg-sky-50', href: '/vendors' },
    { label: 'Active Vendors', value: activeVendors ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', href: '/vendors?status=active' },
    { label: 'High Risk', value: highRiskVendors ?? 0, icon: Shield, color: 'text-red-600', bg: 'bg-red-50', href: '/risk' },
    { label: 'Pending Evaluations', value: pendingEvals ?? 0, icon: ClipboardList, color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/evaluations' },
  ]

  const orgName = (membership.organizations as unknown as Record<string, string> | null)?.name ?? 'Your Organization'

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">{orgName}</p>
        </div>
        <Link href="/vendors/new" className="flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.bg} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Vendors */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recent Vendors</CardTitle>
              <Link href="/vendors" className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {!recentVendors?.length ? (
                <div className="text-center py-8">
                  <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No vendors yet</p>
                  <Link href="/vendors/new" className="text-xs text-sky-600 hover:underline mt-1 block">Add your first vendor</Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentVendors.map(v => (
                    <Link key={v.id} href={`/vendors/${v.id}`} className="flex items-center justify-between py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{v.name}</p>
                        <p className="text-xs text-slate-400">{v.category_name || 'Uncategorized'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getRiskColor(v.risk_level)}`}>{v.risk_level}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getStatusColor(v.status)}`}>{formatStatus(v.status)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution + Activity */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(riskCounts).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${level === 'critical' ? 'bg-red-500' : level === 'high' ? 'bg-orange-500' : level === 'medium' ? 'bg-yellow-500' : level === 'low' ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="capitalize text-slate-700">{level}</span>
                  </div>
                  <span className="font-medium text-slate-900">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {!recentActivity?.length ? (
                <p className="text-xs text-slate-400 text-center py-4">No activity yet</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.slice(0, 5).map(log => (
                    <div key={log.id} className="text-xs">
                      <p className="text-slate-700">{log.action}</p>
                      <p className="text-slate-400">{formatDate(log.created_at, 'MMM d, h:mm a')}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts */}
      {(highRiskVendors ?? 0) > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900">{highRiskVendors} high-risk vendor{highRiskVendors !== 1 ? 's' : ''} require attention</p>
                <Link href="/risk" className="text-xs text-orange-700 hover:underline">View risk dashboard</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
