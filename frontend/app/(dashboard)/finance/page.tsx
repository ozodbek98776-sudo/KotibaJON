'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Wallet, PieChart as PieIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, StatCard } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

type Tab = 'overview' | 'transactions' | 'budget'

const transactions = [
  { id: 1, title: 'Tushlik', type: 'expense', amount: 35000, category: 'Oziq-ovqat', date: new Date('2026-05-30'), icon: '🍔' },
  { id: 2, title: 'Oylik maosh', type: 'income', amount: 4500000, category: 'Daromad', date: new Date(Date.now() - 86400000), icon: '💰' },
  { id: 3, title: 'Taksi', type: 'expense', amount: 22000, category: 'Transport', date: new Date(Date.now() - 86400000), icon: '🚕' },
  { id: 4, title: 'Ijara to\'lovi', type: 'expense', amount: 800000, category: 'Uy', date: new Date(Date.now() - 2 * 86400000), icon: '🏠' },
  { id: 5, title: 'Freelance loyiha', type: 'income', amount: 1200000, category: 'Daromad', date: new Date(Date.now() - 3 * 86400000), icon: '💻' },
  { id: 6, title: 'Supermarket', type: 'expense', amount: 185000, category: 'Oziq-ovqat', date: new Date(Date.now() - 3 * 86400000), icon: '🛒' },
  { id: 7, title: 'Kino', type: 'expense', amount: 60000, category: 'Ko\'ngil ochar', date: new Date(Date.now() - 4 * 86400000), icon: '🎬' },
  { id: 8, title: 'Aptek', type: 'expense', amount: 45000, category: 'Sog\'liq', date: new Date(Date.now() - 5 * 86400000), icon: '💊' },
]

const monthlyData = [
  { month: 'Sen', income: 4500000, expense: 2800000 },
  { month: 'Okt', income: 5200000, expense: 3100000 },
  { month: 'Noy', income: 4800000, expense: 2900000 },
  { month: 'Dek', income: 5700000, expense: 3400000 },
  { month: 'Yan', income: 4900000, expense: 3200000 },
  { month: 'Fev', income: 5700000, expense: 3000000 },
]

const categoryData = [
  { name: 'Oziq-ovqat', spent: 650000, budget: 800000, color: '#27AE60', icon: '🍔' },
  { name: 'Transport', spent: 180000, budget: 200000, color: '#F5A623', icon: '🚕' },
  { name: 'Uy', spent: 800000, budget: 800000, color: '#1A3A5C', icon: '🏠' },
  { name: "Ko'ngil ochar", spent: 200000, budget: 300000, color: '#9B59B6', icon: '🎬' },
  { name: "Sog'liq", spent: 120000, budget: 200000, color: '#E74C3C', icon: '💊' },
]

const pieData = [
  { name: 'Oziq-ovqat', value: 650000, color: '#27AE60' },
  { name: 'Uy', value: 800000, color: '#1A3A5C' },
  { name: 'Transport', value: 180000, color: '#F5A623' },
  { name: "Ko'ngil ochar", value: 200000, color: '#9B59B6' },
  { name: "Sog'liq", value: 120000, color: '#E74C3C' },
]

const CATS_FIN = ['Oziq-ovqat', 'Transport', 'Uy', "Ko'ngil ochar", "Sog'liq", 'Sovg\'a', 'Boshqa']
const ICONS: Record<string, string> = { 'Oziq-ovqat':'🍔', 'Transport':'🚕', 'Uy':'🏠', "Ko'ngil ochar":'🎬', "Sog'liq":'💊', 'Sovg\'a':'🎁', 'Boshqa':'💸', 'Daromad':'💰' }

