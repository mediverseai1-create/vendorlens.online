import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getRiskColor, getStatusColor, formatStatus, formatCurrency } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Building2, ExternalLink } from 'lucide-react'
import type { Vendor } from '@/types'

interface SearchParams {
  search?: string
  status?: string
  risk_level?: string
}

export default async function VendorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!membership) redirect('/onboarding')
  const orgId = membership.organization_id

  let query = supabase.from('vendors').select('*').eq('organization_id', orgId).order('created_at', { ascending: false })

  if (params.search) query = query.ilike('name', `%${params.search}%`)
  if (params.status) query = query.eq('status', params.status)
  if (params.risk_level) query = query.eq('risk_level', params.risk_level)

  const { data: vendors } = await query

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Vendors</h1>
          <p className="text-sm text-slate-500">{vendors?.length ?? 0} total vendors</p>
        </div>
        <Link href="/vendors/new" className="flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Link>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Search vendors..."
          className="flex h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 w-64"
        />
        <select name="status" defaultValue={params.status} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending_review">Pending Review</option>
          <option value="active">Active</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="archived">Archived</option>
        </select>
        <select name="risk_level" defaultValue={params.risk_level} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All risk levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="unknown">Unknown</option>
        </select>
        <button type="submit" className="h-9 px-4 rounded-md bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors">Filter</button>
        {(params.search || params.status || params.risk_level) && (
          <Link href="/vendors" className="h-9 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center">Clear</Link>
        )}
      </form>

      {/* Table */}
      {!vendors?.length ? (
        <div className="text-center py-20">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-medium text-slate-900 mb-1">No vendors found</h3>
          <p className="text-sm text-slate-500 mb-4">
            {params.search || params.status || params.risk_level ? 'Try adjusting your filters.' : 'Get started by adding your first vendor.'}
          </p>
          <Link href="/vendors/new" className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">
            <Plus className="h-4 w-4" />Add Vendor
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Annual Spend</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v: Vendor) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div>
                      <Link href={`/vendors/${v.id}`} className="font-medium text-slate-900 hover:text-sky-600 transition-colors">{v.name}</Link>
                      {v.website && <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><ExternalLink className="h-3 w-3" />{v.website}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getStatusColor(v.status)}`}>{formatStatus(v.status)}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium capitalize ${getRiskColor(v.risk_level)}`}>{v.risk_level}</span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{v.category_name || '—'}</TableCell>
                  <TableCell className="text-sm text-slate-600">{v.owner_name || '—'}</TableCell>
                  <TableCell className="text-sm text-slate-600">{v.spend_annual ? formatCurrency(v.spend_annual, v.spend_currency) : '—'}</TableCell>
                  <TableCell className="text-sm text-slate-400">{formatDate(v.updated_at, 'MMM d')}</TableCell>
                  <TableCell>
                    <Link href={`/vendors/${v.id}`} className="text-xs text-sky-600 hover:underline">View</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
