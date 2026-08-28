'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(data: SignUpInput) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    })
    if (authError) {
      setError(authError.message)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/signin'), 3000)
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-8 text-center space-y-3">
          <div className="text-4xl">✉️</div>
          <h2 className="font-semibold text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-500">We sent a confirmation link. Please verify your email to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start managing your vendors today — free forever</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" placeholder="Jane Smith" {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-red-600">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" placeholder="jane@company.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Min. 8 characters" {...register('password')} />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" className="mt-0.5" {...register('terms')} />
            <Label htmlFor="terms" className="text-slate-500 font-normal text-xs leading-relaxed">
              I agree to the <Link href="#" className="text-sky-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-sky-600 hover:underline">Privacy Policy</Link>
            </Label>
          </div>
          {errors.terms && <p className="text-xs text-red-600">{errors.terms.message}</p>}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create free account
          </Button>
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-sky-600 hover:underline font-medium">Sign in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
