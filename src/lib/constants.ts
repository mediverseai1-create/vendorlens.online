export const VENDOR_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'under_evaluation', label: 'Under Evaluation' },
  { value: 'approved', label: 'Approved' },
  { value: 'active', label: 'Active' },
  { value: 'review_required', label: 'Review Required' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'archived', label: 'Archived' },
]

export const RISK_LEVELS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'unknown', label: 'Unknown' },
]

export const CRITICALITY_LEVELS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Government', 'Energy', 'Transportation', 'Media',
  'Real Estate', 'Legal', 'Consulting', 'Non-profit', 'Other',
]

export const COMPANY_SIZES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+',
]

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'India', 'Singapore', 'Netherlands', 'Japan', 'Other',
]

export const DOCUMENT_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'certification', label: 'Certification' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'security', label: 'Security' },
  { value: 'policy', label: 'Policy' },
  { value: 'financial', label: 'Financial' },
  { value: 'nda', label: 'NDA' },
  { value: 'sow', label: 'Statement of Work' },
  { value: 'other', label: 'Other' },
]

export const EVALUATION_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'financial', label: 'Financial' },
  { value: 'operational', label: 'Operational' },
  { value: 'performance', label: 'Performance' },
  { value: 'risk', label: 'Risk' },
]

export const MEMBER_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export const PLAN_LIMITS = {
  free: { vendors: 5, users: 1, label: 'Free' },
  professional: { vendors: 50, users: 5, label: 'Professional' },
  business: { vendors: -1, users: -1, label: 'Business' },
}
