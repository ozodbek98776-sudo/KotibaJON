'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, CheckSquare, Target, Download, Calendar, Trophy, TrendingDown, AlertTriangle, Flame } from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
} from 'recharts'

type Period = 'weekly' | 'monthly' | 'yearly'

const UZ_MONTHS = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr',
]

function formatMonthYear(date: Date) {
  return `${UZ_MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}

/* ── Empty state component ──────────────────────────────────────── */
function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center text-neutral-300 dark:text-neutral-600">
        {icon}
      </div>
      <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-[200px]">{desc}</p>
    </div>
  )
}

export default function ReportsPage() {
  const currentMonthYear = formatMonthYear(new Date())
  const [period, setPeriod] = useState<Period>('weekly')

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Hisobotlar va Tahlil</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{currentMonthYear}</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          PDF yuklash
        </Button>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-fit">
        {(['weekly', 'monthly', 'yearly'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              period === p
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            {p === 'weekly' ? 'Haftalik' : p === 'monthly' ? 'Oylik' : 'Yillik'}
          </button>
        ))}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bajarilgan vazifalar"
          value="0/0"
          change="Ma'lumot yo'q"
          changeType="neutral"
          icon={<CheckSquare className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Jami xarajat"
          value={formatCurrency(0)}
          change="Tranzaksiya yo'q"
          changeType="neutral"
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Maqsad progressi"
          value="0%"
          change="Maqsad qo'shilmagan"
          changeType="neutral"
          icon={<Target className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard
          title="Faollik kunlari"
          value="0/7"
          change="Ma'lumot yo'q"
          changeType="neutral"
          icon={<Calendar className="w-5 h-5" />}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Task performance */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Vazifalar Samaradorligi</h3>
          <EmptyState
            icon={<BarChart3 className="w-6 h-6"/>}
            title="Ma'lumot yo'q"
            desc="Vazifalar qo'shilgandan so'ng bu yerda grafik paydo bo'ladi"
          />
        </Card>

        {/* Expense trend */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Xarajat Trendi</h3>
          <EmptyState
            icon={<TrendingUp className="w-6 h-6"/>}
            title="Tranzaksiya yo'q"
            desc="Moliya bo'limidan tranzaksiya qo'shing"
          />
        </Card>

        {/* Goals overview */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Maqsadlar Holati</h3>
          <EmptyState
            icon={<Target className="w-6 h-6"/>}
            title="Maqsad qo'shilmagan"
            desc="Maqsadlar bo'limidan yangi maqsad qo'shing"
          />
        </Card>

        {/* Activity */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Haftalik Faollik</h3>
          <EmptyState
            icon={<Flame className="w-6 h-6"/>}
            title="Faollik ma'lumoti yo'q"
            desc="Kunlik vazifalarni bajara boshlang"
          />
        </Card>
      </div>

    </div>
  )
}
