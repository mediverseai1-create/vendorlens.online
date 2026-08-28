'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function ProfileSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) reset({ full_name: profile.full_name || '', job_role: profile.job_role || '', phone: profile.phone || '' })
      setLoading(false)
    }
    load()
  }, [reset])

  async function onSubmit(data: ProfileInput) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id)
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    toast({ title: 'Profile updated', variant: 'success' })
  }

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading...</div>

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register('full_name')} placeholder="Your full name" />
              {errors.full_name && <p className="text-xs text-red-600">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Job Role</Label>
              <Select {...register('job_role')}>
                <option value="">Select role</option>
                <option>Chief Procurement Officer</option>
                <option>Procurement Manager</option>
                <option>Risk Manager</option>
                <option>Compliance Officer</option>
                <option>IT/Security Manager</option>
                <option>Finance Manager</option>
                <option>Operations Manager</option>
                <option>Other</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input {...register('phone')} placeholder="+1 555 000 0000" />
            </div>
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
