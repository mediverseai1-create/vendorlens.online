import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor, getStatusColor, formatStatus, formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Globe, FileText, Activity } from 'lucide-react'

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: vendor } = await supabase.from('vendors').select('*').eq('id', id).single()
  if (!vendor) notFound()

  const [
    { data: contacts },
    { data: evaluations },
    { data: documents },
    { data: riskAssessment },
    { data: riskFindings },
    { data: statusHistory },
    { data: performance },
  ] = await Promise.all([
    supabase.from('vendor_contacts').select('*').eq('vendor_id', id).order('is_primary', { ascending: false }),
    supabase.from('vendor_evaluations').select('*').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendor_documents').select('*').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendor_risk_assessments').select('*').eq('vendor_id', id).order('created_at', { ascending: false }).limit(1).single(),
    supabase.from('risk_findings').select('*').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendor_status_history').select('*').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendor_performance').select('*').eq('vendor_id', id).order('period_start', { ascending: false }).limit(4),
  ])

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/vendors" className="text-slate-400 hover:text-slate-600 mt-1">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900">{vendor.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getStatusColor(vendor.status)}`}>{formatStatus(vendor.status)}</span>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(vendor.risk_level)}`}>{vendor.risk_level} risk</span>
            </div>
            {vendor.description && <p className="text-sm text-slate-500 mt-0.5">{vendor.description}</p>}
          </div>
        </div>
        <Link href={`/vendors/${id}/edit`} className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Edit className="h-4 w-4" />Edit
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluations ({evaluations?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="risk">Risk ({riskFindings?.filter(f => f.status === 'open').length ?? 0} open)</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-500">Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ['Legal Name', vendor.legal_name],
                  ['Category', vendor.category_name],
                  ['Criticality', vendor.criticality],
                  ['Department', vendor.department],
                  ['Country', vendor.country],
                  ['Website', vendor.website],
                  ['Founded', vendor.founded_year],
                  ['Employees', vendor.employee_count],
                ].map(([label, val]) => val ? (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900 text-right">{label === 'Website' ? <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">{val}<Globe className="h-3 w-3" /></a> : String(val)}</span>
                  </div>
                ) : null)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-500">Contract &amp; Spend</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ['Annual Spend', vendor.spend_annual ? formatCurrency(vendor.spend_annual, vendor.spend_currency) : null],
                  ['Contract Start', vendor.contract_start_date ? formatDate(vendor.contract_start_date) : null],
                  ['Contract End', vendor.contract_end_date ? formatDate(vendor.contract_end_date) : null],
                  ['Next Review', vendor.next_review_date ? formatDate(vendor.next_review_date) : null],
                  ['Owner', vendor.owner_name],
                  ['Has NDA', vendor.has_nda ? 'Yes' : 'No'],
                  ['Has Contract', vendor.has_contract ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900">{val || '—'}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-500">Contacts</CardTitle></CardHeader>
              <CardContent>
                {!contacts?.length ? <p className="text-sm text-slate-400">No contacts added</p> : (
                  <div className="space-y-3">
                    {contacts.map(c => (
                      <div key={c.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{c.name}</span>
                          {c.is_primary && <span className="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">Primary</span>}
                        </div>
                        {c.title && <div className="text-slate-500">{c.title}</div>}
                        {c.email && <div className="text-sky-600">{c.email}</div>}
                        {c.phone && <div className="text-slate-500">{c.phone}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Score */}
            {riskAssessment && (
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-slate-500">Risk Assessment</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    ['Overall Score', riskAssessment.overall_risk_score],
                    ['Cybersecurity', riskAssessment.cybersecurity_score],
                    ['Compliance', riskAssessment.compliance_score],
                    ['Financial', riskAssessment.financial_score],
                    ['Operational', riskAssessment.operational_score],
                    ['Privacy', riskAssessment.privacy_score],
                  ].map(([label, score]) => (
                    <div key={label as string} className="flex items-center justify-between">
                      <span className="text-slate-500">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${Number(score) >= 70 ? 'bg-red-500' : Number(score) >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${score}%` }} />
                        </div>
                        <span className="font-medium text-slate-900 w-8 text-right">{score}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="evaluation">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Evaluations</h3>
            <Link href={`/vendors/${id}/evaluation`} className="text-xs bg-sky-500 text-white px-3 py-1.5 rounded-md hover:bg-sky-600">New Evaluation</Link>
          </div>
          {!evaluations?.length ? <p className="text-sm text-slate-400 text-center py-8">No evaluations yet.</p> : (
            <div className="space-y-3">
              {evaluations.map(e => (
                <Card key={e.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.evaluation_type} · {formatDate(e.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {e.overall_score != null && <span className="text-sm font-medium text-slate-900">{e.overall_score}/10</span>}
                      <span className={`text-xs px-2 py-0.5 rounded border ${e.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{e.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="risk">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Risk Findings</h3>
            <Link href={`/vendors/${id}/risk`} className="text-xs bg-sky-500 text-white px-3 py-1.5 rounded-md hover:bg-sky-600">Manage Risk</Link>
          </div>
          {!riskFindings?.length ? <p className="text-sm text-slate-400 text-center py-8">No risk findings.</p> : (
            <div className="space-y-3">
              {riskFindings.map(f => (
                <Card key={f.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{f.title}</p>
                      <p className="text-xs text-slate-500">{f.category || 'General'} · {formatDate(f.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(f.severity === 'informational' ? 'low' : f.severity)}`}>{f.severity}</span>
                      <span className="text-xs px-2 py-0.5 rounded border text-slate-600 border-slate-200 bg-slate-50 capitalize">{f.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-700">Documents</h3>
            <Link href={`/vendors/${id}/documents`} className="text-xs bg-sky-500 text-white px-3 py-1.5 rounded-md hover:bg-sky-600">Manage Documents</Link>
          </div>
          {!documents?.length ? <p className="text-sm text-slate-400 text-center py-8">No documents.</p> : (
            <div className="space-y-2">
              {documents.map(d => (
                <Card key={d.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{d.name}</p>
                        <p className="text-xs text-slate-400">{d.document_type} {d.expiration_date ? `· Expires ${formatDate(d.expiration_date)}` : ''}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${d.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : d.status === 'expired' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{d.status}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance">
          {!performance?.length ? <p className="text-sm text-slate-400 text-center py-8">No performance records.</p> : (
            <div className="space-y-3">
              {performance.map(p => (
                <Card key={p.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-slate-900">{formatDate(p.period_start, 'MMM yyyy')} — {formatDate(p.period_end, 'MMM yyyy')}</p>
                      {p.overall_score != null && <span className="text-sm font-bold text-slate-900">{p.overall_score}/10</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      {[['SLA', p.sla_compliance], ['Delivery', p.delivery_score], ['Quality', p.quality_score], ['Responsiveness', p.responsiveness_score], ['Incidents', p.incidents_count]].map(([label, val]) => (
                        <div key={label as string}>
                          <span className="text-slate-500">{label}</span>
                          <p className="font-medium text-slate-900">{val ?? '—'}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          {!statusHistory?.length ? <p className="text-sm text-slate-400 text-center py-8">No status history.</p> : (
            <div className="space-y-2">
              {statusHistory.map(h => (
                <div key={h.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                  <Activity className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-700">Status changed to <span className="font-medium capitalize">{h.new_status.replace(/_/g, ' ')}</span>{h.old_status ? ` from ${h.old_status.replace(/_/g, ' ')}` : ''}</p>
                    {h.reason && <p className="text-slate-500 text-xs">{h.reason}</p>}
                    <p className="text-slate-400 text-xs">{formatDate(h.created_at, 'MMM d, yyyy h:mm a')} {h.changed_by_name ? `by ${h.changed_by_name}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
