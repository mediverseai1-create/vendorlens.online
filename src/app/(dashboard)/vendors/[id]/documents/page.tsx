import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, ArrowLeft } from 'lucide-react'

export default async function VendorDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: vendor } = await supabase.from('vendors').select('name').eq('id', id).single()
  if (!vendor) notFound()

  const { data: documents } = await supabase.from('vendor_documents').select('*').eq('vendor_id', id).order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/vendors/${id}`} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Documents — {vendor.name}</h1>
      </div>
      {!documents?.length ? (
        <Card><CardContent className="py-12 text-center text-sm text-slate-400">No documents yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {documents.map(d => (
            <Card key={d.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{d.document_type} {d.expiration_date ? `· Expires ${formatDate(d.expiration_date)}` : ''} · Added {formatDate(d.created_at)}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded border capitalize ${d.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : d.status === 'expired' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{d.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
