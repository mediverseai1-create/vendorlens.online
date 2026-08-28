'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { evaluationSchema, type EvaluationInput } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function NewEvaluationPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EvaluationInput>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { evaluation_type: 'general' }
  })

  async function onSubmit(data: EvaluationInput) {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: mem } = await supabase.from('organization_members').select('organization_id').eq('user_id', user.id).limit(1).single()
    if (!mem) return

    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

    const { error: err } = await supabase.from('vendor_evaluations').insert({
      vendor_id: id,
      organization_id: mem.organization_id,
      title: data.title,
      evaluation_type: data.evaluation_type,
      due_date: data.due_date || null,
      notes: data.notes || null,
      evaluated_by: user.id,
      evaluated_by_name: profile?.full_name || user.email,
      status: 'draft',
    })

    if (err) { setError(err.message); return }
    toast({ title: 'Evaluation created', variant: 'success' })
    router.push(`/vendors/${id}`)
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/vendors/${id}`} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">New Evaluation</h1>
      </div>
      {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input {...register('title')} placeholder="e.g. Annual Security Review 2025" />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select {...register('evaluation_type')}>
                <option value="general">General</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="performance">Performance</option>
                <option value="risk">Risk</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" {...register('due_date')} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea {...register('notes')} placeholder="Evaluation scope and objectives..." rows={3} />
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Link href={`/vendors/${id}`}><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" loading={isSubmitting}>Create Evaluation</Button>
        </div>
      </form>
    </div>
  )
}
