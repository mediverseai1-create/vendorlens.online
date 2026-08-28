import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine(v => v, 'You must accept the terms'),
})

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  job_role: z.string().optional(),
  phone: z.string().optional(),
})

export const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name required'),
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const vendorSchema = z.object({
  name: z.string().min(2, 'Vendor name required'),
  legal_name: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  category_name: z.string().optional(),
  criticality: z.enum(['critical', 'high', 'medium', 'low']),
  department: z.string().optional(),
  country: z.string().optional(),
  risk_level: z.enum(['critical', 'high', 'medium', 'low', 'unknown']),
  spend_annual: z.coerce.number().optional(),
  spend_currency: z.string(),
  contract_start_date: z.string().optional(),
  contract_end_date: z.string().optional(),
  next_review_date: z.string().optional(),
  owner_name: z.string().optional(),
  has_nda: z.boolean(),
  has_contract: z.boolean(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  services_provided: z.array(z.string()),
  data_access: z.array(z.string()),
  system_access: z.array(z.string()),
})

export const evaluationSchema = z.object({
  title: z.string().min(2, 'Title required'),
  evaluation_type: z.enum(['general', 'security', 'compliance', 'financial', 'operational', 'performance', 'risk']),
  due_date: z.string().optional(),
  notes: z.string().optional(),
})

export const riskFindingSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'informational']),
  category: z.string().optional(),
  due_date: z.string().optional(),
  owner_name: z.string().optional(),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type OrganizationInput = z.infer<typeof organizationSchema>
export type VendorInput = z.infer<typeof vendorSchema>
export type EvaluationInput = z.infer<typeof evaluationSchema>
export type RiskFindingInput = z.infer<typeof riskFindingSchema>
