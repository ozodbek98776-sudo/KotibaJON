import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KOTIBAJON — Shaxsiy Raqamli Kotiba',
  description: "Vaqtingizni, maqsadlaringizni va resurslaringizni samarali boshqaring. O'zbekiston uchun yaratilgan shaxsiy samaradorlik platformasi.",
  keywords: "vazifa boshqaruvi, moliya, maqsadlar, eslatmalar, O'zbekiston, productivity",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning className={nunito.variable}>
      <body className={nunito.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#171717',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #262626',
              },
              success: { style: { background: '#16A34A', border: '1px solid #22C55E' } },
              error:   { style: { background: '#DC2626', border: '1px solid #EF4444' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
