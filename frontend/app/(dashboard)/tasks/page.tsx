'use client'

import { useState } from 'react'
import {
  Plus, Search, CheckSquare, Calendar, Layout,
  Clock, Trash2, Edit3, ChevronDown, ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

type View     = 'list' | 'kanban' | 'calendar'
type Priority = 'urgent' | 'high' | 'medium' | 'low'
type Status   = 'todo' | 'in_progress' | 'done' | 'cancelled'

interface Task {
  id: number; title: string; description?: string
  status: Status; priority: Priority; category: string
  dueDate?: Date; subtasks?: { title: string; done: boolean }[]
}

const INIT: Task[] = [
  { id: 1, title: 'Loyiha taqdimotini tayyorlash', description: "Mijoz uchun to'liq taqdimot", status: 'in_progress', priority: 'urgent', category: 'Ish', dueDate: new Date(Date.now() + 86400000), subtasks: [{ title: 'Slaydlar tayyorlash', done: true }, { title: 'Demo video', done: false }] },
  { id: 2, title: 'Doktor bilan uchrashuv', status: 'todo', priority: 'high', category: "Sog'liq", dueDate: new Date(Date.now() + 2 * 86400000) },
  { id: 3, title: 'Haftalik hisobot yozish', status: 'done', priority: 'medium', category: 'Ish', dueDate: new Date('2026-05-30') },
  { id: 4, title: "Kitob o'qish (30 bet)", status: 'todo', priority: 'low', category: 'Shaxsiy', dueDate: new Date(Date.now() + 5 * 86400000) },
  { id: 5, title: "Kommunal to'lov", status: 'todo', priority: 'high', category: 'Moliya', dueDate: new Date(Date.now() + 3 * 86400000) },
  { id: 6, title: 'React kursini davom ettirish', status: 'in_progress', priority: 'medium', category: "O'qish", dueDate: new Date(Date.now() + 7 * 86400000), subtasks: [{ title: '3-dars: Hooks', done: true }, { title: '4-dars: State', done: true }, { title: '5-dars: Context', done: false }] },
  { id: 7, title: 'Sport zal abonement yangilash', status: 'todo', priority: 'medium', category: "Sog'liq" },
]

const CATS = ['Barchasi', 'Ish', 'Shaxsiy', 'Oila', "O'qish", "Sog'liq", 'Moliya']
const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'urgent', label: 'Shoshilinch' },
  { value: 'high',   label: 'Yuqori' },
  { value: 'medium', label: "O'rta" },
  { value: 'low',    label: 'Past' },
]
const STATUSES: { value: Status; label: string }[] = [
  { value: 'todo',        label: 'Bajarilmagan' },
  { value: 'in_progress', label: 'Jarayonda' },
  { value: 'done',        label: 'Bajarildi' },
  { value: 'cancelled',   label: 'Bekor qilindi' },
]

const pBadge: Record<Priority, any> = { urgent:'urgent', high:'high', medium:'medium', low:'low' }
const pLabel: Record<Priority, string> = { urgent:'Shoshilinch', high:'Yuqori', medium:"O'rta", low:'Past' }

const kanbanCols = [
  { key: 'todo' as Status,        label: 'Bajarilmagan', dot: 'bg-neutral-400' },
  { key: 'in_progress' as Status, label: 'Jarayonda',    dot: 'bg-blue-500' },
  { key: 'done' as Status,        label: 'Bajarildi',    dot: 'bg-emerald-500' },
]

/* ── Empty form ──────────────────────────────────────────────── */
const EMPTY_FORM = { title: '', description: '', priority: 'medium' as Priority, category: 'Ish', dueDate: '', status: 'todo' as Status }

/* ================================================================
   PAGE
   ================================================================ */
