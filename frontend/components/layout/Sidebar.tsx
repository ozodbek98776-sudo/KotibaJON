'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, CheckSquare, DollarSign, Target,
  Calendar, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { KotibaLogo, KotibaIcon } from '@/components/ui/KotibaLogo'

const nav = [
  { href: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/tasks',     label: 'Vazifalar',     icon: CheckSquare },
  { href: '/finance',   label: 'Moliya',         icon: DollarSign },
  { href: '/goals',     label: 'Maqsadlar',      icon: Target },
  { href: '/dates',     label: 'Muhim Sanalar',  icon: Calendar },
  { href: '/reports',   label: 'Hisobotlar',     icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen flex-shrink-0 transition-all duration-300',
        'bg-neutral-900 dark:bg-neutral-950',
        'border-r border-neutral-800',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-[60px] border-b border-neutral-800',
        collapsed ? 'justify-center px-3' : 'px-4',
      )}>
        {collapsed
          ? <KotibaIcon size={30} className="opacity-90" />
          : <KotibaLogo size={30} variant="white" />
        }
      </div>

      {/* Collapse btn */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] z-20 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-500 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 no-scrollbar">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-150',
                collapsed && 'justify-center px-0',
                active
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
              )}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-neutral-800 px-2 py-3 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-150',
            collapsed && 'justify-center px-0',
            pathname === '/settings'
              ? 'bg-white text-neutral-900'
              : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
          )}
        >
          <Settings className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Sozlamalar</span>}
        </Link>

        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-150 text-left',
            'text-neutral-400 hover:bg-neutral-800 hover:text-white',
            collapsed && 'justify-center px-0',
          )}
        >
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-extrabold text-white">
            ST
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-extrabold text-white leading-tight">Sardor T.</p>
                <p className="truncate text-[11px] font-bold text-amber-500">Pro tarif</p>
              </div>
              <LogOut className="h-[15px] w-[15px] flex-shrink-0 text-neutral-600" />
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
