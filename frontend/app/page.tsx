import Link from 'next/link'
import {
  CheckSquare, DollarSign, Target, Calendar,
  Bell, BarChart3, ArrowRight,
  Check, Star, Shield, Globe,
  Users, Award, Sparkles, Zap,
} from 'lucide-react'
import { KotibaLogo, KotibaIcon } from '@/components/ui/KotibaLogo'

const features = [
  { icon: CheckSquare, title: 'Vazifalar Boshqaruvi',  desc: 'Kunlik, haftalik va oylik vazifalaringizni tartibli boshqaring. Kanban, ro\'yxat va kalendar ko\'rinishlari.' },
  { icon: Bell,        title: 'Aqlli Eslatmalar',      desc: 'Push, SMS, Telegram va ringtone eslatmalar. Snooze funksiyasi. Hech qachon muhim ishni unutmang.' },
  { icon: DollarSign,  title: 'Moliya Nazorati',       desc: 'Daromad va xarajatlaringizni kuzating. Byudjet belgilang va 80% limitda ogohlantirish oling.' },
  { icon: Target,      title: 'Maqsadlar Moduli',      desc: 'Yillik maqsadlaringizni bosqichlarga bo\'ling, progress foizda kuzating. Streak tizimi bilan.' },
  { icon: Calendar,    title: 'Muhim Sanalar',         desc: 'Tug\'ilgan kunlar, to\'yliklar va to\'lovlarni unutmang. 1, 3, 7 va 30 kun oldin erta eslatmalar.' },
  { icon: BarChart3,   title: 'Tahlil va Hisobotlar', desc: 'Haftalik va oylik hisobotlar. Samaradorligingizni interaktiv grafiklarda kuzating. PDF eksport.' },
]

const plans = [
  {
    name: 'Bepul', price: '0', per: '', desc: 'Boshlash uchun',
    features: ['50 ta vazifa/oy', 'Push bildirishnomalar', 'Asosiy moliya', '3 ta maqsad'],
    cta: 'Bepul boshlash', style: 'border-neutral-200 dark:border-[#2A2A2A]',
    btnStyle: 'border border-neutral-200 dark:border-[#2A2A2A] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#1A1A1A]',
  },
  {
    name: 'Pro', price: '29,000', per: '/oy', desc: 'Eng ommabop',
    badge: '⭐ Ommabop',
    features: ['Cheksiz vazifalar', 'Push + SMS + Telegram', 'To\'liq moliya', 'Cheksiz maqsadlar', 'Oylik hisobotlar', '1 GB saqlash'],
    cta: 'Pro boshlash',
    style: 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/10',
    btnStyle: 'bg-[#0F0F0F] text-white hover:bg-[#1c1c1c] dark:bg-white dark:text-[#0F0F0F] dark:hover:bg-neutral-100',
    featured: true,
  },
  {
    name: 'Premium', price: '59,000', per: '/oy', desc: 'Maksimal',
    features: ['Pro\'dagi hamma narsa', 'AI xarajat tahlili', 'PDF hisobotlar', 'Google Calendar', 'Email eslatmalar', '5 GB saqlash'],
    cta: 'Premium boshlash',
    style: 'border-accent-400',
    btnStyle: 'bg-accent-500 text-white hover:bg-accent-600',
  },
]

const stats = [
  { value: '50K+', label: 'Foydalanuvchi',   icon: Users },
  { value: '98%',  label: 'Push yetkazish',  icon: Zap },
  { value: '4.8★', label: 'App reytingi',    icon: Star },
  { value: '3 til', label: 'O\'zbek · Rus · EN', icon: Globe },
]

