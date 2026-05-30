'use client'

import { useState } from 'react'
import {
  Plus, Target, TrendingUp, Calendar,
  CheckCircle2, Circle, Flame, Trophy,
  ChevronDown, ChevronUp, Pencil,
  Pause, Play,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Types ─────────────────────────────────────────────────── */
interface Milestone { title: string; done: boolean; date?: Date }
interface Goal {
  id: number
  title: string
  description: string
  category: string
  gradFrom: string
  gradTo: string
  badgeBg: string
  iconColor: string
  progress: number
  target: number
  current: number
  unit: string
  deadline?: Date
  status: 'active' | 'completed' | 'paused'
  streak?: number
  milestones?: Milestone[]
}

/* ── Initial data ───────────────────────────────────────────── */
const INIT: Goal[] = [
  {
    id: 1, title: 'Har kuni 10 000 qadam yurish', description: "Sog'liqni saqlash uchun kunlik faollik",
    category: "Sog'liq",
    gradFrom: 'from-emerald-400', gradTo: 'to-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    iconColor: 'text-emerald-500',
    status: 'active', progress: 72, target: 100, current: 72, unit: '%', streak: 7,
    milestones: [
      { title: 'Birinchi 7 kun ketma-ket', done: true, date: new Date('2026-05-23') },
      { title: 'Birinchi oy', done: false },
      { title: '3 oy davomida', done: false },
    ],
  },
  {
    id: 2, title: "5 000 000 so'm jamg'arish", description: 'Favqulodda zaxira fondi',
    category: 'Moliya',
    gradFrom: 'from-blue-400', gradTo: 'to-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    iconColor: 'text-blue-500',
    status: 'active', progress: 64, target: 5000000, current: 3200000, unit: "so'm",
    deadline: new Date('2026-09-28'),
    milestones: [
      { title: "1 000 000 so'm", done: true, date: new Date('2026-02-15') },
      { title: "2 500 000 so'm", done: true, date: new Date('2026-04-10') },
      { title: "5 000 000 so'm", done: false },
    ],
  },
  {
    id: 3, title: "Yil davomida 12 ta kitob o'qish", description: 'Har oyda kamida 1 ta kitob',
    category: "O'qish",
    gradFrom: 'from-violet-400', gradTo: 'to-violet-600',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    iconColor: 'text-violet-500',
    status: 'active', progress: 58, target: 12, current: 7, unit: 'ta kitob',
    deadline: new Date('2026-10-27'),
    milestones: [
      { title: '3 ta kitob', done: true, date: new Date('2026-03-31') },
      { title: '6 ta kitob', done: true, date: new Date('2026-05-20') },
      { title: '9 ta kitob', done: false },
      { title: '12 ta kitob', done: false },
    ],
  },
  {
    id: 4, title: "TypeScript ni o'rganish", description: 'Advanced TypeScript patterns va generics',
    category: 'Kasbiy',
    gradFrom: 'from-accent-400', gradTo: 'to-accent-600',
    badgeBg: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',
    iconColor: 'text-accent-500',
    status: 'active', progress: 85, target: 100, current: 85, unit: '%',
    deadline: new Date('2026-06-29'),
  },
  {
    id: 5, title: 'Ingliz tilini B2 darajasiga yetkazish', description: 'IELTS tayyorgarlik',
    category: "O'qish",
    gradFrom: 'from-purple-400', gradTo: 'to-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    iconColor: 'text-purple-500',
    status: 'paused', progress: 40, target: 100, current: 40, unit: '%',
    deadline: new Date('2026-12-16'),
  },
]

const CATS    = ['Barchasi', "Sog'liq", 'Moliya', "O'qish", 'Kasbiy', 'Shaxsiy']
const UNITS   = ['%', "so'm", 'ta kitob', 'km', 'soat', 'kun', 'ta']
const CAT_LIST = ["Sog'liq", 'Moliya', "O'qish", 'Kasbiy', 'Shaxsiy', 'Shaxsiy rivojlanish']

/* ── Progress bar ───────────────────────────────────────────── */
function GoalBar({ value, gradFrom, gradTo }: { value: number; gradFrom: string; gradTo: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/40">
      <div
        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', gradFrom, gradTo)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */
function fmtValue(val: number, unit: string) {
  return unit === "so'm" ? formatCurrency(val) : `${val} ${unit}`
}

/* ── Select style helper ─────────────────────────────────────── */
const selectCls = [
  'h-10 w-full rounded-lg border px-3 text-sm font-semibold outline-none transition-all',
  'bg-white dark:bg-primary-900',
  'border-border-light dark:border-primary-700',
  'text-primary-900 dark:text-primary-100',
  'focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800',
].join(' ')

const labelCls = 'mb-1.5 block text-sm font-bold text-primary-800 dark:text-primary-200'

/* ================================================================
   PAGE
   ================================================================ */
export default function GoalsPage() {
  const [goals, setGoals]  = useState<Goal[]>(INIT)
  const [cat, setCat]      = useState('Barchasi')
  const [expanded, setExp] = useState<number | null>(null)

  /* ── Modal states ─────────────────────────────────────────── */
  const [progressModal, setProgressModal] = useState<Goal | null>(null)
  const [editModal, setEditModal]         = useState<Goal | null>(null)
  const [addModal, setAddModal]           = useState(false)

  /* ── Progress form ────────────────────────────────────────── */
  const [newProgress, setNewProgress]   = useState('')
  const [progressNote, setProgressNote] = useState('')

  /* ── Edit form ────────────────────────────────────────────── */
  const [editForm, setEditForm] = useState<{
    title: string; description: string; category: string;
    target: number | string; unit: string; deadline: string;
  }>({ title: '', description: '', category: "Sog'liq", target: '', unit: '%', deadline: '' })

  /* ── Add form ─────────────────────────────────────────────── */
  const [addForm, setAddForm] = useState({
    title: '', description: '', category: "Sog'liq",
    target: '', unit: '%', deadline: '',
  })

  /* ── Derived ──────────────────────────────────────────────── */
  const filtered = goals.filter(g => cat === 'Barchasi' || g.category === cat)
  const active   = goals.filter(g => g.status === 'active')
  const avgPct   = active.length
    ? Math.round(active.reduce((s, g) => s + g.progress, 0) / active.length)
    : 0

  /* ── Actions ──────────────────────────────────────────────── */
  function openProgress(goal: Goal) {
    setNewProgress(String(goal.current))
    setProgressNote('')
    setProgressModal(goal)
  }

  function saveProgress() {
    if (!progressModal) return
    const val = Number(newProgress)
    if (isNaN(val) || val < 0) { toast.error("Noto'g'ri qiymat"); return }
    const pct = Math.min(Math.round((val / progressModal.target) * 100), 100)
    setGoals(gs => gs.map(g =>
      g.id === progressModal.id
        ? { ...g, current: val, progress: pct, status: pct >= 100 ? 'completed' : g.status }
        : g
    ))
    toast.success(pct >= 100 ? '🎉 Maqsad bajarildi!' : '✅ Progress yangilandi!')
    setProgressModal(null)
  }

  function openEdit(goal: Goal) {
    setEditForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target: goal.target,
      unit: goal.unit,
      deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : '',
    })
    setEditModal(goal)
  }

  function saveEdit() {
    if (!editModal) return
    if (!editForm.title?.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    setGoals(gs => gs.map(g =>
      g.id === editModal.id
        ? {
            ...g,
            title: editForm.title,
            description: editForm.description,
            category: editForm.category,
            target: Number(editForm.target) || g.target,
            unit: editForm.unit,
            deadline: editForm.deadline ? new Date(editForm.deadline) : g.deadline,
          }
        : g
    ))
    toast.success('✅ Maqsad tahrirlandi!')
    setEditModal(null)
  }

  function saveAdd() {
    if (!addForm.title.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    const target = Number(addForm.target)
    if (!target || target <= 0) { toast.error("Maqsad qiymatini kiriting"); return }

    const gradMap: Record<string, { from: string; to: string; badge: string; icon: string }> = {
      "Sog'liq": { from: 'from-emerald-400', to: 'to-emerald-600', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', icon: 'text-emerald-500' },
      'Moliya':  { from: 'from-blue-400',    to: 'to-blue-600',    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',           icon: 'text-blue-500' },
      "O'qish":  { from: 'from-violet-400',  to: 'to-violet-600',  badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',   icon: 'text-violet-500' },
      'Kasbiy':  { from: 'from-accent-400',  to: 'to-accent-600',  badge: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',   icon: 'text-accent-500' },
      'Shaxsiy': { from: 'from-rose-400',    to: 'to-rose-600',    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',           icon: 'text-rose-500' },
      'Shaxsiy rivojlanish': { from: 'from-pink-400', to: 'to-pink-600', badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300', icon: 'text-pink-500' },
    }
    const theme = gradMap[addForm.category] ?? gradMap["Sog'liq"]
    const newGoal: Goal = {
      id: Date.now(), title: addForm.title, description: addForm.description,
      category: addForm.category, unit: addForm.unit,
      target, current: 0, progress: 0, status: 'active',
      gradFrom: theme.from, gradTo: theme.to,
      badgeBg: theme.badge, iconColor: theme.icon,
      deadline: addForm.deadline ? new Date(addForm.deadline) : undefined,
    }
    setGoals(gs => [newGoal, ...gs])
    toast.success("✅ Yangi maqsad qo'shildi!")
    setAddModal(false)
    setAddForm({ title: '', description: '', category: "Sog'liq", target: '', unit: '%', deadline: '' })
  }

  function togglePause(id: number) {
    const goal = goals.find(g => g.id === id)
    setGoals(gs => gs.map(g =>
      g.id === id ? { ...g, status: g.status === 'paused' ? 'active' : 'paused' } : g
    ))
    toast.success(goal?.status === 'paused' ? '▶ Maqsad davom ettirildi' : "⏸ Maqsad to'xtatildi")
  }

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Maqsadlar</h1>
          <p className="mt-0.5 text-sm text-primary-500 dark:text-primary-400">
            {active.length} ta faol maqsad — o'rtacha {avgPct}% progress
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddModal(true)}>
          Yangi maqsad
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Faol maqsadlar" value={`${active.length} ta`}
          icon={<Target className="h-5 w-5" />} color="primary" />
        <StatCard title="O'rtacha progress" value={`${avgPct}%`}
          change="+5% o'tgan oydan" changeType="up"
          icon={<TrendingUp className="h-5 w-5" />} color="success" />
        <StatCard title="Eng uzun streak" value="7 kun"
          icon={<Flame className="h-5 w-5" />} color="warning" />
        <StatCard title="Bajarilgan" value={`${goals.filter(g => g.status === 'completed').length} ta`}
          icon={<Trophy className="h-5 w-5" />} color="accent" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cn(
              'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition-all',
              cat === c
                ? 'bg-primary-500 text-white shadow-glow-sm'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50',
            )}>
            {c}
          </button>
        ))}
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map(goal => {
          const isOpen  = expanded === goal.id
          const doneMs  = goal.milestones?.filter(m => m.done).length ?? 0
          const totalMs = goal.milestones?.length ?? 0

          return (
            <div key={goal.id} className={cn(
              'group relative overflow-hidden rounded-xl border bg-white transition-all duration-200 dark:bg-primary-800',
              'border-border-light dark:border-primary-700/50',
              'hover:border-primary-300 dark:hover:border-primary-600',
              goal.status === 'paused' && 'opacity-70',
              goal.status === 'completed' && 'border-emerald-200 dark:border-emerald-700',
            )}
            style={{ boxShadow: '0 2px 12px rgba(5,150,105,0.08)' }}>
              {/* Left accent bar */}
              <div className={cn(
                'absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b',
                goal.gradFrom, goal.gradTo,
              )} />

              <div className="p-5 pl-6">
                {/* Top row */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', goal.badgeBg)}>
                      {goal.category}
                    </span>
                    {goal.streak && goal.status === 'active' && (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-accent-500">
                        <Flame className="h-3.5 w-3.5" />{goal.streak} kun streak
                      </span>
                    )}
                    {goal.status === 'paused' && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Pause className="h-3 w-3" /> To'xtatilgan
                      </span>
                    )}
                    {goal.status === 'completed' && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Bajarildi!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="font-mono text-xl font-black text-primary-800 dark:text-primary-100">
                      {goal.progress}%
                    </span>
                    <button
                      onClick={() => togglePause(goal.id)}
                      title={goal.status === 'paused' ? 'Davom ettirish' : "To'xtatish"}
                      className="rounded-lg p-1.5 text-primary-300 opacity-0 transition-all hover:bg-primary-50 hover:text-primary-600 group-hover:opacity-100 dark:hover:bg-primary-700/50 dark:hover:text-primary-200"
                    >
                      {goal.status === 'paused'
                        ? <Play className="h-3.5 w-3.5 text-primary-500" />
                        : <Pause className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="mb-0.5 text-[15px] font-black tracking-tight text-primary-900 dark:text-primary-50">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="mb-3 text-xs text-primary-400 dark:text-primary-500">{goal.description}</p>
                )}

                {/* Progress bar */}
                <div className="mb-2 mt-3">
                  <GoalBar value={goal.progress} gradFrom={goal.gradFrom} gradTo={goal.gradTo} />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-primary-600 dark:text-primary-300">{fmtValue(goal.current, goal.unit)}</span>
                  <span className="text-primary-400">{fmtValue(goal.target, goal.unit)}</span>
                </div>

                {/* Deadline */}
                {goal.deadline && (
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary-400" />
                    <span className="text-xs text-primary-400">Muddat: {formatDate(goal.deadline)}</span>
                  </div>
                )}

                {/* Milestones accordion */}
                {goal.milestones && totalMs > 0 && (
                  <>
                    <button
                      onClick={() => setExp(isOpen ? null : goal.id)}
                      className="mt-3 flex w-full items-center gap-2 rounded-lg border border-border-light bg-primary-50/60 px-3 py-2 text-xs font-bold text-primary-600 transition-all hover:bg-primary-100 dark:border-primary-700/50 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                    >
                      <div className="flex gap-1">
                        {goal.milestones.map((m, i) => (
                          <div key={i} className={cn(
                            'h-1.5 w-4 rounded-full bg-gradient-to-r transition-all',
                            m.done ? `${goal.gradFrom} ${goal.gradTo}` : 'bg-primary-200 dark:bg-primary-700',
                          )} />
                        ))}
                      </div>
                      <span className="flex-1">{doneMs}/{totalMs} bosqich bajarildi</span>
                      {isOpen
                        ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="mt-2 space-y-2 rounded-lg border border-border-light bg-primary-50/60 p-3 dark:border-primary-700/50 dark:bg-primary-900/30">
                        {goal.milestones.map((m, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            {m.done
                              ? <CheckCircle2 className={cn('h-4 w-4 flex-shrink-0', goal.iconColor)} />
                              : <Circle className="h-4 w-4 flex-shrink-0 text-primary-200 dark:text-primary-700" />}
                            <span className={cn(
                              'flex-1 text-xs font-semibold',
                              m.done
                                ? 'text-primary-400 line-through dark:text-primary-600'
                                : 'text-primary-700 dark:text-primary-300',
                            )}>
                              {m.title}
                            </span>
                            {m.done && m.date && (
                              <span className="text-[11px] text-primary-400">{formatDate(m.date)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex gap-2 border-t border-border-light pt-4 dark:border-primary-700/50">
                  {goal.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs"
                      leftIcon={<TrendingUp className="h-3.5 w-3.5" />}
                      onClick={() => openProgress(goal)}
                    >
                      Progress yangilash
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    leftIcon={<Pencil className="h-3.5 w-3.5" />}
                    onClick={() => openEdit(goal)}
                  >
                    Tahrirlash
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add CTA */}
      <button
        onClick={() => setAddModal(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-200 py-5 text-sm font-bold text-primary-400 transition-all hover:border-primary-400 hover:text-primary-600 dark:border-primary-700 dark:hover:border-primary-500 dark:hover:text-primary-300"
      >
        <Plus className="h-5 w-5" /> Yangi maqsad qo'shish
      </button>

      {/* ============================================================
          MODALS — createPortal orqali document.body ga render bo'ladi
          ============================================================ */}

      {/* ── Progress update ──────────────────────────────────────── */}
      <Modal
        open={!!progressModal}
        onClose={() => setProgressModal(null)}
        title="Progress Yangilash"
        description={progressModal?.title}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setProgressModal(null)}>
              Bekor qilish
            </Button>
            <Button size="sm" onClick={saveProgress}>
              Saqlash
            </Button>
          </>
        }
      >
        {progressModal && (
          <div className="space-y-4">
            {/* Current vs Target */}
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3 dark:bg-primary-900/40">
              <div>
                <p className="text-xs font-semibold text-primary-400">Hozirgi holat</p>
                <p className="text-lg font-black text-primary-900 dark:text-primary-50">
                  {fmtValue(progressModal.current, progressModal.unit)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-primary-400">Maqsad</p>
                <p className="text-lg font-black text-primary-900 dark:text-primary-50">
                  {fmtValue(progressModal.target, progressModal.unit)}
                </p>
              </div>
            </div>

            {/* Live preview bar */}
            <div>
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-primary-400">
                <span>Progress</span>
                <span className="font-black text-primary-800 dark:text-primary-100">
                  {Math.min(Math.round((Number(newProgress || 0) / progressModal.target) * 100), 100)}%
                </span>
              </div>
              <GoalBar
                value={Math.min(Math.round((Number(newProgress || 0) / progressModal.target) * 100), 100)}
                gradFrom={progressModal.gradFrom}
                gradTo={progressModal.gradTo}
              />
            </div>

            {/* New value */}
            <Input
              label={`Yangi qiymat (${progressModal.unit})`}
              type="number"
              value={newProgress}
              onChange={e => setNewProgress(e.target.value)}
              min={0}
              max={progressModal.unit === '%' ? 100 : undefined}
              hint={`Maqsad: ${fmtValue(progressModal.target, progressModal.unit)}`}
            />

            {/* Quick add (% only) */}
            {progressModal.unit === '%' && (
              <div>
                <p className="mb-1.5 text-xs font-semibold text-primary-400">Tez qo'shish</p>
                <div className="flex gap-2">
                  {[5, 10, 25].map(inc => (
                    <button
                      key={inc}
                      onClick={() => setNewProgress(prev => String(Math.min(100, Number(prev || 0) + inc)))}
                      className="flex-1 rounded-lg border border-border-light bg-primary-50 py-1.5 text-xs font-bold text-primary-700 transition-all hover:border-primary-400 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                    >
                      +{inc}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Textarea
              label="Izoh (ixtiyoriy)"
              placeholder="Bugun nima qildingiz?"
              value={progressNote}
              onChange={e => setProgressNote(e.target.value)}
              rows={2}
            />
          </div>
        )}
      </Modal>

      {/* ── Edit modal ────────────────────────────────────────── */}
      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Maqsadni Tahrirlash"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditModal(null)}>
              Bekor qilish
            </Button>
            <Button size="sm" onClick={saveEdit}>
              Saqlash
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Sarlavha *"
            value={editForm.title}
            onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Maqsad nomi"
          />
          <Textarea
            label="Tavsif"
            value={editForm.description}
            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Maqsad haqida qisqacha..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Kategoriya</label>
              <select
                value={editForm.category}
                onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                className={selectCls}
              >
                {CAT_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Birlik</label>
              <select
                value={editForm.unit}
                onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                className={selectCls}
              >
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Maqsad qiymati *"
            type="number"
            value={String(editForm.target)}
            onChange={e => setEditForm(f => ({ ...f, target: e.target.value }))}
            placeholder="Masalan: 100, 5000000, 12"
          />
          <Input
            label="Muddat"
            type="date"
            value={editForm.deadline}
            onChange={e => setEditForm(f => ({ ...f, deadline: e.target.value }))}
          />
        </div>
      </Modal>

      {/* ── Add modal ─────────────────────────────────────────── */}
      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Yangi Maqsad Qo'shish"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>
              Bekor qilish
            </Button>
            <Button size="sm" onClick={saveAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Qo'shish
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Sarlavha *"
            value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Masalan: 10 000 qadam yurish"
          />
          <Textarea
            label="Tavsif"
            value={addForm.description}
            onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Maqsad haqida..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Kategoriya</label>
              <select
                value={addForm.category}
                onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                className={selectCls}
              >
                {CAT_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Birlik</label>
              <select
                value={addForm.unit}
                onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                className={selectCls}
              >
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Maqsad qiymati *"
            type="number"
            value={addForm.target}
            onChange={e => setAddForm(f => ({ ...f, target: e.target.value }))}
            placeholder="Masalan: 100"
          />
          <Input
            label="Muddat"
            type="date"
            value={addForm.deadline}
            onChange={e => setAddForm(f => ({ ...f, deadline: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}
