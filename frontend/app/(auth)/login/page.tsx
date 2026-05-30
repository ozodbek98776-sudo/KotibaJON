'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })

  function validate() {
    const e = { email: '', password: '' }
    if (!form.email.trim()) e.email = 'Email manzilini kiriting'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email noto\'g\'ri formatda'
    if (!form.password) e.password = 'Parolni kiriting'
    else if (form.password.length < 6) e.password = 'Parol kamida 6 ta belgi bo\'lishi kerak'
    setErrors(e)
    return !e.email && !e.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Xush kelibsiz!')
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #059669 0%, #064E3B 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-16 left-16 w-72 h-72 bg-white rounded-full" />
          <div className="absolute bottom-16 right-16 w-52 h-52 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-white rounded-full" />
        </div>
        <div className="relative text-white max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">KOTIBAJON</h1>
            <p className="text-lg text-emerald-100">Shaxsiy Raqamli Kotibingiz</p>
          </div>
          <div className="space-y-3 text-left">
            {[
              'Vazifalaringizni tartibga saling',
              'Moliyangizni nazorat qiling',
              'Maqsadlaringizga erishing',
              'Muhim sanalarni unutmang',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-emerald-100 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-primary-600 dark:text-primary-300">KOTIBAJON</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-primary-900 dark:text-primary-50 tracking-tight">
              Xush kelibsiz!
            </h2>
            <p className="text-primary-500 dark:text-primary-400 mt-1.5 text-sm">
              Hisobingizga kiring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email manzil"
              type="email"
              placeholder="sardor@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
            />

            <div>
              <Input
                label="Parol"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="hover:text-primary-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password}
              />
              <div className="flex justify-end mt-1">
                <Link href="#" className="text-xs text-primary-500 hover:underline font-medium">
                  Parolni unutdingizmi?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" loading={loading}>
              Kirish
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border-light dark:bg-primary-700" />
            <span className="text-xs text-primary-400 font-medium">yoki</span>
            <div className="flex-1 h-px bg-border-light dark:bg-primary-700" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border-light dark:border-primary-700 rounded-button hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-sm font-semibold text-primary-700 dark:text-primary-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google bilan kirish
          </button>

          <p className="mt-6 text-center text-sm text-primary-500 dark:text-primary-400">
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" className="text-primary-600 font-bold hover:underline">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
