export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  job_role: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string | null
  industry: string | null
  size: string | null
  country: string | null
  website: string | null
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'analyst' | 'member' | 'viewer'
  joined_at: string
  invited_by: string | null
}

export interface Subscription {
  id: string
  organization_id: string
  plan: 'free' | 'professional' | 'business'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  vendor_limit: number
  user_limit: number
  created_at: string
  updated_at: string
}

export interface VendorCategory {
  id: string
  organization_id: string
  name: string
  description: string | null
  color: string
  created_at: string
}

export type VendorStatus =
  | 'draft'
  | 'pending_review'
  | 'under_evaluation'
  | 'approved'
  | 'active'
  | 'review_required'
  | 'suspended'
  | 'archived'

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'unknown'

export interface Vendor {
  id: string
  organization_id: string
  name: string
  legal_name: string | null
  description: string | null
  website: string | null
  category_id: string | null
  category_name: string | null
  status: VendorStatus
  risk_level: RiskLevel
  risk_score: number
  criticality: 'critical' | 'high' | 'medium' | 'low'
  spend_annual: number | null
  spend_currency: string
  contract_start_date: string | null
  contract_end_date: string | null
  next_review_date: string | null
  owner_id: string | null
  owner_name: string | null
  department: string | null
  country: string | null
  address: string | null
  tax_id: string | null
  founded_year: number | null
  employee_count: string | null
  services_provided: string[]
  data_access: string[]
  system_access: string[]
  has_nda: boolean
  has_contract: boolean
  notes: string | null
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface VendorContact {
  id: string
  vendor_id: string
  organization_id: string
  name: string
  email: string | null
  phone: string | null
  title: string | null
  is_primary: boolean
  created_at: string
}

export interface VendorStatusHistory {
  id: string
  vendor_id: string
  organization_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  changed_by_name: string | null
  reason: string | null
  created_at: string
}

export interface VendorEvaluation {
  id: string
  vendor_id: string
  organization_id: string
  title: string
  evaluation_type: 'general' | 'security' | 'compliance' | 'financial' | 'operational' | 'performance' | 'risk'
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  overall_score: number | null
  findings: string | null
  recommendations: string | null
  notes: string | null
  evaluated_by: string | null
  evaluated_by_name: string | null
  due_date: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface EvaluationCriteria {
  id: string
  evaluation_id: string
  organization_id: string
  category: string
  criterion: string
  score: number | null
  max_score: number
  weight: number
  notes: string | null
  status: 'pending' | 'pass' | 'fail' | 'partial' | 'na'
}

export interface VendorRiskAssessment {
  id: string
  vendor_id: string
  organization_id: string
  overall_risk_level: RiskLevel
  overall_risk_score: number
  cybersecurity_score: number
  compliance_score: number
  financial_score: number
  operational_score: number
  privacy_score: number
  continuity_score: number
  performance_score: number
  notes: string | null
  assessed_by: string | null
  assessed_by_name: string | null
  next_assessment_date: string | null
  created_at: string
  updated_at: string
}

export interface RiskFinding {
  id: string
  vendor_id: string
  organization_id: string
  risk_assessment_id: string | null
  title: string
  description: string | null
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational'
  category: string | null
  status: 'open' | 'in_progress' | 'resolved' | 'accepted' | 'mitigated'
  owner_id: string | null
  owner_name: string | null
  due_date: string | null
  resolution: string | null
  evidence: string | null
  created_at: string
  updated_at: string
}

export interface VendorDocument {
  id: string
  vendor_id: string
  organization_id: string
  name: string
  document_type: 'contract' | 'certification' | 'compliance' | 'insurance' | 'security' | 'policy' | 'financial' | 'nda' | 'sow' | 'other'
  file_name: string | null
  file_path: string | null
  file_size: number | null
  mime_type: string | null
  status: 'active' | 'expired' | 'pending_review' | 'archived'
  expiration_date: string | null
  issue_date: string | null
  issued_by: string | null
  notes: string | null
  uploaded_by: string | null
  uploaded_by_name: string | null
  created_at: string
  updated_at: string
}

export interface VendorPerformance {
  id: string
  vendor_id: string
  organization_id: string
  period_start: string
  period_end: string
  overall_score: number | null
  sla_compliance: number | null
  delivery_score: number | null
  quality_score: number | null
  responsiveness_score: number | null
  cost_performance: number | null
  incidents_count: number
  notes: string | null
  reviewed_by: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id: string | null
  user_name: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  entity_name: string | null
  details: Record<string, unknown>
  created_at: string
}

export interface AiAnalysis {
  id: string
  organization_id: string
  user_id: string | null
  vendor_id: string | null
  analysis_type: string
  prompt: string
  response: string
  tokens_used: number | null
  created_at: string
}

export interface Report {
  id: string
  organization_id: string
  title: string
  report_type: 'vendor_portfolio' | 'risk' | 'evaluation' | 'compliance' | 'performance' | 'executive'
  status: 'draft' | 'generating' | 'ready' | 'error'
  content: Record<string, unknown>
  generated_by: string | null
  generated_by_name: string | null
  created_at: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id: string | null
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  entity_type: string | null
  entity_id: string | null
  created_at: string
}