export default function TasksPage() {
  const [tasks, setTasks]     = useState<Task[]>(INIT)
  const [view, setView]       = useState<View>('list')
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('Barchasi')

  /* ── Modal states ──────────────────────────────────────────── */
  const [addModal, setAddModal]   = useState(false)
  const [editTask, setEditTask]   = useState<Task | null>(null)
  const [deleteId, setDeleteId]   = useState<number | null>(null)
  const [addForm, setAddForm]     = useState({ ...EMPTY_FORM })
  const [editForm, setEditForm]   = useState({ ...EMPTY_FORM })

  /* ── Derived ───────────────────────────────────────────────── */
  const filtered = tasks.filter(t => {
    const matchS = t.title.toLowerCase().includes(search.toLowerCase())
    const matchC = cat === 'Barchasi' || t.category === cat
    return matchS && matchC
  })

  /* ── Actions ───────────────────────────────────────────────── */
  function toggleDone(id: number) {
    setTasks(ts => ts.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
    ))
  }

  function saveAdd() {
    if (!addForm.title.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    const t: Task = {
      id: Date.now(), title: addForm.title, description: addForm.description || undefined,
      status: addForm.status, priority: addForm.priority, category: addForm.category,
      dueDate: addForm.dueDate ? new Date(addForm.dueDate) : undefined,
    }
    setTasks(ts => [t, ...ts])
    toast.success("Vazifa qo'shildi!")
    setAddModal(false)
    setAddForm({ ...EMPTY_FORM })
  }

  function openEdit(task: Task) {
    setEditForm({
      title: task.title, description: task.description ?? '',
      priority: task.priority, category: task.category,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    })
    setEditTask(task)
  }

  function saveEdit() {
    if (!editTask) return
    if (!editForm.title.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    setTasks(ts => ts.map(t =>
      t.id === editTask.id
        ? { ...t, title: editForm.title, description: editForm.description || undefined,
            priority: editForm.priority, category: editForm.category, status: editForm.status,
            dueDate: editForm.dueDate ? new Date(editForm.dueDate) : t.dueDate }
        : t
    ))
    toast.success("Vazifa tahrirlandi!")
    setEditTask(null)
  }

  function confirmDelete() {
    setTasks(ts => ts.filter(t => t.id !== deleteId))
    toast.success("Vazifa o'chirildi!")
    setDeleteId(null)
  }

  /* ── Task form fields (reusable) ───────────────────────────── */
  function TaskForm({ form, set }: { form: typeof EMPTY_FORM; set: (f: typeof EMPTY_FORM) => void }) {
    return (
      <div className="space-y-4">
        <Input label="Sarlavha *" value={form.title}
          onChange={e => set({ ...form, title: e.target.value })} placeholder="Vazifa nomi..." />
        <Textarea label="Tavsif" value={form.description}
          onChange={e => set({ ...form, description: e.target.value })} placeholder="Qo'shimcha ma'lumot..." rows={2} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-primary-800 dark:text-primary-200">Muhimlik</label>
            <select value={form.priority} onChange={e => set({ ...form, priority: e.target.value as Priority })}
              className="h-10 w-full rounded-lg border border-border-light bg-white px-3 text-sm font-semibold text-primary-900 outline-none focus:border-neutral-500 dark:border-primary-700 dark:bg-primary-800 dark:text-neutral-100">
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-primary-800 dark:text-primary-200">Holat</label>
            <select value={form.status} onChange={e => set({ ...form, status: e.target.value as Status })}
              className="h-10 w-full rounded-lg border border-border-light bg-white px-3 text-sm font-semibold text-primary-900 outline-none focus:border-neutral-500 dark:border-primary-700 dark:bg-primary-800 dark:text-neutral-100">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-primary-800 dark:text-primary-200">Kategoriya</label>
            <select value={form.category} onChange={e => set({ ...form, category: e.target.value })}
              className="h-10 w-full rounded-lg border border-border-light bg-white px-3 text-sm font-semibold text-primary-900 outline-none focus:border-neutral-500 dark:border-primary-700 dark:bg-primary-800 dark:text-neutral-100">
              {CATS.filter(c => c !== 'Barchasi').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Muddat" type="date" value={form.dueDate}
            onChange={e => set({ ...form, dueDate: e.target.value })} />
        </div>
      </div>
    )
  }

  /* ── RENDER ────────────────────────────────────────────────── */
  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-primary-900 dark:text-primary-50">Vazifalar</h1>
          <p className="mt-0.5 text-sm text-primary-500">
            {tasks.filter(t => t.status === 'done').length} / {tasks.length} bajarildi
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddModal(true)}>
          Yangi vazifa
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <Input placeholder="Vazifalarni qidirish..."
            value={search} onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />} />
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-primary-50 p-1 dark:bg-primary-700/60">
          {[
            { key: 'list',    icon: <CheckSquare className="h-4 w-4" /> },
            { key: 'kanban',  icon: <Layout      className="h-4 w-4" /> },
            { key: 'calendar',icon: <Calendar    className="h-4 w-4" /> },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key as View)}
              className={cn('flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-bold transition-all',
                view === v.key
                  ? 'bg-white text-primary-900 shadow-sm dark:bg-neutral-700 dark:text-primary-50'
                  : 'text-primary-500 hover:text-primary-700 dark:hover:text-primary-300',
              )}>
              {v.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cn(
              'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition-all',
              cat === c
                ? 'bg-primary-800 text-white dark:bg-white dark:text-primary-900'
                : 'bg-primary-50 text-primary-600 hover:bg-neutral-200 dark:bg-primary-700/60 dark:text-primary-400',
            )}>
            {c}
          </button>
        ))}
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckSquare className="mx-auto mb-3 h-12 w-12 text-primary-200 dark:text-primary-700" />
              <p className="text-sm text-primary-400">Vazifalar topilmadi</p>
            </div>
          ) : filtered.map(task => (
            <TaskRow key={task.id} task={task}
              onToggle={toggleDone}
              onEdit={openEdit}
              onDelete={id => setDeleteId(id)} />
          ))}
          <button
            onClick={() => setAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-light py-3 text-sm font-bold text-primary-400 transition-all hover:border-neutral-400 hover:text-primary-600 dark:border-primary-700/50">
            <Plus className="h-4 w-4" /> Yangi vazifa qo'shish
          </button>
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {kanbanCols.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key)
            return (
              <div key={col.key} className="rounded-xl border border-border-light bg-primary-50/50 p-3 dark:border-primary-700/50 dark:bg-primary-800">
                <div className="mb-3 flex items-center gap-2">
                  <div className={cn('h-2.5 w-2.5 rounded-full', col.dot)} />
                  <span className="text-sm font-extrabold text-primary-700 dark:text-primary-300">{col.label}</span>
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-500 shadow-sm dark:bg-primary-700/60">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colTasks.map(task => (
                    <div key={task.id}
                      className="rounded-xl border border-border-light bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-primary-700 dark:bg-primary-700/60">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-primary-900 dark:text-primary-50">{task.title}</p>
                        <button onClick={() => openEdit(task)}
                          className="flex-shrink-0 rounded p-0.5 text-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-neutral-700">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={pBadge[task.priority]}>{pLabel[task.priority]}</Badge>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-primary-400">
                            <Clock className="h-3 w-3" />{formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setAddModal(true)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border-light py-2 text-xs font-bold text-primary-400 hover:border-neutral-400 hover:text-primary-600 dark:border-primary-700">
                    <Plus className="h-3.5 w-3.5" /> Qo'shish
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Calendar placeholder */}
      {view === 'calendar' && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-light bg-white py-16 shadow-sm dark:border-primary-700/50 dark:bg-primary-800">
          <Calendar className="mb-3 h-12 w-12 text-primary-200 dark:text-primary-700" />
          <p className="font-bold text-primary-600 dark:text-primary-400">Kalendar ko'rinishi</p>
          <p className="mt-1 text-sm text-primary-400">Tez orada qo'shiladi</p>
        </div>
      )}

      {/* ── Add Modal ───────────────────────────────────────────── */}
      <Modal open={addModal} onClose={() => setAddModal(false)}
        title="Yangi Vazifa Qo'shish" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveAdd} leftIcon={<Plus className="h-4 w-4" />}>Qo'shish</Button>
          </>
        }>
        <TaskForm form={addForm} set={setAddForm} />
      </Modal>

      {/* ── Edit Modal ──────────────────────────────────────────── */}
      <Modal open={!!editTask} onClose={() => setEditTask(null)}
        title="Vazifani Tahrirlash" description={editTask?.title} size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditTask(null)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveEdit}>Saqlash</Button>
          </>
        }>
        <TaskForm form={editForm} set={setEditForm} />
      </Modal>

      {/* ── Delete Confirm ──────────────────────────────────────── */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}
        title="Vazifani o'chirish?" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>O'chirish</Button>
          </>
        }>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Bu amal qaytarib bo'lmaydi. Vazifa to'liq o'chiriladi.
        </p>
      </Modal>
    </div>
  )
}

