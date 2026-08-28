import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      {children}
    </div>
  )
}
