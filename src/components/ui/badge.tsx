import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-sky-500 text-white',
        secondary: 'border-transparent bg-slate-100 text-slate-700',
        destructive: 'border-transparent bg-red-100 text-red-700 border-red-200',
        outline: 'text-slate-700',
        success: 'border-green-200 bg-green-100 text-green-700',
        warning: 'border-yellow-200 bg-yellow-100 text-yellow-700',
        critical: 'border-red-200 bg-red-100 text-red-700',
        high: 'border-orange-200 bg-orange-100 text-orange-700',
        medium: 'border-yellow-200 bg-yellow-100 text-yellow-700',
        low: 'border-green-200 bg-green-100 text-green-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
