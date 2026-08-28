'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-8 text-center space-y-3">
          <div className="text-4xl">📬</div>
          <h2 className="font-semibold text-slate-900">Reset link sent</h2>
          <p className="text-sm text-slate-500">Check your email for a password reset link.</p>
          <Link href="/signin" className="text-sky-600 text-sm hover:underline block">Back to sign in</Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Enter your email to receive a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
          </div>
          <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
          <p className="text-center text-sm text-slate-500">
            <Link href="/signin" className="text-sky-600 hover:underline">Back to sign in</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
