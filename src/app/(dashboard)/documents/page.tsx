import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, AlertTriangle } from 'lucide-react'
import { addDays, isBefore, parseISO } from 'date-fns'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')

  const { data: documents } = await supabase
    .from('vendor_documents')
    .select('*, vendors(name)')
    .eq('organization_id', membership.organization_id)
    .order('created_at', { ascending: false })

  const now = new Date()
  const in90Days = addDays(now, 90)
  const expiring = documents?.filter(d => d.expiration_date && isBefore(parseISO(d.expiration_date), in90Days) && d.status === 'active') ?? []

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Documents</h1>
        <p className="text-sm text-slate-500">{documents?.length ?? 0} total documents</p>
      </div>

      {expiring.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900">{expiring.length} document{expiring.length !== 1 ? 's' : ''} expiring within 90 days</p>
                <p className="text-xs text-orange-700">Review and renew these documents promptly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!documents?.length ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm text-slate-500">No documents yet. Add documents from the vendor detail page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(d => {
                const vendor = d.vendors as { name: string } | null
                const isExpiringSoon = d.expiration_date && isBefore(parseISO(d.expiration_date), in90Days) && d.status === 'active'
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-sm text-slate-900">{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vendors/${d.vendor_id}`} className="text-xs text-sky-600 hover:underline">{vendor?.name || '—'}</Link>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 capitalize">{d.document_type}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded border capitalize ${d.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : d.status === 'expired' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{d.status}</span>
                    </TableCell>
                    <TableCell>
                      {d.expiration_date ? (
                        <span className={`text-sm ${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-slate-500'}`}>{formatDate(d.expiration_date)}</span>
                      ) : <span className="text-slate-400 text-sm">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400">{formatDate(d.created_at, 'MMM d')}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
