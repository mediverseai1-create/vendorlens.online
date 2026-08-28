import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  const [{ data: vendors }, { data: evaluations }, { data: documents }] = await Promise.all([
    supabase.from('vendors').select('status, risk_level, category_name, criticality').eq('organization_id', orgId),
    supabase.from('vendor_evaluations').select('status, evaluation_type').eq('organization_id', orgId),
    supabase.from('vendor_documents').select('status, document_type').eq('organization_id', orgId),
  ])

  // Compute distributions
  const riskDist: Record<string, number> = {}
  const statusDist: Record<string, number> = {}
  const categoryDist: Record<string, number> = {}
  vendors?.forEach(v => {
    riskDist[v.risk_level] = (riskDist[v.risk_level] || 0) + 1
    statusDist[v.status] = (statusDist[v.status] || 0) + 1
    const cat = v.category_name || 'Uncategorized'
    categoryDist[cat] = (categoryDist[cat] || 0) + 1
  })

  const evalStatusDist: Record<string, number> = {}
  evaluations?.forEach(e => { evalStatusDist[e.status] = (evalStatusDist[e.status] || 0) + 1 })

  const docStatusDist: Record<string, number> = {}
  documents?.forEach(d => { docStatusDist[d.status] = (docStatusDist[d.status] || 0) + 1 })

  const totalVendors = vendors?.length ?? 0
  const activeVendors = statusDist['active'] ?? 0
  const totalEvals = evaluations?.length ?? 0
  const completedEvals = evalStatusDist['completed'] ?? 0
  const activeDocs = docStatusDist['active'] ?? 0
  const expiredDocs = docStatusDist['expired'] ?? 0
  const totalDocs = documents?.length ?? 0

  const riskColors: Record<string, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500', unknown: 'bg-slate-300' }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Data-driven insights from your vendor portfolio</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: totalVendors },
          { label: 'Active Rate', value: totalVendors > 0 ? `${Math.round((activeVendors / totalVendors) * 100)}%` : '—' },
          { label: 'Eval Completion Rate', value: totalEvals > 0 ? `${Math.round((completedEvals / totalEvals) * 100)}%` : '—' },
          { label: 'Document Compliance', value: totalDocs > 0 ? `${Math.round((activeDocs / totalDocs) * 100)}%` : '—' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Risk Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {totalVendors === 0 ? <p className="text-sm text-slate-400 text-center py-4">No data</p> : Object.entries(riskDist).sort(([a], [b]) => {
              const order = ['critical', 'high', 'medium', 'low', 'unknown']
              return order.indexOf(a) - order.indexOf(b)
            }).map(([level, count]) => (
              <div key={level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-700">{level}</span>
                  <span className="font-medium text-slate-900">{count} ({Math.round((count / totalVendors) * 100)}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${riskColors[level] || 'bg-slate-400'}`} style={{ width: `${(count / totalVendors) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Vendor Status Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {totalVendors === 0 ? <p className="text-sm text-slate-400 text-center py-4">No data</p> : Object.entries(statusDist).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-700">{status.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-slate-900">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${(count / totalVendors) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Vendors by Category</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(categoryDist).length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No data</p> : Object.entries(categoryDist).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 truncate">{cat}</span>
                  <span className="font-medium text-slate-900 ml-2 shrink-0">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${(count / totalVendors) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evaluation Status */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Evaluation Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {totalEvals === 0 ? <p className="text-sm text-slate-400 text-center py-4">No evaluations yet</p> : (
              <>
                {Object.entries(evalStatusDist).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-slate-700">{status.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-slate-900">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'}`} style={{ width: `${(count / totalEvals) * 100}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-slate-400 pt-2">Total: {totalEvals} evaluations</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Document Status</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{activeDocs}</p>
              <p className="text-xs text-slate-500 mt-1">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{expiredDocs}</p>
              <p className="text-xs text-slate-500 mt-1">Expired</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalDocs}</p>
              <p className="text-xs text-slate-500 mt-1">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
