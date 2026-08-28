import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
      {...props}
    >
      <div
        className="h-full bg-sky-500 transition-all"
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  )
)
Progress.displayName = 'Progress'

export { Progress }
