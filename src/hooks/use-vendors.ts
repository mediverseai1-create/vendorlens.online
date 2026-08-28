'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Vendor } from '@/types'

interface UseVendorsOptions {
  organizationId?: string
  search?: string
  status?: string
  riskLevel?: string
}

interface VendorsState {
  vendors: Vendor[]
  loading: boolean
  error: string | null
}

export function useVendors(options: UseVendorsOptions = {}) {
  const [state, setState] = useState<VendorsState>({ vendors: [], loading: true, error: null })
  const mountedRef = useRef(true)

  const fetchVendors = useCallback(async () => {
    const supabase = createClient()
    let query = supabase.from('vendors').select('*').order('created_at', { ascending: false })

    if (options.organizationId) query = query.eq('organization_id', options.organizationId)
    if (options.search) query = query.ilike('name', `%${options.search}%`)
    if (options.status) query = query.eq('status', options.status)
    if (options.riskLevel) query = query.eq('risk_level', options.riskLevel)

    const { data, error } = await query
    if (!mountedRef.current) return

    setState({
      vendors: data || [],
      loading: false,
      error: error ? error.message : null,
    })
  }, [options.organizationId, options.search, options.status, options.riskLevel])

  useEffect(() => {
    mountedRef.current = true
    fetchVendors()
    return () => { mountedRef.current = false }
  }, [fetchVendors])

  return { vendors: state.vendors, loading: state.loading, error: state.error, refetch: fetchVendors }
}
