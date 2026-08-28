import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch {
    return '—'
  }
}

export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function truncate(str: string | null | undefined, length = 50): string {
  if (!str) return ''
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function getRiskColor(risk: string | null | undefined): string {
  switch (risk) {
    case 'critical': return 'text-red-700 bg-red-100 border-red-200'
    case 'high': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'low': return 'text-green-700 bg-green-100 border-green-200'
    default: return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

export function getRiskDotColor(risk: string | null | undefined): string {
  switch (risk) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-slate-400'
  }
}

export function getStatusColor(status: string | null | undefined): string {
  switch (status) {
    case 'active': return 'text-green-700 bg-green-100 border-green-200'
    case 'approved': return 'text-blue-700 bg-blue-100 border-blue-200'
    case 'under_evaluation': return 'text-purple-700 bg-purple-100 border-purple-200'
    case 'pending_review': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'review_required': return 'text-orange-700 bg-orange-100 border-orange-200'
    case 'suspended': return 'text-red-700 bg-red-100 border-red-200'
    case 'archived': return 'text-slate-600 bg-slate-100 border-slate-200'
    case 'draft': return 'text-slate-600 bg-slate-100 border-slate-200'
    default: return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

export function formatStatus(status: string | null | undefined): string {
  if (!status) return '—'
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function calculateRiskScore(scores: {
  cybersecurity?: number
  compliance?: number
  financial?: number
  operational?: number
  privacy?: number
  continuity?: number
  performance?: number
}): number {
  const weights = {
    cybersecurity: 0.25,
    compliance: 0.20,
    financial: 0.15,
    operational: 0.15,
    privacy: 0.10,
    continuity: 0.10,
    performance: 0.05,
  }
  let total = 0
  let weightSum = 0
  for (const [key, weight] of Object.entries(weights)) {
    const score = scores[key as keyof typeof scores]
    if (score != null) {
      total += score * weight
      weightSum += weight
    }
  }
  return weightSum > 0 ? Math.round((total / weightSum) * 10) / 10 : 0
}

export function getRiskLevelFromScore(score: number): string {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  if (score > 0) return 'low'
  return 'unknown'
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
