'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { KotibaLogo } from '@/components/ui/KotibaLogo'
import toast from 'react-hot-toast'

/* ── Password strength ───────────────────────────────────────── */
function strength(pw: string) {
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const strengthLabel = ['', 'Juda zaif', 'Zaif', "O'rta", 'Kuchli', 'Juda kuchli']
const strengthColor  = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#059669']

/* ── Floating blob animation styles ─────────────────────────── */
const blobStyle = `
  @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(24px,-18px) scale(1.06)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(-20px,22px) scale(0.95)} }
  @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)}  50%{transform:translate(18px,14px) scale(1.04)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  .blob1{animation:float1 8s ease-in-out infinite}
  .blob2{animation:float2 11s ease-in-out infinite}
  .blob3{animation:float3 9s ease-in-out infinite 1s}
  .slide-up{animation:slideUp 0.5s cubic-bezier(.16,1,.3,1) both}
  .fade-in{animation:fadeIn 0.4s ease both}
`

export default function LoginPage() {
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({ email: '', password: '' })
  const [focused, setFocused]   = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const pw = form.password
  const pwStrength = strength(pw)

  function validate() {
    const e = { email: '', password: '' }
    if (!form.email.trim())                            e.email    = 'Email manzilini kiriting'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email noto'g'ri formatda"
    if (!form.password)                                e.password = 'Parolni kiriting'
    else if (form.password.length < 6)                 e.password = 'Parol kamida 6 ta belgi'
    setErrors(e)
    return !e.email && !e.password
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    // Save email; derive name from email prefix if not set yet
    localStorage.setItem('kj_email', form.email.trim())
    if (!localStorage.getItem('kj_name')) {
      const prefix = form.email.split('@')[0]
      const name = prefix.charAt(0).toUpperCase() + prefix.slice(1)
      localStorage.setItem('kj_name', name)
    }
    if (!localStorage.getItem('kj_plan')) {
      localStorage.setItem('kj_plan', 'Bepul tarif')
    }
    toast.success('Xush kelibsiz!')
    window.location.href = '/dashboard'
  }

  return (
    <>
      <style>{blobStyle}</style>
      <div className="min-h-screen flex bg-white">

        {/* ── LEFT PANEL ─────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
          style={{ background: 'linear-gradient(140deg, #022C22 0%, #064E3B 50%, #047857 100%)' }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(rgba(167,243,208,0.4) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          {/* Animated blobs */}
          <div className="blob1 absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-20"
               style={{ background: 'radial-gradient(circle, #34D399, transparent 70%)' }} />
          <div className="blob2 absolute bottom-[-100px] left-[-60px] w-[380px] h-[380px] rounded-full opacity-15"
               style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }} />
          <div className="blob3 absolute top-[40%] left-[30%] w-[280px] h-[280px] rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #A7F3D0, transparent 70%)' }} />

          {/* Logo + back link */}
          <div className="relative z-10 flex items-center justify-between">
            <KotibaLogo size={38} />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Bosh sahifa
            </Link>
          </div>

          <div className="relative z-10 max-w-sm">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-semibold">O'zbekiston №1 samaradorlik platformasi</span>
            </div>

            <h2 className="text-[2.8rem] font-black text-white leading-[1.1] mb-5 tracking-tight">
              Hayotingizni<br />
              <span style={{ color: '#6EE7B7' }}>tartibga soling</span>
            </h2>
            <p className="text-emerald-200 text-base leading-relaxed mb-10 font-medium">
              Vazifalar, moliya va maqsadlarni bitta aqlli platformada boshqaring.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                'Bepul boshlash',
                "O'zbek tili",
                'Offline rejim',
                "Kredit karta yo'q",
              ].map(f => (
                <span key={f} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Check className="w-3 h-3 flex-shrink-0" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[['50K+', 'Foydalanuvchi'], ['98%', 'Yetkazish'], ['4.8★', 'Reyting']].map(([val, lbl]) => (
              <div key={lbl} className="bg-white/8 border border-white/12 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-white font-black text-xl font-mono">{val}</div>
                <div className="text-emerald-300 text-xs font-medium mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col p-6 lg:p-10" style={{ background: '#F0FDF7' }}>

          {/* Mobile top bar */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <KotibaLogo size={28} />
            <Link href="/"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Bosh sahifa
            </Link>
          </div>

          {/* Desktop back link */}
          <div className="hidden lg:flex justify-end mb-2">
            <Link href="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs font-semibold transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Bosh sahifaga qaytish
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
          <div
            className={`w-full max-w-[400px] slide-up`}
            style={{ animationDelay: '0.05s' }}
          >
            {/* Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100/80">

              {/* Mobile logo - hidden since top bar shows it */}
              <div className="lg:hidden flex justify-center mb-7 hidden">
                <KotibaLogo size={32} />
              </div>

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Xush kelibsiz!</h1>
                <p className="text-slate-500 text-sm mt-1">Hisobingizga kiring</p>
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-5"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google bilan kirish
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">yoki email bilan</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email manzil</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="sardor@example.com"
                      value={form.email}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all"
                      style={{
                        borderColor: errors.email ? '#EF4444' : focused === 'email' ? '#059669' : '#E2E8F0',
                        boxShadow: focused === 'email' ? '0 0 0 3px rgba(5,150,105,0.12)' : 'none',
                      }}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">Parol</label>
                    <Link href="#" className="text-xs text-emerald-600 hover:underline font-medium">Parolni unutdingizmi?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
                      className="w-full h-11 pl-10 pr-10 rounded-xl border text-sm font-medium outline-none transition-all"
                      style={{
                        borderColor: errors.password ? '#EF4444' : focused === 'password' ? '#059669' : '#E2E8F0',
                        boxShadow: focused === 'password' ? '0 0 0 3px rgba(5,150,105,0.12)' : 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {pw.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                               style={{ background: i <= pwStrength ? strengthColor[pwStrength] : '#E2E8F0' }} />
                        ))}
                      </div>
                      {pwStrength > 0 && (
                        <p className="text-[11px] font-semibold" style={{ color: strengthColor[pwStrength] }}>
                          {strengthLabel[pwStrength]}
                        </p>
                      )}
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 mt-2"
                  style={{
                    background: loading ? '#6EE7B7' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(5,150,105,0.35)',
                  }}
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  ) : <>Kirish <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              Hisobingiz yo'qmi?{' '}
              <Link href="/register" className="text-emerald-600 font-bold hover:underline">
                Ro'yxatdan o'ting
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
