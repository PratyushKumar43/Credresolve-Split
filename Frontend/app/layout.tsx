import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'Credresolve - Split Expenses Easily',
  description: 'Track shared expenses, split bills fairly, and settle up with ease. The simplest way to manage group expenses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={plusJakarta.variable}>
        <body className="bg-white text-neutral-900 antialiased selection:bg-[#ccf32f] selection:text-black font-sans">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}

