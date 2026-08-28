export * from './database'

export interface DashboardStats {
  totalVendors: number
  activeVendors: number
  highRiskVendors: number
  pendingEvaluations: number
}

export interface NavItem {
  label: string
  href: string
  icon?: string
}
