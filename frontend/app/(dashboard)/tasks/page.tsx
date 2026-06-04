'use client'

import { useState, useMemo } from 'react'
import {
  Plus, Search, CheckSquare, Calendar, LayoutGrid, ListTodo,
  Clock, Trash2, Pencil, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, CheckCircle2,
  X, Flame, Flag, AlertTriangle, Check, Bell, BellOff, Volume2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useNotifications } from '@/hooks/useNotifications'
import { triggerMascot } from '@/components/mascot/KotibaBot'

/* ── Types ──────────────────────────────────────────────────────── */
type View     = 'list' | 'kanban' | 'calendar'
type Priority = 'urgent' | 'high' | 'medium' | 'low'
type Status   = 'todo' | 'in_progress' | 'done' | 'cancelled'

interface Subtask { id: number; title: string; done: boolean }
interface Task {
  id: number; title: string; description?: string
  status: Status; priority: Priority; category: string
  dueDate?: Date; subtasks: Subtask[]; createdAt: Date
  notifAt?: number   // scheduled notification timestamp (ms)
  notifSound?: boolean
}

/* ── Config ─────────────────────────────────────────────────────── */
const CATS = ['Barchasi', 'Ish', 'Shaxsiy', 'Oila', "O'qish", "Sog'liq", 'Moliya']

const PRIORITY_CFG: Record<Priority, { label: string; color: string; bg: string; border: string; dot: string }> = {
  urgent: { label: 'Shoshilinch', color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-200 dark:border-red-500/30',       dot: 'bg-red-500'     },
  high:   { label: 'Yuqori',      color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/30', dot: 'bg-orange-500'  },
  medium: { label: "O'rta",       color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/30',   dot: 'bg-amber-500'   },
  low:    { label: 'Past',        color: 'text-neutral-500 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-white/[0.06]', border: 'border-neutral-200 dark:border-white/10',   dot: 'bg-neutral-400' },
}

const STATUS_CFG: Record<Status, { label: string; color: string; dot: string }> = {
  todo:        { label: 'Bajarilmagan',  color: 'text-neutral-500 dark:text-neutral-400',   dot: 'bg-neutral-400'  },
  in_progress: { label: 'Jarayonda',     color: 'text-blue-600 dark:text-blue-400',          dot: 'bg-blue-500'     },
  done:        { label: 'Bajarildi',     color: 'text-emerald-600 dark:text-emerald-400',    dot: 'bg-emerald-500'  },
  cancelled:   { label: 'Bekor qilindi', color: 'text-neutral-400 dark:text-neutral-500',    dot: 'bg-neutral-300'  },
}

const KANBAN_COLS: { key: Status; label: string; color: string; bg: string }[] = [
  { key: 'todo',        label: 'Bajarilmagan', color: 'text-neutral-600 dark:text-neutral-300',   bg: 'bg-neutral-100 dark:bg-white/[0.06]'       },
  { key: 'in_progress', label: 'Jarayonda',    color: 'text-blue-600 dark:text-blue-400',          bg: 'bg-blue-50 dark:bg-blue-500/10'             },
  { key: 'done',        label: 'Bajarildi',    color: 'text-emerald-600 dark:text-emerald-400',    bg: 'bg-emerald-50 dark:bg-emerald-500/10'       },
]

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'urgent', label: 'Shoshilinch' },
  { value: 'high',   label: 'Yuqori'      },
  { value: 'medium', label: "O'rta"       },
  { value: 'low',    label: 'Past'        },
]
const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo',        label: 'Bajarilmagan'  },
  { value: 'in_progress', label: 'Jarayonda'     },
  { value: 'done',        label: 'Bajarildi'     },
  { value: 'cancelled',   label: 'Bekor qilindi' },
]

const MONTH_NAMES = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']
const WEEK_DAYS   = ['Du','Se','Ch','Pa','Ju','Sh','Ya']

const EMPTY_FORM = {
  title: '', description: '', priority: 'medium' as Priority,
  category: 'Ish', dueDate: '', status: 'todo' as Status,
  notifEnabled: false,
  notifDate: '',
  notifTime: '',
  notifSound: true,
}

const card   = cn('rounded-2xl border bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08]')
const shadow  = { boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / 86400000)
}

const INIT: Task[] = []

/* ================================================================
   SHARED TASK FORM
   ================================================================ */
