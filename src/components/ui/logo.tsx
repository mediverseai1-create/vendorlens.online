import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  dark?: boolean
}

export function Logo({ className, showText = true, dark = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="13" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="2" />
        <circle cx="14" cy="14" r="7" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2.5" fill={dark ? '#0EA5E9' : '#0EA5E9'} />
        <line x1="14" y1="1" x2="14" y2="6" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="22" x2="14" y2="27" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27" y1="14" x2="22" y2="14" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="14" x2="1" y2="14" stroke={dark ? '#0EA5E9' : '#0EA5E9'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={cn('font-bold text-lg tracking-tight', dark ? 'text-white' : 'text-slate-900')}>
          Vendor<span className="text-sky-500">Lens</span>
        </span>
      )}
    </div>
  )
}
