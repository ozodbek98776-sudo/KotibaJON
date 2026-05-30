import Link from 'next/link'
import Image from 'next/image'
import {
  CheckSquare, DollarSign, Target, Calendar,
  Bell, BarChart3, ArrowRight, Check, Star,
  Shield, Globe, Users, Award, Sparkles, Zap,
  ChevronRight, TrendingUp, Clock, Smartphone,
} from 'lucide-react'

/* ── Data ─────────────────────────────────────────────────────── */
const features = [
  { icon: CheckSquare, title: 'Vazifalar Boshqaruvi', color: '#2563EB', bg: '#EFF6FF',
    desc: "Kanban, ro'yxat va kalendar ko'rinishi. Deadline, prioritet va subtasklar bilan." },
  { icon: Bell, title: 'Aqlli Eslatmalar', color: '#7C3AED', bg: '#F5F3FF',
    desc: 'Push, SMS, Telegram va ringtone orqali. Snooze funksiyasi bilan hech narsa unutilmaydi.' },
  { icon: DollarSign, title: 'Moliya Nazorati', color: '#059669', bg: '#ECFDF5',
    desc: "Daromad va xarajat kuzating. Byudjet belgilang, 80% limitda ogohlantirish oling." },
  { icon: Target, title: 'Maqsadlar Moduli', color: '#DC2626', bg: '#FEF2F2',
    desc: "Yillik maqsadlarni bosqichlarga bo'ling, foizda kuzating. Streak tizimi." },
  { icon: Calendar, title: 'Muhim Sanalar', color: '#D97706', bg: '#FFFBEB',
    desc: "Tug'ilgan kunlar, to'yliklar, to'lovlar. 1-3-7-30 kun oldin eslatmalar." },
  { icon: BarChart3, title: 'Tahlil va Hisobotlar', color: '#0891B2', bg: '#ECFEFF',
    desc: "Haftalik va oylik hisobotlar. Samaradorlikni grafiklarda kuzating. PDF eksport." },
]

const plans = [
  {
    name: 'Bepul', price: '0', period: '', desc: 'Boshlash uchun',
    features: ['50 ta vazifa/oy', 'Push bildirishnomalar', 'Asosiy moliya', '3 ta maqsad'],
    cta: 'Bepul boshlash', featured: false,
  },
  {
    name: 'Pro', price: '29 000', period: '/oy', desc: 'Eng ommabop tarif',
    badge: '⭐ Ommabop',
    features: ['Cheksiz vazifalar', 'Push + SMS + Telegram', "To'liq moliya", 'Cheksiz maqsadlar', 'Oylik hisobotlar', '1 GB saqlash'],
    cta: 'Pro boshlash', featured: true,
  },
  {
    name: 'Premium', price: '59 000', period: '/oy', desc: 'Maksimal imkoniyatlar',
    features: ["Pro'dagi hamma narsa", 'AI xarajat tahlili', 'PDF hisobotlar', 'Google Calendar sync', 'Email eslatmalar', '5 GB saqlash'],
    cta: 'Premium boshlash', featured: false,
  },
]

const reviews = [
  { name: 'Sardor Toshmatov', role: 'Freelancer', av: 'ST', color: '#1E293B',
    text: "Endi mijozlar deadlinlarini hech qachon unutmayman. Moliya moduli daromadlarimni to'liq tartibga soldi!" },
  { name: 'Nilufar Rashidova', role: 'Uy bekasi', av: 'NR', color: '#D97706',
    text: "Bolalarim sanalarini va maktab to'lovlarini kuzatish juda osonlashdi. O'zbek tili — nihoyatda qulay!" },
  { name: 'Jasur Mirzayev', role: 'IT mutaxassis', av: 'JM', color: '#2563EB',
    text: "Notion va Todoist o'zbek tiliga moslashmagan edi. KOTIBAJON bizning madaniyatimizga to'liq mos keladi!" },
]

