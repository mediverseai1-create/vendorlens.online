'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { vendorSchema } from '@/lib/validations'
import type { VendorInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

const RISK_LEVELS = ['unknown', 'low', 'medium', 'high', 'critical']
const CRITICALITY_LEVELS = ['low', 'medium', 'high', 'critical']

export default function NewVendorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors, isSubmitting } } = (useForm as any)({
    resolver: zodResolver(vendorSchema),
    defaultValues: { criticality: 'medium', risk_level: 'unknown', spend_currency: 'USD', has_nda: false, has_contract: false, tags: [], services_provided: [], data_access: [], system_access: [] }
  })

  async function onSubmit(data: VendorInput) {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signin'); return }

    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!membership) { router.push('/onboarding'); return }

    const { data: vendor, error: err } = await supabase
      .from('vendors')
      .insert({
        ...data,
        organization_id: membership.organization_id,
        created_by: user.id,
        website: data.website || null,
        spend_annual: data.spend_annual || null,
        contract_start_date: data.contract_start_date || null,
        contract_end_date: data.contract_end_date || null,
        next_review_date: data.next_review_date || null,
      })
      .select()
      .single()

    if (err) { setError(err.message); return }

    // Log initial status
    await supabase.from('vendor_status_history').insert({
      vendor_id: vendor.id,
      organization_id: membership.organization_id,
      new_status: 'draft',
      changed_by: user.id,
      reason: 'Vendor created',
    })

    // Activity log
    await supabase.from('activity_logs').insert({
      organization_id: membership.organization_id,
      user_id: user.id,
      action: `Added vendor: ${data.name}`,
      entity_type: 'vendor',
      entity_id: vendor.id,
      entity_name: data.name,
    })

    toast({ title: 'Vendor added', description: `${data.name} has been created.`, variant: 'success' })
    router.push(`/vendors/${vendor.id}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vendors" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Add Vendor</h1>
          <p className="text-sm text-slate-500">Create a new vendor profile</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Vendor Name *</Label>
              <Input {...register('name')} placeholder="e.g. Acme Software Inc." />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Legal Name</Label>
              <Input {...register('legal_name')} placeholder="Legal entity name" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea {...register('description')} placeholder="Brief description of what this vendor provides..." rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input {...register('website')} placeholder="https://vendor.com" />
              {errors.website && <p className="text-xs text-red-600">{errors.website.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader><CardTitle className="text-base">Classification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input {...register('category_name')} placeholder="e.g. SaaS, IT Infrastructure" />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input {...register('department')} placeholder="e.g. Engineering, Finance" />
              </div>
              <div className="space-y-1.5">
                <Label>Criticality</Label>
                <Select {...register('criticality')}>
                  {CRITICALITY_LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Initial Risk Level</Label>
                <Select {...register('risk_level')}>
                  {RISK_LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input {...register('country')} placeholder="e.g. United States" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract */}
        <Card>
          <CardHeader><CardTitle className="text-base">Contract &amp; Spend</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Annual Spend</Label>
                <Input type="number" {...register('spend_annual')} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select {...register('spend_currency')}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Contract Start Date</Label>
                <Input type="date" {...register('contract_start_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Contract End Date</Label>
                <Input type="date" {...register('contract_end_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Next Review Date</Label>
                <Input type="date" {...register('next_review_date')} />
              </div>
              <div className="space-y-1.5">
                <Label>Owner Name</Label>
                <Input {...register('owner_name')} placeholder="Relationship owner" />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('has_nda')} />
                <span>Has NDA</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('has_contract')} />
                <span>Has Contract</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
          <CardContent>
            <Textarea {...register('notes')} placeholder="Additional notes about this vendor..." rows={4} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href="/vendors">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting}>Create Vendor</Button>
        </div>
      </form>
    </div>
  )
}