/* ── Task Row Component ──────────────────────────────────────── */
function TaskRow({ task, onToggle, onEdit, onDelete }: {
  task: Task
  onToggle: (id: number) => void
  onEdit:   (task: Task) => void
  onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(false)
  const done = task.status === 'done'

  return (
    <div className={cn(
      'rounded-xl border bg-white transition-all dark:bg-primary-800',
      done
        ? 'border-border-light opacity-60 dark:border-primary-700/50'
        : 'border-border-light hover:border-neutral-300 hover:shadow-sm dark:border-primary-700/50 dark:hover:border-neutral-700',
    )}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button onClick={() => onToggle(task.id)}
          className={cn(
            'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all',
            done
              ? 'border-neutral-900 bg-primary-800 dark:border-white dark:bg-white'
              : 'border-neutral-300 hover:border-neutral-600 dark:border-neutral-600',
          )}>
          {done && (
            <svg className="h-3 w-3 text-white dark:text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={() => task.subtasks && setOpen(!open)} style={{ cursor: task.subtasks ? 'pointer' : 'default' }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('text-sm font-semibold', done ? 'text-primary-400 line-through' : 'text-primary-900 dark:text-neutral-100')}>
              {task.title}
            </span>
            <Badge variant={({ urgent:'urgent', high:'high', medium:'medium', low:'low' } as any)[task.priority]}>
              {({ urgent:'Shoshilinch', high:'Yuqori', medium:"O'rta", low:'Past' } as any)[task.priority]}
            </Badge>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-500 dark:bg-primary-700/60 dark:text-primary-400">
              {task.category}
            </span>
          </div>
          {task.dueDate && (
            <div className="mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary-400" />
              <span className="text-xs text-primary-400">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Subtask indicator */}
        {task.subtasks && (
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-700/60 transition-colors">
            {task.subtasks.filter(s => s.done).length}/{task.subtasks.length}
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-1">
          <button onClick={() => onEdit(task)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-700/60 dark:hover:text-primary-200">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Subtasks */}
      {open && task.subtasks && (
        <div className="border-t border-border-light px-4 py-3 dark:border-primary-700/50">
          <div className="space-y-2 pl-8">
            {task.subtasks.map((sub, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn('h-3.5 w-3.5 flex-shrink-0 rounded border flex items-center justify-center',
                  sub.done ? 'border-neutral-900 bg-primary-800 dark:border-white dark:bg-white' : 'border-neutral-300 dark:border-neutral-600')}>
                  {sub.done && <svg className="h-2 w-2 text-white dark:text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={cn('text-xs font-medium', sub.done ? 'text-primary-400 line-through' : 'text-primary-600 dark:text-primary-400')}>
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
