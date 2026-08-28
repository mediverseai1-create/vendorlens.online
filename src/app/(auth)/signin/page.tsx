'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signInSchema, type SignInInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit(data: SignInInput) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword(data)
    if (authError) {
      setError(authError.message)
      return
    }
    // Check if user has org — if not, send to onboarding
    const { data: membership } = await supabase
      .from('organization_members')
      .select('id')
      .limit(1)
      .single()
    router.push(membership ? '/dashboard' : '/onboarding')
    router.refresh()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your VendorLens account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-sky-600 hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
          <p className="text-center text-sm text-slate-500">
            No account?{' '}
            <Link href="/signup" className="text-sky-600 hover:underline font-medium">Create one free</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
