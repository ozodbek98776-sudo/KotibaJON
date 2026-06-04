'use client'

/**
 * NotificationListener — mounts once in the dashboard layout.
 *
 * Responsibilities:
 *   1. Sync pending notifications to the SW on every page load
 *   2. Listen for KJ_NOTIF_FIRED messages → play ringtone + show in-app toast
 *   3. Show an in-app banner when a notification fires while the user is on the page
 */

import { useEffect, useState, useCallback } from 'react'
import { Bell, X, CheckCircle2 } from 'lucide-react'
import { useNotifications, playRingtone } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface ActiveToast {
  id       : string
  title    : string
  body     : string
  url      : string
  createdAt: number
}

export function NotificationListener () {
  const { hasPermission } = useNotifications()
  const [toasts, setToasts] = useState<ActiveToast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onMessage = (event: MessageEvent) => {
      const { type, id, title = 'Eslatma', body = '', url = '/tasks', playSound } = event.data || {}

      if (type !== 'KJ_NOTIF_FIRED') return

      // Play ringtone
      if (playSound !== false) playRingtone()

      // Show in-app toast
      const toast: ActiveToast = { id, title, body, url, createdAt: Date.now() }
      setToasts(ts => [...ts.filter(t => t.id !== id), toast])

      // Auto-dismiss after 8 s
      setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 8_000)
    }

    navigator.serviceWorker?.addEventListener('message', onMessage)
    return () => navigator.serviceWorker?.removeEventListener('message', onMessage)
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3',
            'w-80 rounded-2xl border shadow-2xl p-4',
            'bg-white dark:bg-[#1A1A1A]',
            'border-amber-200 dark:border-amber-500/30',
            'animate-slide-up',
          )}
          style={{ boxShadow: '0 8px 32px rgba(245,158,11,0.18)' }}>

          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-500" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight">
              {toast.title}
            </p>
            {toast.body && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed line-clamp-2">
                {toast.body}
              </p>
            )}
            <a href={toast.url}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ko'rish
            </a>
          </div>

          {/* Close */}
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-700 dark:hover:text-neutral-200 transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
