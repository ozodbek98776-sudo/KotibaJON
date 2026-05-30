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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KOTIBAJON',
    startupImage: '/icons/icon-512.png',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'KOTIBAJON — Shaxsiy Raqamli Kotiba',
    description: "Vazifalar, moliya, maqsadlar va muhim sanalarni bitta platformada boshqaring.",
    type: 'website',
    locale: 'uz_UZ',
    images: ['/icons/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  themeColor: '#2563EB',
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
