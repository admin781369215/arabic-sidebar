import { Cairo } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'نظام المحاسبة العربي',
  description: 'تطبيق محاسبة عربي مع قائمة جانبية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  )
}

