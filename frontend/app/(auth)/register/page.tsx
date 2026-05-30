'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { KotibaLogo } from '@/components/ui/KotibaLogo'
import toast from 'react-hot-toast'

/* ── Password strength ───────────────────────────────────────── */
function strength(pw: string) {
  let s = 0
  if (pw.length >= 6)  s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/\d/.test(pw))   s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const sLabel = ['', 'Juda zaif', 'Zaif', "O'rta", 'Kuchli', 'Juda kuchli']
const sColor  = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#059669']

/* ── CSS animations ──────────────────────────────────────────── */
const css = `
  @keyframes float1{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-16px) scale(1.05)}}
  @keyframes float2{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,20px) scale(0.96)}}
  @keyframes float3{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,12px) scale(1.03)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)}}
  @keyframes pop{0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1}}
  .blob1{animation:float1 9s ease-in-out infinite}
  .blob2{animation:float2 12s ease-in-out infinite}
  .blob3{animation:float3 10s ease-in-out infinite 1.5s}
  .slide-up{animation:slideUp 0.5s cubic-bezier(.16,1,.3,1) both}
  .slide-left{animation:slideLeft 0.4s cubic-bezier(.16,1,.3,1) both}
  .slide-right{animation:slideRight 0.4s cubic-bezier(.16,1,.3,1) both}
  .pop{animation:pop 0.5s cubic-bezier(.34,1.56,.64,1) both}
`

/* ── Left panel feature list ─────────────────────────────────── */
const leftFeatures = [
  { icon: '🚀', title: 'Bepul boshlang', desc: 'Kredit karta talab qilinmaydi' },
  { icon: '🇺🇿', title: "O'zbek tilida", desc: "To'liq mahalliylashtirish" },
  { icon: '📡', title: 'Offline rejim',   desc: 'Internetsiz ham ishlaydi (PWA)' },
  { icon: '🔒', title: 'Xavfsiz',         desc: 'Sizning ma\'lumotlar shifrlangan' },
]

