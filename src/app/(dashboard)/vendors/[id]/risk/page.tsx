import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default async function VendorRiskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: vendor } = await supabase.from('vendors').select('name, risk_level').eq('id', id).single()
  if (!vendor) notFound()

  const { data: findings } = await supabase.from('risk_findings').select('*').eq('vendor_id', id).order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/vendors/${id}`} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Risk — {vendor.name}</h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{findings?.length ?? 0} risk findings</p>
      </div>
      {!findings?.length ? (
        <Card><CardContent className="py-12 text-center text-sm text-slate-400">No risk findings for this vendor.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {findings.map(f => (
            <Card key={f.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{f.title}</p>
                    {f.description && <p className="text-xs text-slate-500 mt-0.5">{f.description}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>{f.category || 'General'}</span>
                      <span>·</span>
                      <span>{formatDate(f.created_at)}</span>
                      {f.due_date && <><span>·</span><span>Due {formatDate(f.due_date)}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(f.severity === 'informational' ? 'low' : f.severity)}`}>{f.severity}</span>
                    <span className="text-xs px-2 py-0.5 rounded border text-slate-600 border-slate-200 capitalize">{f.status}</span>
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
