'use client'

import { useState, useEffect } from 'react'
import {
  CheckSquare, DollarSign, Target, TrendingUp,
  Plus, Clock, Flame, Calendar,
  Gift, Heart, CreditCard, Zap, Check, ChevronRight,
  BarChart2, Activity, LayoutDashboard,
} from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Types ──────────────────────────────────────────────────────── */
type Priority = 'urgent' | 'high' | 'medium' | 'low'
interface Task {
  id: number; title: string; priority: Priority; done: boolean; time: string
}

/* ── Empty initial state ─────────────────────────────────────────── */
const initialTasks: Task[] = []

const PRIORITY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  urgent: { bg:'bg-red-100 dark:bg-red-500/15',    text:'text-red-600 dark:text-red-400',    label:'Shoshilinch' },
  high:   { bg:'bg-orange-100 dark:bg-orange-500/15', text:'text-orange-600 dark:text-orange-400', label:'Yuqori' },
  medium: { bg:'bg-amber-100 dark:bg-amber-500/15', text:'text-amber-600 dark:text-amber-400', label:"O'rta" },
  low:    { bg:'bg-neutral-100 dark:bg-white/[0.08]', text:'text-neutral-500 dark:text-neutral-400', label:'Past' },
}

const DATE_ICONS: Record<string, React.ReactNode> = {
  birthday:    <Gift       className="w-4 h-4 text-pink-500"  />,
  anniversary: <Heart      className="w-4 h-4 text-red-500"   />,
  payment:     <CreditCard className="w-4 h-4 text-blue-500"  />,
}
const DATE_BG: Record<string, string> = {
  birthday:    'bg-pink-50 dark:bg-pink-500/10',
  anniversary: 'bg-red-50 dark:bg-red-500/10',
  payment:     'bg-blue-50 dark:bg-blue-500/10',
}

