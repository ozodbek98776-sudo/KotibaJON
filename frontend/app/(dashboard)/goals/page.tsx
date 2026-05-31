'use client'

import { useState, useMemo } from 'react'
import {
  Plus, Target, TrendingUp, Calendar, CheckCircle2, Circle,
  Flame, Trophy, ChevronDown, ChevronUp, Pencil, Pause, Play,
  Trash2, LayoutGrid, List, Flag, Zap, Clock, Star,
  MoreHorizontal, X, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Types ──────────────────────────────────────────────────────── */
interface Milestone { id: number; title: string; done: boolean; date?: Date }
interface Goal {
  id: number; title: string; description: string; category: string
  color: string; bgColor: string; textColor: string
  progress: number; target: number; current: number; unit: string
  deadline?: Date; status: 'active' | 'completed' | 'paused'
  streak?: number; milestones: Milestone[]
  createdAt: Date
}
type View   = 'grid' | 'list'
type Status = 'all' | 'active' | 'completed' | 'paused'

/* ── Theme map ──────────────────────────────────────────────────── */
const THEME: Record<string, { color: string; bg: string; text: string; light: string }> = {
  "Sog'liq":              { color:'#10B981', bg:'rgba(16,185,129,0.12)',  text:'#059669', light:'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  'Moliya':               { color:'#3B82F6', bg:'rgba(59,130,246,0.12)',  text:'#2563EB', light:'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  "O'qish":               { color:'#8B5CF6', bg:'rgba(139,92,246,0.12)',  text:'#7C3AED', light:'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' },
  'Kasbiy':               { color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  text:'#D97706', light:'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  'Shaxsiy':              { color:'#EC4899', bg:'rgba(236,72,153,0.12)',  text:'#DB2777', light:'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300' },
  'Shaxsiy rivojlanish':  { color:'#EF4444', bg:'rgba(239,68,68,0.12)',   text:'#DC2626', light:'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300' },
}
const getTheme = (cat: string) => THEME[cat] ?? THEME["Sog'liq"]

/* ── Data ───────────────────────────────────────────────────────── */
const D = Date.now
const INIT: Goal[] = [
  {
    id:1, title:'Har kuni 10 000 qadam yurish', description:"Sog'liqni saqlash uchun kunlik faollik",
    category:"Sog'liq", ...(() => { const t = getTheme("Sog'liq"); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'active', progress:72, target:100, current:72, unit:'%', streak:7, createdAt:new Date('2026-04-01'),
    milestones:[
      { id:1, title:'Birinchi 7 kun ketma-ket', done:true, date:new Date('2026-05-23') },
      { id:2, title:'Birinchi oy (30 kun)',      done:false },
      { id:3, title:'3 oy davomida',             done:false },
    ],
  },
  {
    id:2, title:"5 000 000 so'm jamg'arish", description:'Favqulodda zaxira fondi',
    category:'Moliya', ...(() => { const t = getTheme('Moliya'); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'active', progress:64, target:5000000, current:3200000, unit:"so'm",
    deadline:new Date('2026-09-28'), createdAt:new Date('2026-01-15'),
    milestones:[
      { id:1, title:"1 000 000 so'm",  done:true,  date:new Date('2026-02-15') },
      { id:2, title:"2 500 000 so'm",  done:true,  date:new Date('2026-04-10') },
      { id:3, title:"5 000 000 so'm",  done:false },
    ],
  },
  {
    id:3, title:"Yil davomida 12 ta kitob o'qish", description:'Har oyda kamida 1 ta kitob',
    category:"O'qish", ...(() => { const t = getTheme("O'qish"); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'active', progress:58, target:12, current:7, unit:'ta kitob',
    deadline:new Date('2026-10-27'), createdAt:new Date('2026-01-01'),
    milestones:[
      { id:1, title:'3 ta kitob',  done:true,  date:new Date('2026-03-31') },
      { id:2, title:'6 ta kitob',  done:true,  date:new Date('2026-05-20') },
      { id:3, title:'9 ta kitob',  done:false },
      { id:4, title:'12 ta kitob', done:false },
    ],
  },
  {
    id:4, title:"TypeScript ni o'rganish", description:'Advanced TypeScript patterns va generics',
    category:'Kasbiy', ...(() => { const t = getTheme('Kasbiy'); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'active', progress:85, target:100, current:85, unit:'%',
    deadline:new Date('2026-06-29'), createdAt:new Date('2026-03-01'),
    milestones:[
      { id:1, title:'Basics',    done:true, date:new Date('2026-03-15') },
      { id:2, title:'Generics',  done:true, date:new Date('2026-04-20') },
      { id:3, title:'Advanced',  done:false },
    ],
  },
  {
    id:5, title:'Ingliz tilini B2 darajasiga yetkazish', description:'IELTS tayyorgarlik',
    category:"O'qish", ...(() => { const t = getTheme("O'qish"); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'paused', progress:40, target:100, current:40, unit:'%',
    deadline:new Date('2026-12-16'), createdAt:new Date('2026-02-01'),
    milestones:[
      { id:1, title:'A2 darajasi', done:true,  date:new Date('2026-03-01') },
      { id:2, title:'B1 darajasi', done:false },
      { id:3, title:'B2 darajasi', done:false },
    ],
  },
  {
    id:6, title:"5 kg vazn yo'qotish", description:"Sport va to'g'ri ovqatlanish bilan",
    category:"Sog'liq", ...(() => { const t = getTheme("Sog'liq"); return { color:t.color, bgColor:t.bg, textColor:t.text } })(),
    status:'completed', progress:100, target:5, current:5, unit:'kg',
    deadline:new Date('2026-05-01'), createdAt:new Date('2026-02-01'),
    milestones:[
      { id:1, title:'1 kg',  done:true, date:new Date('2026-02-20') },
      { id:2, title:'3 kg',  done:true, date:new Date('2026-03-25') },
      { id:3, title:'5 kg',  done:true, date:new Date('2026-04-28') },
    ],
  },
]

const CATS  = ["Sog'liq", 'Moliya', "O'qish", 'Kasbiy', 'Shaxsiy', 'Shaxsiy rivojlanish']
const UNITS = ['%', "so'm", 'ta', 'km', 'soat', 'kun', 'kg', 'ta kitob', 'bet', 'marta']
const SEL   = cn(
  'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-all',
  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/[0.10]',
  'text-neutral-900 dark:text-white',
  'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-500/20',
)
const LBL = 'mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200'

/* ── Helpers ────────────────────────────────────────────────────── */
function fmtVal(val: number, unit: string) {
  return unit === "so'm" ? formatCurrency(val) : `${val} ${unit}`
}
function daysLeft(deadline: Date) {
  return Math.ceil((deadline.getTime() - Date.now()) / 86400000)
}

/* ── Radial progress ring ────────────────────────────────────────── */
function RadialRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
        strokeWidth={4} className="text-neutral-200 dark:text-white/[0.10]"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={4} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition:'stroke-dasharray 0.7s ease' }}/>
    </svg>
  )
}

/* ================================================================
   PAGE
   ================================================================ */
export default function GoalsPage() {
  const [goals, setGoals]           = useState<Goal[]>(INIT)
  const [view, setView]             = useState<View>('grid')
  const [statusFilter, setStatus]   = useState<Status>('all')
  const [catFilter, setCat]         = useState('Barchasi')
  const [expanded, setExp]          = useState<number | null>(null)
  const [menuOpen, setMenu]         = useState<number | null>(null)

  /* modals */
  const [progressModal, setProgressModal] = useState<Goal | null>(null)
  const [editModal, setEditModal]         = useState<Goal | null>(null)
  const [deleteModal, setDeleteModal]     = useState<Goal | null>(null)
  const [addModal, setAddModal]           = useState(false)
  const [addMsGoal, setAddMsGoal]         = useState<number | null>(null)
  const [newMs, setNewMs]                 = useState('')

  /* forms */
  const [progress, setProgress] = useState('')
  const [progressNote, setProgressNote] = useState('')
  const emptyForm = { title:'', description:'', category:"Sog'liq", target:'', unit:'%', deadline:'' }
  const [addForm, setAddForm]   = useState({ ...emptyForm })
  const [editForm, setEditForm] = useState({ ...emptyForm })

  /* ── Derived ─────────────────────────────────────────────────── */
  const allCats = useMemo(() => ['Barchasi', ...new Set(goals.map(g => g.category))], [goals])
  const filtered = useMemo(() => goals.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (catFilter !== 'Barchasi' && g.category !== catFilter) return false
    return true
  }), [goals, statusFilter, catFilter])

  const active    = goals.filter(g => g.status === 'active')
  const completed = goals.filter(g => g.status === 'completed')
  const avgPct    = active.length ? Math.round(active.reduce((s,g)=>s+g.progress,0)/active.length) : 0
  const maxStreak = Math.max(...goals.map(g=>g.streak||0), 0)
  const urgentCount = active.filter(g => g.deadline && daysLeft(g.deadline) <= 7).length

  /* ── Actions ─────────────────────────────────────────────────── */
  function saveProgress() {
    if (!progressModal) return
    const val = Number(progress)
    if (isNaN(val) || val < 0) { toast.error("Noto'g'ri qiymat"); return }
    const pct = Math.min(Math.round((val / progressModal.target) * 100), 100)
    setGoals(gs => gs.map(g => g.id === progressModal.id
      ? { ...g, current:val, progress:pct, status:pct>=100?'completed':g.status }
      : g))
    toast.success(pct >= 100 ? 'Maqsad bajarildi!' : 'Progress yangilandi!')
    setProgressModal(null)
  }

  function openEdit(goal: Goal) {
    setEditForm({
      title:goal.title, description:goal.description, category:goal.category,
      target:String(goal.target), unit:goal.unit,
      deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : '',
    })
    setEditModal(goal); setMenu(null)
  }

  function saveEdit() {
    if (!editModal) return
    if (!editForm.title?.trim()) { toast.error('Sarlavha majburiy'); return }
    const th = getTheme(editForm.category)
    setGoals(gs => gs.map(g => g.id === editModal.id ? {
      ...g, title:editForm.title, description:editForm.description,
      category:editForm.category, color:th.color, bgColor:th.bg, textColor:th.text,
      target:Number(editForm.target)||g.target, unit:editForm.unit,
      deadline:editForm.deadline ? new Date(editForm.deadline) : g.deadline,
    } : g))
    toast.success('Maqsad yangilandi!')
    setEditModal(null)
  }

  function saveAdd() {
    if (!addForm.title.trim()) { toast.error('Sarlavha majburiy'); return }
    if (!addForm.target || Number(addForm.target) <= 0) { toast.error('Maqsad qiymati majburiy'); return }
    const th = getTheme(addForm.category)
    const newGoal: Goal = {
      id:Date.now(), title:addForm.title, description:addForm.description,
      category:addForm.category, color:th.color, bgColor:th.bg, textColor:th.text,
      target:Number(addForm.target), current:0, progress:0, unit:addForm.unit,
      status:'active', milestones:[], createdAt:new Date(),
      deadline:addForm.deadline ? new Date(addForm.deadline) : undefined,
    }
    setGoals(gs => [newGoal, ...gs])
    toast.success("Yangi maqsad qo'shildi!")
    setAddModal(false); setAddForm({ ...emptyForm })
  }

  function confirmDelete() {
    if (!deleteModal) return
    setGoals(gs => gs.filter(g => g.id !== deleteModal.id))
    toast.success('Maqsad o\'chirildi')
    setDeleteModal(null)
  }

  function togglePause(id: number) {
    setGoals(gs => gs.map(g => g.id === id
      ? { ...g, status: g.status === 'paused' ? 'active' : 'paused' } : g))
    const g = goals.find(g => g.id === id)
    toast.success(g?.status === 'paused' ? 'Davom ettirildi' : 'To\'xtatildi')
    setMenu(null)
  }

  function toggleMilestone(goalId: number, msId: number) {
    setGoals(gs => gs.map(g => g.id !== goalId ? g : {
      ...g, milestones: g.milestones.map(m =>
        m.id === msId ? { ...m, done:!m.done, date:!m.done?new Date():undefined } : m
      )
    }))
  }

  function deleteMilestone(goalId: number, msId: number) {
    setGoals(gs => gs.map(g => g.id !== goalId ? g : {
      ...g, milestones: g.milestones.filter(m => m.id !== msId)
    }))
  }

  function addMilestone(goalId: number) {
    if (!newMs.trim()) return
    setGoals(gs => gs.map(g => g.id !== goalId ? g : {
      ...g, milestones: [...g.milestones, { id:Date.now(), title:newMs.trim(), done:false }]
    }))
    setNewMs(''); setAddMsGoal(null)
    toast.success("Bosqich qo'shildi!")
  }

  /* ── Status counts ─────────────────────────────────────────────── */
  const STATUS_TABS: { key: Status; label: string; count: number }[] = [
    { key:'all',       label:'Barchasi',      count:goals.length },
    { key:'active',    label:'Faol',          count:active.length },
    { key:'completed', label:'Bajarilgan',    count:completed.length },
    { key:'paused',    label:"To'xtatilgan",  count:goals.filter(g=>g.status==='paused').length },
  ]

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="space-y-6 animate-fade-in" onClick={()=>menuOpen&&setMenu(null)}>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Maqsadlar</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {active.length} ta faol · o'rtacha {avgPct}% progress
            {urgentCount > 0 && (
              <span className="ml-2 text-amber-500 font-bold">· {urgentCount} ta deadline yaqin!</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.06]">
            <button onClick={()=>setView('grid')}
              className={cn('p-1.5 rounded-lg transition-all',
                view==='grid'?'bg-white dark:bg-white/[0.13] text-neutral-900 dark:text-white shadow-sm':
                'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300')}>
              <LayoutGrid className="w-4 h-4"/>
            </button>
            <button onClick={()=>setView('list')}
              className={cn('p-1.5 rounded-lg transition-all',
                view==='list'?'bg-white dark:bg-white/[0.13] text-neutral-900 dark:text-white shadow-sm':
                'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300')}>
              <List className="w-4 h-4"/>
            </button>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setAddModal(true)}>
            Yangi maqsad
          </Button>
        </div>
      </div>

      {/* ══ STAT CARDS ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Faol maqsadlar',    value:`${active.length} ta`,      sub:`${completed.length} ta bajarilgan`, icon:<Target className="w-4 h-4"/>,      bg:'rgba(16,185,129,0.12)', color:'#10B981' },
          { label:"O'rtacha progress", value:`${avgPct}%`,               sub:'+5% o\'tgan oydan',                  icon:<TrendingUp className="w-4 h-4"/>,   bg:'rgba(59,130,246,0.12)', color:'#3B82F6' },
          { label:'Eng uzun streak',   value:`${maxStreak} kun`,         sub:'Ketma-ket faollik',                   icon:<Flame className="w-4 h-4"/>,        bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
          { label:'Jami maqsad',       value:`${goals.length} ta`,       sub:`${urgentCount} ta yaqin muddat`,     icon:<Trophy className="w-4 h-4"/>,       bg:'rgba(139,92,246,0.12)', color:'#8B5CF6' },
        ].map(s => (
          <div key={s.label}
            className="rounded-2xl border p-4 bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08] transition-colors"
            style={{ boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
                <p className="text-xl font-black text-neutral-900 dark:text-white font-mono">{s.value}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 truncate">{s.sub}</p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ FILTERS ═════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] w-fit">
          {STATUS_TABS.map(t => (
            <button key={t.key} onClick={()=>setStatus(t.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all',
                statusFilter===t.key
                  ? 'bg-white dark:bg-white/[0.13] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
              )}>
              {t.label}
              <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded-full',
                statusFilter===t.key?'bg-neutral-200 dark:bg-white/20 text-neutral-700 dark:text-white':
                'bg-neutral-200/70 dark:bg-white/[0.10] text-neutral-500 dark:text-neutral-400')}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allCats.map(c => {
            const th = c !== 'Barchasi' ? getTheme(c) : null
            return (
              <button key={c} onClick={()=>setCat(c)}
                className={cn(
                  'whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border',
                  catFilter===c && th
                    ? 'text-white border-transparent'
                    : catFilter===c
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                    : 'bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/[0.10] hover:border-neutral-300 dark:hover:border-white/20',
                )}
                style={catFilter===c && th ? { background:th.color } : {}}>
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ EMPTY STATE ══════════════════════════════════════════ */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08] p-12 text-center"
          style={{ boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }}>
          <Target className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3"/>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-1">Maqsad topilmadi</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4">Filtr yoki kategoriyani o'zgartiring</p>
          <Button size="sm" onClick={()=>setAddModal(true)} leftIcon={<Plus className="w-4 h-4"/>}>
            Yangi maqsad qo'shish
          </Button>
        </div>
      )}

      {/* ══ GOAL CARDS ══════════════════════════════════════════ */}
      <div className={cn(view==='grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'flex flex-col gap-3')}>
        {filtered.map(goal => {
          const isOpen   = expanded === goal.id
          const doneMs   = goal.milestones.filter(m=>m.done).length
          const totalMs  = goal.milestones.length
          const dl       = goal.deadline ? daysLeft(goal.deadline) : null
          const isUrgent = dl !== null && dl <= 7 && goal.status === 'active'
          const isAddingMs = addMsGoal === goal.id
          const th = getTheme(goal.category)

          return (
            <div key={goal.id}
              className={cn(
                'group relative rounded-2xl border transition-all duration-200 overflow-hidden',
                'bg-white dark:bg-[#111111]',
                goal.status==='completed'
                  ? 'border-emerald-200 dark:border-emerald-500/25'
                  : isUrgent
                  ? 'border-amber-200 dark:border-amber-500/25'
                  : 'border-neutral-200 dark:border-white/[0.08]',
                goal.status==='paused' && 'opacity-65',
                'hover:border-neutral-300 dark:hover:border-white/[0.16]',
              )}
              style={{ boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}>

              {/* Top color bar */}
              <div className="h-1 w-full" style={{ background:`linear-gradient(90deg, ${th.color}, ${th.color}88)` }}/>

              <div className="p-5">
                {/* ── Top row ────────────────────────────────── */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Progress ring */}
                  <div className="relative flex-shrink-0">
                    <RadialRing pct={goal.progress} color={th.color} size={52}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-black text-neutral-700 dark:text-white">{goal.progress}%</span>
                    </div>
                  </div>

                  {/* Title area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', th.light)}>
                        {goal.category}
                      </span>
                      {goal.status==='completed' && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3"/> Bajarildi
                        </span>
                      )}
                      {goal.status==='paused' && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Pause className="w-3 h-3"/> To'xtatilgan
                        </span>
                      )}
                      {isUrgent && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3"/> {dl} kun qoldi!
                        </span>
                      )}
                    </div>
                    <h3 className="text-[15px] font-black text-neutral-900 dark:text-white tracking-tight leading-snug">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 line-clamp-1">{goal.description}</p>
                    )}
                  </div>

                  {/* Context menu */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={e=>{ e.stopPropagation(); setMenu(menuOpen===goal.id?null:goal.id) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-700 dark:hover:text-neutral-200 transition-all">
                      <MoreHorizontal className="w-4 h-4"/>
                    </button>
                    {menuOpen===goal.id && (
                      <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border bg-white dark:bg-[#1A1A1A] border-neutral-200 dark:border-white/[0.10] shadow-lg py-1"
                        onClick={e=>e.stopPropagation()}>
                        {goal.status!=='completed' && (
                          <button onClick={()=>{ setProgress(String(goal.current)); setProgressNote(''); setProgressModal(goal); setMenu(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.06]">
                            <TrendingUp className="w-4 h-4 text-emerald-500"/> Progress yangilash
                          </button>
                        )}
                        <button onClick={()=>openEdit(goal)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.06]">
                          <Pencil className="w-4 h-4 text-blue-500"/> Tahrirlash
                        </button>
                        <button onClick={()=>togglePause(goal.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.06]">
                          {goal.status==='paused'
                            ? <><Play className="w-4 h-4 text-amber-500"/> Davom ettirish</>
                            : <><Pause className="w-4 h-4 text-amber-500"/> To'xtatish</>}
                        </button>
                        <div className="my-1 border-t border-neutral-100 dark:border-white/[0.06]"/>
                        <button onClick={()=>{ setDeleteModal(goal); setMenu(null) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4"/> O'chirish
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Progress bar ──────────────────────────── */}
                <div className="mb-3">
                  <div className="h-2 w-full rounded-full overflow-hidden bg-neutral-100 dark:bg-white/[0.08] mb-1.5">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${Math.min(goal.progress,100)}%`, background:`linear-gradient(90deg,${th.color},${th.color}99)` }}/>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-neutral-600 dark:text-neutral-300 font-mono">{fmtVal(goal.current, goal.unit)}</span>
                    <span className="text-neutral-400 dark:text-neutral-500 font-mono">{fmtVal(goal.target, goal.unit)}</span>
                  </div>
                </div>

                {/* ── Meta info ─────────────────────────────── */}
                <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 mb-3">
                  {goal.deadline && (
                    <span className={cn('flex items-center gap-1',isUrgent&&'text-amber-500 dark:text-amber-400 font-semibold')}>
                      <Calendar className="w-3.5 h-3.5"/>
                      {dl !== null && dl > 0 ? `${dl} kun qoldi` : dl === 0 ? 'Bugun!' : 'Muddati o\'tdi'}
                    </span>
                  )}
                  {goal.streak && goal.status==='active' && (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Flame className="w-3.5 h-3.5"/> {goal.streak} kun
                    </span>
                  )}
                  {totalMs > 0 && (
                    <span className="flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5"/> {doneMs}/{totalMs} bosqich
                    </span>
                  )}
                </div>

                {/* ── Milestones ────────────────────────────── */}
                {(totalMs > 0 || isAddingMs) && (
                  <div className="mb-3">
                    <button
                      onClick={()=>setExp(isOpen?null:goal.id)}
                      className={cn(
                        'w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all',
                        'bg-neutral-50 dark:bg-white/[0.05] border border-neutral-100 dark:border-white/[0.07]',
                        'text-neutral-600 dark:text-neutral-300',
                        'hover:bg-neutral-100 dark:hover:bg-white/[0.09]',
                      )}>
                      {/* mini milestone dots */}
                      <div className="flex gap-1">
                        {goal.milestones.slice(0,6).map((m,i)=>(
                          <div key={i} className="w-3.5 h-1.5 rounded-full transition-all"
                            style={{ background:m.done?th.color:'rgba(148,163,184,0.3)' }}/>
                        ))}
                      </div>
                      <span className="flex-1 text-left">{doneMs}/{totalMs} bosqich bajarildi</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
                    </button>

                    {isOpen && (
                      <div className="mt-2 rounded-xl border border-neutral-100 dark:border-white/[0.07] overflow-hidden bg-neutral-50 dark:bg-white/[0.03]">
                        {goal.milestones.map(m=>(
                          <div key={m.id} className="flex items-center gap-2.5 px-3 py-2.5 border-b border-neutral-100 dark:border-white/[0.05] last:border-0 group/ms hover:bg-white dark:hover:bg-white/[0.05] transition-colors">
                            <button onClick={()=>toggleMilestone(goal.id,m.id)}
                              className="flex-shrink-0 transition-all hover:scale-110">
                              {m.done
                                ? <CheckCircle2 className="w-4 h-4" style={{ color:th.color }}/>
                                : <Circle className="w-4 h-4 text-neutral-300 dark:text-neutral-600"/>}
                            </button>
                            <span className={cn('flex-1 text-xs font-semibold transition-all',
                              m.done?'line-through text-neutral-400 dark:text-neutral-500':'text-neutral-700 dark:text-neutral-200')}>
                              {m.title}
                            </span>
                            {m.done && m.date && (
                              <span className="text-[10px] text-neutral-400">{formatDate(m.date)}</span>
                            )}
                            <button onClick={()=>deleteMilestone(goal.id,m.id)}
                              className="opacity-0 group-hover/ms:opacity-100 w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                              <X className="w-3 h-3"/>
                            </button>
                          </div>
                        ))}

                        {/* Add milestone input */}
                        {isAddingMs ? (
                          <div className="flex items-center gap-2 px-3 py-2">
                            <input value={newMs} onChange={e=>setNewMs(e.target.value)}
                              onKeyDown={e=>{ if(e.key==='Enter') addMilestone(goal.id); if(e.key==='Escape') setAddMsGoal(null) }}
                              autoFocus
                              placeholder="Bosqich nomi..."
                              className={cn(
                                'flex-1 text-xs font-semibold h-7 px-2.5 rounded-lg border outline-none transition-all',
                                'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10',
                                'text-neutral-900 dark:text-white placeholder-neutral-400',
                                'focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 dark:focus:ring-emerald-500/20',
                              )}
                            />
                            <button onClick={()=>addMilestone(goal.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
                              <Check className="w-3.5 h-3.5"/>
                            </button>
                            <button onClick={()=>setAddMsGoal(null)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all">
                              <X className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        ) : (
                          <button onClick={()=>setAddMsGoal(goal.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-white dark:hover:bg-white/[0.05] transition-all">
                            <Plus className="w-3.5 h-3.5"/> Bosqich qo'shish
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Action buttons ───────────────────────── */}
                <div className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-white/[0.06]">
                  {goal.status!=='completed' && (
                    <button
                      onClick={()=>{ setProgress(String(goal.current)); setProgressNote(''); setProgressModal(goal) }}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl text-xs font-bold transition-all',
                        'text-white',
                      )}
                      style={{ background:`linear-gradient(135deg, ${th.color}, ${th.color}cc)` }}>
                      <Zap className="w-3.5 h-3.5"/> Progress yangilash
                    </button>
                  )}
                  {!isOpen && totalMs === 0 && (
                    <button onClick={()=>{ setExp(goal.id); setAddMsGoal(goal.id) }}
                      className={cn(
                        'flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition-all',
                        'bg-neutral-100 dark:bg-white/[0.07] text-neutral-600 dark:text-neutral-300',
                        'hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
                      )}>
                      <Flag className="w-3.5 h-3.5"/> Bosqich
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add CTA */}
      {filtered.length > 0 && (
        <button onClick={()=>setAddModal(true)}
          className={cn(
            'w-full py-4 text-sm font-bold rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2',
            'text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-white/[0.10]',
            'hover:border-emerald-400 dark:hover:border-emerald-500',
            'hover:text-emerald-600 dark:hover:text-emerald-400',
            'hover:bg-emerald-50/50 dark:hover:bg-emerald-500/[0.05]',
          )}>
          <Plus className="w-5 h-5"/> Yangi maqsad qo'shish
        </button>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: PROGRESS UPDATE
          ═══════════════════════════════════════════════════════════ */}
      <Modal open={!!progressModal} onClose={()=>setProgressModal(null)}
        title="Progress Yangilash" description={progressModal?.title} size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setProgressModal(null)}>Bekor</Button>
            <Button size="sm" onClick={saveProgress} leftIcon={<Zap className="w-4 h-4"/>}>Saqlash</Button>
          </>
        }>
        {progressModal && (() => {
          const th = getTheme(progressModal.category)
          const previewPct = Math.min(Math.round((Number(progress||0)/progressModal.target)*100), 100)
          return (
            <div className="space-y-4">
              {/* Current vs Target */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 bg-neutral-50 dark:bg-white/[0.06] text-center">
                  <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 mb-0.5">Hozirgi</p>
                  <p className="text-lg font-black text-neutral-900 dark:text-white font-mono">
                    {fmtVal(progressModal.current, progressModal.unit)}
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-neutral-50 dark:bg-white/[0.06] text-center">
                  <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 mb-0.5">Maqsad</p>
                  <p className="text-lg font-black text-neutral-900 dark:text-white font-mono">
                    {fmtVal(progressModal.target, progressModal.unit)}
                  </p>
                </div>
              </div>

              {/* Live preview */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5">
                  <span>Progress ko'rinishi</span>
                  <span className="font-black" style={{ color:th.color }}>{previewPct}%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width:`${previewPct}%`, background:`linear-gradient(90deg,${th.color},${th.color}99)` }}/>
                </div>
              </div>

              <Input label={`Yangi qiymat (${progressModal.unit}) *`} type="number"
                value={progress} onChange={e=>setProgress(e.target.value)}
                hint={`Maqsad: ${fmtVal(progressModal.target, progressModal.unit)}`}
                placeholder="0"/>

              {/* Quick add */}
              {progressModal.unit==='%' && (
                <div>
                  <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2">Tez qo'shish</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[5,10,20,25].map(inc=>(
                      <button key={inc}
                        onClick={()=>setProgress(p=>String(Math.min(100,Number(p||0)+inc)))}
                        className="h-8 rounded-xl text-xs font-bold bg-neutral-100 dark:bg-white/[0.07] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-white/[0.12] transition-all">
                        +{inc}%
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Textarea label="Izoh (ixtiyoriy)" placeholder="Bugun nima qildingiz?"
                value={progressNote} onChange={e=>setProgressNote(e.target.value)} rows={2}/>
            </div>
          )
        })()}
      </Modal>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: ADD / EDIT (shared GoalForm)
          ═══════════════════════════════════════════════════════════ */}
      {[
        { open:addModal,   title:"Yangi Maqsad Qo'shish", form:addForm,  setForm:(f:any)=>setAddForm(f),  onSave:saveAdd,  onClose:()=>setAddModal(false)  },
        { open:!!editModal,title:"Maqsadni Tahrirlash",   form:editForm, setForm:(f:any)=>setEditForm(f), onSave:saveEdit, onClose:()=>setEditModal(null) },
      ].map(({ open, title, form, setForm, onSave, onClose })=>(
        <Modal key={title} open={open} onClose={onClose} title={title} size="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>Bekor qilish</Button>
              <Button size="sm" onClick={onSave} leftIcon={<Check className="w-4 h-4"/>}>
                {title.includes('Yangi') ? "Qo'shish" : 'Saqlash'}
              </Button>
            </>
          }>
          <div className="space-y-4">
            <Input label="Sarlavha *" value={form.title}
              onChange={e=>setForm((f:any)=>({...f,title:e.target.value}))}
              placeholder="Masalan: 10 000 qadam yurish"/>
            <Textarea label="Tavsif" value={form.description}
              onChange={e=>setForm((f:any)=>({...f,description:e.target.value}))}
              placeholder="Maqsad haqida qisqacha..." rows={2}/>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LBL}>Kategoriya</label>
                <select value={form.category} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))} className={SEL}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={LBL}>Birlik</label>
                <select value={form.unit} onChange={e=>setForm((f:any)=>({...f,unit:e.target.value}))} className={SEL}>
                  {UNITS.map(u=><option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Maqsad qiymati *" type="number" value={form.target}
                onChange={e=>setForm((f:any)=>({...f,target:e.target.value}))}
                placeholder="Masalan: 100"/>
              <Input label="Muddat (ixtiyoriy)" type="date" value={form.deadline}
                onChange={e=>setForm((f:any)=>({...f,deadline:e.target.value}))}/>
            </div>
            {/* Category preview */}
            {form.category && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background:getTheme(form.category).bg }}>
                <div className="w-3 h-3 rounded-full" style={{ background:getTheme(form.category).color }}/>
                <span className="text-sm font-bold" style={{ color:getTheme(form.category).text }}>
                  {form.category}
                </span>
              </div>
            )}
          </div>
        </Modal>
      ))}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: DELETE CONFIRM
          ═══════════════════════════════════════════════════════════ */}
      <Modal open={!!deleteModal} onClose={()=>setDeleteModal(null)} title="Maqsadni o'chirish" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setDeleteModal(null)}>Bekor</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} leftIcon={<Trash2 className="w-4 h-4"/>}>
              O'chirish
            </Button>
          </>
        }>
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500"/>
          </div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            "{deleteModal?.title}"
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.</p>
        </div>
      </Modal>
    </div>
  )
}
