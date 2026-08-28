'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({ open: false, setOpen: () => {} })

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    document.addEventListener('click', handler, { capture: true })
    return () => document.removeEventListener('click', handler, { capture: true })
  }, [open])
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div onClick={(e) => { e.stopPropagation(); setOpen(!open) }} className="cursor-pointer">
      {children}
    </div>
  )
}

function DropdownMenuContent({ className, children, align = 'end' }: { className?: string; children: React.ReactNode; align?: 'start' | 'end' | 'center' }) {
  const { open } = React.useContext(DropdownMenuContext)
  if (!open) return null
  return (
    <div className={cn(
      'absolute z-50 min-w-[160px] rounded-md border border-slate-200 bg-white p-1 shadow-lg mt-1',
      align === 'end' && 'right-0',
      align === 'start' && 'left-0',
      align === 'center' && 'left-1/2 -translate-x-1/2',
      className
    )}>
      {children}
    </div>
  )
}

function DropdownMenuItem({ className, children, onClick }: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div
      className={cn('flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100', className)}
      onClick={() => { onClick?.(); setOpen(false) }}
    >
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-slate-100', className)} />
}

function DropdownMenuLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('px-2 py-1.5 text-xs font-medium text-slate-500', className)}>{children}</div>
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel }
