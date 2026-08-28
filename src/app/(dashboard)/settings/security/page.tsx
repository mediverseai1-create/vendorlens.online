'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'

export default function SecuritySettingsPage() {
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast({ title: 'Password too short', description: 'Minimum 8 characters', variant: 'destructive' }); return }
    if (password !== confirm) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return }
    toast({ title: 'Password updated', variant: 'success' })
    setPassword('')
    setConfirm('')
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Security</h1>
      </div>
      <form onSubmit={handleChangePassword}>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Change Password</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" />
            </div>
            <Button type="submit" loading={loading}>Update Password</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
