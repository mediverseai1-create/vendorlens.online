'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({ activeTab: '', setActiveTab: () => {} })

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue = '', value, onValueChange, children, ...props }, ref) => {
    const [activeTab, setActiveTabInternal] = React.useState(defaultValue)
    const activeTabValue = value ?? activeTab
    const setActiveTab = (tab: string) => {
      setActiveTabInternal(tab)
      onValueChange?.(tab)
    }
    return (
      <TabsContext.Provider value={{ activeTab: activeTabValue, setActiveTab }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>{children}</div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex h-9 items-center rounded-lg bg-slate-100 p-1 text-slate-500', className)} {...props} />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    return (
      <button
        ref={ref}
        onClick={() => setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all',
          activeTab === value
            ? 'bg-white text-slate-900 shadow'
            : 'text-slate-500 hover:text-slate-700',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null
    return <div ref={ref} className={cn('mt-4', className)} {...props}>{children}</div>
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
