'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { vendorSchema, type VendorInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'
import type { Vendor } from '@/types'

export default function EditVendorPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = (useForm as any)({
    resolver: zodResolver(vendorSchema),
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('vendors').select('*').eq('id', id).single()
      if (data) {
        setVendor(data)
        reset({
          name: data.name,
          legal_name: data.legal_name ?? '',
          description: data.description ?? '',
          website: data.website ?? '',
          category_name: data.category_name ?? '',
          criticality: data.criticality,
          department: data.department ?? '',
          country: data.country ?? '',
          risk_level: data.risk_level,
          spend_annual: data.spend_annual ?? undefined,
          spend_currency: data.spend_currency,
          contract_start_date: data.contract_start_date ?? '',
          contract_end_date: data.contract_end_date ?? '',
          next_review_date: data.next_review_date ?? '',
          owner_name: data.owner_name ?? '',
          has_nda: data.has_nda,
          has_contract: data.has_contract,
          notes: data.notes ?? '',
          tags: data.tags,
          services_provided: data.services_provided,
          data_access: data.data_access,
          system_access: data.system_access,
        })
      }
      setLoading(false)
    }
    load()
  }, [id, reset])

  async function onSubmit(data: VendorInput) {
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.from('vendors').update({
      ...data,
      website: data.website || null,
      spend_annual: data.spend_annual || null,
      contract_start_date: data.contract_start_date || null,
      contract_end_date: data.contract_end_date || null,
      next_review_date: data.next_review_date || null,
    }).eq('id', id)

    if (err) { setError(err.message); return }
    toast({ title: 'Vendor updated', variant: 'success' })
    router.push(`/vendors/${id}`)
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading...</div>
  if (!vendor) return <div className="p-8 text-sm text-red-500">Vendor not found</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/vendors/${id}`} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold text-slate-900">Edit Vendor</h1>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Vendor Name *</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Legal Name</Label>
              <Input {...register('legal_name')} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea {...register('description')} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input {...register('website')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Classification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input {...register('category_name')} />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input {...register('department')} />
              </div>
              <div className="space-y-1.5">
                <Label>Criticality</Label>
                <Select {...register('criticality')}>
                  {['low', 'medium', 'high', 'critical'].map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Risk Level</Label>
                <Select {...register('risk_level')}>
                  {['unknown', 'low', 'medium', 'high', 'critical'].map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input {...register('country')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Contract &amp; Spend</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Annual Spend</Label>
                <Input type="number" {...register('spend_annual')} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select {...register('spend_currency')}>
                  {['USD', 'EUR', 'GBP', 'CAD'].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Contract Start</Label>
                <Input type="date" {...register('contract_start_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Contract End</Label>
                <Input type="date" {...register('contract_end_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Next Review</Label>
                <Input type="date" {...register('next_review_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Owner</Label>
                <Input {...register('owner_name')} />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('has_nda')} />Has NDA</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('has_contract')} />Has Contract</label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
          <CardContent><Textarea {...register('notes')} rows={4} /></CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href={`/vendors/${id}`}><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" loading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