const faqs = [
  { q: "KOTIBAJON bepulmi?", a: "Ha, asosiy funksiyalar bepul. Pro va Premium tariflar qo'shimcha imkoniyatlar beradi." },
  { q: "Internet bo'lmasa ham ishlaydi?", a: "Ha! KOTIBAJON PWA texnologiyasida qurilgan — internet bo'lmasa ham asosiy funksiyalar ishlaydi." },
  { q: "Ma'lumotlarim xavfsizmi?", a: "Barcha ma'lumotlar SSL orqali shifrlangan. Serverlarimiz EU standartlariga mos." },
  { q: "Qaysi qurilmalarda ishlaydi?", a: "Barcha brauzerlar: Chrome, Safari, Firefox. Android va iOS ilovalar ham tez orada." },
]

/* ================================================================
   PAGE
   ================================================================ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-slate-100"
           style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="KOTIBAJON" width={36} height={36} className="rounded-xl" priority />
            <span className="text-[17px] font-black tracking-tight text-slate-900">
              KOTIBA<span className="text-blue-600">JON</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {[['#features','Xususiyatlar'],['#pricing','Narxlar'],['#reviews','Fikrlar'],['#faq','FAQ']].map(([h,l]) => (
              <a key={h} href={h}
                 className="px-3.5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link href="/login"
                  className="hidden sm:flex items-center h-9 px-4 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
              Kirish
            </Link>
            <Link href="/register"
                  className="flex items-center gap-1.5 h-9 px-4 text-sm font-bold text-white rounded-lg transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow: '0 2px 8px rgba(37,99,235,0.35)' }}>
              Boshlash <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage:'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)', backgroundSize:'36px 36px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAFAFA] pointer-events-none" />
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block pointer-events-none"
             style={{ background:'radial-gradient(ellipse at 70% 45%,rgba(37,99,235,0.06) 0%,transparent 65%)' }} />

        <div className="relative max-w-7xl mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center gap-16 pt-16 pb-20 lg:pt-24 lg:pb-32">

            {/* LEFT */}
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8"
                   style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-600">O'zbekiston №1 Samaradorlik Platformasi</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[66px] font-black tracking-tight leading-[1.04] mb-6 text-slate-900">
                Hayotingizni{' '}
                <span style={{ background:'linear-gradient(135deg,#D97706,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  tartibga
                </span>{' '}
                soling
              </h1>

              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-10 max-w-lg mx-auto lg:mx-0">
                Vazifalar, moliya, maqsadlar va muhim sanalarni bitta aqlli platformada boshqaring. O'zbek tiliga to'liq moslashtirilgan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-12">
                <Link href="/register"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 text-base font-black text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ height:'52px', background:'linear-gradient(135deg,#1D4ED8,#2563EB)', boxShadow:'0 6px 20px rgba(37,99,235,0.38)' }}>
                  Bepul boshlash <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/dashboard"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl transition-all hover:bg-slate-50 hover:border-slate-300"
                      style={{ height:'52px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                  Demo ko'rish
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  {['#1E293B','#D97706','#2563EB','#059669'].map((c,i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white" style={{ background:c }}>
                      {['ST','NR','JM','AR'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 font-medium">
                  <span className="font-black text-slate-900">50,000+</span> foydalanuvchi ishonadi
                </span>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-sm font-bold text-slate-700 ml-1">4.8</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Logo showcase */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative">
              <div className="absolute w-[460px] h-[460px] rounded-full border border-slate-200/80" />
              <div className="absolute w-[370px] h-[370px] rounded-full border border-blue-100/60" />

              <div className="relative w-[300px] h-[300px] rounded-[32px] flex flex-col items-center justify-center gap-5"
                   style={{ background:'linear-gradient(145deg,#0F1A2E,#152035)', boxShadow:'0 0 0 1px rgba(37,99,235,0.2), 0 0 80px rgba(37,99,235,0.18), 0 32px 80px rgba(0,0,0,0.30)' }}>
                <div className="absolute inset-0 rounded-[32px] pointer-events-none opacity-35"
                     style={{ backgroundImage:'radial-gradient(rgba(99,146,255,0.25) 1px,transparent 1px)', backgroundSize:'18px 18px' }} />
                <div className="absolute inset-0 rounded-[32px] pointer-events-none"
                     style={{ background:'radial-gradient(ellipse at 60% 40%,rgba(37,99,235,0.18) 0%,transparent 60%)' }} />
                {[['top-4 left-4','border-t-2 border-l-2 rounded-tl-lg'],['top-4 right-4','border-t-2 border-r-2 rounded-tr-lg'],['bottom-4 left-4','border-b-2 border-l-2 rounded-bl-lg'],['bottom-4 right-4','border-b-2 border-r-2 rounded-br-lg']].map(([pos,brd],i) => (
                  <div key={i} className={`absolute ${pos} w-5 h-5 ${brd} border-blue-500/40`} />
                ))}
                <Image src="/logo.png" alt="KOTIBAJON" width={155} height={155} className="rounded-2xl relative z-10" />
                <div className="relative z-10 text-center">
                  <p className="text-white font-black text-lg tracking-[0.2em]">KOTIBAJON</p>
                  <p className="text-blue-400 text-[10px] font-bold tracking-[0.15em] uppercase mt-0.5">Shaxsiy Raqamli Kotiba</p>
                </div>
              </div>

              {[
                { pos:'-left-6 top-[18%]', text:'✅ 50,000+ foydalanuvchi' },
                { pos:'-right-6 bottom-[20%]', text:'🇺🇿 O\'zbek tiliga mos' },
                { pos:'left-[12%] -bottom-4', text:'⚡ Offline rejim' },
              ].map(({ pos, text }) => (
                <div key={text} className={`absolute ${pos} bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 text-xs font-bold text-slate-700`}
                     style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.09)' }}>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-5 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            [Users,'50,000+','Foydalanuvchi'],
            [TrendingUp,'98%','Push yetkazish'],
            [Star,'4.8★','App reytingi'],
            [Globe,'3 til',"O'zb · Rus · EN"],
            [Clock,'30 sek',"Ro'yxatdan o'tish"],
            [Smartphone,'PWA','Offline ishlaydi'],
          ].map(([Icon, val, lbl]) => (
            <div key={lbl as string} className="flex items-center gap-2">
              {/* @ts-ignore */}
              <Icon className="w-4 h-4 text-slate-300 flex-shrink-0" />
              <span className="text-sm font-black text-slate-800">{val as string}</span>
              <span className="text-sm text-slate-400 font-medium">{lbl as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Imkoniyatlar</p>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Hamma narsa —{' '}
              <span style={{ background:'linear-gradient(135deg,#D97706,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                bitta joyda
              </span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
              Ko'p ilovalar o'rniga bitta aqlli platforma. Vaqtingizni tejang, samaradorligingizni oshiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title}
                     className="group relative rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-200"
                     style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                       style={{ background: f.bg }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: f.color }}>
                    Batafsil <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              [Globe,"O'zbek tili birinchi",'UI, bildirishnomalar va hisobotlar to\'liq o\'zbek tilida'],
              [Zap,'Mahalliy SMS Gateway','Eskiz va Play Mobile orqali ishonchli eslatmalar'],
              [Shield,'Offline rejim (PWA)','Internet bo\'lmasa ham asosiy funksiyalar ishlaydi'],
            ].map(([Icon, t, d]) => (
              <div key={t as string} className="flex items-start gap-4 rounded-2xl bg-slate-900 p-6">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  {/* @ts-ignore */}
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white mb-1">{t as string}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{d as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Narxlar</p>
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
              Oddiy va{' '}
              <span style={{ background:'linear-gradient(135deg,#D97706,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                tushunarli
              </span>{' '}
              narxlar
            </h2>
            <p className="text-slate-400 font-semibold text-sm">Yillik to'lovda 20% chegirma mavjud</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map(p => (
              <div key={p.name}
                   className={`relative bg-white rounded-2xl p-7 border-2 transition-all ${p.featured ? 'border-blue-600 shadow-2xl shadow-blue-100 md:-mt-5' : 'border-slate-100 hover:border-slate-200'}`}>
                {p.badge && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="bg-blue-600 text-white text-[11px] font-black px-4 py-1 rounded-full">
                      {p.badge}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{p.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="font-mono text-4xl font-black text-slate-900">{p.price}</span>
                  {p.period
                    ? <span className="text-slate-400 text-sm font-medium ml-1">so'm{p.period}</span>
                    : <span className="text-slate-400 text-sm font-medium ml-1">so'm</span>}
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${p.featured ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <Check className={`w-2.5 h-2.5 ${p.featured ? 'text-blue-600' : 'text-slate-500'}`} />
                      </div>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                      className={`w-full flex items-center justify-center h-11 rounded-xl text-sm font-bold transition-all ${p.featured ? 'text-white hover:opacity-90' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      style={p.featured ? { background:'linear-gradient(135deg,#2563EB,#1D4ED8)', boxShadow:'0 4px 14px rgba(37,99,235,0.28)' } : {}}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Foydalanuvchi fikrlari</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Ular nima{' '}
              <span style={{ background:'linear-gradient(135deg,#D97706,#F59E0B)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                deydi?
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="font-black text-slate-900 ml-1">4.8</span>
              <span className="text-slate-400 text-sm font-medium">— 1,200+ sharh asosida</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map(r => (
              <div key={r.name} className="bg-slate-50 rounded-2xl p-7 border border-slate-100 flex flex-col">
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium flex-1">"{r.text}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                       style={{ background: r.color }}>
                    {r.av}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-5 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Savollar</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ko'p so'raladigan savollar</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(f => (
              <div key={f.q} className="bg-white rounded-2xl border border-slate-100 p-6"
                   style={{ boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <h3 className="font-black text-slate-900 mb-2">{f.q}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl p-14 text-center relative overflow-hidden"
               style={{ background:'linear-gradient(135deg,#0F172A,#1E3A5F)', boxShadow:'0 24px 64px rgba(0,0,0,0.22)' }}>
            <div className="absolute inset-0 pointer-events-none opacity-20"
                 style={{ backgroundImage:'radial-gradient(rgba(255,255,255,0.12) 1px,transparent 1px)', backgroundSize:'24px 24px' }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none"
                 style={{ background:'radial-gradient(ellipse,rgba(37,99,235,0.35) 0%,transparent 70%)' }} />
            <div className="relative z-10">
              <Image src="/logo.png" alt="KOTIBAJON" width={72} height={72} className="mx-auto mb-6 rounded-2xl" />
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Bugun boshlang!</h2>
              <p className="text-slate-400 mb-8 font-medium">30 soniyada ro'yxatdan o'ting. Kredit karta talab etilmaydi.</p>
              <Link href="/register"
                    className="inline-flex items-center gap-2 h-12 px-8 text-base font-black text-blue-900 bg-white rounded-xl transition-all hover:bg-blue-50"
                    style={{ boxShadow:'0 4px 16px rgba(255,255,255,0.15)' }}>
                Hoziroq boshlash <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-5 text-xs text-slate-500 font-medium">
                ✓ Kredit karta yo'q &nbsp;·&nbsp; ✓ Istalgan vaqt bekor qilish &nbsp;·&nbsp; ✓ Bepul boshlash
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white py-10 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <Image src="/logo.png" alt="KOTIBAJON" width={30} height={30} className="rounded-lg" />
              <span className="font-black text-slate-900 text-sm">KOTIBA<span className="text-blue-600">JON</span></span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              {['Xususiyatlar','Narxlar','Fikrlar','FAQ','Blog','Aloqa'].map(l => (
                <a key={l} href="#" className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">© 2026 KOTIBAJON. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-5">
              {['Maxfiylik siyosati','Foydalanish shartlari'].map(l => (
                <a key={l} href="#" className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
