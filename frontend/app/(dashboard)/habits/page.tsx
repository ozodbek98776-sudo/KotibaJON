'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Plus, X, Flame, Trophy, TrendingUp, Check,
  ChevronRight, Minus, MoreHorizontal, Archive,
  Droplets, PersonStanding, BookOpen, Brain, Pill, PenLine,
  Leaf, Dumbbell, Bike, Target, Moon, Ban, Apple, Coffee,
  Music, Sparkles, Coins, Users, Heart, Star, Zap,
  CalendarDays, BarChart2, CheckCircle2, Sprout,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ================================================================
   TYPES
   ================================================================ */
type HabitCat = 'soglik' | 'organish' | 'productivity' | 'ruh' | 'ijtimoiy' | 'moliya'

interface Habit {
  id        : string
  name      : string
  icon      : string   // key from ICON_MAP
  cat       : HabitCat
  color     : string
  target    : number
  createdAt : string
  archived  : boolean
}

interface HabitLog {
  habitId : string
  dateKey : string
  count   : number
}

/* ================================================================
   ICON SYSTEM
   ================================================================ */
const ICON_MAP: Record<string, LucideIcon> = {
  droplets  : Droplets,
  run       : PersonStanding,
  book      : BookOpen,
  brain     : Brain,
  pill      : Pill,
  pen       : PenLine,
  leaf      : Leaf,
  dumbbell  : Dumbbell,
  bike      : Bike,
  target    : Target,
  moon      : Moon,
  ban       : Ban,
  apple     : Apple,
  coffee    : Coffee,
  music     : Music,
  sparkles  : Sparkles,
  coins     : Coins,
  users     : Users,
  heart     : Heart,
  zap       : Zap,
}

const ICONS = Object.keys(ICON_MAP)

