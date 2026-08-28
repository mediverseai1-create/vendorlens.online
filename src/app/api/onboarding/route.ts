import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Verify the user is authenticated via their session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try { cookieStore.set(name, value, options) } catch {}
            })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { profile, org, orgId } = body

    // Use service role to bypass RLS for onboarding setup
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update profile
    const { error: profileErr } = await admin.from('profiles').upsert({
      id: user.id,
      full_name: profile.full_name || user.user_metadata?.full_name || '',
      email: user.email || '',
      job_role: profile.job_role || '',
      phone: profile.phone || '',
      updated_at: new Date().toISOString(),
    })
    if (profileErr) {
      console.error('Profile error:', profileErr)
    }

    // Create organization
    const { error: orgErr } = await admin.from('organizations').insert({
      id: orgId,
      name: org.name || 'My Organization',
      slug: org.slug,
      industry: org.industry || null,
      size: org.size || null,
      country: org.country || null,
      website: org.website || null,
    })
    if (orgErr) {
      return NextResponse.json({ error: 'Organization error: ' + orgErr.message }, { status: 500 })
    }

    // Add owner membership
    const { error: memberErr } = await admin.from('organization_members').insert({
      organization_id: orgId,
      user_id: user.id,
      role: 'owner',
    })
    if (memberErr) {
      return NextResponse.json({ error: 'Membership error: ' + memberErr.message }, { status: 500 })
    }

    // Create free subscription
    const { error: subErr } = await admin.from('subscriptions').insert({
      organization_id: orgId,
      plan: 'free',
      status: 'active',
      vendor_limit: 5,
      user_limit: 1,
    })
    if (subErr) {
      return NextResponse.json({ error: 'Subscription error: ' + subErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, orgId })
  } catch (e) {
    console.error('Onboarding API error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}
