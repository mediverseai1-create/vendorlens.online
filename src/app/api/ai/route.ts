import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeVendorData } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, vendorId } = await request.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(name, industry)')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    const orgId = membership.organization_id
    const orgInfo = membership.organizations as unknown as { name: string; industry: string } | null

    // Fetch relevant data
    const [
      { data: vendors },
      { data: evaluations },
      { data: findings },
      { data: documents },
    ] = await Promise.all([
      supabase.from('vendors').select('name, status, risk_level, risk_score, category_name, criticality, spend_annual, contract_end_date, next_review_date, department, country').eq('organization_id', orgId).limit(50),
      supabase.from('vendor_evaluations').select('title, status, overall_score, evaluation_type, vendors(name)').eq('organization_id', orgId).limit(20),
      supabase.from('risk_findings').select('title, severity, status, category, vendors(name)').eq('organization_id', orgId).eq('status', 'open').limit(20),
      supabase.from('vendor_documents').select('name, document_type, status, expiration_date, vendors(name)').eq('organization_id', orgId).limit(20),
    ])

    // Build context
    const context = `
Organization: ${orgInfo?.name || 'Unknown'} (${orgInfo?.industry || 'Unknown industry'})

VENDORS (${vendors?.length ?? 0} total):
${vendors?.map(v => `- ${v.name}: Status=${v.status}, Risk=${v.risk_level}(score:${v.risk_score}), Category=${v.category_name || 'N/A'}, Criticality=${v.criticality}, Spend=${v.spend_annual ? '$' + v.spend_annual : 'N/A'}, ContractEnd=${v.contract_end_date || 'N/A'}, NextReview=${v.next_review_date || 'N/A'}`).join('\n') || 'No vendors'}

Risk Distribution:
- Critical: ${vendors?.filter(v => v.risk_level === 'critical').length ?? 0}
- High: ${vendors?.filter(v => v.risk_level === 'high').length ?? 0}
- Medium: ${vendors?.filter(v => v.risk_level === 'medium').length ?? 0}
- Low: ${vendors?.filter(v => v.risk_level === 'low').length ?? 0}

OPEN RISK FINDINGS (${findings?.length ?? 0}):
${findings?.slice(0, 10).map(f => {
  const vendor = f.vendors as unknown as { name: string } | null
  return `- [${f.severity.toUpperCase()}] ${f.title} (${vendor?.name || 'Unknown vendor'}, ${f.category || 'General'})`
}).join('\n') || 'None'}

EVALUATIONS (${evaluations?.length ?? 0} total):
${evaluations?.slice(0, 10).map(e => {
  const vendor = e.vendors as unknown as { name: string } | null
  return `- ${e.title} - ${vendor?.name || 'Unknown'}: Type=${e.evaluation_type}, Status=${e.status}, Score=${e.overall_score ?? 'N/A'}`
}).join('\n') || 'None'}

DOCUMENTS (${documents?.length ?? 0} total):
- Active: ${documents?.filter(d => d.status === 'active').length ?? 0}
- Expired: ${documents?.filter(d => d.status === 'expired').length ?? 0}
- Expiring soon (active with expiry date): ${documents?.filter(d => d.status === 'active' && d.expiration_date && new Date(d.expiration_date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length ?? 0}
`

    const response = await analyzeVendorData(context, message)

    // Store analysis
    await supabase.from('ai_analyses').insert({
      organization_id: orgId,
      user_id: user.id,
      vendor_id: vendorId || null,
      analysis_type: 'chat',
      prompt: message,
      response,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI route error:', error)
    return NextResponse.json({ error: 'Failed to process request. Please ensure your Gemini API key is configured.' }, { status: 500 })
  }
}
