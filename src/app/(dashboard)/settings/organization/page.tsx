'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { organizationSchema, type OrganizationInput } from '@/lib/validations'
import { INDUSTRIES, COMPANY_SIZES, COUNTRIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function OrganizationSettingsPage() {
  const { toast } = useToast()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<OrganizationInput>({
    resolver: zodResolver(organizationSchema),
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: mem } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
      if (!mem) return
      setOrgId(mem.organization_id)
      const { data: org } = await supabase.from('organizations').select('*').eq('id', mem.organization_id).single()
      if (org) reset({ name: org.name, industry: org.industry || '', size: org.size || '', country: org.country || '', website: org.website || '' })
      setLoading(false)
    }
    load()
  }, [reset])

  async function onSubmit(data: OrganizationInput) {
    if (!orgId) return
    const supabase = createClient()
    const { error } = await supabase.from('organizations').update({ ...data, website: data.website || null }).eq('id', orgId)
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    toast({ title: 'Organization updated', variant: 'success' })
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading...</div>

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Organization</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Organization Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select {...register('industry')}>
                  <option value="">Select</option>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Company Size</Label>
                <Select {...register('size')}>
                  <option value="">Select</option>
                  {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Select {...register('country')}>
                <option value="">Select</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input {...register('website')} placeholder="https://" />
            </div>
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
