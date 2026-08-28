import { Logo } from '@/components/ui/logo'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <Logo />
      </div>
      {children}
    </div>
  )
}
