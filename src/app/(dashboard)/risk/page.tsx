import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, AlertTriangle } from 'lucide-react'

export default async function RiskPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  const [
    { data: riskVendors },
    { data: openFindings },
    { data: allVendors },
  ] = await Promise.all([
    supabase.from('vendors').select('id, name, risk_level, risk_score, category_name, status').eq('organization_id', orgId).in('risk_level', ['critical', 'high']).order('risk_score', { ascending: false }),
    supabase.from('risk_findings').select('*, vendors(name)').eq('organization_id', orgId).eq('status', 'open').order('created_at', { ascending: false }),
    supabase.from('vendors').select('risk_level').eq('organization_id', orgId),
  ])

  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 }
  allVendors?.forEach(v => { riskCounts[v.risk_level as keyof typeof riskCounts]++ })

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Risk Management</h1>
        <p className="text-sm text-slate-500">Monitor and manage vendor risk across your portfolio</p>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(riskCounts).map(([level, count]) => (
          <Card key={level} className={`${level === 'critical' ? 'border-red-200 bg-red-50' : level === 'high' ? 'border-orange-200 bg-orange-50' : ''}`}>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{count}</p>
              <p className={`text-xs font-medium capitalize mt-1 ${level === 'critical' ? 'text-red-700' : level === 'high' ? 'text-orange-700' : 'text-slate-500'}`}>{level}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* High/Critical vendors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            High & Critical Risk Vendors ({riskVendors?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!riskVendors?.length ? (
            <p className="text-sm text-slate-400 text-center py-6">No high or critical risk vendors.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskVendors.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium text-slate-900">{v.name}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(v.risk_level)}`}>{v.risk_level}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{v.risk_score > 0 ? v.risk_score : '—'}</TableCell>
                    <TableCell className="text-sm text-slate-500">{v.category_name || '—'}</TableCell>
                    <TableCell className="text-sm capitalize text-slate-500">{v.status.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Link href={`/vendors/${v.id}`} className="text-xs text-sky-600 hover:underline">View</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Open Risk Findings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            Open Risk Findings ({openFindings?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!openFindings?.length ? (
            <p className="text-sm text-slate-400 text-center py-6">No open risk findings. Great!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finding</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openFindings.map(f => {
                  const vendor = f.vendors as { name: string } | null
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium text-sm text-slate-900">{f.title}</TableCell>
                      <TableCell>
                        <Link href={`/vendors/${f.vendor_id}`} className="text-xs text-sky-600 hover:underline">{vendor?.name || '—'}</Link>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(f.severity === 'informational' ? 'low' : f.severity)}`}>{f.severity}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{f.category || '—'}</TableCell>
                      <TableCell className="text-sm text-slate-400">{f.due_date ? formatDate(f.due_date) : '—'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