export default function RegisterPage() {
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState<'left'|'right'>('left')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [form, setForm]       = useState({
    email: '', password: '', name: '', phone: '', language: 'uz', currency: 'UZS',
  })
  const [errors, setErrors]   = useState({ email: '', password: '', name: '' })

  useEffect(() => { setMounted(true) }, [])

  const pw = form.password
  const pwStr = strength(pw)

  function go(nextStep: number) {
    setDir(nextStep > step ? 'left' : 'right')
    setStep(nextStep)
  }

  function validateStep0() {
    const e = { email: '', password: '', name: '' }
    if (!form.email.trim())              e.email    = 'Email manzilini kiriting'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email noto'g'ri"
    if (!form.password)                  e.password = 'Parolni kiriting'
    else if (form.password.length < 6)   e.password = 'Kamida 6 ta belgi'
    setErrors(e)
    return !e.email && !e.password
  }

  function validateStep1() {
    const e = { email: '', password: '', name: '' }
    if (!form.name.trim()) e.name = 'Ismingizni kiriting'
    setErrors(e)
    return !e.name
  }

  async function handleStep0(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep0()) return
    go(1)
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep1()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    // Save user data to localStorage
    localStorage.setItem('kj_name',  form.name.trim())
    localStorage.setItem('kj_email', form.email.trim())
    localStorage.setItem('kj_plan',  'Bepul tarif')
    setLoading(false)
    go(2)
  }

  const inputBase = (field: string, err?: string) => ({
    borderColor: err ? '#EF4444' : focused === field ? '#059669' : '#E2E8F0',
    boxShadow: focused === field && !err ? '0 0 0 3px rgba(5,150,105,0.12)' : 'none',
  } as React.CSSProperties)

  return (
    <>
      <style>{css}</style>
      <div className="min-h-screen flex bg-white">

        {/* ── LEFT PANEL ─────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[48%] relative overflow-hidden p-12"
          style={{ background: 'linear-gradient(150deg, #022C22 0%, #064E3B 45%, #065F46 100%)' }}
        >
          {/* Back to home — top left inside left panel */}
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

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.18]" style={{
            backgroundImage: 'radial-gradient(rgba(167,243,208,0.5) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }} />

          {/* Blobs */}
          <div className="blob1 absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full opacity-[0.18]"
               style={{ background: 'radial-gradient(circle, #6EE7B7, transparent 70%)' }} />
          <div className="blob2 absolute -bottom-20 -left-16 w-[360px] h-[360px] rounded-full opacity-[0.14]"
               style={{ background: 'radial-gradient(circle, #34D399, transparent 70%)' }} />
          <div className="blob3 absolute top-[38%] left-[35%] w-[250px] h-[250px] rounded-full opacity-[0.10]"
               style={{ background: 'radial-gradient(circle, #A7F3D0, transparent 70%)' }} />

          {/* Middle content */}
          <div className="relative z-10 max-w-[360px]">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 mb-7 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-white/80 text-xs font-semibold">30 soniyada boshlang</span>
            </div>

            <h2 className="text-[2.6rem] font-black text-white leading-[1.1] mb-4 tracking-tight">
              Hammasi<br />
              <span style={{ color: '#6EE7B7' }}>bepul!</span>
            </h2>
            <p className="text-emerald-200 text-sm leading-relaxed mb-8 font-medium">
              Istalgan qurilmada ishlang. Vaqtingizni tejang.
            </p>

            {/* Feature list */}
            <div className="space-y-3.5">
              {leftFeatures.map((f, i) => (
                <div key={f.title}
                     className="flex items-center gap-3.5 bg-white/8 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
                     style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{f.title}</p>
                    <p className="text-emerald-300 text-xs font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#059669','#047857','#065F46','#6EE7B7'].map((c,i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-black text-white" style={{ background: c }}>
                  {String.fromCharCode(65+i*7)}
                </div>
              ))}
            </div>
            <p className="text-emerald-200 text-xs font-medium">
              <span className="text-white font-bold">50,000+</span> foydalanuvchi allaqachon boshlagan
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col p-6 lg:p-10" style={{ background: '#F0FDF7' }}>

          {/* Mobile top bar */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <KotibaLogo size={28} />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Bosh sahifa
            </Link>
          </div>

          {/* Desktop: back link top-right */}
          <div className="hidden lg:flex justify-end mb-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs font-semibold transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Bosh sahifaga qaytish
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
          <div className={`w-full max-w-[420px] slide-up`} style={{ animationDelay: '0.05s' }}>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100/80 overflow-hidden">

              {/* Step progress bar */}
              <div className="h-1 bg-slate-100">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: step === 0 ? '33%' : step === 1 ? '66%' : '100%',
                    background: 'linear-gradient(90deg, #059669, #34D399)',
                  }}
                />
              </div>

              <div className="p-8">
                {/* Mobile logo */}
                <div className="lg:hidden flex justify-center mb-6">
                  <KotibaLogo size={32} />
                </div>

                {/* Step indicator pills */}
                {step < 2 && (
                  <div className="flex items-center gap-2 mb-6">
                    {['Hisob', 'Profil'].map((lbl, i) => (
                      <div key={lbl} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 transition-all duration-300"
                               style={{
                                 background: i < step ? '#059669' : i === step ? '#059669' : '#E2E8F0',
                                 color: i <= step ? '#fff' : '#94A3B8',
                               }}>
                            {i < step ? <Check className="w-3 h-3" /> : i + 1}
                          </div>
                          <span className="text-xs font-semibold" style={{ color: i === step ? '#059669' : i < step ? '#059669' : '#94A3B8' }}>
                            {lbl}
                          </span>
                        </div>
                        {i < 1 && (
                          <div className="flex-1 h-px w-10 mx-1 transition-all duration-500"
                               style={{ background: step > 0 ? '#059669' : '#E2E8F0' }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── STEP 0: Account ───────────────────────────── */}
                {step === 0 && (
                  <div className={dir === 'left' ? 'slide-left' : 'slide-right'}>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hisob yaratish</h1>
                      <p className="text-slate-500 text-sm mt-1">Email va parolingizni kiriting</p>
                    </div>

                    {/* Google */}
                    <button type="button"
                      className="w-full h-11 flex items-center justify-center gap-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-5">
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google bilan ro'yxatdan o'tish
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-xs text-slate-400 font-medium">yoki email bilan</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <form onSubmit={handleStep0} noValidate className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email manzil</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="email" placeholder="sardor@example.com"
                            value={form.email}
                            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all"
                            style={inputBase('email', errors.email)}
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Parol</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type={showPw ? 'text' : 'password'} placeholder="Kamida 8 ta belgi"
                            value={form.password}
                            onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                            onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
                            className="w-full h-11 pl-10 pr-10 rounded-xl border text-sm font-medium outline-none transition-all"
                            style={inputBase('password', errors.password)}
                          />
                          <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {pw.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                                     style={{ background: i <= pwStr ? sColor[pwStr] : '#E2E8F0' }} />
                              ))}
                            </div>
                            {pwStr > 0 && <p className="text-[11px] font-semibold" style={{ color: sColor[pwStr] }}>{sLabel[pwStr]}</p>}
                          </div>
                        )}
                        {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                      </div>

                      <button type="submit"
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all mt-2"
                        style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}>
                        Davom etish <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* ── STEP 1: Profile ───────────────────────────── */}
                {step === 1 && (
                  <div className={dir === 'left' ? 'slide-left' : 'slide-right'}>
                    <div className="mb-6">
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil ma'lumotlari</h1>
                      <p className="text-slate-500 text-sm mt-1">Siz haqingizda bir oz ma'lumot</p>
                    </div>

                    <form onSubmit={handleStep1} noValidate className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">To'liq ismingiz *</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="text" placeholder="Sardor Toshmatov"
                            value={form.name}
                            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all"
                            style={inputBase('name', errors.name)}
                          />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Telefon (ixtiyoriy)</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="tel" placeholder="+998 90 123 45 67"
                            value={form.phone}
                            onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-none transition-all"
                            style={inputBase('phone')}
                          />
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Til</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ code:'uz', label:"O'zbek" }, { code:'ru', label:'Русский' }, { code:'en', label:'English' }].map(lang => (
                            <button key={lang.code} type="button"
                              onClick={() => setForm(f => ({ ...f, language: lang.code }))}
                              className="py-2 text-xs rounded-xl border font-semibold transition-all"
                              style={{
                                borderColor: form.language === lang.code ? '#059669' : '#E2E8F0',
                                background:  form.language === lang.code ? '#F0FDF4' : 'white',
                                color:       form.language === lang.code ? '#059669' : '#64748B',
                                boxShadow:   form.language === lang.code ? '0 0 0 2px rgba(5,150,105,0.15)' : 'none',
                              }}>
                              {lang.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Currency */}
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Valyuta</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['UZS','USD','EUR','RUB'].map(cur => (
                            <button key={cur} type="button"
                              onClick={() => setForm(f => ({ ...f, currency: cur }))}
                              className="py-2 text-xs rounded-xl border font-mono font-bold transition-all"
                              style={{
                                borderColor: form.currency === cur ? '#059669' : '#E2E8F0',
                                background:  form.currency === cur ? '#F0FDF4' : 'white',
                                color:       form.currency === cur ? '#059669' : '#64748B',
                                boxShadow:   form.currency === cur ? '0 0 0 2px rgba(5,150,105,0.15)' : 'none',
                              }}>
                              {cur}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => go(0)}
                          className="h-11 px-4 flex items-center gap-1.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                          <ArrowLeft className="w-4 h-4" /> Orqaga
                        </button>
                        <button type="submit" disabled={loading}
                          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                          style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}>
                          {loading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                          ) : <>Yakunlash <ArrowRight className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── STEP 2: Success ───────────────────────────── */}
                {step === 2 && (
                  <div className="text-center py-6 fade-in">
                    {/* Animated check circle */}
                    <div className="pop w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                         style={{ background: 'linear-gradient(135deg, #059669, #34D399)', boxShadow: '0 8px 30px rgba(5,150,105,0.35)' }}>
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Tabriklaymiz! 🎉</h2>
                    <p className="text-slate-500 text-sm mb-1">Hisob muvaffaqiyatli yaratildi</p>
                    <p className="text-sm font-bold mb-8" style={{ color: '#059669' }}>
                      Xush kelibsiz, {form.name || 'foydalanuvchi'}!
                    </p>

                    {/* Mini summary */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Email</span>
                        <span className="font-semibold text-slate-800 truncate ml-4">{form.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Til</span>
                        <span className="font-semibold text-slate-800">
                          {form.language === 'uz' ? "O'zbek" : form.language === 'ru' ? 'Русский' : 'English'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Valyuta</span>
                        <span className="font-semibold text-slate-800 font-mono">{form.currency}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = '/dashboard'}
                      className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}>
                      Dashboardga o'tish <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {step < 2 && (
              <p className="text-center text-sm text-slate-500 mt-5">
                Hisobingiz bormi?{' '}
                <Link href="/login" className="text-emerald-600 font-bold hover:underline">Kirish</Link>
              </p>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