function HabitIcon({
  icon, className = 'w-5 h-5', style,
}: { icon: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICON_MAP[icon] ?? Star
  return <Icon className={className} style={style}/>
}

/* ================================================================
   CONSTANTS
   ================================================================ */
const UID = () => Math.random().toString(36).slice(2, 10)

const UZ_MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun',
                   'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
const UZ_DAYS_SHORT = ['Du','Se','Ch','Pa','Ju','Sh','Ya']

const CATS: Record<HabitCat, { label: string; bg: string; text: string }> = {
  soglik      : { label: "Sog'liq",   bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  organish    : { label: "O'rganish", bg: 'bg-violet-500/10  dark:bg-violet-500/20',  text: 'text-violet-600  dark:text-violet-400'  },
  productivity: { label: 'Unumdorlik',bg: 'bg-blue-500/10    dark:bg-blue-500/20',    text: 'text-blue-600    dark:text-blue-400'    },
  ruh         : { label: 'Ruh holati',bg: 'bg-amber-500/10   dark:bg-amber-500/20',   text: 'text-amber-600   dark:text-amber-400'   },
  ijtimoiy    : { label: 'Ijtimoiy',  bg: 'bg-pink-500/10    dark:bg-pink-500/20',    text: 'text-pink-600    dark:text-pink-400'    },
  moliya      : { label: 'Moliya',    bg: 'bg-teal-500/10    dark:bg-teal-500/20',    text: 'text-teal-600    dark:text-teal-400'    },
}

const COLORS = [
  '#06B6D4','#EF4444','#8B5CF6','#10B981',
  '#F59E0B','#3B82F6','#EC4899','#14B8A6',
  '#F97316','#6366F1',
]

const QUICK_HABITS: Omit<Habit,'id'|'createdAt'|'archived'>[] = [
  { name: 'Suv ichish',   icon: 'droplets', cat: 'soglik',      color: '#06B6D4', target: 8 },
  { name: 'Sport',        icon: 'run',      cat: 'soglik',      color: '#EF4444', target: 1 },
  { name: "Kitob o'qish", icon: 'book',     cat: 'organish',    color: '#8B5CF6', target: 1 },
  { name: 'Meditatsiya',  icon: 'brain',    cat: 'ruh',         color: '#10B981', target: 1 },
  { name: 'Vitaminlar',   icon: 'pill',     cat: 'soglik',      color: '#F59E0B', target: 1 },
  { name: 'Kundalik',     icon: 'pen',      cat: 'productivity',color: '#3B82F6', target: 1 },
]

/* ================================================================
   DATE HELPERS
   ================================================================ */
const dkey   = (d: Date) => d.toISOString().slice(0, 10)
const today  = () => dkey(new Date())
const addDay = (dk: string, n: number) => {
  const d = new Date(dk); d.setDate(d.getDate() + n); return dkey(d)
}
const fmtShort = (dk: string) => {
  const d = new Date(dk)
  return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`
}

/* ================================================================
   LOCAL STORAGE
   ================================================================ */
const LS_H = 'kj_habits'
const LS_L = 'kj_habit_logs'

const loadHabits = (): Habit[]    => { try { return JSON.parse(localStorage.getItem(LS_H)||'[]') } catch { return [] } }
const loadLogs   = (): HabitLog[] => { try { return JSON.parse(localStorage.getItem(LS_L)||'[]') } catch { return [] } }
const saveHabits = (h: Habit[])    => localStorage.setItem(LS_H, JSON.stringify(h))
const saveLogs   = (l: HabitLog[]) => localStorage.setItem(LS_L, JSON.stringify(l))

/* ================================================================
   STREAK LOGIC
   ================================================================ */
function getStreak(habitId: string, logs: HabitLog[]): { current: number; best: number } {
  const done = new Set(logs.filter(l => l.habitId === habitId && l.count > 0).map(l => l.dateKey))
  if (!done.size) return { current: 0, best: 0 }

  const allDates = [...done].sort()
  let best = 0, run = 0, prev = ''

  for (const dk of allDates) {
    run = (prev && addDay(prev, 1) === dk) ? run + 1 : 1
    best = Math.max(best, run)
    prev = dk
  }

  let current = 0
  const d = new Date()
  if (!done.has(dkey(d))) d.setDate(d.getDate() - 1)
  while (done.has(dkey(d))) {
    current++
    d.setDate(d.getDate() - 1)
  }

  return { current, best }
}

function getCompletionRate(habitId: string, logs: HabitLog[], days = 7): number {
  const t = today()
  let completed = 0
  for (let i = 0; i < days; i++) {
    const dk = addDay(t, -i)
    if (logs.some(l => l.habitId === habitId && l.dateKey === dk && l.count > 0)) completed++
  }
  return Math.round((completed / days) * 100)
}

/* ================================================================
   PROGRESS RING
   ================================================================ */
function Ring({ value, max, size, color, children }: {
  value: number; max: number; size: number; color: string; children?: React.ReactNode
}) {
  const r    = size / 2 - 3.5
  const circ = 2 * Math.PI * r
  const pct  = Math.min(value / Math.max(max, 1), 1)
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          className="stroke-neutral-100 dark:stroke-white/[0.08]" strokeWidth="3.5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="3.5"
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray .35s cubic-bezier(.34,1.56,.64,1)' }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

/* ================================================================
   HABIT CARD
   ================================================================ */
function HabitCard({
  habit, count, streak, rate7,
  onIncrement, onDecrement, onEdit,
}: {
  habit      : Habit
  count      : number
  streak     : number
  rate7      : number
  onIncrement: () => void
  onDecrement: () => void
  onEdit     : () => void
}) {
  const done    = count >= habit.target
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    const h = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [menu])

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-4 transition-all duration-200 group cursor-pointer',
        'hover:shadow-md active:scale-[0.98]',
        done
          ? 'border-transparent shadow-sm'
          : 'border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900',
      )}
      style={done ? {
        background: `linear-gradient(135deg, ${habit.color}18, ${habit.color}08)`,
        borderColor: `${habit.color}35`,
      } : {}}
      onClick={onIncrement}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {/* Lucide icon with color */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${habit.color}18` }}>
            <HabitIcon icon={habit.icon} className="w-4.5 h-4.5" style={{ color: habit.color, width: 18, height: 18 }}/>
          </div>
          <div>
            <p className={cn('text-sm font-extrabold leading-tight',
              done ? 'text-neutral-700 dark:text-white' : 'text-neutral-800 dark:text-neutral-100')}>
              {habit.name}
            </p>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', CATS[habit.cat].bg, CATS[habit.cat].text)}>
              {CATS[habit.cat].label}
            </span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={e => { e.stopPropagation(); setMenu(v => !v) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center
              text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.07]
              opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal className="w-4 h-4"/>
          </button>
          {menu && (
            <div className="absolute right-0 top-8 w-36 bg-white dark:bg-neutral-800
              border border-neutral-200 dark:border-white/[0.10] rounded-xl shadow-xl z-20 overflow-hidden">
              <button onClick={e => { e.stopPropagation(); setMenu(false); onEdit() }}
                className="w-full text-left px-3 py-2 text-xs font-bold
                  text-neutral-700 dark:text-neutral-200
                  hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors">
                Tahrirlash
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-3">
        <Ring value={count} max={habit.target} size={52} color={habit.color}>
          {done
            ? <Check className="w-4 h-4" style={{ color: habit.color }}/>
            : <span className="text-[13px] font-black" style={{ color: habit.color }}>{count}</span>
          }
        </Ring>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-lg font-black leading-none" style={{ color: habit.color }}>{count}</span>
            <span className="text-xs text-neutral-400 font-bold">/ {habit.target}</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.07] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(count / habit.target, 1) * 100}%`, background: habit.color }}/>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-500">
                <Flame className="w-3 h-3"/> {streak}
              </span>
            )}
            <span className="text-[10px] text-neutral-400 font-medium">{rate7}% / 7kun</span>
          </div>
        </div>

        {count > 0 && (
          <button
            onClick={e => { e.stopPropagation(); onDecrement() }}
            className="w-7 h-7 rounded-full flex items-center justify-center
              border border-neutral-200 dark:border-white/[0.10]
              text-neutral-400 hover:border-red-300 hover:text-red-400
              opacity-0 group-hover:opacity-100 transition-all"
          >
            <Minus className="w-3 h-3"/>
          </button>
        )}
      </div>

      {/* 7-day mini bar */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 7 }, (_, i) => {
          const d = addDay(today(), i - 6)
          const isToday = d === today()
          const hadLog = false // simplified
          return (
            <div key={i} className="flex-1 rounded-md h-1.5 transition-all"
              style={{
                background: isToday
                  ? (count >= habit.target ? habit.color : `${habit.color}30`)
                  : `${habit.color}20`,
              }}/>
          )
        })}
      </div>
    </div>
  )
}

/* ================================================================
   HEATMAP
   ================================================================ */
function Heatmap({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  const WEEKS = 18
  const DAYS  = WEEKS * 7

  const cells = useMemo(() => {
    const t   = new Date()
    const end = new Date(t)
    end.setDate(end.getDate() + (6 - end.getDay()))
    const start = new Date(end)
    start.setDate(start.getDate() - DAYS + 1)

    const result: { dk: string; intensity: number; month: number }[] = []
    for (let i = 0; i < DAYS; i++) {
      const d   = new Date(start)
      d.setDate(d.getDate() + i)
      const dk  = dkey(d)
      const dayLogs  = logs.filter(l => l.dateKey === dk && l.count > 0)
      const total    = habits.filter(h => !h.archived).length
      const intensity = total > 0 ? dayLogs.length / total : 0
      result.push({ dk, intensity, month: d.getMonth() })
    }
    return result
  }, [habits, logs])

  const weeks: typeof cells[] = []
  for (let w = 0; w < WEEKS; w++) weeks.push(cells.slice(w * 7, w * 7 + 7))

  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, wi) => {
    const first = week[0]
    const prev  = wi > 0 ? weeks[wi - 1][0] : null
    if (!prev || first.month !== prev.month)
      monthLabels.push({ label: UZ_MONTHS[first.month].slice(0, 3), col: wi })
  })

  function colorFor(intensity: number) {
    if (intensity === 0) return 'var(--heat-0)'
    if (intensity < 0.25) return 'var(--heat-1)'
    if (intensity < 0.5)  return 'var(--heat-2)'
    if (intensity < 0.75) return 'var(--heat-3)'
    return 'var(--heat-4)'
  }

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
      bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Faollik Xaritasi</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
          <span>Kam</span>
          {['var(--heat-0)','var(--heat-1)','var(--heat-2)','var(--heat-3)','var(--heat-4)'].map((c,i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }}/>
          ))}
          <span>Ko'p</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        <div className="flex flex-col gap-[3px] pt-5 pr-1 flex-shrink-0">
          {['Du','Ch','Ju'].map((d, i) => (
            <div key={d} className="text-[9px] text-neutral-400 font-bold leading-none"
              style={{ height: 12, marginTop: i === 0 ? 0 : 14 }}>{d}</div>
          ))}
        </div>
        <div className="flex flex-col gap-0 flex-shrink-0">
          <div className="flex gap-[3px] mb-1.5 h-4">
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.col === wi)
              return (
                <div key={wi} style={{ width: 12 }}
                  className="text-[9px] text-neutral-400 font-bold leading-none">
                  {ml?.label || ''}
                </div>
              )
            })}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => {
                  const isT = cell.dk === today()
                  return (
                    <div key={di}
                      title={`${fmtShort(cell.dk)}: ${Math.round(cell.intensity * 100)}%`}
                      className={cn('rounded-sm transition-all cursor-default',
                        isT && 'ring-1 ring-offset-1 ring-neutral-400 dark:ring-neutral-500')}
                      style={{ width: 12, height: 12, background: colorFor(cell.intensity) }}/>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        :root { --heat-0:#f3f4f6; --heat-1:#ddd6fe; --heat-2:#a78bfa; --heat-3:#7c3aed; --heat-4:#5b21b6; }
        .dark  { --heat-0:rgba(255,255,255,0.05); --heat-1:rgba(139,92,246,0.25); --heat-2:rgba(139,92,246,0.50); --heat-3:rgba(139,92,246,0.75); --heat-4:rgba(139,92,246,1); }
      `}</style>
    </div>
  )
}

