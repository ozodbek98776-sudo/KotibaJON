// VARIANT B — Obsidian Dark (Premium Neon uslubi)
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, CheckSquare, DollarSign, Target, Calendar,
  Bell, BarChart3, Check, Star, Zap, Shield, Globe, Users, Sparkles,
} from 'lucide-react'

const features = [
  { icon: CheckSquare, title: 'Vazifalar',     desc: "Kanban va ro'yxat ko'rinishi. Deadline, prioritet, subtasklar.", color: '#059669' },
  { icon: Bell,        title: 'Eslatmalar',    desc: 'Push, SMS, Telegram orqali o\'z vaqtida eslatmalar.', color: '#3B82F6' },
  { icon: DollarSign,  title: 'Moliya',        desc: "Byudjet nazorati. 80% chegib qolgan bo'lsa ogohlantirish.", color: '#F59E0B' },
  { icon: Target,      title: 'Maqsadlar',     desc: "Streak tizimi bilan yillik maqsadlarni kuzating.", color: '#8B5CF6' },
  { icon: Calendar,    title: 'Muhim Sanalar', desc: "To'yliklar, to'lovlar. 30 kun oldindan eslatma.", color: '#EF4444' },
  { icon: BarChart3,   title: 'Hisobotlar',    desc: 'Haftalik/oylik tahlil. PDF eksport.', color: '#06B6D4' },
]
const plans = [
  { name: 'Bepul', price: '0', features: ['50 vazifa/oy', 'Push bildirishnomalar', 'Asosiy moliya', '3 maqsad'], cta: 'Boshlash', highlight: false, border: 'border-white/10' },
  { name: 'Pro',   price: '29 000', features: ['Cheksiz vazifalar', 'Push+SMS+Telegram', "To'liq moliya", 'Cheksiz maqsad', 'PDF hisobot', '1 GB'], cta: 'Pro boshlash', highlight: true, border: 'border-emerald-500/60' },
  { name: 'Max',   price: '59 000', features: ["Pro'dagi hamma narsa", 'AI tahlil', 'Google Calendar', '5 GB', 'Priority support'], cta: 'Max boshlash', highlight: false, border: 'border-amber-500/40' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#0A0A0F' }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.90)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="logo" width={34} height={34} className="rounded-xl" />
            <span className="text-[17px] font-black tracking-tight text-white">KOTIBA<span style={{ color: '#00FF87' }}>JON</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {[['#xususiyatlar','Xususiyatlar'],['#narxlar','Narxlar'],['#fikrlar','Fikrlar']].map(([h,l]) => (
              <a key={h} href={h} className="text-sm font-semibold text-white/50 transition-colors hover:text-white">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-white/50 hover:text-white transition-colors">Kirish</Link>
            <Link href="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-bold text-black transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#00FF87,#00D4FF)', boxShadow: '0 0 20px rgba(0,255,135,0.3)' }}>
              Boshlash <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-28 pt-20">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-20"
             style={{ background: 'radial-gradient(ellipse,rgba(0,255,135,0.25) 0%,transparent 70%)' }} />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full opacity-15"
             style={{ background: 'radial-gradient(ellipse,rgba(0,212,255,0.30) 0%,transparent 70%)' }} />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-14 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-white/70 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              O'zbekiston №1 samaradorlik platformasi
            </div>
            <h1 className="mb-6 text-6xl font-black leading-[1.06] tracking-tight lg:text-7xl">
              <span className="text-white">Vaqtingizni</span><br />
              <span style={{ background: 'linear-gradient(135deg,#00FF87,#00D4FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                tejaydigan
              </span><br />
              <span className="text-white">yagona ilova</span>
            </h1>
            <p className="mb-10 text-xl font-medium leading-relaxed text-white/50">
              Vazifalar, moliya, maqsadlar va muhim sanalar — barchasi bitta aqlli platformada. O'zbek tiliga to'liq moslashtirilgan.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/register" className="inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-black text-black transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#00FF87,#00D4FF)', boxShadow: '0 0 30px rgba(0,255,135,0.35)' }}>
                Bepul boshlash <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 text-base font-bold text-white transition-all hover:bg-white/10">
                Demo ko'rish
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6">
              {[['50K+','Foydalanuvchi'],['98%','Yetkazish'],['4.8★','Reyting'],['3 til','O\'zb · Rus · EN']].map(([v,l]) => (
                <div key={l} className="text-center">
                  <div className="text-lg font-black text-white">{v}</div>
                  <div className="text-xs font-semibold text-white/40">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Logo showcase */}
          <div className="relative hidden flex-1 items-center justify-center lg:flex">
            <div className="absolute h-80 w-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,rgba(0,255,135,0.4),transparent 70%)' }} />
            <div className="relative rounded-3xl border border-white/10 p-10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(0,255,135,0.12), 0 25px 80px rgba(0,0,0,0.5)' }}>
              <Image src="/logo.png" alt="KOTIBAJON" width={200} height={200} className="rounded-2xl" />
              <p className="mt-5 text-center text-lg font-black text-white tracking-widest">KOTIBAJON</p>
              <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: '#00FF87' }}>Shaxsiy raqamli kotiba</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="xususiyatlar" className="px-6 py-24" style={{ background: '#0D0D14' }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-white/30">Imkoniyatlar</p>
            <h2 className="text-4xl font-black tracking-tight text-white">Hamma narsa bitta joyda</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="group rounded-2xl border border-white/8 bg-white/4 p-6 transition-all hover:border-white/20 hover:bg-white/8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: f.color + '22' }}>
                    <Icon className="h-5 w-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="mb-2 text-sm font-black text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="narxlar" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-white/30">Narxlar</p>
            <h2 className="text-4xl font-black tracking-tight text-white">Oddiy va tushunarli narxlar</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map(p => (
              <div key={p.name} className={`relative rounded-2xl border-2 p-7 ${p.border} transition-all ${p.highlight ? 'scale-105' : ''}`}
                   style={{ background: p.highlight ? 'rgba(0,255,135,0.05)' : 'rgba(255,255,255,0.03)', boxShadow: p.highlight ? '0 0 40px rgba(0,255,135,0.12)' : 'none' }}>
                {p.highlight && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-black text-black whitespace-nowrap" style={{ background:'linear-gradient(135deg,#00FF87,#00D4FF)' }}>⭐ Ommabop</span>}
                <p className="mb-1 text-lg font-black text-white">{p.name}</p>
                <div className="mb-5"><span className="font-mono text-4xl font-black text-white">{p.price}</span><span className="ml-1 text-white/40 text-sm">so'm/oy</span></div>
                <ul className="mb-6 space-y-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition-all"
                      style={{ background: p.highlight ? 'linear-gradient(135deg,#00FF87,#00D4FF)' : 'rgba(255,255,255,0.08)', color: p.highlight ? '#000' : '#fff' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 p-14 text-center" style={{ background: 'rgba(0,255,135,0.04)', boxShadow: '0 0 80px rgba(0,255,135,0.08)' }}>
          <Image src="/logo.png" alt="logo" width={64} height={64} className="mx-auto mb-6 rounded-2xl" />
          <h2 className="mb-3 text-4xl font-black text-white tracking-tight">Bugun boshlang!</h2>
          <p className="mb-8 font-medium text-white/40">30 soniyada ro'yxatdan o'ting. Kredit karta talab etilmaydi.</p>
          <Link href="/register" className="inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-black text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#00FF87,#00D4FF)', boxShadow: '0 0 30px rgba(0,255,135,0.35)' }}>
            Hoziroq boshlash <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="logo" width={28} height={28} className="rounded-lg" />
            <span className="font-black text-sm text-white">KOTIBA<span style={{ color:'#00FF87' }}>JON</span></span>
          </div>
          <p className="text-xs font-medium text-white/30">© 2026 KOTIBAJON. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-5">
            {['Maxfiylik','Shartlar','Aloqa'].map(l => (
              <a key={l} href="#" className="text-xs font-semibold text-white/30 transition-colors hover:text-white/70">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
