'use client'

import { useState } from 'react'
import {
  Plus, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Wallet, PieChart as PieIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

type Tab = 'overview' | 'transactions' | 'budget'

/* ── Data ──────────────────────────────────────────────────────── */
const transactions = [
  { id:1,  title:'Tushlik',        type:'expense', amount:35000,   category:'Oziq-ovqat',    date:new Date('2026-05-30'),          icon:'🍔' },
  { id:2,  title:'Oylik maosh',    type:'income',  amount:4500000, category:'Daromad',       date:new Date(Date.now()-86400000),   icon:'💰' },
  { id:3,  title:'Taksi',          type:'expense', amount:22000,   category:'Transport',     date:new Date(Date.now()-86400000),   icon:'🚕' },
  { id:4,  title:"Ijara to'lovi", type:'expense', amount:800000,  category:'Uy',            date:new Date(Date.now()-2*86400000), icon:'🏠' },
  { id:5,  title:'Freelance',      type:'income',  amount:1200000, category:'Daromad',       date:new Date(Date.now()-3*86400000), icon:'💻' },
  { id:6,  title:'Supermarket',    type:'expense', amount:185000,  category:'Oziq-ovqat',    date:new Date(Date.now()-3*86400000), icon:'🛒' },
  { id:7,  title:'Kino',           type:'expense', amount:60000,   category:"Ko'ngil ochar", date:new Date(Date.now()-4*86400000), icon:'🎬' },
  { id:8,  title:'Aptek',          type:'expense', amount:45000,   category:"Sog'liq",       date:new Date(Date.now()-5*86400000), icon:'💊' },
]

const monthlyData = [
  { month:'Sen', income:4500000, expense:2800000 },
  { month:'Okt', income:5200000, expense:3100000 },
  { month:'Noy', income:4800000, expense:2900000 },
  { month:'Dek', income:5700000, expense:3400000 },
  { month:'Yan', income:4900000, expense:3200000 },
  { month:'Fev', income:5700000, expense:3000000 },
]

const categoryData = [
  { name:'Oziq-ovqat',    spent:650000, budget:800000, color:'#059669', icon:'🍔' },
  { name:'Transport',     spent:180000, budget:200000, color:'#F59E0B', icon:'🚕' },
  { name:'Uy',            spent:800000, budget:800000, color:'#2563EB', icon:'🏠' },
  { name:"Ko'ngil ochar", spent:200000, budget:300000, color:'#7C3AED', icon:'🎬' },
  { name:"Sog'liq",       spent:120000, budget:200000, color:'#EF4444', icon:'💊' },
]

const pieData = [
  { name:'Oziq-ovqat',    value:650000, color:'#059669' },
  { name:'Uy',            value:800000, color:'#2563EB' },
  { name:'Transport',     value:180000, color:'#F59E0B' },
  { name:"Ko'ngil ochar", value:200000, color:'#7C3AED' },
  { name:"Sog'liq",       value:120000, color:'#EF4444' },
]

const CATS = ['Oziq-ovqat','Transport','Uy',"Ko'ngil ochar","Sog'liq","Sovg'a",'Boshqa']

const CARD = cn(
  'rounded-2xl border p-5 transition-colors',
  'bg-white dark:bg-[#111111]',
  'border-slate-200 dark:border-white/[0.08]',
)
const CARD_SHADOW = { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }

/* ── Page ──────────────────────────────────────────────────────── */
export default function FinancePage() {
  const [tab, setTab]           = useState<Tab>('overview')
  const [filterType, setFilter] = useState<'all'|'income'|'expense'>('all')
  const [addModal, setAddModal] = useState(false)
  const [addForm, setAddForm]   = useState({
    title:'', type:'expense' as 'income'|'expense',
    amount:'', category:'Oziq-ovqat', date:'', description:'',
  })

  function saveTransaction() {
    if (!addForm.title.trim())                          { toast.error('Sarlavha kiritish majburiy'); return }
    if (!addForm.amount || Number(addForm.amount) <= 0) { toast.error('Summani kiriting'); return }
    toast.success(`${addForm.type === 'income' ? '✅ Daromad' : '✅ Xarajat'} qo'shildi!`)
    setAddModal(false)
    setAddForm({ title:'', type:'expense', amount:'', category:'Oziq-ovqat', date:'', description:'' })
  }

  const totalIncome  = 5700000
  const totalExpense = 1950000
  const balance      = totalIncome - totalExpense
  const filtered     = transactions.filter(t => filterType === 'all' || t.type === filterType)

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Moliya</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fevral 2026</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddModal(true)}>
          Yozuv qo'shish
        </Button>
      </div>

      {/* ── Balance card (gradient) ─────────────────────────────── */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400"
        style={{ boxShadow: '0 8px 32px rgba(37,99,235,0.35)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-10 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white opacity-10 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Joriy balans</p>
            <p className="text-4xl font-black font-mono tracking-tight text-white">{formatCurrency(balance)}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.20)' }}>
            <Wallet className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowUpRight className="w-4 h-4 text-green-300" />
              <span className="text-xs text-blue-100 font-medium">Daromad</span>
            </div>
            <p className="font-black font-mono text-lg text-white">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowDownRight className="w-4 h-4 text-red-300" />
              <span className="text-xs text-blue-100 font-medium">Xarajat</span>
            </div>
            <p className="font-black font-mono text-lg text-white">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title:"Bu oy tejamkor",   value:formatCurrency(balance),                     change:"+15% o'tgan oydan", up:true,  color:'#059669', darkBg:'rgba(5,150,105,0.18)',  Icon:TrendingUp },
          { title:"O'rtacha kunlik",  value:formatCurrency(Math.round(totalExpense/28)), change:'Kun xarajati',     up:false, color:'#F59E0B', darkBg:'rgba(245,158,11,0.18)', Icon:DollarSign },
          { title:"Byudjet o'tishi",  value:'0 ta',                                      change:'Barcha limit OK',  up:true,  color:'#2563EB', darkBg:'rgba(37,99,235,0.18)',  Icon:PieIcon    },
          { title:'Qarzdorlik',       value:"0 so'm",                                    change:"Hisob-kitob yo'q", up:null,  color:'#7C3AED', darkBg:'rgba(124,58,237,0.18)', Icon:Wallet     },
        ].map(s => (
          <div key={s.title} className={CARD} style={CARD_SHADOW}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">{s.title}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white font-mono leading-tight">{s.value}</p>
                <p className={cn('mt-1.5 text-xs font-semibold',
                  s.up === true ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')}>
                  {s.up === true && '↑ '}{s.change}
                </p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: s.darkBg }}>
                <s.Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-white/[0.06] p-1 rounded-xl w-fit">
        {(['overview','transactions','budget'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-bold transition-all',
              tab === t
                ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}>
            {t === 'overview' ? 'Umumiy' : t === 'transactions' ? 'Tranzaksiyalar' : 'Byudjet'}
          </button>
        ))}
      </div>

      {/* ── Overview ───────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bar chart */}
          <div className={CARD} style={CARD_SHADOW}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Oylik tahlil</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top:5, right:0, left:-20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v=>`${v/1000000}M`} />
                <Tooltip
                  formatter={(v:number)=>[formatCurrency(v)]}
                  contentStyle={{
                    fontSize:12, borderRadius:10, border:'none',
                    boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
                    background:'#1A1A1A', color:'#fff',
                  }}
                />
                <Bar dataKey="income"  fill="#059669" radius={[5,5,0,0]} name="Daromad" />
                <Bar dataKey="expense" fill="#EF4444" radius={[5,5,0,0]} name="Xarajat" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 justify-center">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Daromad
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Xarajat
              </span>
            </div>
          </div>

          {/* Pie chart */}
          <div className={CARD} style={CARD_SHADOW}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Xarajat taqsimoti</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {pieData.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 flex-shrink-0 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono flex-shrink-0">
                      {Math.round((item.value / totalExpense) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Transactions ───────────────────────────────────────── */}
      {tab === 'transactions' && (
        <div className="space-y-3">
          {/* Filter pills */}
          <div className="flex gap-2">
            {[['all','Barchasi'],['income','Daromad'],['expense','Xarajat']].map(([f,l]) => (
              <button key={f} onClick={() => setFilter(f as any)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold transition-all',
                  filterType === f
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-white/[0.07] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.12]',
                )}>
                {l}
              </button>
            ))}
          </div>

          {/* Transaction list */}
          <div className="space-y-2">
            {filtered.map(t => (
              <div key={t.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3.5 transition-all',
                  'bg-white dark:bg-[#111111]',
                  'border-slate-100 dark:border-white/[0.07]',
                  'hover:border-slate-200 dark:hover:border-white/[0.14] hover:shadow-sm',
                )}
                style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: t.type === 'income' ? 'rgba(5,150,105,0.15)' : 'rgba(239,68,68,0.15)' }}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{t.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t.category}</span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(t.date)}</span>
                  </div>
                </div>
                <div className={cn(
                  'text-sm font-black font-mono flex-shrink-0',
                  t.type === 'income' ? 'text-emerald-500' : 'text-red-500',
                )}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Budget ─────────────────────────────────────────────── */}
      {tab === 'budget' && (
        <div className="space-y-3">
          {categoryData.map(cat => {
            const pct    = Math.round((cat.spent / cat.budget) * 100)
            const isOver = pct >= 100
            const isWarn = pct >= 80 && !isOver
            return (
              <div key={cat.name}
                className={cn(
                  'rounded-2xl border p-5 transition-all',
                  'bg-white dark:bg-[#111111]',
                  isOver
                    ? 'border-red-200 dark:border-red-500/30'
                    : isWarn
                    ? 'border-amber-200 dark:border-amber-500/30'
                    : 'border-slate-200 dark:border-white/[0.08]',
                )}
                style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: cat.color + '22' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        {isOver && <Badge variant="danger">Limit oshdi!</Badge>}
                        {isWarn && <Badge variant="warning">Ogohlantirish</Badge>}
                        <span className="text-xs font-black font-mono"
                          style={{ color: isOver ? '#EF4444' : isWarn ? '#D97706' : '#94A3B8' }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-white/[0.08]">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(pct,100)}%`,
                          background: isOver
                            ? '#EF4444'
                            : isWarn
                            ? 'linear-gradient(90deg,#F59E0B,#FBBF24)'
                            : `linear-gradient(90deg,${cat.color},${cat.color}cc)`,
                        }} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Sarflandi: <span className="font-bold text-slate-700 dark:text-slate-200">{formatCurrency(cat.spent)}</span>
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Limit: {formatCurrency(cat.budget)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <button
            onClick={() => toast('Tez orada!')}
            className={cn(
              'w-full py-3 text-sm font-bold rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2',
              'text-slate-400 dark:text-slate-500',
              'border-slate-200 dark:border-white/[0.10]',
              'hover:bg-slate-50 dark:hover:bg-white/[0.04]',
              'hover:border-slate-300 dark:hover:border-white/[0.18]',
              'hover:text-slate-700 dark:hover:text-slate-300',
            )}>
            <Plus className="w-4 h-4" /> Yangi kategoriya qo'shish
          </button>
        </div>
      )}

      {/* ── Add transaction modal ───────────────────────────────── */}
      <Modal open={addModal} onClose={() => setAddModal(false)}
        title="Yozuv Qo'shish" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveTransaction} leftIcon={<Plus className="w-4 h-4" />}>Qo'shish</Button>
          </>
        }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(['income','expense'] as const).map(type => (
              <button key={type} type="button"
                onClick={() => setAddForm(f => ({ ...f, type }))}
                className={cn(
                  'flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold border-2 transition-all',
                  addForm.type === type
                    ? type === 'income'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'border-red-500 bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                    : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20',
                )}>
                {type === 'income'
                  ? <><ArrowUpRight className="w-4 h-4" /> Daromad</>
                  : <><ArrowDownRight className="w-4 h-4" /> Xarajat</>}
              </button>
            ))}
          </div>

          <Input label="Sarlavha *" value={addForm.title}
            onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Masalan: Tushlik" />

          <Input label="Summa (so'm) *" type="number" value={addForm.amount}
            onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))}
            placeholder="0" />

          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">Kategoriya</label>
            <select value={addForm.category}
              onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
              className={cn(
                'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-colors',
                'bg-white dark:bg-[#1A1A1A]',
                'border-slate-200 dark:border-white/10',
                'text-slate-900 dark:text-white',
                'focus:border-blue-400 dark:focus:border-blue-500',
                'focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
              )}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <Input label="Sana" type="date" value={addForm.date}
            onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} />

          <Textarea label="Izoh (ixtiyoriy)" value={addForm.description}
            onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Qo'shimcha ma'lumot..." rows={2} />
        </div>
      </Modal>
    </div>
  )
}
