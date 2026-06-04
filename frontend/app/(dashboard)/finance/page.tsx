'use client'

import { useState, useMemo } from 'react'
import {
  Plus, TrendingUp, DollarSign, Wallet,
  ArrowUpRight, ArrowDownRight, Search, Pencil, Trash2,
  PieChart as PieIcon, BarChart2, Calendar, X, Target,
  CreditCard, ShoppingCart, Home, Car, Heart, Tv, Gift,
  AlertTriangle, CheckCircle2, ChevronRight, Wifi, BookOpen,
  Dumbbell, Smartphone, Utensils, Fuel, Banknote, Package,
  Coffee, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

/* ── Types ─────────────────────────────────────────────────────── */
type Tab  = 'overview' | 'transactions' | 'budget' | 'analytics'
type TxType = 'income' | 'expense'
interface Tx {
  id: number; title: string; type: TxType; amount: number
  category: string; date: Date; note?: string
}
interface BudgetCat {
  id: number; name: string; spent: number; budget: number
  color: string
}

/* ── Category icon component ────────────────────────────────────── */
const CAT_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  'Oziq-ovqat':    { icon: Utensils,     color: '#10B981' },
  'Daromad':       { icon: Banknote,     color: '#10B981' },
  'Transport':     { icon: Car,          color: '#F59E0B' },
  'Uy':            { icon: Home,         color: '#3B82F6' },
  "Ko'ngil ochar": { icon: Tv,           color: '#8B5CF6' },
  "Sog'liq":       { icon: Heart,        color: '#EF4444' },
  'Kommunal':      { icon: Wifi,         color: '#06B6D4' },
  "O'qish":        { icon: BookOpen,     color: '#8B5CF6' },
  "Sovg'a":        { icon: Gift,         color: '#EC4899' },
  'Benzin':        { icon: Fuel,         color: '#F97316' },
  'Sport':         { icon: Dumbbell,     color: '#10B981' },
  'Telefon':       { icon: Smartphone,   color: '#6366F1' },
  'Restoran':      { icon: Coffee,       color: '#92400E' },
  'Supermarket':   { icon: ShoppingCart, color: '#059669' },
  'Boshqa':        { icon: Package,      color: '#6B7280' },
}
function CategoryIcon({ category, size = 20 }: { category: string; size?: number }) {
  const cfg = CAT_ICONS[category] ?? { icon: CreditCard, color: '#6B7280' }
  const Icon = cfg.icon
  return <Icon style={{ width: size, height: size, color: cfg.color }} strokeWidth={1.8}/>
}

/* ── Static data ────────────────────────────────────────────────── */
const D = Date.now
const INIT_TXS: Tx[] = []

const INIT_BUDGET: BudgetCat[] = []

const MONTHLY: { month: string; income: number; expense: number; savings: number }[] = []

const CATS = ['Oziq-ovqat','Transport','Uy',"Ko'ngil ochar","Sog'liq","Kommunal","O'qish","Sovg'a",'Boshqa']

/* ── Helpers ────────────────────────────────────────────────────── */
const card = cn('rounded-2xl border bg-white dark:bg-[#111111] border-neutral-200 dark:border-white/[0.08]')
const shadow = { boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }

function groupByDate(txs: Tx[]) {
  const groups: Record<string, Tx[]> = {}
  txs.forEach(t => {
    const key = formatDate(t.date)
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })
  return Object.entries(groups)
}

function isSameDate(d: Date, label: string) {
  const today = formatDate(new Date())
  const yesterday = formatDate(new Date(Date.now() - 86400000))
  if (label === today) return 'Bugun'
  if (label === yesterday) return 'Kecha'
  return label
}

/* ── Custom Tooltip ─────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 p-3 text-xs" style={{ background:'#1A1A1A', minWidth:140 }}>
      <p className="font-bold text-white mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono font-bold text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ================================================================
   PAGE
   ================================================================ */
