import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
