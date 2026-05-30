'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const steps = ['Hisob ma\'lumotlari', 'Profil', 'Xush kelibsiz!']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    language: 'uz',
    currency: 'UZS',
  })

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 0) { handleNext(); return }
    if (step === 1) {
      setLoading(true)
      await new Promise(r => setTimeout(r, 1200))
      setLoading(false)
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-32 left-20 w-48 h-48 bg-white rounded-full" />
        </div>
        <div className="relative text-white max-w-md text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Hammasi bepul!</h1>
          <p className="text-primary-100 text-lg mb-8">30 soniyada ro'yxatdan o'ting va boshlang</p>
          <div className="space-y-3">
            {['Kredit karta talab qilinmaydi', 'Istalgan vaqt bekor qilish mumkin', 'O\'zbek tiliga to\'liq moslashtirilgan', 'Offline rejim mavjud'].map(item => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-primary-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-500">KOTIBAJON</span>
          </div>

          {/* Progress */}
          {step < 2 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {steps.slice(0, 2).map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      i < step ? 'bg-success text-white' : i === step ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-xs ${i === step ? 'text-primary-500 font-medium' : 'text-gray-400'}`}>{s}</span>
                    {i < 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-success' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 0: Account */}
          {step === 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hisob yaratish</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Email va parolingizni kiriting</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email manzil"
                  type="email"
                  placeholder="sardor@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                <div>
                  <Input
                    label="Parol"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Kamida 8 ta belgi"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    hint="Kamida 8 ta belgi, harf va raqam bo'lishi kerak"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Davom etish
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                <span className="text-xs text-gray-400">yoki</span>
                <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </div>

              <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-button hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google bilan kirish
              </button>
            </>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profil ma'lumotlari</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Siz haqingizda bir oz ma'lumot bering</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="To'liq ismingiz"
                  type="text"
                  placeholder="Sardor Toshmatov"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Telefon raqam (ixtiyoriy)"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <div>
                  <label className="label">Til</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ code: 'uz', label: "O'zbek" }, { code: 'ru', label: 'Русский' }, { code: 'en', label: 'English' }].map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setForm({ ...form, language: lang.code })}
                        className={`py-2 text-sm rounded-button border transition-all ${
                          form.language === lang.code
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                            : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Valyuta</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['UZS', 'USD', 'EUR', 'RUB'].map(cur => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setForm({ ...form, currency: cur })}
                        className={`py-2 text-sm rounded-button border transition-all font-mono ${
                          form.currency === cur
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                            : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Tugatish
                </Button>
                <button type="button" onClick={() => setStep(0)} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  Orqaga qaytish
                </button>
              </form>
            </>
          )}

          {/* Step 2: Success */}
          {step === 2 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tabriklaymiz!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">Hisob muvaffaqiyatli yaratildi</p>
              <p className="text-sm text-gray-400 mb-8">Xush kelibsiz, <span className="text-primary-500 font-medium">{form.name || 'foydalanuvchi'}</span>!</p>
              <Button variant="primary" size="lg" className="w-full" onClick={() => window.location.href = '/dashboard'}>
                Dashboardga o'tish
              </Button>
            </div>
          )}

          {step < 2 && (
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Hisobingiz bormi?{' '}
              <Link href="/login" className="text-primary-500 font-medium hover:underline">
                Kirish
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
