'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { INDUSTRIES, COMPANY_SIZES, COUNTRIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const USE_CASES = [
  'Vendor onboarding & due diligence',
  'Third-party risk management',
  'Compliance & regulatory requirements',
  'Contract lifecycle management',
  'Vendor performance tracking',
  'Security assessments',
  'Cost management & optimization',
  'Supplier diversity program',
]

const STEPS = ['Your profile', 'Organization', 'Your needs', 'All set!']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState({ full_name: '', job_role: '', phone: '' })
  const [org, setOrg] = useState({ name: '', industry: '', size: '', country: '', website: '' })
  const [useCases, setUseCases] = useState<string[]>([])

  function toggleUseCase(uc: string) {
    setUseCases(prev => prev.includes(uc) ? prev.filter(u => u !== uc) : [...prev, uc])
  }

  async function handleFinish() {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update profile
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name || user.user_metadata?.full_name,
        email: user.email,
        job_role: profile.job_role,
        phone: profile.phone,
      })

      // Create organization
      const slug = slugify(org.name) + '-' + Math.random().toString(36).slice(2, 6)
      const { data: orgData, error: orgErr } = await supabase
        .from('organizations')
        .insert({ name: org.name, slug, industry: org.industry, size: org.size, country: org.country, website: org.website || null })
        .select()
        .single()
      if (orgErr) throw orgErr

      // Add owner membership
      await supabase.from('organization_members').insert({
        organization_id: orgData.id,
        user_id: user.id,
        role: 'owner',
      })

      // Create free subscription
      await supabase.from('subscriptions').insert({
        organization_id: orgData.id,
        plan: 'free',
        status: 'active',
        vendor_limit: 5,
        user_limit: 1,
      })

      setStep(3)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium shrink-0 ${i <= step ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? 'bg-sky-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

        {/* Step 0: Profile */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>This helps us personalize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Jane Smith" />
              </div>
              <div className="space-y-1.5">
                <Label>Job role</Label>
                <Select value={profile.job_role} onChange={e => setProfile(p => ({ ...p, job_role: e.target.value }))}>
                  <option value="">Select your role</option>
                  <option>Chief Procurement Officer</option>
                  <option>Procurement Manager</option>
                  <option>Risk Manager</option>
                  <option>Compliance Officer</option>
                  <option>IT/Security Manager</option>
                  <option>Finance Manager</option>
                  <option>Operations Manager</option>
                  <option>Legal Counsel</option>
                  <option>Other</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Phone (optional)</Label>
                <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555 000 0000" />
              </div>
              <Button className="w-full" onClick={() => setStep(1)} disabled={!profile.full_name}>Continue</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Organization */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Your organization</CardTitle>
              <CardDescription>Set up your company workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Company name *</Label>
                <Input value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} placeholder="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Industry</Label>
                  <Select value={org.industry} onChange={e => setOrg(o => ({ ...o, industry: e.target.value }))}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Company size</Label>
                  <Select value={org.size} onChange={e => setOrg(o => ({ ...o, size: e.target.value }))}>
                    <option value="">Select size</option>
                    {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select value={org.country} onChange={e => setOrg(o => ({ ...o, country: e.target.value }))}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Website (optional)</Label>
                <Input value={org.website} onChange={e => setOrg(o => ({ ...o, website: e.target.value }))} placeholder="https://acme.com" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(2)} disabled={!org.name}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Use cases */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>What are your main needs?</CardTitle>
              <CardDescription>Select all that apply — helps us tailor your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {USE_CASES.map(uc => (
                  <label key={uc} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${useCases.includes(uc) ? 'border-sky-300 bg-sky-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="checkbox" className="sr-only" checked={useCases.includes(uc)} onChange={() => toggleUseCase(uc)} />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${useCases.includes(uc) ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300'}`}>
                      {useCases.includes(uc) && <span className="text-xs">✓</span>}
                    </div>
                    <span className="text-sm text-slate-700">{uc}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" loading={loading} onClick={handleFinish}>Finish setup</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <Card>
            <CardContent className="pt-8 text-center space-y-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-semibold text-slate-900">You&apos;re all set!</h2>
              <p className="text-sm text-slate-500">Taking you to your dashboard...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
