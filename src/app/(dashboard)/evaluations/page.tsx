import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList } from 'lucide-react'

export default async function EvaluationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')

  const { data: evaluations } = await supabase
    .from('vendor_evaluations')
    .select('*, vendors(name)')
    .eq('organization_id', membership.organization_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Evaluations</h1>
        <p className="text-sm text-slate-500">{evaluations?.length ?? 0} total evaluations</p>
      </div>

      {!evaluations?.length ? (
        <div className="text-center py-20">
          <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-medium text-slate-900 mb-1">No evaluations yet</h3>
          <p className="text-sm text-slate-500">Start by opening a vendor and creating an evaluation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluation</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((e) => {
                const vendor = e.vendors as { name: string } | null
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium text-slate-900">{e.title}</TableCell>
                    <TableCell>
                      <Link href={`/vendors/${e.vendor_id}`} className="text-sky-600 hover:underline text-sm">{vendor?.name || '—'}</Link>
                    </TableCell>
                    <TableCell className="capitalize text-sm text-slate-600">{e.evaluation_type}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${e.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : e.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{e.status.replace(/_/g, ' ')}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{e.overall_score != null ? `${e.overall_score}/10` : '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{e.evaluated_by_name || '—'}</TableCell>
                    <TableCell className="text-sm text-slate-400">{e.due_date ? formatDate(e.due_date) : '—'}</TableCell>
                    <TableCell className="text-sm text-slate-400">{formatDate(e.created_at, 'MMM d')}</TableCell>
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
