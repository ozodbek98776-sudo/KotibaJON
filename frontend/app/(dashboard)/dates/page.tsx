'use client'

import { useState, useMemo } from 'react'
import {
  Plus, Calendar, Gift, Heart, CreditCard, Star, Bell,
  Trash2, Pencil, Search, Clock, AlertTriangle, Check,
  X, RefreshCw, User, ChevronDown, Repeat, Banknote,
  PartyPopper, Cake, Building2, MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatDate, getDaysUntil } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

/* ── Types ──────────────────────────────────────────────────────── */
type DateType = 'birthday' | 'anniversary' | 'payment' | 'holiday' | 'other'
interface ImportantDate {
  id: number
  title: string
  personName?: string
  date: Date
  type: DateType
  remindDays: number[]
  notes?: string
  amount?: number
  recurring: boolean
  year?: number
}

/* ── Type config ─────────────────────────────────────────────────── */
const TYPE_CFG: Record<DateType, {
  icon: React.ReactNode; label: string
  color: string; bg: string; border: string; accent: string
}> = {
  birthday: {
    icon: <Cake className="w-4 h-4"/>,
    label: "Tug'ilgan kun",
    color:  'text-pink-600 dark:text-pink-400',
    bg:     'bg-pink-50 dark:bg-pink-500/10',
    border: 'border-pink-200 dark:border-pink-500/25',
    accent: '#EC4899',
  },
  anniversary: {
    icon: <Heart className="w-4 h-4"/>,
    label: 'Yillik sana',
    color:  'text-red-600 dark:text-red-400',
    bg:     'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/25',
    accent: '#EF4444',
  },
  payment: {
    icon: <CreditCard className="w-4 h-4"/>,
    label: "To'lov",
    color:  'text-blue-600 dark:text-blue-400',
    bg:     'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/25',
    accent: '#3B82F6',
  },
  holiday: {
    icon: <PartyPopper className="w-4 h-4"/>,
    label: 'Bayram',
    color:  'text-amber-600 dark:text-amber-400',
    bg:     'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/25',
    accent: '#F59E0B',
  },
  other: {
    icon: <Star className="w-4 h-4"/>,
    label: 'Boshqa',
    color:  'text-purple-600 dark:text-purple-400',
    bg:     'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/25',
    accent: '#8B5CF6',
  },
}

/* ── Initial data ────────────────────────────────────────────────── */
const D = Date.now
const INIT: ImportantDate[] = []

const REMIND_OPTIONS = [1, 3, 7, 14, 30]
const SEL = cn(
  'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-all',
  'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/[0.10]',
  'text-neutral-900 dark:text-white',
  'focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
)
const LBL = 'mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200'

/* ── Helpers ─────────────────────────────────────────────────────── */
function urgencyLevel(days: number): 'today' | 'critical' | 'soon' | 'near' | 'normal' {
  if (days === 0) return 'today'
  if (days <= 3)  return 'critical'
  if (days <= 7)  return 'soon'
  if (days <= 30) return 'near'
  return 'normal'
}

function urgencyStyle(level: ReturnType<typeof urgencyLevel>) {
  switch (level) {
    case 'today':    return { badge:'bg-red-500 text-white', text:'Bugun!', counter:'text-red-500' }
    case 'critical': return { badge:'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400', text:`3 kun`, counter:'text-red-500' }
    case 'soon':     return { badge:'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', text:`7 kun`, counter:'text-amber-500' }
    case 'near':     return { badge:'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', text:`30 kun`, counter:'text-blue-500' }
    default:         return { badge:'bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400', text:'', counter:'text-neutral-700 dark:text-white' }
  }
}

function calcAge(year: number): number {
  return new Date().getFullYear() - year + 1
}

function calcAnniversary(year: number): number {
  return new Date().getFullYear() - year + 1
}

const EMPTY_FORM = {
  title:'', personName:'', date:'',
  type:'birthday' as DateType,
  notes:'', amount:'', recurring:true, year:'',
  remindDays:[1,3,7] as number[],
}

/* ================================================================
   PAGE
   ================================================================ */
