import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    const body = await request.json()
    const { name, ...rest } = body
    if (!name) return NextResponse.json({ error: 'Vendor name is required' }, { status: 400 })

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: vendor, error } = await admin.from('vendors').insert({
      organization_id: membership.organization_id,
      created_by: user.id,
      name,
      ...rest,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Log activity
    await admin.from('activity_logs').insert({
      organization_id: membership.organization_id,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email,
      action: 'vendor_created',
      entity_type: 'vendor',
      entity_id: vendor.id,
      entity_name: vendor.name,
    })

    // Insert initial status history
    await admin.from('vendor_status_history').insert({
      vendor_id: vendor.id,
      organization_id: membership.organization_id,
      new_status: vendor.status,
      changed_by: user.id,
      changed_by_name: user.user_metadata?.full_name || user.email,
    })

    return NextResponse.json({ vendor })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const riskLevel = searchParams.get('risk_level')

    let query = supabase.from('vendors').select('*').eq('organization_id', membership.organization_id)
    if (status) query = query.eq('status', status)
    if (riskLevel) query = query.eq('risk_level', riskLevel)

    const { data, error: queryError } = await query.order('created_at', { ascending: false })
    if (queryError) return NextResponse.json({ error: queryError.message }, { status: 500 })

    return NextResponse.json({ vendors: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
