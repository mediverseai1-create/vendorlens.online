import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Clock, FileText } from 'lucide-react'
import { addDays } from 'date-fns'

export default async function MonitoringPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  const now = new Date()
  const in90Days = addDays(now, 90)

  const [
    { data: reviewRequired },
    { data: expiringDocs },
    { data: overdueEvals },
    { data: openFindings },
  ] = await Promise.all([
    supabase.from('vendors').select('id, name, risk_level, next_review_date').eq('organization_id', orgId).in('status', ['review_required']),
    supabase.from('vendor_documents').select('*, vendors(name)').eq('organization_id', orgId).eq('status', 'active').not('expiration_date', 'is', null).lte('expiration_date', in90Days.toISOString()),
    supabase.from('vendor_evaluations').select('*, vendors(name)').eq('organization_id', orgId).eq('status', 'in_progress').not('due_date', 'is', null).lte('due_date', now.toISOString()),
    supabase.from('risk_findings').select('*, vendors(name)').eq('organization_id', orgId).eq('status', 'open').not('due_date', 'is', null).lte('due_date', now.toISOString()),
  ])

  const alertCount = (reviewRequired?.length ?? 0) + (expiringDocs?.length ?? 0) + (overdueEvals?.length ?? 0) + (openFindings?.length ?? 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Monitoring</h1>
        <p className="text-sm text-slate-500">{alertCount} items require attention</p>
      </div>

      {alertCount === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <p className="font-medium text-slate-900">Everything looks good!</p>
            <p className="text-sm text-slate-500 mt-1">No items currently require attention.</p>
          </CardContent>
        </Card>
      )}

      {/* Vendors requiring review */}
      {(reviewRequired?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Vendors Requiring Review ({reviewRequired?.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reviewRequired?.map(v => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${v.risk_level === 'critical' ? 'bg-red-500' : v.risk_level === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <Link href={`/vendors/${v.id}`} className="text-sm font-medium text-slate-900 hover:text-sky-600">{v.name}</Link>
                </div>
                <div className="flex items-center gap-3">
                  {v.next_review_date && <span className="text-xs text-slate-400">Review due {formatDate(v.next_review_date)}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(v.risk_level)}`}>{v.risk_level}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Expiring documents */}
      {(expiringDocs?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              Documents Expiring Within 90 Days ({expiringDocs?.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiringDocs?.map(d => {
              const vendor = d.vendors as { name: string } | null
              return (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-400">{vendor?.name} · {d.document_type}</p>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">Expires {formatDate(d.expiration_date!)}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Overdue evaluations */}
      {(overdueEvals?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              Overdue Evaluations ({overdueEvals?.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueEvals?.map(e => {
              const vendor = e.vendors as { name: string } | null
              return (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{e.title}</p>
                    <p className="text-xs text-slate-400">{vendor?.name}</p>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Due {formatDate(e.due_date!)}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Overdue risk findings */}
      {(openFindings?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue Risk Findings ({openFindings?.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {openFindings?.map(f => {
              const vendor = f.vendors as { name: string } | null
              return (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{f.title}</p>
                    <p className="text-xs text-slate-400">{vendor?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(f.severity === 'informational' ? 'low' : f.severity)}`}>{f.severity}</span>
                    <span className="text-xs text-red-600 font-medium">Due {formatDate(f.due_date!)}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