export default function FinancePage() {
  /* ── State ──────────────────────────────────────────────────── */
  const [tab, setTab]             = useState<Tab>('overview')
  const [txs, setTxs]             = useState<Tx[]>(INIT_TXS)
  const [budget, setBudget]       = useState<BudgetCat[]>(INIT_BUDGET)
  const [search, setSearch]       = useState('')
  const [filterType, setFilter]   = useState<'all'|TxType>('all')
  const [filterCat, setFilterCat] = useState('Barchasi')
  const [addModal, setAddModal]   = useState(false)
  const [editTx, setEditTx]       = useState<Tx | null>(null)
  const [deleteTx, setDeleteTx]   = useState<Tx | null>(null)
  const [addBudgetModal, setAddBudgetModal] = useState(false)

  const emptyForm = { title:'', type:'expense' as TxType, amount:'', category:'Oziq-ovqat', date:'', note:'' }
  const [addForm, setAddForm] = useState({ ...emptyForm })
  const [editForm, setEditForm] = useState({ ...emptyForm })
  const [newBudget, setNewBudget] = useState({ name:'', budget:'', color:'#10B981' })

  /* ── Derived ────────────────────────────────────────────────── */
  const totalIncome  = useMemo(() => txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0), [txs])
  const totalExpense = useMemo(() => txs.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0), [txs])
  const balance      = totalIncome - totalExpense
  const savingsRate  = totalIncome > 0 ? Math.round((balance/totalIncome)*100) : 0

  const pieData = useMemo(() => {
    const map: Record<string, number> = {}
    txs.filter(t=>t.type==='expense').forEach(t=>{ map[t.category]=(map[t.category]||0)+t.amount })
    const COLORS = ['#10B981','#3B82F6','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#F97316','#EC4899']
    return Object.entries(map).map(([name,value],i)=>({ name, value, color: COLORS[i%COLORS.length] }))
  }, [txs])

  const filtered = useMemo(() => txs
    .filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false
      if (filterCat !== 'Barchasi' && t.category !== filterCat) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
          !t.category.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a,b)=>b.date.getTime()-a.date.getTime()),
  [txs, filterType, filterCat, search])

  const allCats = useMemo(()=>['Barchasi',...new Set(txs.map(t=>t.category))],[txs])

  /* ── Actions ────────────────────────────────────────────────── */
  function saveAdd() {
    if (!addForm.title.trim()) { toast.error('Sarlavha majburiy'); return }
    if (!addForm.amount || Number(addForm.amount)<=0) { toast.error('Summa majburiy'); return }
    const newTx: Tx = {
      id: Date.now(), title: addForm.title, type: addForm.type,
      amount: Number(addForm.amount), category: addForm.category,
      date: addForm.date ? new Date(addForm.date) : new Date(),
      note: addForm.note,
    }
    setTxs(prev=>[newTx,...prev])
    toast.success(addForm.type==='income' ? 'Daromad qo\'shildi!' : 'Xarajat qo\'shildi!')
    setAddModal(false)
    setAddForm({ ...emptyForm })
  }

  function openEdit(tx: Tx) {
    setEditTx(tx)
    setEditForm({ title:tx.title, type:tx.type, amount:String(tx.amount),
      category:tx.category, date:tx.date.toISOString().split('T')[0], note:tx.note||'' })
  }

  function saveEdit() {
    if (!editTx) return
    setTxs(prev=>prev.map(t=> t.id===editTx.id
      ? { ...t, title:editForm.title, type:editForm.type, amount:Number(editForm.amount),
          category:editForm.category,
          date:editForm.date?new Date(editForm.date):t.date, note:editForm.note }
      : t
    ))
    toast.success('Tahrirlandi!')
    setEditTx(null)
  }

  function confirmDelete() {
    if (!deleteTx) return
    setTxs(prev=>prev.filter(t=>t.id!==deleteTx.id))
    toast.success('O\'chirildi!')
    setDeleteTx(null)
  }

  function saveBudget() {
    if (!newBudget.name.trim()) { toast.error('Kategoriya nomi majburiy'); return }
    if (!newBudget.budget || Number(newBudget.budget)<=0) { toast.error('Limit majburiy'); return }
    setBudget(prev=>[...prev, {
      id:Date.now(), name:newBudget.name, spent:0,
      budget:Number(newBudget.budget), color:newBudget.color,
    }])
    toast.success('Kategoriya qo\'shildi!')
    setAddBudgetModal(false)
    setNewBudget({ name:'', budget:'', color:'#10B981' })
  }

  /* ── Tabs config ────────────────────────────────────────────── */
  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key:'overview',     label:'Umumiy',         icon:<BarChart2 className="w-3.5 h-3.5"/>    },
    { key:'transactions', label:'Tranzaksiyalar',  icon:<CreditCard className="w-3.5 h-3.5"/>   },
    { key:'budget',       label:'Byudjet',         icon:<Target className="w-3.5 h-3.5"/>       },
    { key:'analytics',    label:'Tahlil',          icon:<TrendingUp className="w-3.5 h-3.5"/>   },
  ]

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">Moliya</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            May 2026 &nbsp;·&nbsp; {txs.length} ta tranzaksiya
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Calendar className="w-4 h-4"/>}>
            May 2026
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>{ setAddForm({...emptyForm}); setAddModal(true) }}>
            Qo'shish
          </Button>
        </div>
      </div>

      {/* ══ BALANCE HERO ════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden text-white bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400"
        style={{ boxShadow:'0 12px 40px rgba(37,99,235,0.40)' }}>
        {/* decorative */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white opacity-[0.07] pointer-events-none" />
        <div className="absolute top-8 right-20 w-24 h-24 rounded-full bg-white opacity-[0.05] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white opacity-[0.06] pointer-events-none" />

        <div className="relative z-10 p-6">
          {/* top row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Joriy balans</p>
              <p className="text-5xl font-black font-mono tracking-tight leading-none">
                {formatCurrency(balance)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5"/>
                  +{savingsRate}% tejamkorlik
                </span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)' }}>
              <Wallet className="w-7 h-7 text-white"/>
            </div>
          </div>

          {/* income / expense */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.20)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'rgba(52,211,153,0.30)' }}>
                  <ArrowUpRight className="w-4 h-4 text-emerald-300"/>
                </div>
                <span className="text-xs text-blue-100 font-semibold">Daromad</span>
              </div>
              <p className="text-xl font-black font-mono text-white">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-blue-200 mt-0.5">{txs.filter(t=>t.type==='income').length} ta to'lov</p>
            </div>
            <div className="rounded-2xl p-4"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.20)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'rgba(252,165,165,0.30)' }}>
                  <ArrowDownRight className="w-4 h-4 text-red-300"/>
                </div>
                <span className="text-xs text-blue-100 font-semibold">Xarajat</span>
              </div>
              <p className="text-xl font-black font-mono text-white">{formatCurrency(totalExpense)}</p>
              <p className="text-xs text-blue-200 mt-0.5">{txs.filter(t=>t.type==='expense').length} ta chiqim</p>
            </div>
          </div>

          {/* savings bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-blue-100 mb-1.5">
              <span>Tejamkorlik</span>
              <span className="font-bold">{savingsRate}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${Math.min(savingsRate,100)}%`, background:'rgba(52,211,153,0.80)' }}/>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label:"Bu oy tejamkor", value:formatCurrency(balance),
            sub:"+15% o'tgan oydan", up:true,
            icon:<TrendingUp className="w-4 h-4"/>, bg:'rgba(16,185,129,0.12)', color:'#10B981',
          },
          {
            label:"Kunlik o'rtacha", value:formatCurrency(Math.round(totalExpense/31)),
            sub:'Xarajat/kun', up:null,
            icon:<DollarSign className="w-4 h-4"/>, bg:'rgba(245,158,11,0.12)', color:'#F59E0B',
          },
          {
            label:"Byudjet holati", value:`${budget.filter(b=>b.spent>=b.budget).length===0?'Yaxshi':'Diqqat'}`,
            sub:`${budget.filter(b=>b.spent<b.budget).length}/${budget.length} limit OK`,
            up: budget.filter(b=>b.spent>=b.budget).length===0,
            icon:<Target className="w-4 h-4"/>, bg:'rgba(59,130,246,0.12)', color:'#3B82F6',
          },
          {
            label:'Tranzaksiyalar', value:`${txs.length} ta`,
            sub:'Bu oyda', up:null,
            icon:<CreditCard className="w-4 h-4"/>, bg:'rgba(139,92,246,0.12)', color:'#8B5CF6',
          },
        ].map(s=>(
          <div key={s.label} className={cn(card,'p-4')} style={shadow}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
                <p className="text-lg font-black text-neutral-900 dark:text-white font-mono leading-tight">{s.value}</p>
                <p className={cn('mt-1 text-[11px] font-semibold truncate',
                  s.up===true?'text-emerald-600 dark:text-emerald-400':
                  s.up===false?'text-red-500 dark:text-red-400':'text-neutral-400 dark:text-neutral-500')}>
                  {s.up===true&&'↑ '}{s.up===false&&'↓ '}{s.sub}
                </p>
              </div>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:s.bg }}>
                <span style={{ color:s.color }}>{s.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ TABS ════════════════════════════════════════════════ */}
      <div className="flex gap-1 p-1 rounded-2xl w-full sm:w-fit bg-neutral-100 dark:bg-white/[0.06]">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all',
              tab===t.key
                ? 'bg-white dark:bg-white/[0.13] text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}>
            {t.icon}<span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          TAB: OVERVIEW
          ══════════════════════════════════════════════════════════ */}
      {tab==='overview' && (
        <div className="space-y-5">
          {/* Area chart */}
          <div className={cn(card,'p-5')} style={shadow}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white">Oylik pul oqimi</h3>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block"/>Daromad</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-red-400 inline-block"/>Xarajat</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-blue-400 inline-block"/>Tejamkorlik</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY} margin={{ top:5, right:5, left:-15, bottom:0 }}>
                <defs>
                  <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.20}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.20}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.12)"/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v=>`${v/1000000}M`}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Area type="monotone" dataKey="income"  name="Daromad"      stroke="#10B981" strokeWidth={2} fill="url(#gIncome)"  dot={false}/>
                <Area type="monotone" dataKey="expense" name="Xarajat"      stroke="#EF4444" strokeWidth={2} fill="url(#gExpense)" dot={false}/>
                <Area type="monotone" dataKey="savings" name="Tejamkorlik"  stroke="#3B82F6" strokeWidth={2} fill="url(#gSavings)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Donut chart */}
            <div className={cn(card,'p-5')} style={shadow}>
              <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4">Xarajat taqsimoti</h3>
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62}
                        dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                        {pieData.map((e,i)=><Cell key={i} fill={e.color} strokeWidth={0}/>)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Jami</p>
                      <p className="text-xs font-black text-neutral-700 dark:text-white leading-tight">
                        {(totalExpense/1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {pieData.slice(0,5).map(item=>(
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 flex-shrink-0 rounded-full" style={{ background:item.color }}/>
                      <span className="text-xs text-neutral-600 dark:text-neutral-300 flex-1 truncate">{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${Math.round((item.value/totalExpense)*100)}%`, background:item.color }}/>
                        </div>
                        <span className="text-[11px] font-black text-neutral-700 dark:text-neutral-200 font-mono w-7 text-right">
                          {Math.round((item.value/totalExpense)*100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent transactions */}
            <div className={cn(card,'p-5')} style={shadow}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white">So'nggi tranzaksiyalar</h3>
                <button onClick={()=>setTab('transactions')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">
                  Barchasi <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
              <div className="space-y-2">
                {txs.slice(0,5).map(t=>(
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:t.type==='income'?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)' }}>
                      <CategoryIcon category={t.category} size={18}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{t.title}</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">{t.category}</p>
                    </div>
                    <p className={cn('text-sm font-black font-mono flex-shrink-0',
                      t.type==='income'?'text-emerald-500':'text-red-500')}>
                      {t.type==='income'?'+':'-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: TRANSACTIONS
          ══════════════════════════════════════════════════════════ */}
      {tab==='transactions' && (
        <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Tranzaksiya qidirish..."
                className={cn(
                  'w-full h-10 pl-9 pr-4 rounded-xl border text-sm font-semibold outline-none transition-all',
                  'bg-white dark:bg-[#111111]',
                  'border-neutral-200 dark:border-white/[0.10]',
                  'text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600',
                  'focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
                )}
              />
              {search && (
                <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  <X className="w-4 h-4"/>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {(['all','income','expense'] as const).map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-sm font-bold transition-all border',
                    filterType===f
                      ? f==='income'?'bg-emerald-500 text-white border-emerald-500':
                        f==='expense'?'bg-red-500 text-white border-red-500':
                        'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
                      : 'bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/[0.10] hover:border-neutral-300 dark:hover:border-white/20',
                  )}>
                  {f==='all'?'Barchasi':f==='income'?'Daromad':'Xarajat'}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {allCats.map(c=>(
              <button key={c} onClick={()=>setFilterCat(c)}
                className={cn(
                  'whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex-shrink-0',
                  filterCat===c
                    ? 'bg-blue-600 text-white border-transparent'
                    : 'bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-white/[0.10] hover:border-neutral-300 dark:hover:border-white/20',
                )}>
                {c}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            {filtered.length} ta natija
          </p>

          {/* Grouped transactions */}
          {filtered.length===0 ? (
            <div className={cn(card,'p-10 text-center')} style={shadow}>
              <Search className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3"/>
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Tranzaksiya topilmadi</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Qidiruv yoki filtrni o'zgartiring</p>
            </div>
          ) : (
            <div className="space-y-5">
              {groupByDate(filtered).map(([dateLabel, group])=>(
                <div key={dateLabel}>
                  <div className="flex items-center gap-3 mb-2.5">
                    <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {isSameDate(new Date(), dateLabel)}
                    </p>
                    <div className="flex-1 h-px bg-neutral-100 dark:bg-white/[0.06]"/>
                    <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 font-mono">
                      {group.reduce((s,t)=>s+(t.type==='income'?t.amount:-t.amount),0)>=0
                        ? '+'+formatCurrency(group.reduce((s,t)=>s+(t.type==='income'?t.amount:-t.amount),0))
                        : '-'+formatCurrency(Math.abs(group.reduce((s,t)=>s+(t.type==='income'?t.amount:-t.amount),0)))}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {group.map(t=>(
                      <div key={t.id}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl border p-3.5 transition-all group/row',
                          'bg-white dark:bg-[#111111]',
                          'border-neutral-100 dark:border-white/[0.07]',
                          'hover:border-neutral-200 dark:hover:border-white/[0.14]',
                          'hover:shadow-sm',
                        )}
                        style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background:t.type==='income'?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)' }}>
                          <CategoryIcon category={t.category} size={20}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-md',
                              'bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400')}>
                              {t.category}
                            </span>
                            {t.note && <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{t.note}</span>}
                          </div>
                        </div>
                        {/* actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <button onClick={()=>openEdit(t)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-blue-500 transition-all">
                            <Pencil className="w-3.5 h-3.5"/>
                          </button>
                          <button onClick={()=>setDeleteTx(t)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                        <div className={cn('text-sm font-black font-mono flex-shrink-0 ml-1',
                          t.type==='income'?'text-emerald-500':'text-red-500')}>
                          {t.type==='income'?'+':'-'}{formatCurrency(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: BUDGET
          ══════════════════════════════════════════════════════════ */}
      {tab==='budget' && (
        <div className="space-y-4">
          {/* Budget summary */}
          <div className={cn(card,'p-5')} style={shadow}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white">Byudjet xulosasi</h3>
              <span className={cn('flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full',
                budget.some(b=>b.spent>=b.budget)
                  ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                  : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400')}>
                {budget.filter(b=>b.spent>=b.budget).length===0
                  ? <><CheckCircle2 className="w-3 h-3"/> Barcha limitlar OK</>
                  : <><AlertTriangle className="w-3 h-3"/> {budget.filter(b=>b.spent>=b.budget).length} ta limit oshdi</>}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Umumiy limit',   value:formatCurrency(budget.reduce((s,b)=>s+b.budget,0)),  color:'text-neutral-700 dark:text-white' },
                { label:'Sarflangan',     value:formatCurrency(budget.reduce((s,b)=>s+b.spent,0)),   color:'text-red-500' },
                { label:'Qolgan',         value:formatCurrency(budget.reduce((s,b)=>s+(b.budget-b.spent),0)), color:'text-emerald-500' },
              ].map(s=>(
                <div key={s.label} className="text-center p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.05]">
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium mb-1">{s.label}</p>
                  <p className={cn('text-sm font-black font-mono', s.color)}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category cards */}
          <div className="space-y-3">
            {budget.map(cat=>{
              const pct    = Math.round((cat.spent/cat.budget)*100)
              const isOver = pct>=100
              const isWarn = pct>=80 && !isOver
              const remaining = cat.budget - cat.spent
              return (
                <div key={cat.id}
                  className={cn(
                    'rounded-2xl border p-5 transition-all',
                    'bg-white dark:bg-[#111111]',
                    isOver?'border-red-200 dark:border-red-500/30':
                    isWarn?'border-amber-200 dark:border-amber-500/30':
                    'border-neutral-200 dark:border-white/[0.08]',
                  )}
                  style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background:cat.color+'18' }}>
                      <CategoryIcon category={cat.name} size={20}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-black text-neutral-900 dark:text-white">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          {isOver && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3"/> Limit oshdi!
                            </span>
                          )}
                          {isWarn && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3"/> {pct}%
                            </span>
                          )}
                          {!isOver && !isWarn && (
                            <span className="text-[11px] font-black font-mono text-neutral-400 dark:text-neutral-500">{pct}%</span>
                          )}
                        </div>
                      </div>
                      {/* Progress */}
                      <div className="h-2.5 w-full rounded-full overflow-hidden bg-neutral-100 dark:bg-white/[0.08]">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width:`${Math.min(pct,100)}%`,
                            background: isOver?'#EF4444':
                              isWarn?'linear-gradient(90deg,#F59E0B,#FBBF24)':
                              `linear-gradient(90deg,${cat.color},${cat.color}bb)`,
                          }}/>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-white/[0.06]">
                    {[
                      { label:'Sarflandi', value:formatCurrency(cat.spent), color:isOver?'text-red-500':'text-neutral-700 dark:text-neutral-200' },
                      { label:'Qoldi',     value:remaining>=0?formatCurrency(remaining):'0', color:remaining<0?'text-red-500':'text-emerald-600 dark:text-emerald-400' },
                      { label:'Limit',     value:formatCurrency(cat.budget), color:'text-neutral-500 dark:text-neutral-400' },
                    ].map(s=>(
                      <div key={s.label} className="text-center">
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mb-0.5">{s.label}</p>
                        <p className={cn('text-xs font-black font-mono', s.color)}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <button onClick={()=>setAddBudgetModal(true)}
              className={cn(
                'w-full py-4 text-sm font-bold rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2',
                'text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-white/[0.10]',
                'hover:bg-neutral-50 dark:hover:bg-white/[0.04]',
                'hover:border-neutral-300 dark:hover:border-white/[0.18]',
                'hover:text-neutral-700 dark:hover:text-neutral-300',
              )}>
              <Plus className="w-4 h-4"/> Yangi kategoriya qo'shish
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB: ANALYTICS
          ══════════════════════════════════════════════════════════ */}
      {tab==='analytics' && (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label:'Tejamkorlik koeffitsienti', value:`${savingsRate}%`,
                desc:'Daromadning tejamkor qismi',
                trend:savingsRate>=20?'up':savingsRate>=10?'neutral':'down',
                color:savingsRate>=20?'text-emerald-500':savingsRate>=10?'text-amber-500':'text-red-500',
              },
              {
                label:'O\'rtacha xarajat (kunlik)', value:formatCurrency(Math.round(totalExpense/31)),
                desc:'May oyida kuniga',
                trend:'neutral', color:'text-neutral-700 dark:text-white',
              },
              {
                label:'Eng katta xarajat',
                value:txs.filter(t=>t.type==='expense').sort((a,b)=>b.amount-a.amount)[0]?.title||'-',
                desc:formatCurrency(txs.filter(t=>t.type==='expense').sort((a,b)=>b.amount-a.amount)[0]?.amount||0),
                trend:'down', color:'text-red-500',
              },
            ].map(s=>(
              <div key={s.label} className={cn(card,'p-5')} style={shadow}>
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-2">{s.label}</p>
                <p className={cn('text-2xl font-black font-mono', s.color)}>{s.value}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Monthly bar comparison */}
          <div className={cn(card,'p-5')} style={shadow}>
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-5">
              Oylar kesimida daromad vs xarajat
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHLY} margin={{ top:5, right:5, left:-15, bottom:0 }} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.12)"/>
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={v=>`${v/1000000}M`}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="income"  name="Daromad"     fill="#10B981" radius={[5,5,0,0]}/>
                <Bar dataKey="expense" name="Xarajat"     fill="#EF4444" radius={[5,5,0,0]}/>
                <Bar dataKey="savings" name="Tejamkorlik" fill="#3B82F6" radius={[5,5,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top spending categories */}
          <div className={cn(card,'p-5')} style={shadow}>
            <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4">
              Top xarajat kategoriyalari
            </h3>
            <div className="space-y-3">
              {pieData.sort((a,b)=>b.value-a.value).slice(0,6).map((c,i)=>(
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-sm font-black text-neutral-400 dark:text-neutral-500 w-5">{i+1}</span>
                  <div className="flex items-center gap-2 w-28 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background:c.color }}/>
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200 truncate">{c.name}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${(c.value/pieData[0].value)*100}%`, background:c.color }}/>
                  </div>
                  <span className="text-xs font-black font-mono text-neutral-600 dark:text-neutral-300 w-20 text-right">
                    {formatCurrency(c.value)}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 w-8 text-right">
                    {Math.round((c.value/totalExpense)*100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: ADD TRANSACTION
          ══════════════════════════════════════════════════════════ */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Yozuv Qo'shish" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setAddModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveAdd} leftIcon={<Plus className="w-4 h-4"/>}>Qo'shish</Button>
          </>
        }>
        <TxForm form={addForm} setForm={setAddForm} cats={CATS} />
      </Modal>

      {/* ══════════════════════════════════════════════════════════
          MODAL: EDIT TRANSACTION
          ══════════════════════════════════════════════════════════ */}
      <Modal open={!!editTx} onClose={()=>setEditTx(null)} title="Tranzaksiyani Tahrirlash" size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setEditTx(null)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveEdit} leftIcon={<CheckCircle2 className="w-4 h-4"/>}>Saqlash</Button>
          </>
        }>
        <TxForm form={editForm} setForm={setEditForm} cats={CATS} />
      </Modal>

      {/* ══════════════════════════════════════════════════════════
          MODAL: DELETE CONFIRM
          ══════════════════════════════════════════════════════════ */}
      <Modal open={!!deleteTx} onClose={()=>setDeleteTx(null)} title="O'chirishni tasdiqlang" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setDeleteTx(null)}>Bekor qilish</Button>
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
            "{deleteTx?.title}" o'chirilsinmi?
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Bu amalni qaytarib bo'lmaydi</p>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════════════════════
          MODAL: ADD BUDGET CATEGORY
          ══════════════════════════════════════════════════════════ */}
      <Modal open={addBudgetModal} onClose={()=>setAddBudgetModal(false)} title="Yangi Kategoriya" size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={()=>setAddBudgetModal(false)}>Bekor qilish</Button>
            <Button size="sm" onClick={saveBudget} leftIcon={<Plus className="w-4 h-4"/>}>Qo'shish</Button>
          </>
        }>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">Kategoriya nomi</label>
            <select value={newBudget.name} onChange={e=>setNewBudget(f=>({...f,name:e.target.value}))}
              className={cn(
                'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-colors',
                'bg-white dark:bg-[#1A1A1A] border-neutral-200 dark:border-white/10',
                'text-neutral-900 dark:text-white',
                'focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
              )}>
              <option value="">Tanlang...</option>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Oylik limit (so'm) *" type="number"
            value={newBudget.budget} onChange={e=>setNewBudget(f=>({...f,budget:e.target.value}))}
            placeholder="1 000 000" />
          <div>
            <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">Rang</label>
            <div className="flex gap-2 flex-wrap">
              {['#10B981','#3B82F6','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#F97316','#EC4899'].map(c=>(
                <button key={c} onClick={()=>setNewBudget(f=>({...f,color:c}))}
                  className={cn('w-8 h-8 rounded-xl transition-all border-2',
                    newBudget.color===c?'border-neutral-900 dark:border-white scale-110':'border-transparent')}
                  style={{ background:c }}/>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ── TxForm (shared for add/edit) ───────────────────────────────── */
function TxForm({ form, setForm, cats }: {
  form: any; setForm: (fn:(f:any)=>any)=>void; cats: string[]
}) {
  const SEL = cn(
    'h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none transition-colors',
    'bg-white dark:bg-[#1A1A1A] border-neutral-200 dark:border-white/10',
    'text-neutral-900 dark:text-white',
    'focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20',
  )
  return (
    <div className="space-y-4">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-white/[0.06] rounded-xl">
        {(['income','expense'] as const).map(type=>(
          <button key={type} type="button"
            onClick={()=>setForm((f:any)=>({...f,type}))}
            className={cn(
              'flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-bold transition-all',
              form.type===type
                ? type==='income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-red-500 text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}>
            {type==='income'
              ? <><ArrowUpRight className="w-4 h-4"/> Daromad</>
              : <><ArrowDownRight className="w-4 h-4"/> Xarajat</>}
          </button>
        ))}
      </div>

      <Input label="Sarlavha *" value={form.title}
        onChange={e=>setForm((f:any)=>({...f,title:e.target.value}))}
        placeholder="Masalan: Tushlik" />

      <Input label="Summa (so'm) *" type="number" value={form.amount}
        onChange={e=>setForm((f:any)=>({...f,amount:e.target.value}))}
        placeholder="0" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">Kategoriya</label>
          <select value={form.category} onChange={e=>setForm((f:any)=>({...f,category:e.target.value}))} className={SEL}>
            {cats.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Sana" type="date" value={form.date}
          onChange={e=>setForm((f:any)=>({...f,date:e.target.value}))} />
      </div>

      <Textarea label="Izoh (ixtiyoriy)" value={form.note}
        onChange={e=>setForm((f:any)=>({...f,note:e.target.value}))}
        placeholder="Qo'shimcha ma'lumot..." rows={2} />
    </div>
  )
}
