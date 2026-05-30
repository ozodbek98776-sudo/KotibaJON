'use client'

import { useState } from 'react'
import { Plus, Calendar, Gift, Heart, CreditCard, Star, Bell, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatDate, getDaysUntil } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ImportantDate {
  id: number
  title: string
  personName?: string
  date: Date
  type: 'birthday' | 'anniversary' | 'payment' | 'other'
  remindDays: number[]
  notes?: string
  spent?: number
}

const dates: ImportantDate[] = [
  { id: 1, title: "Nilufar tug'ilgan kuni", personName: 'Nilufar Rashidova', date: new Date(Date.now() + 3 * 86400000), type: 'birthday', remindDays: [1, 3, 7], notes: 'Gul va tort olish kerak' },
  { id: 2, title: "Aka tug'ilgan kuni", personName: 'Bobur aka', date: new Date(Date.now() + 15 * 86400000), type: 'birthday', remindDays: [3, 7] },
  { id: 3, title: "Nikoh to'yi yillik", personName: '', date: new Date(Date.now() + 25 * 86400000), type: 'anniversary', remindDays: [7, 14] },
  { id: 4, title: 'Ijara to\'lovi', date: new Date(Date.now() + 5 * 86400000), type: 'payment', remindDays: [3], notes: '800,000 so\'m' },
  { id: 5, title: "Ota tug'ilgan kuni", personName: 'Otaxon', date: new Date(Date.now() + 45 * 86400000), type: 'birthday', remindDays: [7, 14] },
  { id: 6, title: 'Internet abonement', date: new Date(Date.now() + 8 * 86400000), type: 'payment', remindDays: [1, 3] },
  { id: 7, title: 'Imtihon kuni', date: new Date(Date.now() + 20 * 86400000), type: 'other', remindDays: [7, 14, 30] },
]

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  birthday: {
    icon: <Gift className="w-4 h-4" />,
    label: 'Tug\'ilgan kun',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  anniversary: {
    icon: <Heart className="w-4 h-4" />,
    label: 'Yillik',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  payment: {
    icon: <CreditCard className="w-4 h-4" />,
    label: 'To\'lov',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  other: {
    icon: <Star className="w-4 h-4" />,
    label: 'Boshqa',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
}

const filters = ['Barchasi', 'Tug\'ilgan kun', 'Yillik', 'To\'lov', 'Boshqa']

export default function DatesPage() {
  const [allDates, setAllDates] = useState(dates)
  const [filter, setFilter] = useState('Barchasi')
  const [addModal, setAddModal] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [addForm, setAddForm] = useState({
    title: '', personName: '', date: '',
    type: 'birthday' as ImportantDate['type'],
    notes: '', remindDays: [1, 3, 7],
  })

  function saveDate() {
    if (!addForm.title.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    if (!addForm.date) { toast.error("Sanani kiriting"); return }
    const newD: ImportantDate = {
      id: Date.now(), title: addForm.title, personName: addForm.personName || undefined,
      date: new Date(addForm.date), type: addForm.type,
      remindDays: addForm.remindDays, notes: addForm.notes || undefined,
    }
    setAllDates(ds => [...ds, newD])
    toast.success("Sana qo'shildi!")
    setAddModal(false)
    setAddForm({ title:'', personName:'', date:'', type:'birthday', notes:'', remindDays:[1,3,7] })
  }

  function confirmDelete() {
    setAllDates(ds => ds.filter(d => d.id !== deleteId))
    toast.success("Sana o'chirildi!")
    setDeleteId(null)
  }

  const sorted = [...allDates].sort((a, b) => {
    const dA = getDaysUntil(a.date)
    const dB = getDaysUntil(b.date)
    return dA - dB
  })

  const filtered = sorted.filter(d => {
    if (filter === 'Barchasi') return true
    const t = typeConfig[d.type]
    return t.label === filter
  })

  const upcoming7 = allDates.filter(d => getDaysUntil(d.date) <= 7).length
  const upcoming30 = allDates.filter(d => getDaysUntil(d.date) <= 30).length

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Muhim Sanalar</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {dates.length} ta sana — {upcoming7} ta bu hafta
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddModal(true)}>
          Sana qo'shish
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Jami sanalar" value={`${dates.length} ta`} icon={<Calendar className="w-5 h-5" />} color="primary" />
        <StatCard title="Bu hafta" value={`${upcoming7} ta`} changeType={upcoming7 > 0 ? 'down' : 'neutral'} change={upcoming7 > 0 ? "Diqqat!" : "Tinch"} icon={<Bell className="w-5 h-5" />} color={upcoming7 > 0 ? 'danger' : 'success'} />
        <StatCard title="Bu oy" value={`${upcoming30} ta`} icon={<Gift className="w-5 h-5" />} color="secondary" />
        <StatCard title="Tug'ilgan kunlar" value={`${dates.filter(d => d.type === 'birthday').length} ta`} icon={<Heart className="w-5 h-5" />} color="warning" />
      </div>

      {/* Upcoming alert */}
      {upcoming7 > 0 && (
        <div className="card p-4 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                Bu hafta {upcoming7} ta muhim sana bor!
              </p>
              <p className="text-xs text-orange-500/80 mt-0.5">
                {sorted.filter(d => getDaysUntil(d.date) <= 7).map(d => d.title).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              filter === f
                ? 'bg-neutral-900 dark:bg-white text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Dates list */}
      <div className="space-y-2">
        {filtered.map(date => {
          const days = getDaysUntil(date.date)
          const config = typeConfig[date.type]
          const isVeryClose = days <= 3
          const isClose = days <= 7

          return (
            <div
              key={date.id}
              className={cn(
                'flex rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 p-4 flex items-center gap-4 hover:border-neutral-300 dark:hover:border-primary-800 transition-all cursor-pointer',
                isVeryClose && 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10'
              )}
            >
              {/* Type icon */}
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', config.bgColor)}>
                <span className={config.color}>{config.icon}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{date.title}</p>
                  {isVeryClose && <Badge variant="danger" dot>Yaqin!</Badge>}
                  {!isVeryClose && isClose && <Badge variant="warning">Bu hafta</Badge>}
                </div>
                {date.personName && (
                  <p className="text-xs text-neutral-400 mb-0.5">{date.personName}</p>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(date.date)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Eslatmalar: {date.remindDays.map(d => `${d} kun`).join(', ')} oldin
                  </span>
                </div>
                {date.notes && (
                  <p className="text-xs text-neutral-400 mt-1 italic">"{date.notes}"</p>
                )}
              </div>

              {/* Days counter */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  'text-2xl font-bold font-mono',
                  isVeryClose ? 'text-red-500' : isClose ? 'text-orange-500' : 'text-neutral-900 dark:text-white'
                )}>
                  {days}
                </div>
                <span className="text-xs text-neutral-400">kun</span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="flex flex-col items-center mr-1">
                  <span className={cn('font-mono text-2xl font-extrabold',
                    isVeryClose ? 'text-red-500' : isClose ? 'text-amber-500' : 'text-neutral-900 dark:text-white')}>
                    {days}
                  </span>
                  <span className="text-xs text-neutral-400">kun</span>
                </div>
                <button onClick={() => setDeleteId(date.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-950/30">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Add Modal ───────────────────────────────────────── */}
      <Modal open={addModal} onClose={() => setAddModal(false)}
        title="Muhim Sana Qo'shish" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveDate} leftIcon={<Plus className="h-4 w-4" />}>Qo'shish</Button>
          </>
        }>
        <div className="space-y-4">
          <Input label="Nomi *" value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Masalan: Otamning tug'ilgan kuni" />
          <Input label="Kishi ismi" value={addForm.personName}
            onChange={e => setAddForm(f => ({ ...f, personName: e.target.value }))} placeholder="Masalan: Bobur aka" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">Tur</label>
              <select value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value as any }))}
                className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <option value="birthday">🎂 Tug'ilgan kun</option>
                <option value="anniversary">💍 Yillik</option>
                <option value="payment">💳 To'lov</option>
                <option value="other">⭐ Boshqa</option>
              </select>
            </div>
            <Input label="Sana *" type="date" value={addForm.date}
              onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <Textarea label="Izoh" value={addForm.notes}
            onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Qo'shimcha ma'lumot..." rows={2} />
        </div>
      </Modal>

      {/* ── Delete Confirm ──────────────────────────────────── */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}
        title="Sanani o'chirish?" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>O'chirish</Button>
          </>
        }>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Bu sana ro'yxatdan o'chiriladi.
        </p>
      </Modal>
    </div>
  )
}
