import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'VendorLens — Vendor Intelligence & Third-Party Risk Management',
  description: 'Know your vendors. Understand your risk. Make better decisions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
