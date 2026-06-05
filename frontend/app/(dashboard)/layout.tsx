'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { NotificationListener } from '@/components/notifications/NotificationListener'
import { KotibaBot } from '@/components/mascot/KotibaBot'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  /* Widget yoki tashqi oynadan navigatsiya buyruqlarini tinglash */
  useEffect(() => {
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('kj-nav')
      bc.onmessage = (e) => {
        if (e.data?.path) router.push(e.data.path)
      }
    } catch (_) {}
    return () => { bc?.close() }
  }, [router])

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Global: listens for SW notification events + plays ringtone */}
      <NotificationListener />

      {/* Site mascot — contextual tips on every page */}
      <KotibaBot />
    </div>
  )
}
