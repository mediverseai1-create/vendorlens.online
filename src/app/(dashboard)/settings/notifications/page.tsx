import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const NOTIF_PREFS = [
  { label: 'Vendor status changes', description: 'When a vendor status is updated', checked: true },
  { label: 'Expiring documents', description: 'When documents are about to expire', checked: true },
  { label: 'New risk findings', description: 'When new risk findings are created', checked: true },
  { label: 'Evaluation due reminders', description: 'When evaluations are due soon', checked: false },
  { label: 'Weekly digest', description: 'Weekly summary of your vendor portfolio', checked: false },
]

export default function NotificationsSettingsPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Email Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {NOTIF_PREFS.map(pref => (
            <label key={pref.label} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={pref.checked} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">{pref.label}</p>
                <p className="text-xs text-slate-500">{pref.description}</p>
              </div>
            </label>
          ))}
          <p className="text-xs text-slate-400 pt-2">Notification preferences will be fully configurable in a future update.</p>
        </CardContent>
      </Card>
    </div>
  )
}
