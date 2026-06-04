'use client'

import { useState } from 'react'
import { Bell, Search, Sun, Moon, Plus, Menu, X, Stethoscope, AlertTriangle, Cake, Flame } from 'lucide-react'
import { KotibaLogo } from '@/components/ui/KotibaLogo'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const notifications: { id: number; text: string; time: string; read: boolean; icon: React.ReactNode }[] = []

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme()
  const [showNotifs, setShowNotifs] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-900">

      {/* Left */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors lg:hidden dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {/* Mobile logo */}
        <div className="lg:hidden">
          <KotibaLogo size={28} />
        </div>
      </div>

      {/* Search */}
      <div className="mx-4 hidden max-w-sm flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-sm font-semibold text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-neutral-400 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-500 dark:focus:bg-neutral-800"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Quick add */}
        <Link
          href="/tasks"
          className="hidden h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-xs font-bold text-white transition-colors hover:bg-neutral-700 sm:flex dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Qo'shish
        </Link>

        {/* Theme */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black leading-none text-white">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl animate-slide-down dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                  <span className="text-sm font-extrabold text-neutral-900 dark:text-white">Bildirishnomalar</span>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button className="text-[11px] font-bold text-amber-600 hover:text-amber-700">
                        Barchasini o'qildi
                      </button>
                    )}
                    <button onClick={() => setShowNotifs(false)} className="text-neutral-400 hover:text-neutral-700 transition-colors dark:hover:text-neutral-200">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <Bell className="h-9 w-9 text-neutral-200 dark:text-neutral-700 mb-2.5" />
                      <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Bildirishnomalar yo'q</p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Yangi bildirishnomalar bu yerda paydo bo'ladi</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 border-b border-neutral-100 px-4 py-3 last:border-0 transition-colors',
                          'hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800',
                          !n.read && 'bg-amber-50/60 dark:bg-amber-950/20',
                        )}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs leading-relaxed', n.read ? 'text-neutral-500 dark:text-neutral-400' : 'font-semibold text-neutral-800 dark:text-neutral-100')}>
                            {n.text}
                          </p>
                          <p className="mt-0.5 text-[11px] text-neutral-400">{n.time}</p>
                        </div>
                        {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