const EMPTY = { title: '', description: '', priority: 'medium', time: '' }
const CARD = cn('rounded-2xl border bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08]')
const SHADOW = { boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 p-3 text-xs" style={{ background:'#1A1A1A', minWidth:130 }}>
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full" style={{ background:p.color }}/>
            {p.name}
          </span>
          <span className="font-mono font-bold text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Empty state component ──────────────────────────────────────── */
function EmptyChart({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center gap-2.5 text-center">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center text-neutral-300 dark:text-neutral-600">
        {icon}
      </div>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{text}</p>
    </div>
  )
}

/* ================================================================
   PAGE
   ================================================================ */
export default function DashboardPage() {
  const [tasks, setTasks]       = useState<Task[]>(initialTasks)
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm]   = useState({ ...EMPTY })
  const [dateStr, setDateStr]   = useState('')
  const [greeting, setGreeting] = useState('Xayrli kun')
  const [greetBg, setGreetBg]   = useState('from-blue-600 to-indigo-600')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const now = new Date()
    const h = now.getHours()
    setDateStr(formatDate(now))
    if (h < 6)       { setGreeting('Yaxshi tun');   setGreetBg('from-indigo-700 to-blue-800') }
    else if (h < 12) { setGreeting('Xayrli tong');  setGreetBg('from-amber-500 to-orange-500') }
    else if (h < 18) { setGreeting('Xayrli kun');   setGreetBg('from-blue-600 to-indigo-600') }
    else             { setGreeting('Xayrli kech');  setGreetBg('from-violet-600 to-purple-700') }

    const name = localStorage.getItem('kj_name') || ''
    setUserName(name ? name.split(' ')[0] : '')
  }, [])

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  function toggleTask(id: number) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function saveTask() {
    if (!addForm.title.trim()) { toast.error('Sarlavha kiritish majburiy'); return }
    setTasks(ts => [...ts, {
      id: Date.now(), title: addForm.title,
      priority: addForm.priority as Priority, done: false, time: addForm.time || '--:--',
    }])
    toast.success("Vazifa qo'shildi!")
    setAddModal(false)
    setAddForm({ ...EMPTY })
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ══ GREETING HERO ════════════════════════════════════════ */}
      <div className={cn('rounded-3xl p-6 text-white relative overflow-hidden bg-gradient-to-br', greetBg)}
        style={{ boxShadow:'0 12px 40px rgba(0,0,0,0.20)' }}>
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white opacity-[0.06] pointer-events-none"/>
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white opacity-[0.04] pointer-events-none"/>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">{dateStr}</p>
            <h1 className="text-2xl font-black tracking-tight">
              {greeting}{userName ? `, ${userName}` : ''}!
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {total > 0
                ? `Bugun ${done}/${total} ta vazifa bajarildi · ${pct}% samaradorlik`
                : "Yangi kun, yangi boshlanish — birinchi vazifangizni qo'shing!"}
            </p>
          </div>
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)' }}>
            <Activity className="w-7 h-7 text-white"/>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-5">
          <div className="flex justify-between text-xs text-white/60 mb-1.5">
            <span>Kunlik progress</span>
            <span className="font-bold text-white">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white/80 transition-all duration-700" style={{ width:`${pct}%` }}/>
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Bugungi vazifalar', value:`${done}/${total}`, sub:`${pct}% bajarildi`,   icon:<CheckSquare className="w-4 h-4"/>, bg:'rgba(16,185,129,0.12)', color:'#10B981' },
          { label:'Oylik balans',      value:formatCurrency(0),   sub:"Moliya bo'limidan",   icon:<TrendingUp className="w-4 h-4"/>,  bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
          { label:'Bu oy xarajat',     value:formatCurrency(0),   sub:"Tranzaksiya yo'q",    icon:<DollarSign className="w-4 h-4"/>, bg:'rgba(245,158,11,0.12)',  color:'#F59E0B' },
          { label:'Faol maqsadlar',    value:'0 ta',              sub:"Maqsad qo'shilmagan", icon:<Target className="w-4 h-4"/>,     bg:'rgba(139,92,246,0.12)',  color:'#8B5CF6' },
        ].map(s => (
          <div key={s.label} className={cn(CARD,'p-4')} style={SHADOW}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
                <p className="text-lg font-black text-neutral-900 dark:text-white font-mono">{s.value}</p>
                <p className="text-[11px] mt-1 font-semibold truncate text-neutral-400 dark:text-neutral-500">
                  {s.sub}
                </p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ MAIN GRID ════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* ── Today tasks ───────────────────────────────────────── */}
        <div className={cn(CARD,'p-5 lg:col-span-2')} style={SHADOW}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-neutral-900 dark:text-white">Bugungi Vazifalar</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{done}/{total} bajarildi</p>
            </div>
            <Link href="/tasks" className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Barchasi <ChevronRight className="w-3.5 h-3.5"/>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-white/[0.08] mb-4 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width:`${pct}%` }}/>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center mb-3">
                <CheckSquare className="w-6 h-6 text-neutral-300 dark:text-neutral-600"/>
              </div>
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Vazifalar yo'q</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 mb-4">Birinchi vazifangizni qo'shing</p>
              <Button size="sm" onClick={() => setAddModal(true)} leftIcon={<Plus className="w-3.5 h-3.5"/>}>
                Qo'shish
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {tasks.map(task => {
                const p = PRIORITY_COLORS[task.priority]
                return (
                  <div key={task.id}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 cursor-pointer transition-all',
                      task.done
                        ? 'border-neutral-100 dark:border-white/[0.05] bg-neutral-50 dark:bg-white/[0.03] opacity-55'
                        : 'border-neutral-200 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.15] hover:bg-neutral-50 dark:hover:bg-white/[0.04]',
                    )}
                    onClick={() => toggleTask(task.id)}>
                    <div className={cn(
                      'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all',
                      task.done
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-emerald-400',
                    )}>
                      {task.done && <Check className="w-3 h-3 text-white"/>}
                    </div>
                    <p className={cn('flex-1 text-sm font-semibold truncate',
                      task.done?'text-neutral-400 dark:text-neutral-500 line-through':'text-neutral-800 dark:text-neutral-100')}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                        <Clock className="w-3 h-3"/>{task.time}
                      </span>
                      <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', p.bg, p.text)}>
                        {p.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <button onClick={() => setAddModal(true)}
            className={cn(
              'mt-3 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-2.5 text-sm font-bold transition-all',
              'border-neutral-200 dark:border-white/[0.10] text-neutral-400 dark:text-neutral-500',
              'hover:border-emerald-400 dark:hover:border-emerald-500',
              'hover:text-emerald-600 dark:hover:text-emerald-400',
            )}>
            <Plus className="w-4 h-4"/> Yangi vazifa
          </button>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Upcoming dates */}
          <div className={cn(CARD,'p-5')} style={SHADOW}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-neutral-900 dark:text-white">Yaqin Sanalar</h2>
              <Link href="/dates"><ChevronRight className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"/></Link>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-neutral-300 dark:text-neutral-600"/>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Muhim sana qo'shilmagan</p>
              <Link href="/dates" className="mt-2 text-xs font-bold text-blue-500 hover:underline">Qo'shish</Link>
            </div>
          </div>

          {/* Goals progress */}
          <div className={cn(CARD,'p-5')} style={SHADOW}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-neutral-900 dark:text-white">Maqsadlar</h2>
              <Link href="/goals"><ChevronRight className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"/></Link>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-neutral-300 dark:text-neutral-600"/>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Maqsad qo'shilmagan</p>
              <Link href="/goals" className="mt-2 text-xs font-bold text-emerald-500 hover:underline">Qo'shish</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CHARTS ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Area chart */}
        <div className={cn(CARD,'p-5 lg:col-span-2')} style={SHADOW}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-black text-neutral-900 dark:text-white">Haftalik Moliya</h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Daromad va xarajatlar</p>
            </div>
            <Link href="/finance" className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Batafsil <ChevronRight className="w-3.5 h-3.5"/>
            </Link>
          </div>
          <EmptyChart
            icon={<BarChart2 className="w-6 h-6"/>}
            text="Moliya ma'lumotlari yo'q — Moliya bo'limiga o'ting"
          />
        </div>

        {/* Pie chart */}
        <div className={cn(CARD,'p-5')} style={SHADOW}>
          <h2 className="text-sm font-black text-neutral-900 dark:text-white mb-4">Xarajat taqsimoti</h2>
          <EmptyChart
            icon={<DollarSign className="w-6 h-6"/>}
            text="Tranzaksiya qo'shilmagan"
          />
        </div>
      </div>

      {/* ══ QUICK LINKS ══════════════════════════════════════════ */}
      <div className={cn(CARD,'p-5')} style={SHADOW}>
        <h2 className="text-sm font-black text-neutral-900 dark:text-white mb-4">Tezkor o'tish</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href:'/tasks',   icon:<CheckSquare className="w-5 h-5"/>, label:'Vazifalar',  color:'#10B981', bg:'rgba(16,185,129,0.10)'  },
            { href:'/finance', icon:<DollarSign className="w-5 h-5"/>,  label:'Moliya',     color:'#3B82F6', bg:'rgba(59,130,246,0.10)'  },
            { href:'/goals',   icon:<Target className="w-5 h-5"/>,      label:'Maqsadlar',  color:'#8B5CF6', bg:'rgba(139,92,246,0.10)'  },
            { href:'/dates',   icon:<Calendar className="w-5 h-5"/>,    label:'Sanalar',    color:'#EC4899', bg:'rgba(236,72,153,0.10)'  },
            { href:'/reports', icon:<BarChart2 className="w-5 h-5"/>,   label:'Hisobotlar', color:'#F59E0B', bg:'rgba(245,158,11,0.10)'  },
            { href:'/settings',icon:<Zap className="w-5 h-5"/>,         label:'Sozlamalar', color:'#6B7280', bg:'rgba(107,114,128,0.10)' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all',
                'border border-neutral-100 dark:border-white/[0.06]',
                'hover:border-neutral-200 dark:hover:border-white/[0.12] hover:shadow-sm',
              )}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:l.bg }}>
                <span style={{ color:l.color }}>{l.icon}</span>
              </div>
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ ADD TASK MODAL ══════════════════════════════════════ */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Yangi Vazifa Qo'shish" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveTask} leftIcon={<Plus className="w-4 h-4"/>}>Qo'shish</Button>
          </>
        }>
        <div className="space-y-4">
          <Input label="Vazifa nomi *" value={addForm.title}
            onChange={e=>setAddForm(f=>({...f,title:e.target.value}))}
            placeholder="Masalan: Loyiha taqdimoti..."/>
          <Textarea label="Izoh" value={addForm.description}
            onChange={e=>setAddForm(f=>({...f,description:e.target.value}))}
            placeholder="Qo'shimcha ma'lumot..." rows={2}/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">Muhimlik</label>
              <select value={addForm.priority} onChange={e=>setAddForm(f=>({...f,priority:e.target.value}))}
                className={cn('h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-colors',
                  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10',
                  'text-neutral-900 dark:text-white',
                  'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20')}>
                <option value="urgent">Shoshilinch</option>
                <option value="high">Yuqori</option>
                <option value="medium">O'rta</option>
                <option value="low">Past</option>
              </select>
            </div>
            <Input label="Vaqt" type="time" value={addForm.time}
              onChange={e=>setAddForm(f=>({...f,time:e.target.value}))}/>
          </div>
        </div>
      </Modal>
    </div>
  )
}
