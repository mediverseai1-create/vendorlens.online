'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileBarChart, Plus } from 'lucide-react'
import type { Report } from '@/types'
import { useToast } from '@/hooks/use-toast'

const REPORT_TYPES = [
  { value: 'vendor_portfolio', label: 'Vendor Portfolio' },
  { value: 'risk', label: 'Risk Report' },
  { value: 'evaluation', label: 'Evaluation Report' },
  { value: 'executive', label: 'Executive Summary' },
]

export default function ReportsPage() {
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState('vendor_portfolio')
  const [reportTitle, setReportTitle] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: mem } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
      if (!mem) return

      setOrgId(mem.organization_id)
      const { data } = await supabase.from('reports').select('*').eq('organization_id', mem.organization_id).order('created_at', { ascending: false })
      setReports(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function generateReport() {
    if (!orgId || !reportTitle) return
    setGenerating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

    // Gather data for report
    const { data: vendors } = await supabase.from('vendors').select('*').eq('organization_id', orgId)
    const { data: evaluations } = await supabase.from('vendor_evaluations').select('*').eq('organization_id', orgId)
    const { data: findings } = await supabase.from('risk_findings').select('*').eq('organization_id', orgId)

    const content = {
      generated_at: new Date().toISOString(),
      report_type: reportType,
      vendors_total: vendors?.length ?? 0,
      vendors_by_risk: vendors?.reduce((acc, v) => { acc[v.risk_level] = (acc[v.risk_level] || 0) + 1; return acc }, {} as Record<string, number>),
      vendors_by_status: vendors?.reduce((acc, v) => { acc[v.status] = (acc[v.status] || 0) + 1; return acc }, {} as Record<string, number>),
      evaluations_total: evaluations?.length ?? 0,
      evaluations_completed: evaluations?.filter(e => e.status === 'completed').length ?? 0,
      findings_open: findings?.filter(f => f.status === 'open').length ?? 0,
      vendors: reportType === 'vendor_portfolio' ? vendors?.map(v => ({ id: v.id, name: v.name, status: v.status, risk_level: v.risk_level, category_name: v.category_name })) : undefined,
    }

    const { data: report } = await supabase.from('reports').insert({
      organization_id: orgId,
      title: reportTitle,
      report_type: reportType as Report['report_type'],
      status: 'ready',
      content,
      generated_by: user.id,
      generated_by_name: profile?.full_name || user.email,
    }).select().single()

    if (report) {
      setReports(prev => [report as Report, ...prev])
      setReportTitle('')
      toast({ title: 'Report generated', variant: 'success' })
    }
    setGenerating(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">Generate and manage vendor intelligence reports</p>
      </div>

      {/* Generate */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Generate New Report</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5 flex-1 min-w-48">
              <Label>Title</Label>
              <Input value={reportTitle} onChange={e => setReportTitle(e.target.value)} placeholder="e.g. Q3 2025 Risk Report" />
            </div>
            <div className="space-y-1.5 min-w-40">
              <Label>Type</Label>
              <Select value={reportType} onChange={e => setReportType(e.target.value)}>
                {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
            <Button onClick={generateReport} loading={generating} disabled={!reportTitle}>
              <Plus className="h-4 w-4 mr-1" />Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-500">No reports generated yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <Card key={r.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{r.report_type.replace(/_/g, ' ')} · Generated {formatDate(r.created_at)} by {r.generated_by_name || 'Unknown'}</p>
                    {r.content && (
                      <div className="text-xs text-slate-400 mt-1 flex gap-4">
                        {(r.content as Record<string, unknown>).vendors_total !== undefined && <span>{(r.content as Record<string, unknown>).vendors_total as number} vendors</span>}
                        {(r.content as Record<string, unknown>).findings_open !== undefined && <span>{(r.content as Record<string, unknown>).findings_open as number} open findings</span>}
                        {(r.content as Record<string, unknown>).evaluations_completed !== undefined && <span>{(r.content as Record<string, unknown>).evaluations_completed as number} completed evaluations</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border capitalize ${r.status === 'ready' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{r.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
