'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, CheckSquare, Target, Download, Calendar, Trophy, TrendingDown, AlertTriangle, Flame } from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { formatCurrency, cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts'

type Period = 'weekly' | 'monthly' | 'yearly'

const weeklyData = [
  { day: 'Dush', tasks: 5, done: 4, expense: 45000 },
  { day: 'Sesh', tasks: 3, done: 3, expense: 32000 },
  { day: 'Chor', tasks: 7, done: 5, expense: 78000 },
  { day: 'Pay', tasks: 4, done: 2, expense: 55000 },
  { day: 'Jum', tasks: 6, done: 6, expense: 89000 },
  { day: 'Shan', tasks: 2, done: 2, expense: 120000 },
  { day: 'Yak', tasks: 1, done: 1, expense: 34000 },
]

const monthlyExpense = [
  { month: 'Sen', value: 2100000 },
  { month: 'Okt', value: 2400000 },
  { month: 'Noy', value: 1950000 },
  { month: 'Dek', value: 2800000 },
  { month: 'Yan', value: 2300000 },
  { month: 'Fev', value: 1950000 },
]

const goalProgress = [
  { name: 'Yurib yurish', progress: 72, color: '#27AE60' },
  { name: "Jamg'arish", progress: 64, color: '#1A3A5C' },
  { name: 'Kitob o\'qish', progress: 58, color: '#9B59B6' },
  { name: 'TypeScript', progress: 85, color: '#F5A623' },
]

const activityData = [
  { week: '1-hafta', tasks: 22, goals: 3 },
  { week: '2-hafta', tasks: 18, goals: 4 },
  { week: '3-hafta', tasks: 25, goals: 5 },
  { week: '4-hafta', tasks: 20, goals: 3 },
]

const insights: { icon: React.ReactNode; text: string; type: string }[] = [
  { icon: <Trophy className="w-4 h-4"/>,        text: 'Bu oy eng ko\'p bajargan kuningiz: 6 ta vazifa (Juma)', type: 'success' },
  { icon: <TrendingDown className="w-4 h-4"/>,  text: 'Oziq-ovqat xarajati o\'tgan oydan 12% oshdi',           type: 'warning' },
  { icon: <Target className="w-4 h-4"/>,        text: 'TypeScript maqsadi deyarli bajarilmoqda (85%)',          type: 'info'    },
  { icon: <AlertTriangle className="w-4 h-4"/>, text: 'Oy o\'rtasida 2 kun vazifa bajarilmadi',                 type: 'warning' },
  { icon: <Flame className="w-4 h-4"/>,         text: 'Sog\'liq maqsadida 7 kunlik streak davom etmoqda!',      type: 'success' },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('weekly')

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Hisobotlar va Tahlil</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Fevral 2025</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          PDF yuklash
        </Button>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-button w-fit">
        {(['weekly', 'monthly', 'yearly'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-4 py-1.5 rounded text-sm font-medium transition-all',
              period === p ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 dark:text-neutral-400'
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
          value="23/28"
          change="82% samaradorlik"
          changeType="up"
          icon={<CheckSquare className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Jami xarajat"
          value={formatCurrency(1950000)}
          change="-8% o'tgan haftadan"
          changeType="up"
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
        <StatCard
          title="Maqsad progressi"
          value="69%"
          change="+5% o'tgan haftadan"
          changeType="up"
          icon={<Target className="w-5 h-5" />}
          color="secondary"
        />
        <StatCard
          title="Faollik kunlari"
          value="6/7"
          change="86% aktiv"
          changeType="up"
          icon={<Calendar className="w-5 h-5" />}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Task performance */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Vazifalar Samaradorligi</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
              <Bar dataKey="tasks" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Jami" />
              <Bar dataKey="done" fill="#1A3A5C" radius={[4, 4, 0, 0]} name="Bajarildi" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-neutral-200" />
              <span className="text-xs text-neutral-400">Jami vazifalar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-neutral-900 dark:bg-white" />
              <span className="text-xs text-neutral-400">Bajarildi</span>
            </div>
          </div>
        </Card>

        {/* Expense trend */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Xarajat Trendi</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyExpense} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3A5C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1A3A5C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000000}M`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
              <Area type="monotone" dataKey="value" stroke="#1A3A5C" strokeWidth={2} fill="url(#expGrad)" name="Xarajat" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Goals overview */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Maqsadlar Holati</h3>
          <div className="space-y-4">
            {goalProgress.map(g => (
              <div key={g.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{g.name}</span>
                  <span className="text-sm font-bold font-mono" style={{ color: g.color }}>{g.progress}%</span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${g.progress}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity */}
        <Card padding="md">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mb-4">Haftalik Faollik</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
              <Line type="monotone" dataKey="tasks" stroke="#1A3A5C" strokeWidth={2} dot={{ r: 4 }} name="Vazifalar" />
              <Line type="monotone" dataKey="goals" stroke="#F5A623" strokeWidth={2} dot={{ r: 4 }} name="Maqsadlar" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI Insights */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg flex items-center justify-center">
            <span className="text-base">🤖</span>
          </div>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Aqlli Tahlil</h3>
          <Badge variant="primary">AI</Badge>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg',
                insight.type === 'success' && 'bg-green-50 dark:bg-green-900/20',
                insight.type === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20',
                insight.type === 'info' && 'bg-blue-50 dark:bg-blue-900/20',
              )}
            >
              <span className={cn('flex-shrink-0 mt-0.5',
                insight.type==='success'?'text-green-600 dark:text-green-400':
                insight.type==='warning'?'text-amber-600 dark:text-amber-400':
                'text-blue-600 dark:text-blue-400')}>{insight.icon}</span>
              <p className={cn(
                'text-sm',
                insight.type === 'success' && 'text-green-700 dark:text-green-400',
                insight.type === 'warning' && 'text-yellow-700 dark:text-yellow-400',
                insight.type === 'info' && 'text-blue-700 dark:text-blue-400',
              )}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