export default function DatesPage() {
  const [dates, setDates]     = useState<ImportantDate[]>(INIT)
  const [search, setSearch]   = useState('')
  const [typeFilter, setType] = useState<DateType | 'all'>('all')
  const [menuId, setMenuId]   = useState<number | null>(null)

  const [addModal, setAddModal]       = useState(false)
  const [editDate, setEditDate]       = useState<ImportantDate | null>(null)
  const [deleteDate, setDeleteDate]   = useState<ImportantDate | null>(null)

  const [addForm, setAddForm]   = useState({ ...EMPTY_FORM })
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM })

  /* ── Derived ─────────────────────────────────────────────────── */
  const sorted = useMemo(() => [...dates].sort((a,b) => getDaysUntil(a.date) - getDaysUntil(b.date)), [dates])

  const filtered = useMemo(() => sorted.filter(d => {
    if (typeFilter !== 'all' && d.type !== typeFilter) return false
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) &&
        !(d.personName?.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  }), [sorted, typeFilter, search])

  const today     = dates.filter(d => getDaysUntil(d.date) === 0).length
  const thisWeek  = dates.filter(d => getDaysUntil(d.date) <= 7).length
  const thisMonth = dates.filter(d => getDaysUntil(d.date) <= 30).length
  const birthdays = dates.filter(d => d.type === 'birthday').length

  /* ── Actions ─────────────────────────────────────────────────── */
  function toggleRemind(form: typeof addForm, day: number, setForm: (f:any)=>void) {
    const has = form.remindDays.includes(day)
    setForm((f: any) => ({ ...f, remindDays: has ? f.remindDays.filter((d:number)=>d!==day) : [...f.remindDays, day].sort((a:number,b:number)=>a-b) }))
  }

  function saveAdd() {
    if (!addForm.title.trim()) { toast.error('Nomi majburiy'); return }
    if (!addForm.date)          { toast.error('Sana majburiy'); return }
    const newD: ImportantDate = {
      id:Date.now(), title:addForm.title.trim(),
      personName:addForm.personName.trim()||undefined,
      date:new Date(addForm.date), type:addForm.type,
      remindDays:addForm.remindDays, notes:addForm.notes.trim()||undefined,
      amount:addForm.amount?Number(addForm.amount):undefined,
      recurring:addForm.recurring,
      year:addForm.year?Number(addForm.year):undefined,
    }
    setDates(ds=>[...ds,newD])
    toast.success("Sana qo'shildi!")
    setAddModal(false); setAddForm({...EMPTY_FORM})
  }

  function openEdit(d: ImportantDate) {
    setEditDate(d)
    setEditForm({
      title:d.title, personName:d.personName||'',
      date:d.date.toISOString().split('T')[0],
      type:d.type, notes:d.notes||'',
      amount:d.amount?String(d.amount):'',
      recurring:d.recurring, year:d.year?String(d.year):'',
      remindDays:[...d.remindDays],
    })
    setMenuId(null)
  }

  function saveEdit() {
    if (!editDate) return
    if (!editForm.title.trim()) { toast.error('Nomi majburiy'); return }
    setDates(ds=>ds.map(d=>d.id!==editDate.id?d:{
      ...d, title:editForm.title.trim(),
      personName:editForm.personName.trim()||undefined,
      date:new Date(editForm.date), type:editForm.type,
      remindDays:editForm.remindDays, notes:editForm.notes.trim()||undefined,
      amount:editForm.amount?Number(editForm.amount):undefined,
      recurring:editForm.recurring,
      year:editForm.year?Number(editForm.year):undefined,
    }))
    toast.success('Yangilandi!')
    setEditDate(null)
  }

  function confirmDelete() {
    if (!deleteDate) return
    setDates(ds=>ds.filter(d=>d.id!==deleteDate.id))
    toast.success("O'chirildi!")
    setDeleteDate(null)
  }

  /* ── Type filter pills ─────────────────────────────────────────── */
  const TYPE_FILTERS: { key: DateType | 'all'; label: string; count: number }[] = ([
    { key:'all'         as const, label:'Barchasi',        count:dates.length },
    { key:'birthday'    as const, label:"Tug'ilgan kun",   count:dates.filter(d=>d.type==='birthday').length },
    { key:'anniversary' as const, label:'Yillik',           count:dates.filter(d=>d.type==='anniversary').length },
    { key:'payment'     as const, label:"To'lov",           count:dates.filter(d=>d.type==='payment').length },
    { key:'holiday'     as const, label:'Bayram',            count:dates.filter(d=>d.type==='holiday').length },
    { key:'other'       as const, label:'Boshqa',            count:dates.filter(d=>d.type==='other').length },
  ] as { key: DateType | 'all'; label: string; count: number }[]).filter(f => f.key === 'all' || f.count > 0)

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="space-y-6 animate-fade-in" onClick={()=>menuId&&setMenuId(null)}>

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Muhim Sanalar</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {dates.length} ta sana
            {thisWeek > 0 && <span className="ml-1.5 text-amber-500 font-bold">· {thisWeek} ta bu hafta</span>}
            {today > 0   && <span className="ml-1.5 text-red-500 font-bold">· {today} ta bugun!</span>}
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>{ setAddForm({...EMPTY_FORM}); setAddModal(true) }}>
          Sana qo'shish
        </Button>
      </div>

      {/* ══ STAT CARDS ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Jami sanalar',     value:`${dates.length} ta`,    sub:'Hammasi',         icon:<Calendar className="w-4 h-4"/>,       bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
          { label:'Bu hafta',         value:`${thisWeek} ta`,        sub:thisWeek>0?'Diqqat!':'Tinch', icon:<Bell className="w-4 h-4"/>, bg:thisWeek>0?'rgba(239,68,68,0.12)':'rgba(16,185,129,0.12)', color:thisWeek>0?'#EF4444':'#10B981' },
          { label:'Bu oy',            value:`${thisMonth} ta`,       sub:'30 kun ichida',   icon:<Clock className="w-4 h-4"/>,          bg:'rgba(245,158,11,0.12)',  color:'#F59E0B' },
          { label:"Tug'ilgan kunlar", value:`${birthdays} ta`,       sub:'Ro\'yxatda',      icon:<Cake className="w-4 h-4"/>,           bg:'rgba(236,72,153,0.12)', color:'#EC4899' },
        ].map(s=>(
          <div key={s.label}
            className="rounded-2xl border p-4 bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08]"
            style={{ boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
                <p className="text-xl font-black text-neutral-900 dark:text-white font-mono">{s.value}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">{s.sub}</p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ URGENT ALERT ════════════════════════════════════════ */}
      {thisWeek > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-500/25 bg-amber-50 dark:bg-amber-500/[0.08] p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-amber-800 dark:text-amber-300">Bu hafta {thisWeek} ta muhim sana!</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {sorted.filter(d=>getDaysUntil(d.date)<=7).map(d=>{
                  const days = getDaysUntil(d.date)
                  const cfg = TYPE_CFG[d.type]
                  return (
                    <span key={d.id} className={cn('flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', cfg.bg, cfg.border, cfg.color)}>
                      {cfg.icon}
                      {d.title} · {days===0?'Bugun!':days+' kun'}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SEARCH + FILTER ═════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Sana yoki ism qidirish..."
            className={cn(
              'w-full h-10 pl-9 pr-4 rounded-xl border text-sm font-semibold outline-none transition-all',
              'bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.10]',
              'text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600',
              'focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
            )}
          />
          {search && (
            <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4"/>
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TYPE_FILTERS.map(f=>{
            const accent = f.key!=='all' ? TYPE_CFG[f.key as DateType]?.accent : null
            return (
              <button key={f.key} onClick={()=>setType(f.key as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0',
                  typeFilter===f.key
                    ? 'text-white border-transparent'
                    : 'bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/[0.10] hover:border-neutral-300 dark:hover:border-white/20',
                )}
                style={typeFilter===f.key ? { background: accent || '#1f2937' } : {}}>
                {f.key!=='all' && <span className={typeFilter===f.key?'text-white':TYPE_CFG[f.key as DateType]?.color}>
                  {TYPE_CFG[f.key as DateType]?.icon}
                </span>}
                {f.label}
                <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded-full',
                  typeFilter===f.key?'bg-white/20 text-white':'bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400')}>
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ══ DATE LIST ═══════════════════════════════════════════ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08] p-12 text-center"
          style={{ boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }}>
          <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3"/>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-4">Sana topilmadi</p>
          <Button size="sm" onClick={()=>setAddModal(true)} leftIcon={<Plus className="w-4 h-4"/>}>
            Sana qo'shish
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(date => {
            const days   = getDaysUntil(date.date)
            const level  = urgencyLevel(days)
            const style  = urgencyStyle(level)
            const cfg    = TYPE_CFG[date.type]
            const isMenu = menuId === date.id

            return (
              <div key={date.id}
                className={cn(
                  'relative rounded-2xl border p-4 transition-all group',
                  'bg-white dark:bg-[#111111]',
                  level==='today'||level==='critical'
                    ? 'border-red-200 dark:border-red-500/25'
                    : level==='soon'
                    ? 'border-amber-200 dark:border-amber-500/25'
                    : 'border-neutral-200 dark:border-white/[0.08]',
                  'hover:border-neutral-300 dark:hover:border-white/[0.16]',
                )}
                style={{ boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>

                {/* Left accent line */}
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl" style={{ background:cfg.accent }}/>

                <div className="pl-3 flex items-start gap-3">
                  {/* Type icon */}
                  <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0', cfg.bg, cfg.border, 'border')}>
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
                          <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                            {cfg.label}
                          </span>
                          {date.recurring && (
                            <span className="flex items-center gap-0.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                              <Repeat className="w-3 h-3"/> Har yil
                            </span>
                          )}
                          {(level==='today'||level==='critical') && (
                            <span className={cn('flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', style.badge)}>
                              <AlertTriangle className="w-3 h-3"/>
                              {level==='today'?'Bugun!':'Yaqin!'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white">{date.title}</h3>
                        {date.personName && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-neutral-400"/>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">{date.personName}</span>
                            {date.year && date.type==='birthday' && (
                              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                · {calcAge(date.year)} yosh bo'ladi
                              </span>
                            )}
                            {date.year && date.type==='anniversary' && (
                              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                · {calcAnniversary(date.year)}-yillik
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Days counter + menu */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-center">
                          <div className={cn('text-2xl font-black font-mono leading-none', style.counter)}>{days}</div>
                          <div className="text-[10px] text-neutral-400 font-medium">kun</div>
                        </div>

                        {/* Context menu */}
                        <div className="relative">
                          <button
                            onClick={e=>{ e.stopPropagation(); setMenuId(isMenu?null:date.id) }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-700 dark:hover:text-neutral-200 transition-all">
                            <MoreHorizontal className="w-4 h-4"/>
                          </button>
                          {isMenu && (
                            <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border bg-white dark:bg-[#1A1A1A] border-neutral-200 dark:border-white/[0.10] shadow-lg py-1"
                              onClick={e=>e.stopPropagation()}>
                              <button onClick={()=>openEdit(date)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.06]">
                                <Pencil className="w-4 h-4 text-blue-500"/> Tahrirlash
                              </button>
                              <div className="my-1 border-t border-neutral-100 dark:border-white/[0.06]"/>
                              <button onClick={()=>{ setDeleteDate(date); setMenuId(null) }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4"/> O'chirish
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom meta */}
                    <div className="flex items-center flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                        <Calendar className="w-3.5 h-3.5"/> {formatDate(date.date)}
                      </span>
                      {date.remindDays.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                          <Bell className="w-3.5 h-3.5"/> {date.remindDays.map(d=>`${d}k`).join(', ')} oldin
                        </span>
                      )}
                      {date.amount && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <Banknote className="w-3.5 h-3.5"/> {formatCurrency(date.amount)}
                        </span>
                      )}
                      {date.notes && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 italic truncate max-w-xs">
                          "{date.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add CTA */}
      {filtered.length > 0 && (
        <button onClick={()=>{ setAddForm({...EMPTY_FORM}); setAddModal(true) }}
          className={cn(
            'w-full py-4 text-sm font-bold rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2',
            'text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-white/[0.10]',
            'hover:border-blue-400 dark:hover:border-blue-500',
            'hover:text-blue-600 dark:hover:text-blue-400',
            'hover:bg-blue-50/50 dark:hover:bg-blue-500/[0.05]',
          )}>
          <Plus className="w-5 h-5"/> Yangi sana qo'shish
        </button>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SHARED FORM — Add / Edit
          ═══════════════════════════════════════════════════════════ */}
      {[
        { open:addModal,   title:"Sana Qo'shish",    form:addForm,  setForm:(fn:any)=>setAddForm(fn), onSave:saveAdd, onClose:()=>setAddModal(false) },
        { open:!!editDate, title:'Sanani Tahrirlash', form:editForm, setForm:(fn:any)=>setEditForm(fn),onSave:saveEdit,onClose:()=>setEditDate(null) },
      ].map(({ open, title, form, setForm, onSave, onClose })=>(
        <Modal key={title} open={open} onClose={onClose} title={title} size="md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={onClose}>Bekor qilish</Button>
              <Button size="sm" onClick={onSave} leftIcon={<Check className="w-4 h-4"/>}>
                {title.includes("Qo'shish") ? "Qo'shish" : 'Saqlash'}
              </Button>
            </>
          }>
          <div className="space-y-4">
            {/* Type selector */}
            <div>
              <label className={LBL}>Sana turi</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(TYPE_CFG) as DateType[]).map(t=>{
                  const c = TYPE_CFG[t]
                  return (
                    <button key={t} type="button" onClick={()=>setForm((f:any)=>({...f,type:t}))}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-bold transition-all',
                        form.type===t
                          ? cn(c.bg, c.border, c.color, 'border-current')
                          : 'border-neutral-200 dark:border-white/[0.10] text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20',
                      )}>
                      {c.icon} {c.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Input label="Nomi *" value={form.title}
              onChange={e=>setForm((f:any)=>({...f,title:e.target.value}))}
              placeholder="Masalan: Otamning tug'ilgan kuni"/>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Kishi ismi" value={form.personName}
                onChange={e=>setForm((f:any)=>({...f,personName:e.target.value}))}
                placeholder="Ismi"/>
              <Input label="Sana *" type="date" value={form.date}
                onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))}/>
            </div>

            {(form.type==='birthday'||form.type==='anniversary') && (
              <Input label={form.type==='birthday'?"Tug'ilgan yil":"Tadbirning yili"}
                type="number" value={form.year}
                onChange={e=>setForm((f:any)=>({...f,year:e.target.value}))}
                placeholder={form.type==='birthday'?'1990 (yosh hisoblash uchun)':'2020 (yillikni hisoblash uchun)'}/>
            )}

            {form.type==='payment' && (
              <Input label="Summa (so'm)" type="number" value={form.amount}
                onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}
                placeholder="800 000"/>
            )}

            {/* Recurring toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-neutral-500"/>
                <div>
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Har yil takrorlansin</p>
                  <p className="text-xs text-neutral-400">Tug'ilgan kunlar, yilliklar uchun</p>
                </div>
              </div>
              <button
                onClick={()=>setForm((f:any)=>({...f,recurring:!f.recurring}))}
                className={cn(
                  'w-11 h-6 rounded-full transition-all relative',
                  form.recurring?'bg-emerald-500':'bg-neutral-200 dark:bg-neutral-700',
                )}>
                <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
                  form.recurring?'left-5':'left-0.5')}/>
              </button>
            </div>

            {/* Remind days */}
            <div>
              <label className={LBL}>Eslatma (qancha kun oldin)</label>
              <div className="flex gap-2 flex-wrap">
                {REMIND_OPTIONS.map(d=>(
                  <button key={d} type="button"
                    onClick={()=>toggleRemind(form, d, setForm)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all',
                      form.remindDays.includes(d)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-neutral-200 dark:border-white/[0.10] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20',
                    )}>
                    {d} kun
                  </button>
                ))}
              </div>
            </div>

            <Textarea label="Izoh (ixtiyoriy)" value={form.notes}
              onChange={e=>setForm((f:any)=>({...f,notes:e.target.value}))}
              placeholder="Qo'shimcha ma'lumot, eslatmalar..." rows={2}/>
          </div>
        </Modal>
      ))}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      <Modal open={!!deleteDate} onClose={()=>setDeleteDate(null)} title="O'chirishni tasdiqlang" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setDeleteDate(null)}>Bekor</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} leftIcon={<Trash2 className="w-4 h-4"/>}>
              O'chirish
            </Button>
          </>
        }>
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500"/>
          </div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">"{deleteDate?.title}"</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.</p>
        </div>
      </Modal>
    </div>
  )
}
