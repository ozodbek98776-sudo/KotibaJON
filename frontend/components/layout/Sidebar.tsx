'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, CheckSquare, DollarSign, Target,
  Calendar, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight, Sparkles, CalendarClock, Flame, BookOpen,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { KotibaLogo, KotibaIcon } from '@/components/ui/KotibaLogo'

const nav = [
  { href: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/tasks',     label: 'Vazifalar',    icon: CheckSquare },
  { href: '/finance',   label: 'Moliya',        icon: DollarSign },
  { href: '/goals',     label: 'Maqsadlar',     icon: Target },
  { href: '/dates',     label: 'Muhim Sanalar', icon: Calendar },
  { href: '/planner',   label: 'Kun Tartibi',   icon: CalendarClock },
  { href: '/habits',    label: 'Odatlar',        icon: Flame },
  { href: '/library',   label: 'Kutubxona',     icon: BookOpen },
  { href: '/reports',   label: 'Hisobotlar',    icon: BarChart3 },
]

/* ── Helpers ──────────────────────────────────────────────────── */
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts[0]?.length) return parts[0].slice(0, 2).toUpperCase()
  return '?'
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0]} ${parts[1][0]}.`
  return parts[0] || 'Foydalanuvchi'
}

/* ── Component ────────────────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState({ name: '', email: '', plan: '' })

  // Read user info from localStorage (client-side only)
  useEffect(() => {
    const name  = localStorage.getItem('kj_name')  || ''
    const email = localStorage.getItem('kj_email') || ''
    const plan  = localStorage.getItem('kj_plan')  || 'Bepul tarif'
    setUser({ name, email, plan })

    // Listen for storage changes (e.g. settings page update)
    const onStorage = () => {
      setUser({
        name:  localStorage.getItem('kj_name')  || '',
        email: localStorage.getItem('kj_email') || '',
        plan:  localStorage.getItem('kj_plan')  || 'Bepul tarif',
      })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleLogout() {
    localStorage.removeItem('kj_name')
    localStorage.removeItem('kj_email')
    localStorage.removeItem('kj_plan')
    router.push('/')
  }

  const displayName = user.name ? shortName(user.name) : 'Foydalanuvchi'
  const avatar      = user.name ? initials(user.name)  : '?'
  const planLabel   = user.plan || 'Bepul tarif'
  const planColor   = planLabel === 'Pro tarif' || planLabel === 'Premium tarif'
    ? 'text-amber-500'
    : 'text-neutral-500'

  return (
    <aside className={cn(
      'relative flex flex-col h-screen flex-shrink-0 transition-all duration-300',
      'bg-neutral-900 dark:bg-neutral-950 border-r border-neutral-800',
      collapsed ? 'w-16' : 'w-60',
    )}>

      {/* Logo */}
      <div className={cn(
        'flex items-center h-[60px] border-b border-neutral-800',
        collapsed ? 'justify-center px-3' : 'px-4',
      )}>
        {collapsed
          ? <KotibaIcon size={32} />
          : <KotibaLogo size={32} textColor="text-white" />
        }
      </div>

      {/* Collapse btn */}
      <button
        onClick={() => setCollapsed(v => !v)}
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

        {/* AI Yordamchi — panel toggle (sahifaga o'tmaydi) */}
        <AiNavButton collapsed={collapsed} />
      </nav>

      {/* Bottom */}
      <div className="border-t border-neutral-800 px-2 py-3 space-y-0.5">
        {/* Settings */}
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

        {/* User profile */}
        <div className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 cursor-default',
          collapsed && 'justify-center px-0',
        )}>
          {/* Avatar */}
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-neutral-700 flex items-center justify-center text-[11px] font-extrabold text-white select-none">
            {avatar}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-extrabold text-white leading-tight">
                  {displayName}
                </p>
                <p className={cn('truncate text-[11px] font-bold', planColor)}>
                  {planLabel}
                </p>
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Chiqish"
                className="flex-shrink-0 text-neutral-600 hover:text-red-400 transition-colors p-0.5 rounded"
              >
                <LogOut className="h-[15px] w-[15px]" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}

/* ── AI nav button — toggles floating panel, no page navigation ── */
function AiNavButton({ collapsed }: { collapsed: boolean }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const h = () => setActive(v => !v)
    window.addEventListener('toggle-ai-chat', h)
    return () => window.removeEventListener('toggle-ai-chat', h)
  }, [])

  function toggle() {
    window.dispatchEvent(new CustomEvent('toggle-ai-chat'))
  }

  return (
    <button
      onClick={toggle}
      title={collapsed ? 'AI Yordamchi' : undefined}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-150',
        collapsed && 'justify-center px-0',
        active
          ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,.40)]'
          : 'text-violet-400 hover:bg-violet-500/10 hover:text-violet-300',
      )}
    >
      <Sparkles className={cn(
        'h-[18px] w-[18px] flex-shrink-0',
        !active && 'drop-shadow-[0_0_5px_rgba(139,92,246,.7)]',
      )} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">AI Yordamchi</span>
          {active
            ? <span className="h-1.5 w-1.5 rounded-full bg-violet-200 animate-pulse" />
            : <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400">AI</span>
          }
        </>
      )}
    </button>
  )
}