export default function FinancePage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm] = useState({
    title: '', type: 'expense' as 'income' | 'expense',
    amount: '', category: 'Oziq-ovqat', date: '', description: '',
  })

  function saveTransaction() {
    if (!addForm.title.trim()) { toast.error("Sarlavha kiritish majburiy"); return }
    if (!addForm.amount || Number(addForm.amount) <= 0) { toast.error("Summani kiriting"); return }
    toast.success(`${addForm.type === 'income' ? 'Daromad' : 'Xarajat'} qo'shildi!`)
    setAddModal(false)
    setAddForm({ title:'', type:'expense', amount:'', category:'Oziq-ovqat', date:'', description:'' })
  }

  const totalIncome = 5700000
  const totalExpense = 1950000
  const balance = totalIncome - totalExpense

  const filtered = transactions.filter(t =>
    filterType === 'all' || t.type === filterType
  )

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Moliya</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Fevral 2025</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddModal(true)}>
          Yozuv qo'shish
        </Button>
      </div>

      {/* Balance card */}
      <div className="card p-6 gradient-primary text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-100 text-sm">Joriy balans</p>
            <p className="text-4xl font-bold font-mono mt-1">{formatCurrency(balance)}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Wallet className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="w-4 h-4 text-green-300" />
              <span className="text-xs text-primary-100">Daromad</span>
            </div>
            <p className="font-bold font-mono text-lg">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight className="w-4 h-4 text-red-300" />
              <span className="text-xs text-primary-100">Xarajat</span>
            </div>
            <p className="font-bold font-mono text-lg">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Bu oy tejamkor" value={formatCurrency(balance)} changeType="up" change="+ 15% o'tgan oydan" icon={<TrendingUp className="w-5 h-5" />} color="success" />
        <StatCard title="O'rtacha kunlik" value={formatCurrency(Math.round(totalExpense / 28))} changeType="neutral" change="Kun xarajati" icon={<DollarSign className="w-5 h-5" />} color="warning" />
        <StatCard title="Byudjet o'tishi" value="0 ta" changeType="up" change="Barcha limit OK" icon={<PieIcon className="w-5 h-5" />} color="primary" />
        <StatCard title="Qarzdorlik" value="0 so'm" changeType="neutral" change="Hisob-kitob yo'q" icon={<Wallet className="w-5 h-5" />} color="secondary" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-button w-fit">
        {(['overview', 'transactions', 'budget'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded text-sm font-medium transition-all',
              tab === t ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
            )}
          >
            {t === 'overview' ? "Umumiy" : t === 'transactions' ? "Tranzaksiyalar" : "Byudjet"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly chart */}
          <Card padding="md">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Oylik tahlil</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000000}M`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value)]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                />
                <Bar dataKey="income" fill="#27AE60" radius={[4, 4, 0, 0]} name="Daromad" />
                <Bar dataKey="expense" fill="#E74C3C" radius={[4, 4, 0, 0]} name="Xarajat" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category pie */}
          <Card padding="md">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Xarajat taqsimoti</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono">
                      {Math.round((item.value / totalExpense) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {tab === 'transactions' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {['all', 'income', 'expense'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f as any)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  filterType === f
                    ? 'bg-neutral-900 dark:bg-white text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                )}
              >
                {f === 'all' ? 'Barchasi' : f === 'income' ? 'Daromad' : 'Xarajat'}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(t => (
              <div key={t.id} className="card p-3 flex items-center gap-3 hover:border-neutral-300 dark:hover:border-primary-800 transition-all">
                <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{t.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-400">{t.category}</span>
                    <span className="text-xs text-neutral-300">•</span>
                    <span className="text-xs text-neutral-400">{formatDate(t.date)}</span>
                  </div>
                </div>
                <div className={cn(
                  'text-sm font-bold font-mono flex-shrink-0',
                  t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                )}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {tab === 'budget' && (
        <div className="space-y-3">
          {categoryData.map(cat => {
            const percent = Math.round((cat.spent / cat.budget) * 100)
            const isOver = percent >= 100
            const isWarn = percent >= 80
            return (
              <div key={cat.name} className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xl">{cat.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        {isOver && <Badge variant="danger">Limit oshdi!</Badge>}
                        {!isOver && isWarn && <Badge variant="warning">Ogohlantirish</Badge>}
                        <span className={cn('text-xs font-bold font-mono', isOver ? 'text-red-500' : 'text-neutral-600 dark:text-neutral-400')}>
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <Progress value={percent} color={isOver ? 'danger' : isWarn ? 'warning' : 'success'} size="sm" />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-neutral-400">Sarflandi: {formatCurrency(cat.spent)}</span>
                      <span className="text-xs text-neutral-400">Limit: {formatCurrency(cat.budget)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <button className="w-full py-3 text-sm text-neutral-900 dark:text-white border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Yangi byudjet kategoriyasi
          </button>
        </div>
      )}

      {/* ── Add Transaction Modal ───────────────────────────── */}
      <Modal open={addModal} onClose={() => setAddModal(false)}
        title="Yozuv Qo'shish" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveTransaction} leftIcon={<Plus className="h-4 w-4" />}>Qo'shish</Button>
          </>
        }>
        <div className="space-y-4">
          {/* Type toggle */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">Tur</label>
            <div className="grid grid-cols-2 gap-2">
              {([['expense','Xarajat'],['income','Daromad']] as const).map(([val,lbl]) => (
                <button key={val} onClick={() => setAddForm(f => ({ ...f, type: val }))}
                  className={cn('rounded-lg border py-2 text-sm font-bold transition-all',
                    addForm.type === val
                      ? val === 'expense'
                        ? 'border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        : 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700'
                  )}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <Input label="Nima uchun *" value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} placeholder="Masalan: Tushlik" />
          <Input label="Summa (so'm) *" type="number" value={addForm.amount}
            onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} placeholder="35000" />
          <div>
            <label className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">Kategoriya</label>
            <select value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              {(addForm.type === 'income' ? ['Maosh','Freelance','Bonus','Boshqa'] : CATS_FIN).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Sana" type="date" value={addForm.date}
            onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