const reviews = [
  { name: 'Sardor T.', role: 'Freelancer', av: 'ST', color: '#0F0F0F', text: 'Endi mijozlar deadlinlarini hech qachon unutmayman. Moliya moduli daromadlarimni tartibga soldi!' },
  { name: 'Nilufar R.', role: 'Uy bekasi', av: 'NR', color: '#D97706', text: 'Bolalarim sanalarini va maktab to\'lovlarini kuzatish juda osonlashdi. O\'zbek tili — juda qulay!' },
  { name: 'Jasur M.',  role: 'IT mutaxassis', av: 'JM', color: '#2563EB', text: 'Notion va Todoist O\'zbek tiliga moslashmagan edi. KOTIBAJON bizning madaniyatimizga to\'liq mos!' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#09090B]/95 backdrop-blur-xl border-b border-neutral-100 dark:border-[#1A1A1A]"
           style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-5 h-[60px] flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:opacity-85 transition-opacity">
            <KotibaLogo size={34} />
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[['#features','Xususiyatlar'], ['#pricing','Narxlar'], ['#reviews','Fikrlar']].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#111] rounded-lg transition-all"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              href="/login"
              className="hidden sm:block px-3.5 py-1.5 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-[#111]"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              className="h-9 px-4 inline-flex items-center gap-1.5 text-white text-sm font-bold rounded-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
              }}
            >
              Boshlash
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)',
               backgroundSize: '32px 32px',
             }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA] dark:to-[#09090B] pointer-events-none" />
        {/* Blue glow behind logo */}
        <div className="absolute right-0 top-0 w-[55%] h-full pointer-events-none hidden lg:block"
             style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center gap-12 pt-16 pb-20 lg:pt-20 lg:pb-28">

            {/* ── LEFT: Text ─────────────────────────────────────── */}
            <div className="flex-1 text-center lg:text-left max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-[#2A2A2A] rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-8"
                   style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                O'zbekistondagi №1 Samaradorlik Platformasi
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[64px] font-black text-neutral-900 dark:text-white mb-6 tracking-tight leading-[1.05]">
                Hayotingizni{' '}
                <span className="text-gradient-accent">tartibga</span>
                {' '}soling
              </h1>

              <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed font-medium">
                Vazifalar, moliya, maqsadlar va muhim sanalarni bitta aqlli
                platformada boshqaring. O'zbek tiliga to'liq moslashtirilgan.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-12">
                <Link href="/register"
                      className="h-12 px-8 inline-flex items-center gap-2 text-white text-base font-black rounded-xl transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg,#1D4ED8,#2563EB)', boxShadow: '0 6px 20px rgba(37,99,235,0.40)' }}>
                  Bepul boshlash <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/dashboard"
                      className="h-12 px-8 inline-flex items-center gap-2 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-[#2A2A2A] text-neutral-700 dark:text-neutral-300 text-base font-bold rounded-xl transition-all hover:bg-neutral-50 dark:hover:bg-[#1A1A1A]"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  Demo ko'rish
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0">
                {stats.map(s => {
                  const Icon = s.icon
                  return (
                    <div key={s.label}
                         className="bg-white dark:bg-[#111111] rounded-xl p-3.5 border border-neutral-200 dark:border-[#1F1F1F] text-center"
                         style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <Icon className="w-4 h-4 text-neutral-400 mx-auto mb-1.5" />
                      <div className="text-lg font-black text-neutral-900 dark:text-white font-mono">{s.value}</div>
                      <div className="text-[10px] font-semibold text-neutral-400 mt-0.5 leading-tight">{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── RIGHT: Logo showcase ──────────────────────────── */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative">
              {/* Outer glow rings */}
              <div className="absolute w-[440px] h-[440px] rounded-full border border-blue-200/30 dark:border-blue-800/30 animate-pulse" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-300/20 dark:border-blue-700/20" />

              {/* Dark card with logo */}
              <div
                className="relative w-[320px] h-[320px] rounded-3xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 40%, #0d1b3e 100%)',
                  boxShadow: '0 0 80px rgba(37,99,235,0.25), 0 0 0 1px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Radial blue glow inside card */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                     style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(37,99,235,0.18) 0%, transparent 65%)' }} />

                {/* Dot grid inside card */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-30"
                     style={{
                       backgroundImage: 'radial-gradient(rgba(99,146,255,0.3) 1px, transparent 1px)',
                       backgroundSize: '20px 20px',
                     }} />

                {/* The logo itself */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <KotibaIcon size={200} variant="color" />
                  <div className="text-center">
                    <p className="text-white font-black text-2xl tracking-widest">KOTIBAJON</p>
                    <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mt-1">
                      Shaxsiy Raqamli Kotiba
                    </p>
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg" />
              </div>

              {/* Floating feature badges */}
              <div className="absolute -left-4 top-[20%] bg-white dark:bg-[#111] rounded-xl px-3.5 py-2.5 border border-neutral-200 dark:border-[#222] text-xs font-bold text-neutral-700 dark:text-neutral-300"
                   style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                ✅ 50,000+ foydalanuvchi
              </div>
              <div className="absolute -right-4 bottom-[22%] bg-white dark:bg-[#111] rounded-xl px-3.5 py-2.5 border border-neutral-200 dark:border-[#222] text-xs font-bold text-neutral-700 dark:text-neutral-300"
                   style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                🇺🇿 O'zbek tiliga mos
              </div>
              <div className="absolute left-[15%] -bottom-2 bg-white dark:bg-[#111] rounded-xl px-3.5 py-2.5 border border-neutral-200 dark:border-[#222] text-xs font-bold text-neutral-700 dark:text-neutral-300"
                   style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
                ⚡ Offline ishlaydi
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5 bg-white dark:bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">Imkoniyatlar</p>
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-3 tracking-tight">
              Hamma narsa — <span className="text-gradient-accent">bitta joyda</span>
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto font-medium">
              Ko'p ilovalar o'rniga bitta aqlli platforma. Vaqtingizni tejang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={f.title}
                     className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-6 border border-neutral-200 dark:border-[#1F1F1F] hover:border-neutral-300 dark:hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-200 group"
                     style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-white dark:text-neutral-900" />
                  </div>
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>

          {/* USP strip */}
          <div className="mt-12 p-8 rounded-2xl bg-[#0F0F0F] dark:bg-[#111111] border border-[#1F1F1F]">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                { icon: Globe,  title: "O'zbek tili birinchi",  desc: 'UI, bildirishnomalar va hisobotlar to\'liq o\'zbek tilida' },
                { icon: Zap,    title: 'Mahalliy SMS Gateway', desc: 'Eskiz va Play Mobile orqali ishonchli eslatmalar' },
                { icon: Shield, title: 'Offline rejim',        desc: 'Internet bo\'lmasa ham asosiy funksiyalar ishlaydi (PWA)' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title}>
                    <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <h3 className="font-black text-sm text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">Narxlar</p>
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">
              Oddiy va <span className="text-gradient-accent">tushunarli</span> narxlar
            </h2>
            <p className="text-neutral-400 font-semibold text-sm">Yillik to'lovda 20% chegirma</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(p => (
              <div key={p.name}
                   className={`relative bg-white dark:bg-[#111111] rounded-2xl p-6 border-2 ${p.style} transition-all`}
                   style={{ boxShadow: p.featured ? '0 8px 30px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.06)' }}>
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0F0F0F] dark:bg-white text-white dark:text-[#0F0F0F] text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                      {p.badge}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">{p.name}</h3>
                  <p className="text-xs font-semibold text-neutral-400 mt-0.5">{p.desc}</p>
                </div>
                <div className="mb-5">
                  <span className="text-4xl font-black text-neutral-900 dark:text-white font-mono">{p.price}</span>
                  {p.price !== '0'
                    ? <span className="text-neutral-400 text-sm font-medium ml-1">so'm{p.per}</span>
                    : <span className="text-neutral-400 text-sm font-medium ml-1">so'm</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-neutral-600 dark:text-neutral-300" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                      className={`w-full flex items-center justify-center h-10 rounded-lg text-sm font-bold transition-all ${p.btnStyle}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-5 bg-white dark:bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">Fikrlar</p>
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              Ular nima <span className="text-gradient-accent">deydi?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.name}
                   className="bg-[#FAFAFA] dark:bg-[#111111] rounded-xl p-6 border border-neutral-200 dark:border-[#1F1F1F]">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5 font-medium">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                       style={{ background: r.color }}>
                    {r.av}
                  </div>
                  <div>
                    <p className="text-sm font-black text-neutral-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-neutral-400 font-medium">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0F0F0F] rounded-2xl p-12 text-center"
               style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.20)' }}>
            <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-6"
                 style={{ boxShadow: '0 6px 20px rgba(245,158,11,0.40)' }}>
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Bugun boshlang!</h2>
            <p className="text-neutral-400 mb-8 font-medium">30 soniyada ro'yxatdan o'ting. Kredit karta talab etilmaydi.</p>
            <Link href="/register"
                  className="h-12 px-8 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-base font-black rounded-xl transition-all"
                  style={{ boxShadow: '0 6px 20px rgba(245,158,11,0.40)' }}>
              Hoziroq boshlash <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 dark:border-[#1A1A1A] py-8 px-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <KotibaLogo size={28} />
          <p className="text-xs font-medium text-neutral-400">© 2026 KOTIBAJON. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-5">
            {['Maxfiylik', 'Shartlar', 'Aloqa'].map(l => (
              <a key={l} href="#" className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
