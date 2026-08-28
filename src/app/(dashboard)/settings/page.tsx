import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { User, Building2, Shield, Bell, CreditCard, ChevronRight } from 'lucide-react'

const SETTINGS_ITEMS = [
  { href: '/settings/profile', icon: User, label: 'Profile', description: 'Update your personal information and preferences' },
  { href: '/settings/organization', icon: Building2, label: 'Organization', description: 'Manage your organization settings and details' },
  { href: '/settings/security', icon: Shield, label: 'Security', description: 'Change password and manage account security' },
  { href: '/settings/notifications', icon: Bell, label: 'Notifications', description: 'Configure notification preferences' },
  { href: '/settings/subscription', icon: CreditCard, label: 'Subscription', description: 'Manage your plan and billing' },
]

export default function SettingsPage() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
      <div className="space-y-2">
        {SETTINGS_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