/* ================================================================
   STREAK LEADERBOARD
   ================================================================ */
function StreakBoard({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  const ranked = useMemo(() =>
    habits
      .filter(h => !h.archived)
      .map(h => ({ habit: h, ...getStreak(h.id, logs) }))
      .filter(x => x.current > 0)
      .sort((a, b) => b.current - a.current)
      .slice(0, 5)
  , [habits, logs])

  if (!ranked.length) return null

  const medalColors = [
    'bg-amber-400 text-white',
    'bg-neutral-300 text-neutral-700',
    'bg-orange-400 text-white',
  ]

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
      bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-amber-500"/>
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Streak Reytingi</h3>
      </div>
      <div className="space-y-2.5">
        {ranked.map(({ habit, current, best }, i) => (
          <div key={habit.id} className="flex items-center gap-3">
            {/* Medal badge instead of emoji */}
            <div className={cn(
              'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0',
              i < 3
                ? medalColors[i]
                : 'bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400',
            )}>
              {i === 0 ? <Trophy className="w-2.5 h-2.5"/> : i + 1}
            </div>

            {/* Habit icon */}
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${habit.color}18` }}>
              <HabitIcon icon={habit.icon} style={{ color: habit.color, width: 12, height: 12 }}/>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200 truncate">
                  {habit.name}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Flame className="w-3 h-3 text-amber-500"/>
                  <span className="text-xs font-black text-amber-500">{current}</span>
                  {best > current && (
                    <span className="text-[10px] text-neutral-400 font-medium">({best} eng)</span>
                  )}
                </div>
              </div>
              <div className="mt-1 h-1 rounded-full bg-neutral-100 dark:bg-white/[0.07] overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(current / Math.max(best, current, 30), 1) * 100}%`,
                           background: habit.color }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   WEEKLY OVERVIEW
   ================================================================ */
function WeeklyOverview({ habits, logs }: { habits: Habit[]; logs: HabitLog[] }) {
  const active = habits.filter(h => !h.archived)
  if (!active.length) return null
  const days = Array.from({ length: 7 }, (_, i) => addDay(today(), i - 6))

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
      bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-violet-500"/>
        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Haftalik Ko'rinish</h3>
      </div>

      <div className="grid mb-2" style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}>
        <div/>
        {days.map(dk => {
          const d = new Date(dk)
          return (
            <div key={dk} className={cn('text-center',
              dk === today() ? 'text-violet-500 font-extrabold' : 'text-neutral-400')}>
              <div className="text-[9px] font-bold">{UZ_DAYS_SHORT[d.getDay()]}</div>
              <div className="text-[10px] font-black">{d.getDate()}</div>
            </div>
          )
        })}
      </div>

      <div className="space-y-1.5">
        {active.map(habit => (
          <div key={habit.id} className="grid items-center gap-1"
            style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}>
            <div className="flex items-center gap-1.5 pr-2 min-w-0">
              <HabitIcon icon={habit.icon} style={{ color: habit.color, width: 12, height: 12, flexShrink: 0 }}/>
              <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 truncate">
                {habit.name}
              </span>
            </div>
            {days.map(dk => {
              const log   = logs.find(l => l.habitId === habit.id && l.dateKey === dk)
              const count = log?.count ?? 0
              const done  = count >= habit.target
              const pct   = habit.target > 1 ? count / habit.target : done ? 1 : 0
              return (
                <div key={dk} className="flex justify-center">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: pct > 0
                        ? `${habit.color}${Math.round(pct * 0.8 * 255).toString(16).padStart(2,'0')}`
                        : 'rgb(243 244 246)',
                    }}>
                    {done && <Check className="w-3 h-3 text-white"/>}
                    {!done && pct > 0 && (
                      <span className="text-[8px] font-black text-white">{count}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   ADD / EDIT HABIT MODAL
   ================================================================ */
interface HabitForm {
  id    ?: string
  name   : string
  icon   : string
  cat    : HabitCat
  color  : string
  target : number
}

const EMPTY_FORM: HabitForm = { name: '', icon: 'sparkles', cat: 'soglik', color: '#8B5CF6', target: 1 }

function HabitModal({
  initial, onSave, onDelete, onClose,
}: {
  initial : HabitForm
  onSave  : (f: HabitForm) => void
  onDelete: (id: string) => void
  onClose : () => void
}) {
  const [f, setF] = useState<HabitForm>(initial)
  const set = <K extends keyof HabitForm>(k: K, v: HabitForm[K]) => setF(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl
        border border-neutral-200 dark:border-white/[0.08] w-full max-w-md p-5 z-10"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
            {f.id ? 'Odatni tahrirlash' : 'Yangi odat'}
          </h3>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center
              text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl"
          style={{ background: `${f.color}12`, border: `1px solid ${f.color}30` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${f.color}20` }}>
            <HabitIcon icon={f.icon} style={{ color: f.color, width: 20, height: 20 }}/>
          </div>
          <div>
            <p className="text-sm font-extrabold" style={{ color: f.color }}>
              {f.name || 'Odat nomi'}
            </p>
            <p className="text-[10px] text-neutral-400">
              Kuniga {f.target} marta · {CATS[f.cat].label}
            </p>
          </div>
        </div>

        {/* Name */}
        <input autoFocus value={f.name} onChange={e => set('name', e.target.value)}
          placeholder="Odat nomi..."
          className="w-full rounded-xl border border-neutral-200 dark:border-white/[0.10]
            bg-neutral-50 dark:bg-white/[0.04] px-3 py-2.5 text-sm
            text-neutral-900 dark:text-white placeholder:text-neutral-400
            outline-none focus:border-neutral-400 dark:focus:border-white/[0.25] mb-4 transition-colors"/>

        {/* Icon picker — Lucide icons */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2">Belgi</p>
          <div className="flex flex-wrap gap-1.5">
            {ICONS.map(key => (
              <button key={key} onClick={() => set('icon', key)}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  f.icon === key
                    ? 'shadow-md scale-110'
                    : 'bg-neutral-100 dark:bg-white/[0.07] hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
                )}
                style={f.icon === key ? { background: f.color } : {}}>
                <HabitIcon icon={key} className={cn('w-4 h-4', f.icon === key ? 'text-white' : 'text-neutral-500 dark:text-neutral-400')}/>
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2">Rang</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => set('color', c)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  background: c,
                  outline: f.color === c ? `3px solid ${c}` : undefined,
                  outlineOffset: f.color === c ? '2px' : undefined,
                  transform: f.color === c ? 'scale(1.15)' : undefined,
                }}/>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2">Kategoriya</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(CATS) as HabitCat[]).map(c => (
              <button key={c} onClick={() => set('cat', c)}
                className={cn('py-1.5 rounded-xl text-[10px] font-bold border transition-all',
                  f.cat === c
                    ? `${CATS[c].bg} ${CATS[c].text} border-transparent`
                    : 'border-neutral-100 dark:border-white/[0.06] text-neutral-500 hover:border-neutral-200')}>
                {CATS[c].label}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div className="mb-5">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2">
            Kunlik maqsad — {f.target} marta
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => set('target', Math.max(1, f.target - 1))}
              className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-white/[0.10]
                flex items-center justify-center text-neutral-600 dark:text-neutral-300
                hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
              <Minus className="w-3.5 h-3.5"/>
            </button>
            <div className="flex gap-1.5 flex-wrap flex-1">
              {Array.from({ length: f.target }, (_, i) => (
                <div key={i} className="w-6 h-6 rounded-lg flex-shrink-0"
                  style={{ background: f.color, opacity: 0.8 + i * 0.1 / f.target }}/>
              ))}
            </div>
            <button onClick={() => set('target', Math.min(10, f.target + 1))}
              className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-white/[0.10]
                flex items-center justify-center text-neutral-600 dark:text-neutral-300
                hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
              <Plus className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {f.id && (
            <button onClick={() => onDelete(f.id!)}
              className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center
                text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border
                border-neutral-200 dark:border-white/[0.10]">
              <Archive className="w-4 h-4"/>
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold
              border border-neutral-200 dark:border-white/[0.10]
              text-neutral-600 dark:text-neutral-400
              hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all">
            Bekor
          </button>
          <button onClick={() => { if (f.name.trim()) onSave(f) }}
            disabled={!f.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all
              bg-neutral-900 dark:bg-white dark:text-neutral-900
              hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
            {f.id ? 'Saqlash' : "Qo'shish"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function HabitsPage() {
  const [habits,  setHabits]  = useState<Habit[]>([])
  const [logs,    setLogs]    = useState<HabitLog[]>([])
  const [modal,   setModal]   = useState<HabitForm | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const h = loadHabits()
    const l = loadLogs()
    if (h.length === 0) {
      const defaults: Habit[] = QUICK_HABITS.map(q => ({
        ...q, id: UID(), createdAt: today(), archived: false,
      }))
      setHabits(defaults)
      saveHabits(defaults)
    } else {
      setHabits(h)
    }
    setLogs(l)
    setMounted(true)
  }, [])

  useEffect(() => { if (mounted) saveHabits(habits) }, [habits, mounted])
  useEffect(() => { if (mounted) saveLogs(logs)    }, [logs,   mounted])

  const getCount = useCallback((habitId: string) => {
    return logs.find(l => l.habitId === habitId && l.dateKey === today())?.count ?? 0
  }, [logs])

  function increment(habitId: string) {
    const habit = habits.find(h => h.id === habitId)!
    const cur   = getCount(habitId)
    if (cur >= habit.target) return
    setLogs(prev => {
      const idx = prev.findIndex(l => l.habitId === habitId && l.dateKey === today())
      if (idx >= 0) return prev.map((l, i) => i === idx ? { ...l, count: l.count + 1 } : l)
      return [...prev, { habitId, dateKey: today(), count: 1 }]
    })
  }

  function decrement(habitId: string) {
    setLogs(prev => {
      const idx = prev.findIndex(l => l.habitId === habitId && l.dateKey === today())
      if (idx < 0) return prev
      const cur = prev[idx].count
      if (cur <= 1) return prev.filter((_, i) => i !== idx)
      return prev.map((l, i) => i === idx ? { ...l, count: l.count - 1 } : l)
    })
  }

  function saveHabit(f: HabitForm) {
    if (f.id) {
      setHabits(prev => prev.map(h => h.id === f.id
        ? { ...h, name: f.name, icon: f.icon, cat: f.cat, color: f.color, target: f.target }
        : h))
    } else {
      const nh: Habit = {
        id: UID(), name: f.name, icon: f.icon, cat: f.cat,
        color: f.color, target: f.target, createdAt: today(), archived: false,
      }
      setHabits(prev => [...prev, nh])
    }
    setModal(null)
  }

  function archiveHabit(id: string) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, archived: true } : h))
    setModal(null)
  }

  const activeHabits = habits.filter(h => !h.archived)
  const todayDone    = activeHabits.filter(h => getCount(h.id) >= h.target).length
  const todayTotal   = activeHabits.length
  const todayPct     = todayTotal ? Math.round(todayDone / todayTotal * 100) : 0

  /* Summary strip items — Lucide icons instead of emoji */
  const summaryStats = [
    {
      label : 'Bugun',
      value : `${todayDone}/${todayTotal}`,
      sub   : `${todayPct}% bajarildi`,
      color : todayPct === 100 ? '#10B981' : '#8B5CF6',
      Icon  : todayPct === 100 ? CheckCircle2 : CalendarDays,
    },
    {
      label : 'Umumiy Streak',
      value : `${activeHabits.reduce((s, h) => s + getStreak(h.id, logs).current, 0)}`,
      sub   : 'Barcha odatlar',
      color : '#F59E0B',
      Icon  : Flame,
    },
    {
      label : 'Faol Kunlar',
      value : `${new Set(logs.map(l => l.dateKey)).size}`,
      sub   : 'Jami',
      color : '#3B82F6',
      Icon  : BarChart2,
    },
  ]

  if (!mounted) return null

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Odatlar Kuzatuvchi
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {new Date().getDate()} {UZ_MONTHS[new Date().getMonth()]},&nbsp;
            {['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'][new Date().getDay()]}
          </p>
        </div>
        <button
          onClick={() => setModal(EMPTY_FORM)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
            bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
            hover:opacity-90 active:scale-95 transition-all shadow-sm">
          <Plus className="w-4 h-4"/>
          Yangi odat
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {summaryStats.map(s => (
          <div key={s.label}
            className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
              bg-white dark:bg-neutral-900 p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.Icon className="w-4 h-4" style={{ color: s.color }}/>
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-black leading-none mb-1" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-[10px] text-neutral-400 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's habits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white">
            Bugungi Odatlar
          </h2>
          {todayPct === 100 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500
              bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <Trophy className="w-3 h-3"/> Barchasini bajardingiz!
            </span>
          )}
        </div>

        {activeHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center
            rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/[0.08]">
            {/* Sprout icon instead of 🌱 */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10
              flex items-center justify-center mb-3">
              <Sprout className="w-8 h-8 text-emerald-500"/>
            </div>
            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
              Hali odat qo'shilmagan
            </p>
            <p className="text-xs text-neutral-400 mt-1 mb-4">
              Birinchi odatingizni boshlang
            </p>
            <button onClick={() => setModal(EMPTY_FORM)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                hover:opacity-90 transition-all">
              <Plus className="w-4 h-4"/> Odat qo'shish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeHabits.map(h => (
              <HabitCard
                key={h.id}
                habit={h}
                count={getCount(h.id)}
                streak={getStreak(h.id, logs).current}
                rate7={getCompletionRate(h.id, logs, 7)}
                onIncrement={() => increment(h.id)}
                onDecrement={() => decrement(h.id)}
                onEdit={() => setModal({ id: h.id, name: h.name, icon: h.icon, cat: h.cat, color: h.color, target: h.target })}
              />
            ))}
            <button onClick={() => setModal(EMPTY_FORM)}
              className="rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/[0.08]
                p-4 flex flex-col items-center justify-center gap-2 text-neutral-400
                hover:border-neutral-300 dark:hover:border-white/[0.15]
                hover:text-neutral-500 dark:hover:text-neutral-300
                transition-all min-h-[120px]">
              <Plus className="w-5 h-5"/>
              <span className="text-xs font-bold">Yangi odat</span>
            </button>
          </div>
        )}
      </div>

      {logs.length > 0 && <Heatmap habits={activeHabits} logs={logs}/>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyOverview habits={habits} logs={logs}/>
        <StreakBoard    habits={habits} logs={logs}/>
      </div>

      {modal && (
        <HabitModal
          initial={modal}
          onSave={saveHabit}
          onDelete={archiveHabit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
