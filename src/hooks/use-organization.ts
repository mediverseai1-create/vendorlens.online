'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Organization, OrganizationMember } from '@/types'

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [membership, setMembership] = useState<OrganizationMember | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: mem } = await supabase
        .from('organization_members')
        .select('*, organizations(*)')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (mem) {
        setMembership(mem as OrganizationMember)
        setOrganization((mem as Record<string, unknown>).organizations as Organization)
      }
      setLoading(false)
    }
    load()
  }, [])

  return { organization, membership, loading }
}
