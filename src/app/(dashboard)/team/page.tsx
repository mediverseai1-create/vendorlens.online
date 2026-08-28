import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users } from 'lucide-react'

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  manager: 'bg-sky-100 text-sky-700',
  analyst: 'bg-green-100 text-green-700',
  member: 'bg-slate-100 text-slate-600',
  viewer: 'bg-slate-100 text-slate-500',
}

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: membership } = await supabase.from('organization_members').select('organization_id, role').eq('user_id', user.id).limit(1).single()
  if (!membership) redirect('/onboarding')

  const { data: members } = await supabase
    .from('organization_members')
    .select('*, profiles(full_name, email, avatar_url, job_role)')
    .eq('organization_id', membership.organization_id)
    .order('joined_at')

  const { data: org } = await supabase.from('organizations').select('name').eq('id', membership.organization_id).single()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500">{org?.name} · {members?.length ?? 0} member{members?.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {members?.map(m => {
            const profile = m.profiles as { full_name?: string; email?: string; job_role?: string } | null
            const name = profile?.full_name || profile?.email || 'Unknown'
            const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
            return (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-sky-100 text-sky-700 text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{name}</p>
                    <p className="text-xs text-slate-400">{profile?.job_role || profile?.email || ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${ROLE_COLORS[m.role] || 'bg-slate-100 text-slate-600'}`}>{m.role}</span>
                  <span className="text-xs text-slate-400">Joined {formatDate(m.joined_at, 'MMM d, yyyy')}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4">
          <p className="text-sm font-medium text-slate-700">Invite team members</p>
          <p className="text-xs text-slate-500 mt-1">Team member invitations are available on the Professional and Business plans. <a href="/settings/subscription" className="text-sky-600 hover:underline">Upgrade your plan</a> to invite collaborators.</p>
        </CardContent>
      </Card>
    </div>
  )
}
