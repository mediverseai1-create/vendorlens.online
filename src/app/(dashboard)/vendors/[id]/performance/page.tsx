import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default async function VendorPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: vendor } = await supabase.from('vendors').select('name').eq('id', id).single()
  if (!vendor) notFound()

  const { data: records } = await supabase.from('vendor_performance').select('*').eq('vendor_id', id).order('period_start', { ascending: false })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/vendors/${id}`} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Performance — {vendor.name}</h1>
      </div>
      {!records?.length ? (
        <Card><CardContent className="py-12 text-center text-sm text-slate-400">No performance records.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <Card key={r.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-900">{formatDate(r.period_start, 'MMM yyyy')} — {formatDate(r.period_end, 'MMM yyyy')}</p>
                  {r.overall_score != null && <span className="text-lg font-bold text-slate-900">{r.overall_score}/10</span>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[['SLA Compliance', r.sla_compliance], ['Delivery', r.delivery_score], ['Quality', r.quality_score], ['Responsiveness', r.responsiveness_score], ['Cost Performance', r.cost_performance], ['Incidents', r.incidents_count]].map(([label, val]) => (
                    <div key={label as string}>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="font-medium text-slate-900">{val ?? '—'}</p>
                    </div>
                  ))}
                </div>
                {r.notes && <p className="text-xs text-slate-500 mt-3 border-t border-slate-100 pt-3">{r.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
