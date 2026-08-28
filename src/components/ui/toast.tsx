'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'rounded-lg border p-4 shadow-lg bg-white flex items-start gap-3',
              t.variant === 'destructive' && 'border-red-200 bg-red-50',
              t.variant === 'success' && 'border-green-200 bg-green-50'
            )}
          >
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-medium text-sm text-slate-900">{t.title}</div>}
              {t.description && <div className="text-xs text-slate-500 mt-0.5">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return React.useContext(ToastContext)
}