function TaskForm({
  form, set,
}: {
  form: typeof EMPTY_FORM
  set: (f: typeof EMPTY_FORM) => void
}) {
  const SEL = cn(
    'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-all',
    'bg-white dark:bg-[#1A1A1A] border-neutral-200 dark:border-white/10',
    'text-neutral-900 dark:text-white',
    'focus:border-neutral-500 dark:focus:border-white/30',
  )
  const LBL = 'block mb-1.5 text-sm font-bold text-neutral-800 dark:text-neutral-200'
  return (
    <div className="space-y-4">
      <Input label="Sarlavha *" value={form.title}
        onChange={e => set({ ...form, title: e.target.value })}
        placeholder="Vazifa nomi..." />
      <Textarea label="Tavsif" value={form.description}
        onChange={e => set({ ...form, description: e.target.value })}
        placeholder="Qo'shimcha ma'lumot..." rows={2} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LBL}>Muhimlik</label>
          <select value={form.priority}
            onChange={e => set({ ...form, priority: e.target.value as Priority })} className={SEL}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className={LBL}>Holat</label>
          <select value={form.status}
            onChange={e => set({ ...form, status: e.target.value as Status })} className={SEL}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LBL}>Kategoriya</label>
          <select value={form.category}
            onChange={e => set({ ...form, category: e.target.value })} className={SEL}>
            {CATS.filter(c => c !== 'Barchasi').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Muddat" type="date" value={form.dueDate}
          onChange={e => set({ ...form, dueDate: e.target.value })} />
      </div>

      {/* ── Notification section ────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden">
        {/* Toggle header */}
        <button
          type="button"
          onClick={() => set({ ...form, notifEnabled: !form.notifEnabled })}
          className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-colors">
          <div className="flex items-center gap-2.5">
            {form.notifEnabled
              ? <Bell className="w-4 h-4 text-amber-500" />
              : <BellOff className="w-4 h-4 text-neutral-400" />}
            <span className={cn('text-sm font-bold',
              form.notifEnabled ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400')}>
              Eslatma qo'shish
            </span>
          </div>
          <div className={cn(
            'w-10 h-5.5 rounded-full relative transition-all',
            form.notifEnabled ? 'bg-amber-500' : 'bg-neutral-200 dark:bg-neutral-700',
          )} style={{ height: '22px' }}>
            <span className={cn(
              'absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all',
              form.notifEnabled ? 'left-5' : 'left-0.5',
            )} style={{ width: '18px', height: '18px' }}/>
          </div>
        </button>

        {/* Notification fields — only visible when enabled */}
        {form.notifEnabled && (
          <div className="px-4 pb-4 pt-3 space-y-3 border-t border-neutral-100 dark:border-white/[0.06]">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Quyidagi sana va vaqtda bildirishnoma yuboriladi
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sana *" type="date" value={form.notifDate}
                onChange={e => set({ ...form, notifDate: e.target.value })} />
              <Input label="Vaqt *" type="time" value={form.notifTime}
                onChange={e => set({ ...form, notifTime: e.target.value })} />
            </div>
            {/* Sound toggle */}
            <button
              type="button"
              onClick={() => set({ ...form, notifSound: !form.notifSound })}
              className="flex items-center gap-2.5 text-sm">
              <Volume2 className={cn('w-4 h-4', form.notifSound ? 'text-emerald-500' : 'text-neutral-400')} />
              <span className={cn('font-semibold',
                form.notifSound ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500')}>
                {form.notifSound ? 'Ringtone yoqiq' : 'Ringtone o\'chiq'}
              </span>
            </button>
            {/* Validation hint */}
            {form.notifDate && form.notifTime &&
              new Date(`${form.notifDate}T${form.notifTime}`).getTime() <= Date.now() && (
              <p className="text-xs text-red-500 font-semibold">
                O'tib ketgan vaqt tanlandingiz — kelajakdagi vaqt tanlang
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================
   TASK ROW
   ================================================================ */
function TaskRow({
  task, expanded, onToggleDone, onToggleExpand, onToggleSub, onEdit, onDelete,
}: {
  task: Task
  expanded: boolean
  onToggleDone: () => void
  onToggleExpand: () => void
  onToggleSub: (id: number) => void
  onEdit: () => void
  onDelete: () => void
}) {
  const pc   = PRIORITY_CFG[task.priority]
  const sc   = STATUS_CFG[task.status]
  const done = task.status === 'done' || task.status === 'cancelled'
  const days = task.dueDate ? daysUntil(task.dueDate) : null
  const isOverdue = days !== null && days < 0 && !done
  const isUrgent  = days !== null && days <= 1 && days >= 0 && !done
  const doneSubs  = task.subtasks.filter(s => s.done).length
  const totalSubs = task.subtasks.length

  return (
    <div className={cn(
      'rounded-2xl border transition-all',
      'bg-white dark:bg-[#111111]',
      done
        ? 'border-neutral-100 dark:border-white/[0.04] opacity-60'
        : isOverdue
        ? 'border-red-200 dark:border-red-500/25'
        : isUrgent
        ? 'border-amber-200 dark:border-amber-500/25'
        : 'border-neutral-200 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.15]',
    )} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button onClick={onToggleDone}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
            done
              ? 'border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white'
              : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-600 dark:hover:border-neutral-400',
          )}>
          {done && <Check className="w-3 h-3 text-white dark:text-neutral-900"/>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0"
          onClick={totalSubs > 0 ? onToggleExpand : undefined}
          style={{ cursor: totalSubs > 0 ? 'pointer' : 'default' }}>
          <div className="flex items-center flex-wrap gap-2">
            <span className={cn(
              'text-sm font-semibold',
              done
                ? 'line-through text-neutral-400 dark:text-neutral-500'
                : 'text-neutral-900 dark:text-neutral-100',
            )}>
              {task.title}
            </span>
            <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', pc.bg, pc.color)}>
              {pc.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', sc.dot)}/>
              <span className="hidden sm:inline">{sc.label}</span>
            </span>
            <span className="hidden md:inline text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400 font-semibold">
              {task.category}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            {task.dueDate && (
              <span className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-red-500 font-bold'
                : isUrgent  ? 'text-amber-500 font-semibold'
                : 'text-neutral-400 dark:text-neutral-500',
              )}>
                <Clock className="w-3 h-3"/>
                {isOverdue
                  ? `${Math.abs(days!)}k muddati o'tdi`
                  : days === 0 ? 'Bugun!'
                  : days === 1 ? 'Ertaga'
                  : `${days}k qoldi`}
              </span>
            )}
            {totalSubs > 0 && (
              <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                <Flag className="w-3 h-3"/>
                {doneSubs}/{totalSubs}
              </span>
            )}
            {task.notifAt && task.notifAt > Date.now() && (
              <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold"
                title={`Eslatma: ${new Date(task.notifAt).toLocaleString('uz-UZ')}`}>
                <Bell className="w-3 h-3"/>
                {new Date(task.notifAt).toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* Subtask toggle */}
        {totalSubs > 0 && (
          <button onClick={onToggleExpand}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            <span className="font-mono">{doneSubs}/{totalSubs}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={onEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-blue-500 dark:hover:text-blue-400 transition-all">
            <Pencil className="w-3.5 h-3.5"/>
          </button>
          <button onClick={onDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* Subtasks panel */}
      {expanded && totalSubs > 0 && (
        <div className="border-t border-neutral-100 dark:border-white/[0.05] px-4 pb-3 pt-2.5">
          <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-white/[0.08] mb-3 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : 0}%` }}/>
          </div>
          <div className="space-y-1.5 pl-8">
            {task.subtasks.map(sub => (
              <div key={sub.id}
                className="flex items-center gap-2.5 cursor-pointer group/sub"
                onClick={() => onToggleSub(sub.id)}>
                <div className={cn(
                  'flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                  sub.done
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-neutral-300 dark:border-neutral-600 group-hover/sub:border-emerald-400',
                )}>
                  {sub.done && <Check className="w-2.5 h-2.5 text-white"/>}
                </div>
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  sub.done
                    ? 'line-through text-neutral-400 dark:text-neutral-500'
                    : 'text-neutral-700 dark:text-neutral-300 group-hover/sub:text-neutral-900 dark:group-hover/sub:text-white',
                )}>
                  {sub.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================
   PAGE
   ================================================================ */
export default function TasksPage() {
  const { schedule, cancel, requestPermission, hasPermission } = useNotifications()
  const [tasks, setTasks]       = useState<Task[]>(INIT)
  const [view, setView]         = useState<View>('list')
  const [search, setSearch]     = useState('')
  const [cat, setCat]           = useState('Barchasi')
  const [priFilter, setPri]     = useState<Priority | 'all'>('all')
  const [expandedIds, setExp]   = useState<Set<number>>(new Set())

  /* Modals */
  const [addModal, setAddModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [addForm, setAddForm]   = useState({ ...EMPTY_FORM })
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM })

  /* Calendar */
  const now = new Date()
  const [calYear, setCalYear]   = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [selectedDay, setSel]   = useState<Date | null>(null)

  /* ── Derived ─────────────────────────────────────────────────── */
  const filtered = useMemo(() => tasks.filter(t => {
    if (cat !== 'Barchasi' && t.category !== cat) return false
    if (priFilter !== 'all' && t.priority !== priFilter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [tasks, cat, priFilter, search])

  const total   = tasks.length
  const done    = tasks.filter(t => t.status === 'done').length
  const inProg  = tasks.filter(t => t.status === 'in_progress').length
  const overdue = tasks.filter(t =>
    t.dueDate && t.status !== 'done' && t.status !== 'cancelled' &&
    new Date(t.dueDate) < new Date()
  ).length

  /* ── Calendar days ───────────────────────────────────────────── */
  const calDays = useMemo(() => {
    const firstDow   = new Date(calYear, calMonth, 1).getDay()
    const daysInMon  = new Date(calYear, calMonth + 1, 0).getDate()
    const pad        = (firstDow + 6) % 7
    const days: (Date | null)[] = []
    for (let i = 0; i < pad; i++) days.push(null)
    for (let d = 1; d <= daysInMon; d++) days.push(new Date(calYear, calMonth, d))
    return days
  }, [calYear, calMonth])

  function tasksForDay(day: Date) {
    return tasks.filter(t => {
      if (!t.dueDate) return false
      const d = new Date(t.dueDate)
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth()    === day.getMonth()    &&
        d.getDate()     === day.getDate()
      )
    })
  }

  const selectedDayTasks = selectedDay ? tasksForDay(selectedDay) : []

  /* ── Actions ─────────────────────────────────────────────────── */
  function toggleDone(id: number) {
    setTasks(ts => ts.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ))
  }

  function toggleSubtask(taskId: number, subId: number) {
    setTasks(ts => ts.map(t =>
      t.id !== taskId ? t : {
        ...t,
        subtasks: t.subtasks.map(s =>
          s.id === subId ? { ...s, done: !s.done } : s
        ),
      }
    ))
  }

  function toggleExpand(id: number) {
    setExp(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function openEdit(task: Task) {
    const notifDate = task.notifAt
      ? new Date(task.notifAt).toISOString().split('T')[0] : ''
    const notifTime = task.notifAt
      ? new Date(task.notifAt).toTimeString().slice(0, 5) : ''
    setEditForm({
      title: task.title, description: task.description ?? '',
      priority: task.priority, category: task.category, status: task.status,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      notifEnabled: !!task.notifAt,
      notifDate,
      notifTime,
      notifSound: task.notifSound ?? true,
    })
    setEditTask(task)
  }

  /* ── Schedule helper ─────────────────────────────────────────── */
  async function scheduleNotifForTask (
    taskId: number,
    title: string,
    form: typeof EMPTY_FORM,
  ) {
    if (!form.notifEnabled || !form.notifDate || !form.notifTime) return undefined
    const scheduledAt = new Date(`${form.notifDate}T${form.notifTime}`).getTime()
    if (scheduledAt <= Date.now()) {
      toast.error("Eslatma vaqti o'tib ketgan — kelajakdagi vaqt tanlang")
      return undefined
    }
    const perm = await requestPermission()
    if (!perm) {
      toast.error("Bildirishnoma ruxsati berilmagan — sozlamalardan yoqing")
      return undefined
    }
    await schedule({
      id          : `task-${taskId}`,
      title       : `Eslatma: ${title}`,
      body        : "Vazifa muddati yaqinlashdi. Ko'rish uchun bosing.",
      scheduledAt,
      url         : '/tasks',
      sound       : form.notifSound,
      taskId,
    })
    return scheduledAt
  }

  function saveAdd() {
    if (!addForm.title.trim()) { toast.error('Sarlavha kiritish majburiy'); return }
    const taskId = Date.now()
    const t: Task = {
      id: taskId, title: addForm.title.trim(),
      description: addForm.description || undefined,
      status: addForm.status, priority: addForm.priority, category: addForm.category,
      dueDate: addForm.dueDate ? new Date(addForm.dueDate) : undefined,
      subtasks: [], createdAt: new Date(),
      notifSound: addForm.notifSound,
    }
    setTasks(ts => [t, ...ts])

    /* Schedule notification if requested */
    scheduleNotifForTask(taskId, t.title, addForm).then(notifAt => {
      if (notifAt) {
        setTasks(ts => ts.map(x => x.id === taskId ? { ...x, notifAt } : x))
        toast.success(`Vazifa qo'shildi! Eslatma: ${new Date(notifAt).toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' })}`)
        triggerMascot(`"${t.title}" uchun eslatma o'rnatildi! Men vaqtida xabar beraman. 🔔`)
      } else {
        toast.success("Vazifa qo'shildi!")
        const motivations = [
          `Ajoyib! "${t.title}" vazifangiz qo'shildi. Bajarishga tayyor!`,
          `Yangi vazifa qo'shdingiz — oldinga qadam tashladingiz!`,
          `"${t.title}" — bugun bajarishga harakat qiling!`,
        ]
        triggerMascot(motivations[Math.floor(Math.random() * motivations.length)])
      }
    })

    setAddModal(false); setAddForm({ ...EMPTY_FORM })
  }

  function saveEdit() {
    if (!editTask) return
    if (!editForm.title.trim()) { toast.error('Sarlavha kiritish majburiy'); return }

    /* Cancel old notification if it exists */
    if (editTask.notifAt) cancel(`task-${editTask.id}`)

    setTasks(ts => ts.map(t =>
      t.id !== editTask.id ? t : {
        ...t, title: editForm.title.trim(),
        description: editForm.description || undefined,
        priority: editForm.priority, category: editForm.category, status: editForm.status,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate) : t.dueDate,
        notifAt: undefined,
        notifSound: editForm.notifSound,
      }
    ))

    /* Re-schedule if needed */
    scheduleNotifForTask(editTask.id, editForm.title.trim(), editForm).then(notifAt => {
      if (notifAt) {
        setTasks(ts => ts.map(x => x.id === editTask.id ? { ...x, notifAt } : x))
      }
      toast.success('Vazifa yangilandi!')
    })
    setEditTask(null)
  }

  function confirmDelete() {
    const task = tasks.find(t => t.id === deleteId)
    if (task?.notifAt) cancel(`task-${deleteId}`)
    setTasks(ts => ts.filter(t => t.id !== deleteId))
    toast.success("Vazifa o'chirildi!")
    setDeleteId(null)
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="space-y-5 animate-fade-in">

      {/* ══ HEADER ══════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">Vazifalar</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {done}/{total} bajarildi
            {overdue > 0 && <span className="ml-2 text-red-500 font-bold">· {overdue} ta muddati o'tdi!</span>}
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4"/>}
          onClick={() => { setAddForm({ ...EMPTY_FORM }); setAddModal(true) }}>
          Yangi vazifa
        </Button>
      </div>

      {/* ══ STAT CARDS ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Jami vazifalar', value: `${total} ta`,   sub: 'Hammasi',
            icon: <ListTodo className="w-4 h-4"/>,      bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6' },
          { label: 'Bajarildi',      value: `${done} ta`,    sub: `${total > 0 ? Math.round((done/total)*100) : 0}% samaradorlik`,
            icon: <CheckCircle2 className="w-4 h-4"/>,  bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
          { label: 'Jarayonda',      value: `${inProg} ta`,  sub: 'Aktiv',
            icon: <Flame className="w-4 h-4"/>,         bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
          { label: "Muddati o'tdi",  value: `${overdue} ta`, sub: overdue > 0 ? 'Diqqat!' : 'Yaxshi',
            icon: <AlertTriangle className="w-4 h-4"/>,
            bg: overdue > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
            color: overdue > 0 ? '#EF4444' : '#10B981' },
        ].map(s => (
          <div key={s.label} className={cn(card, 'p-4')} style={shadow}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
                <p className="text-xl font-black text-neutral-900 dark:text-white font-mono">{s.value}</p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 truncate">{s.sub}</p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ TOOLBAR ═════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">
        {/* Search + view toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Vazifalarni qidirish..."
              className={cn(
                'w-full h-10 pl-9 pr-4 rounded-xl border text-sm font-semibold outline-none transition-all',
                'bg-white dark:bg-[#111111]',
                'border-neutral-200 dark:border-white/[0.10]',
                'text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600',
                'focus:border-neutral-400 dark:focus:border-white/30',
              )}
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100 dark:bg-white/[0.06]">
            {[
              { key: 'list',     icon: <ListTodo className="w-4 h-4"/>,    title: 'Ro\'yxat'  },
              { key: 'kanban',   icon: <LayoutGrid className="w-4 h-4"/>,  title: 'Kanban'    },
              { key: 'calendar', icon: <Calendar className="w-4 h-4"/>,    title: 'Kalendar'  },
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key as View)} title={v.title}
                className={cn(
                  'flex items-center justify-center w-9 h-8 rounded-lg transition-all',
                  view === v.key
                    ? 'bg-white dark:bg-white/[0.13] text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
                )}>
                {v.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Category + Priority filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {/* Category */}
          <div className="flex gap-1.5 flex-shrink-0">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={cn(
                  'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                  cat === c
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
                )}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex-shrink-0 w-px h-5 bg-neutral-200 dark:bg-white/[0.10]"/>

          {/* Priority filter */}
          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => setPri('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                priFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
              )}>
              Barcha
            </button>
            {(['urgent','high','medium','low'] as Priority[]).map(p => {
              const pc = PRIORITY_CFG[p]
              return (
                <button key={p} onClick={() => setPri(priFilter === p ? 'all' : p)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                    priFilter === p
                      ? cn(pc.bg, pc.color, 'border', pc.border)
                      : 'bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
                  )}>
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', pc.dot)}/>
                  {pc.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          VIEW: LIST
          ════════════════════════════════════════════════════════════ */}
      {view === 'list' && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className={cn(card, 'p-12 text-center')} style={shadow}>
              <CheckSquare className="w-12 h-12 text-neutral-200 dark:text-neutral-700 mx-auto mb-3"/>
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Vazifa topilmadi</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 mb-4">Filtr yoki qidiruvni o'zgartiring</p>
              <Button size="sm" onClick={() => { setAddForm({ ...EMPTY_FORM }); setAddModal(true) }}
                leftIcon={<Plus className="w-4 h-4"/>}>
                Qo'shish
              </Button>
            </div>
          ) : (
            <>
              {filtered.map(task => (
                <TaskRow key={task.id} task={task}
                  expanded={expandedIds.has(task.id)}
                  onToggleDone={() => toggleDone(task.id)}
                  onToggleExpand={() => toggleExpand(task.id)}
                  onToggleSub={sid => toggleSubtask(task.id, sid)}
                  onEdit={() => openEdit(task)}
                  onDelete={() => setDeleteId(task.id)} />
              ))}
              <button onClick={() => { setAddForm({ ...EMPTY_FORM }); setAddModal(true) }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-bold transition-all',
                  'border-neutral-200 dark:border-white/[0.10] text-neutral-400 dark:text-neutral-500',
                  'hover:border-neutral-400 dark:hover:border-white/25 hover:text-neutral-600 dark:hover:text-neutral-300',
                )}>
                <Plus className="w-4 h-4"/> Yangi vazifa qo'shish
              </button>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          VIEW: KANBAN
          ════════════════════════════════════════════════════════════ */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KANBAN_COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key)
            return (
              <div key={col.key} className="flex flex-col gap-2">
                {/* Column header */}
                <div className={cn('flex items-center gap-2 rounded-xl px-3.5 py-2.5', col.bg)}>
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', STATUS_CFG[col.key].dot)}/>
                  <span className={cn('text-sm font-extrabold flex-1', col.color)}>{col.label}</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white dark:bg-white/[0.12] text-neutral-600 dark:text-neutral-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <div className="space-y-2 flex-1 min-h-[80px]">
                  {colTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-neutral-200 dark:border-white/[0.08] py-6 text-center">
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">Vazifa yo'q</p>
                    </div>
                  )}
                  {colTasks.map(task => {
                    const pc   = PRIORITY_CFG[task.priority]
                    const days = task.dueDate ? daysUntil(task.dueDate) : null
                    const isDone    = task.status === 'done'
                    const isOverdue = days !== null && days < 0 && !isDone
                    const isUrgent  = days !== null && days <= 1 && days >= 0 && !isDone
                    const doneSubs  = task.subtasks.filter(s => s.done).length
                    const totalSubs = task.subtasks.length

                    return (
                      <div key={task.id}
                        className={cn(
                          'rounded-xl border p-3.5 transition-all bg-white dark:bg-[#111111]',
                          isOverdue ? 'border-red-200 dark:border-red-500/25'
                          : isUrgent ? 'border-amber-200 dark:border-amber-500/25'
                          : 'border-neutral-200 dark:border-white/[0.08]',
                          'hover:shadow-md hover:border-neutral-300 dark:hover:border-white/[0.16]',
                        )}
                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

                        {/* Card header */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <p className={cn(
                            'text-sm font-bold leading-snug flex-1',
                            isDone
                              ? 'line-through text-neutral-400 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white',
                          )}>
                            {task.title}
                          </p>
                          <button onClick={() => openEdit(task)}
                            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-blue-500 transition-all">
                            <Pencil className="w-3.5 h-3.5"/>
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', pc.bg, pc.color)}>
                            {pc.label}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400 font-semibold">
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span className={cn(
                              'flex items-center gap-1 text-[11px] font-semibold',
                              isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-neutral-400 dark:text-neutral-500',
                            )}>
                              <Clock className="w-3 h-3"/>
                              {days === 0 ? 'Bugun'
                                : days === 1 ? 'Ertaga'
                                : days !== null && days < 0 ? `${Math.abs(days)}k o'tdi`
                                : `${days}k`}
                            </span>
                          )}
                        </div>

                        {/* Subtask progress */}
                        {totalSubs > 0 && (
                          <div className="mb-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                {doneSubs}/{totalSubs} bosqich
                              </span>
                              <span className="text-[11px] font-black text-neutral-500 dark:text-neutral-400">
                                {Math.round((doneSubs / totalSubs) * 100)}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${Math.round((doneSubs / totalSubs) * 100)}%` }}/>
                            </div>
                          </div>
                        )}

                        {/* Card footer */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-white/[0.05]">
                          <button onClick={() => toggleDone(task.id)}
                            className={cn(
                              'text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all',
                              isDone
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-neutral-100 dark:bg-white/[0.07] text-neutral-500 dark:text-neutral-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600',
                            )}>
                            {isDone ? 'Bajarildi' : 'Bajarildi deb belgilash'}
                          </button>
                          <button onClick={() => setDeleteId(task.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add to column */}
                <button
                  onClick={() => { setAddForm({ ...EMPTY_FORM, status: col.key }); setAddModal(true) }}
                  className={cn(
                    'w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-xs font-bold transition-all',
                    'border-neutral-200 dark:border-white/[0.10] text-neutral-400 dark:text-neutral-500',
                    'hover:border-neutral-400 dark:hover:border-white/25 hover:text-neutral-600 dark:hover:text-neutral-300',
                  )}>
                  <Plus className="w-3.5 h-3.5"/> Qo'shish
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          VIEW: CALENDAR
          ════════════════════════════════════════════════════════════ */}
      {view === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Monthly calendar */}
          <div className={cn(card, 'p-5 lg:col-span-2')} style={shadow}>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-700 dark:hover:text-neutral-200 transition-all">
                <ChevronLeft className="w-4 h-4"/>
              </button>
              <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <button onClick={nextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-700 dark:hover:text-neutral-200 transition-all">
                <ChevronRight className="w-4 h-4"/>
              </button>
            </div>

            {/* Week day headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEK_DAYS.map(d => (
                <div key={d} className="text-center text-[11px] font-extrabold text-neutral-400 dark:text-neutral-500 py-1.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, idx) => {
                if (!day) return <div key={idx} className="min-h-[52px]"/>
                const dayTasks   = tasksForDay(day)
                const isToday    = day.toDateString() === now.toDateString()
                const isSelected = selectedDay?.toDateString() === day.toDateString()
                return (
                  <button key={day.getTime()} onClick={() => setSel(isSelected ? null : day)}
                    className={cn(
                      'relative flex flex-col items-center rounded-xl py-1.5 px-1 min-h-[52px] transition-all',
                      isSelected
                        ? 'bg-neutral-900 dark:bg-white'
                        : isToday
                        ? 'bg-neutral-100 dark:bg-white/[0.10]'
                        : 'hover:bg-neutral-50 dark:hover:bg-white/[0.04]',
                    )}>
                    <span className={cn(
                      'text-xs font-extrabold leading-none mb-1.5',
                      isSelected
                        ? 'text-white dark:text-neutral-900'
                        : isToday
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400',
                    )}>
                      {day.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {dayTasks.slice(0, 3).map(t => (
                          <span key={t.id} className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            t.status === 'done'   ? 'bg-emerald-400' :
                            t.priority === 'urgent' ? 'bg-red-400' :
                            t.priority === 'high'   ? 'bg-orange-400' :
                            t.priority === 'medium' ? 'bg-amber-400' : 'bg-neutral-400',
                            isSelected && 'opacity-80',
                          )}/>
                        ))}
                        {dayTasks.length > 3 && (
                          <span className={cn(
                            'text-[9px] font-black leading-none',
                            isSelected ? 'text-white/60 dark:text-neutral-700' : 'text-neutral-400',
                          )}>
                            +{dayTasks.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-white/[0.06]">
              {[
                { color: 'bg-emerald-400', label: 'Bajarildi'   },
                { color: 'bg-red-400',     label: 'Shoshilinch' },
                { color: 'bg-orange-400',  label: 'Yuqori'      },
                { color: 'bg-amber-400',   label: "O'rta"       },
                { color: 'bg-neutral-400', label: 'Past'        },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full', l.color)}/>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day detail */}
          <div className={cn(card, 'p-5')} style={shadow}>
            {selectedDay ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {selectedDay.getDate()} {MONTH_NAMES[selectedDay.getMonth()]}
                    </h3>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {selectedDayTasks.length > 0
                        ? `${selectedDayTasks.length} ta vazifa`
                        : 'Vazifa yo\'q'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAddForm({ ...EMPTY_FORM, dueDate: selectedDay.toISOString().split('T')[0] })
                        setAddModal(true)
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-all">
                      <Plus className="w-3.5 h-3.5"/> Qo'shish
                    </button>
                    <button onClick={() => setSel(null)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] transition-all">
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                </div>

                {selectedDayTasks.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-10 h-10 text-neutral-200 dark:text-neutral-700 mx-auto mb-2"/>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Bu kunda vazifa yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDayTasks.map(task => {
                      const pc   = PRIORITY_CFG[task.priority]
                      const isDone = task.status === 'done'
                      return (
                        <div key={task.id}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border transition-all',
                            'bg-neutral-50 dark:bg-white/[0.04]',
                            'border-neutral-100 dark:border-white/[0.06]',
                            'hover:border-neutral-200 dark:hover:border-white/[0.12]',
                          )}>
                          <button onClick={() => toggleDone(task.id)}
                            className={cn(
                              'flex-shrink-0 mt-0.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all',
                              isDone
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-neutral-300 dark:border-neutral-600 hover:border-emerald-400',
                            )}>
                            {isDone && <Check className="w-2.5 h-2.5 text-white"/>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-xs font-bold truncate',
                              isDone
                                ? 'line-through text-neutral-400 dark:text-neutral-500'
                                : 'text-neutral-900 dark:text-white',
                            )}>
                              {task.title}
                            </p>
                            <span className={cn('text-[10px] font-bold', pc.color)}>{pc.label}</span>
                          </div>
                          <button onClick={() => openEdit(task)}
                            className="flex-shrink-0 text-neutral-400 hover:text-blue-500 transition-colors p-0.5">
                            <Pencil className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-14">
                <Calendar className="w-12 h-12 text-neutral-200 dark:text-neutral-700 mx-auto mb-3"/>
                <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Kunni tanlang</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Vazifalarni ko'rish uchun kalendardagi kunni bosing
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODALS
          ════════════════════════════════════════════════════════════ */}

      {/* Add */}
      <Modal open={addModal} onClose={() => setAddModal(false)}
        title="Yangi Vazifa Qo'shish" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveAdd} leftIcon={<Plus className="w-4 h-4"/>}>Qo'shish</Button>
          </>
        }>
        <TaskForm form={addForm} set={setAddForm}/>
      </Modal>

      {/* Edit */}
      <Modal open={!!editTask} onClose={() => setEditTask(null)}
        title="Vazifani Tahrirlash" description={editTask?.title} size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditTask(null)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveEdit} leftIcon={<Check className="w-4 h-4"/>}>Saqlash</Button>
          </>
        }>
        <TaskForm form={editForm} set={setEditForm}/>
      </Modal>

      {/* Delete */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}
        title="Vazifani o'chirish?" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
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
            "{tasks.find(t => t.id === deleteId)?.title}"
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.</p>
        </div>
      </Modal>
    </div>
  )
}
