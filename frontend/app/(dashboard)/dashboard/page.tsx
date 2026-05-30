'use client'

import { useState, useEffect } from 'react'
import {
  CheckSquare, DollarSign, Target, TrendingUp,
  Plus, ArrowRight, Clock, Flame, X, Calendar,
} from 'lucide-react'
import { StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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

/* ── Static data ─────────────────────────────────────────────── */
const initialTasks = [
  { id: 1, title: 'Loyiha taqdimotini tayyorlash', priority: 'urgent', done: false, time: '14:00' },
  { id: 2, title: 'Doktor bilan uchrashuv',          priority: 'high',   done: false, time: '11:30' },
  { id: 3, title: 'Haftalik hisobot yozish',          priority: 'medium', done: true,  time: '09:00' },
  { id: 4, title: 'Email javob berish',               priority: 'low',    done: true,  time: '10:00' },
  { id: 5, title: "Kitob o'qish (30 bet)",            priority: 'low',    done: false, time: '20:00' },
]

const upcomingDates = [
  { id: 1, title: "Nilufar tug'ilgan kuni", date: new Date(Date.now() + 3  * 86400000), type: 'birthday'    },
  { id: 2, title: "Nikoh to'yi yillik",    date: new Date(Date.now() + 10 * 86400000), type: 'anniversary' },
  { id: 3, title: "Ijara to'lovi",         date: new Date(Date.now() + 5  * 86400000), type: 'payment'     },
]

const goals = [
  { id: 1, title: '10 000 qadam / kun',   progress: 72,      target: 100,     color: 'success'  as const },
  { id: 2, title: "5M so'm jamg'arish",   progress: 3200000, target: 5000000, color: 'accent'   as const },
  { id: 3, title: "12 ta kitob o'qish",   progress: 7,       target: 12,      color: 'primary'  as const },
]

const weeklyData = [
  { name: 'Du',  income: 0,       expense: 45000  },
  { name: 'Se',  income: 0,       expense: 32000  },
  { name: 'Cho', income: 1200000, expense: 78000  },
  { name: 'Pa',  income: 0,       expense: 55000  },
  { name: 'Ju',  income: 0,       expense: 89000  },
  { name: 'Sh',  income: 0,       expense: 120000 },
  { name: 'Ya',  income: 500000,  expense: 34000  },
]

const categoryData = [
  { name: 'Oziq-ovqat', value: 35, color: '#059669' },
  { name: 'Transport',  value: 20, color: '#F59E0B' },
  { name: 'Uy',         value: 25, color: '#3B82F6' },
  { name: "Sog'liq",   value: 10, color: '#EF4444' },
  { name: 'Boshqa',    value: 10, color: '#8B5CF6' },
]

const priorityBadge: Record<string, any>    = { urgent:'urgent', high:'high', medium:'medium', low:'low' }
const priorityLabel: Record<string, string> = { urgent:'Shoshilinch', high:'Yuqori', medium:"O'rta", low:'Past' }
const dateIcon: Record<string, string>       = { birthday:'🎂', anniversary:'💍', payment:'💳' }

/* ── Add task form ───────────────────────────────────────────── */
const EMPTY = { title: '', description: '', priority: 'medium', time: '' }

/* ================================================================
   PAGE
   ================================================================ */
export default function DashboardPage() {
  const [tasks, setTasks]     = useState(initialTasks)
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm]   = useState({ ...EMPTY })
  const [dateStr, setDateStr]   = useState('')
  const [greeting, setGreeting] = useState('Xayrli kun')

  useEffect(() => {
    const now = new Date()
    setDateStr(formatDate(now))
    const h = now.getHours()
    setGreeting(h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech')
  }, [])

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length

  function toggleTask(id: number) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function saveTask() {
    if (!addForm.title.trim()) { toast.error('Sarlavha kiritish majburiy'); return }
    setTasks(ts => [...ts, {
      id: Date.now(), title: addForm.title,
      priority: addForm.priority as any, done: false, time: addForm.time || '--:--',
    }])
    toast.success("✅ Vazifa qo'shildi!")
    setAddModal(false)
    setAddForm({ ...EMPTY })
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">{greeting}, Sardor! 👋</h1>
          <p className="mt-0.5 text-sm text-primary-500 dark:text-primary-400">
            {dateStr} — Bugun {done}/{total} ta vazifa bajarildi
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddModal(true)}>
          Vazifa qo'shish
        </Button>
      </div>

      {/* ── Streak ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-900/40 dark:bg-accent-950/20">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 dark:bg-accent-900/30">
          <Flame className="h-5 w-5 text-accent-600 dark:text-accent-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-accent-800 dark:text-accent-400">7 kunlik streak! 🔥</p>
          <p className="text-xs text-accent-600/70">Davom eting! Rekordingiz: 15 kun</p>
        </div>
        <span className="font-mono text-2xl font-black text-accent-600 dark:text-accent-400">7</span>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Bugungi vazifalar" value={`${done}/${total}`}
          change={`${Math.round((done / total) * 100)}% bajarildi`} changeType="up"
          icon={<CheckSquare className="h-5 w-5" />} color="primary" />
        <StatCard title="Oylik balans" value={formatCurrency(1420000)}
          change="+15% o'tgan oydan" changeType="up"
          icon={<TrendingUp className="h-5 w-5" />} color="success" />
        <StatCard title="Bu oy xarajat" value={formatCurrency(850000)}
          change="Byudjet 70% ishlatildi" changeType="neutral"
          icon={<DollarSign className="h-5 w-5" />} color="warning" />
        <StatCard title="Faol maqsadlar" value="3 ta"
          change="Avg. 64% progress" changeType="up"
          icon={<Target className="h-5 w-5" />} color="accent" />
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Today tasks */}
        <div className="lg:col-span-2 rounded-xl border border-border-light bg-white p-5 dark:border-primary-700/50 dark:bg-primary-800"
             style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-primary-900 dark:text-primary-50">Bugungi Vazifalar</h2>
              <p className="mt-0.5 text-xs text-primary-400">{done} / {total} bajarildi</p>
            </div>
            <Link href="/tasks" className="flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-700 dark:hover:text-primary-200 transition-colors">
              Barchasi <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <Progress value={done} max={total} color="primary" size="xs" className="mb-4" />

          <div className="space-y-1.5">
            {tasks.map(task => (
              <div key={task.id} className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all cursor-pointer',
                task.done
                  ? 'border-transparent bg-primary-50/60 opacity-60 dark:bg-primary-900/20'
                  : 'border-border-light hover:border-primary-200 hover:bg-primary-50/40 dark:border-primary-700/30 dark:hover:bg-primary-900/20',
              )} onClick={() => toggleTask(task.id)}>
                <div className={cn(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all',
                  task.done
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-primary-200 hover:border-primary-400 dark:border-primary-600',
                )}>
                  {task.done && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className={cn(
                  'flex-1 truncate text-sm font-semibold',
                  task.done ? 'text-primary-400 line-through dark:text-primary-600' : 'text-primary-800 dark:text-primary-100',
                )}>
                  {task.title}
                </p>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-primary-400">
                    <Clock className="h-3 w-3" />{task.time}
                  </span>
                  <Badge variant={priorityBadge[task.priority]}>{priorityLabel[task.priority]}</Badge>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAddModal(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary-200 py-2 text-sm font-bold text-primary-400 transition-all hover:border-primary-400 hover:text-primary-600 dark:border-primary-700 dark:hover:border-primary-500"
          >
            <Plus className="h-4 w-4" /> Yangi vazifa qo'shish
          </button>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming dates */}
          <div className="rounded-xl border border-border-light bg-white p-5 dark:border-primary-700/50 dark:bg-primary-800"
               style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black text-primary-900 dark:text-primary-50">Yaqin Sanalar</h2>
              <Link href="/dates"><ArrowRight className="h-4 w-4 text-primary-400 hover:text-primary-600 dark:hover:text-primary-200" /></Link>
            </div>
            <div className="space-y-3">
              {upcomingDates.map(item => {
                const days = getDaysUntil(item.date)
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-lg dark:bg-primary-900/40">
                      {dateIcon[item.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-primary-800 dark:text-primary-100">{item.title}</p>
                      <p className="text-xs text-primary-400">{formatDate(item.date)}</p>
                    </div>
                    <Badge variant={days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'default'}>
                      {days} kun
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Goals */}
          <div className="rounded-xl border border-border-light bg-white p-5 dark:border-primary-700/50 dark:bg-primary-800"
               style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black text-primary-900 dark:text-primary-50">Maqsadlar</h2>
              <Link href="/goals"><ArrowRight className="h-4 w-4 text-primary-400 hover:text-primary-600" /></Link>
            </div>
            <div className="space-y-4">
              {goals.map(g => {
                const pct = Math.round((g.progress / g.target) * 100)
                return (
                  <div key={g.id}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="flex-1 truncate text-xs font-semibold text-primary-700 dark:text-primary-300 mr-2">{g.title}</p>
                      <span className="font-mono text-xs font-black text-primary-500">{pct}%</span>
                    </div>
                    <Progress value={pct} color={g.color} size="sm" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area chart */}
        <div className="lg:col-span-2 rounded-xl border border-border-light bg-white p-5 dark:border-primary-700/50 dark:bg-primary-800"
             style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-primary-900 dark:text-primary-50">Haftalik Moliya</h2>
              <p className="text-xs text-primary-400">Daromad va xarajatlar</p>
            </div>
            <Link href="/finance" className="flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-700 dark:hover:text-primary-200">
              Batafsil <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#059669" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#D1FAE5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6EE7B7' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6EE7B7' }} tickLine={false} axisLine={false} tickFormatter={v => v > 0 ? `${v/1000}K` : ''} />
              <Tooltip
                formatter={(v: number) => [formatCurrency(v)]}
                contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #D1FAE5', boxShadow: '0 4px 12px rgba(5,150,105,0.12)' }}
              />
              <Area type="monotone" dataKey="income"  stroke="#059669" strokeWidth={2} fill="url(#incG)" name="Daromad" />
              <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fill="url(#expG)" name="Xarajat" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl border border-border-light bg-white p-5 dark:border-primary-700/50 dark:bg-primary-800"
             style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
          <h2 className="mb-4 text-sm font-black text-primary-900 dark:text-primary-50">Xarajat taqsimoti</h2>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`]}
                contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #D1FAE5' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-primary-500 dark:text-primary-400">{item.name}</span>
                </div>
                <span className="font-mono text-xs font-black text-primary-700 dark:text-primary-300">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Task Modal ──────────────────────────────────────── */}
      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Yangi Vazifa Qo'shish"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveTask} leftIcon={<Plus className="h-4 w-4" />}>Qo'shish</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Vazifa nomi *"
            value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Masalan: Loyiha taqdimoti..."
          />
          <Textarea
            label="Izoh"
            value={addForm.description}
            onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Qo'shimcha ma'lumot..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-primary-800 dark:text-primary-200">Muhimlik</label>
              <select
                value={addForm.priority}
                onChange={e => setAddForm(f => ({ ...f, priority: e.target.value }))}
                className="h-10 w-full rounded-lg border border-border-light bg-white px-3 text-sm font-semibold text-primary-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-100"
              >
                <option value="urgent">Shoshilinch</option>
                <option value="high">Yuqori</option>
                <option value="medium">O'rta</option>
                <option value="low">Past</option>
              </select>
            </div>
            <Input
              label="Vaqt"
              type="time"
              value={addForm.time}
              onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
