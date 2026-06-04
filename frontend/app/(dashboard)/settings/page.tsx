'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { User, Bell, Shield, Palette, Globe, CreditCard, Trash2, LogOut, Moon, Sun, ChevronRight, Camera, Monitor, BellOff, BellRing, CheckCircle2, XCircle, Volume2, VolumeX, Send, Clock, X, Play, Music2, Tv2, Mic, ExternalLink } from 'lucide-react'
import { openDesktopWidget } from '@/components/mascot/KotibaBot'
import { useNotifications, playRingtone, type ScheduledNotif, type RingtoneId, RINGTONES } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'profile',       label: 'Profil',           icon: User },
  { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  { id: 'sound',         label: 'Musiqa & Ovoz',    icon: Music2 },
  { id: 'desktop',       label: 'Desktop Widget',   icon: Tv2 },
  { id: 'security',      label: 'Xavfsizlik',        icon: Shield },
  { id: 'appearance',    label: "Ko'rinish",         icon: Palette },
  { id: 'language',      label: 'Til va Mintaqa',    icon: Globe },
  { id: 'subscription',  label: 'Obuna',             icon: CreditCard },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [notifs, setNotifs] = useState({ push: false, sms: false, email: false, telegram: false, dailyReminder: false, weeklyReport: false, budgetAlert: false })
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('uz')
  const [currency, setCurrency] = useState('UZS')

  useEffect(() => {
    setProfile({
      name:  localStorage.getItem('kj_name')  || '',
      email: localStorage.getItem('kj_email') || '',
      phone: localStorage.getItem('kj_phone') || '',
    })
  }, [])

  function saveProfile() {
    localStorage.setItem('kj_name',  profile.name.trim())
    localStorage.setItem('kj_email', profile.email.trim())
    localStorage.setItem('kj_phone', profile.phone.trim())
    window.dispatchEvent(new Event('storage'))
    import('react-hot-toast').then(({ default: toast }) => toast.success('Profil saqlandi!'))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">Sozlamalar</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar nav */}
        <div className="lg:w-56 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-0.5">
              {sections.map(s => {
                const Icon = s.icon
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                      activeSection === s.id
                        ? 'bg-primary-500 dark:bg-white text-white'
                        : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-700/30'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {s.label}
                    {activeSection !== s.id && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />}
                  </button>
                )
              })}
              <div className="pt-2 mt-2 border-t border-border-light dark:border-border-dark space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>
              </div>
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeSection === 'profile' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Profil Ma'lumotlari</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar name={profile.name} size="xl" />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 dark:bg-white rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-primary-900 dark:text-primary-50">{profile.name}</p>
                  <p className="text-sm text-primary-400">{profile.email}</p>
                  <Badge variant="primary" className="mt-1">Pro tarif</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="To'liq ism"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
                <Input
                  label="Telefon"
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                />
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" onClick={saveProfile}>Saqlash</Button>
                  <Button variant="ghost" onClick={() => setProfile({ name: localStorage.getItem('kj_name')||'', email: localStorage.getItem('kj_email')||'', phone: localStorage.getItem('kj_phone')||'' })}>Bekor qilish</Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
                <h3 className="text-sm font-semibold text-red-500 mb-3">Xavfli zona</h3>
                <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} size="sm">
                  Hisobni o'chirish
                </Button>
              </div>
            </Card>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <NotificationSettings />
          )}

          {/* Sound */}
          {activeSection === 'sound' && (
            <SoundSettings />
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Ko'rinish</h2>
              <div>
                <label className="label mb-3">Mavzu</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Yorug\'', icon: <Sun className="w-5 h-5" /> },
                    { value: 'dark', label: 'Qorong\'u', icon: <Moon className="w-5 h-5" /> },
                    { value: 'system', label: 'Tizim', icon: <Monitor className="w-5 h-5" /> },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all',
                        theme === t.value
                          ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60'
                          : 'border-border-light dark:border-border-dark hover:border-gray-300'
                      )}
                    >
                      <span className={theme === t.value ? 'text-neutral-900 dark:text-primary-50' : 'text-primary-400'}>{t.icon}</span>
                      <span className={cn('text-sm font-medium', theme === t.value ? 'text-neutral-700 dark:text-primary-400' : 'text-primary-500')}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Language */}
          {activeSection === 'language' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Til va Mintaqa</h2>
              <div className="space-y-5">
                <div>
                  <label className="label mb-2">Interfeys tili</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                    { code: 'uz', label: "O'zbek (lotin)", abbr: 'UZ' },
                    { code: 'ru', label: 'Русский',        abbr: 'RU' },
                    { code: 'en', label: 'English',        abbr: 'EN' },
                  ].map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={cn(
                          'p-3 rounded-button border text-left transition-all',
                          language === l.code
                            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60'
                            : 'border-border-light dark:border-border-dark hover:border-gray-300'
                        )}
                      >
                        <div className="w-10 h-7 rounded-md bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mb-2">
                          <span className="text-xs font-black text-neutral-700 dark:text-neutral-200">{l.abbr}</span>
                        </div>
                        <div className={cn('text-xs font-medium', language === l.code ? 'text-neutral-700 dark:text-primary-400' : 'text-primary-600 dark:text-primary-400')}>{l.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label mb-2">Valyuta</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['UZS', 'USD', 'EUR', 'RUB'].map(c => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={cn(
                          'py-2 px-3 rounded-button border text-sm font-mono font-medium transition-all',
                          currency === c
                            ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-primary-400'
                            : 'border-border-light dark:border-border-dark text-primary-600 dark:text-primary-400 hover:border-gray-300'
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="primary">Saqlash</Button>
              </div>
            </Card>
          )}

          {/* Subscription */}
          {activeSection === 'subscription' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Obuna</h2>
              <div className="p-5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-primary-100">Joriy tarif</p>
                    <p className="text-2xl font-bold">Pro</p>
                  </div>
                  <Badge className="bg-white/20 text-white">Aktiv</Badge>
                </div>
                <p className="text-primary-100 text-sm">Keyingi to'lov: 15 mart 2025 • 29,000 so'm</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pro imkoniyatlari</h3>
                {['Cheksiz vazifalar', 'Push + SMS + Telegram', 'To\'liq moliya moduli', 'Oylik hisobotlar', '1 GB fayl saqlash'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="accent">Premium'ga o'tish</Button>
                <Button variant="ghost">Obunani bekor qilish</Button>
              </div>
            </Card>
          )}

          {/* Desktop Widget */}
          {activeSection === 'desktop' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-1 flex items-center gap-2">
                <Tv2 className="w-5 h-5 text-violet-500"/> Desktop Widget
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                Saytdan chiqib ketsangiz ham, kichik oynada <strong>Tom</strong> siz bilan qoladi va ovoz buyruqlarini bajaradi.
              </p>

              <div className="space-y-4">
                {/* Open widget button */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Tv2 className="w-5 h-5 text-violet-500"/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Widget ochish</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Ekranning pastida kichik oyna ochiladi</p>
                    </div>
                  </div>
                  <button
                    onClick={openDesktopWidget}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all">
                    <ExternalLink className="w-3.5 h-3.5"/> Ochish
                  </button>
                </div>

                {/* How it works */}
                <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5"/> Qanday ishlaydi?
                  </p>
                  <ol className="text-xs text-amber-700 dark:text-amber-400 space-y-1.5">
                    <li>1. "Ochish" tugmasini bosing — kichik oyna chiqadi</li>
                    <li>2. Oynani xohlagan joyga sudrang</li>
                    <li>3. <strong>"Hey Tom"</strong> deb chaqiring</li>
                    <li>4. Buyruq bering: <em>"Google next.js yoz"</em>, <em>"YouTube ochiq"</em>...</li>
                    <li>5. Saytdan chiqsangiz ham — oyna ishlayveradi</li>
                  </ol>
                </div>

                {/* Supported commands */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-white/[0.08]">
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-2">Qo'llab-quvvatlanadigan buyruqlar</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      ['Google qidiruv', '"Google Python kursi"'],
                      ['YouTube', '"YouTube lofi music"'],
                      ['Telegram', '"Telegram ochiq"'],
                      ['Instagram', '"Instagram ochiq"'],
                      ['Gmail', '"Gmail ochiq"'],
                      ['Ob-havo', '"Ob-havo"'],
                      ['Google Maps', '"Xarita"'],
                      ['Widgetni yopish', '"Yop"'],
                    ].map(([title, ex]) => (
                      <div key={title} className="p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.03]">
                        <p className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">{title}</p>
                        <p className="text-[9px] text-neutral-400 italic mt-0.5">{ex}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  ⚠️ Faqat Chrome brauzerida to'liq ishlaydi. Birinchi ishga tushirishda mikrofon ruxsatini bering.
                </p>
              </div>
            </Card>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Xavfsizlik</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Parolni o'zgartirish</h3>
                  <div className="space-y-3">
                    <Input label="Joriy parol" type="password" placeholder="••••••••" />
                    <Input label="Yangi parol" type="password" placeholder="••••••••" />
                    <Input label="Yangi parolni tasdiqlang" type="password" placeholder="••••••••" />
                    <Button variant="primary" size="sm">Parolni o'zgartirish</Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-900 dark:text-primary-50">Ikki bosqichli autentifikatsiya</p>
                      <p className="text-xs text-primary-400 mt-0.5">TOTP (Google Authenticator)</p>
                    </div>
                    <Badge variant="default">Yoqilmagan</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">2FA yoqish</Button>
                </div>
                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Faol sessiyalar</h3>
                  <div className="space-y-2">
                    {[
                      { device: 'Chrome — Windows 11', location: 'Toshkent, UZ', current: true },
                      { device: 'Samsung Galaxy S23', location: 'Toshkent, UZ', current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.device}</p>
                          <p className="text-xs text-primary-400">{s.location}</p>
                        </div>
                        {s.current ? <Badge variant="success">Joriy</Badge> : <Button variant="ghost" size="sm">Chiqarish</Button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   NOTIFICATION SETTINGS — standalone component
   ================================================================ */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={cn(
        'relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200',
        on ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700',
      )}>
      <span className={cn(
        'absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 shadow transition-all duration-200',
        on ? 'left-6' : 'left-1',
      )}/>
    </button>
  )
}

function NotificationSettings () {
  const { schedule, cancel, getAll, sendTest, requestPermission, hasPermission } = useNotifications()
  const [perm, setPerm]         = useState<string>('default')
  const [bgEnabled, setBg]      = useState(false)
  const [notifList, setList]    = useState<ScheduledNotif[]>([])
  const [testing, setTesting]   = useState(false)

  useEffect(() => {
    setPerm(hasPermission())
    setBg(localStorage.getItem('kj_bg_notif') === '1')
    setList(getAll().filter(n => !n.firedAt && n.scheduledAt > Date.now()))
  }, [hasPermission, getAll])

  async function handleRequestPerm (): Promise<boolean> {
    const ok = await requestPermission()
    setPerm(ok ? 'granted' : 'denied')
    if (ok) {
      localStorage.setItem('kj_bg_notif', '1')
      setBg(true)
    }
    return ok
  }

  function handleBgToggle () {
    if (!bgEnabled && perm !== 'granted') {
      handleRequestPerm()
      return
    }
    const next = !bgEnabled
    setBg(next)
    localStorage.setItem('kj_bg_notif', next ? '1' : '0')
  }

  async function handleTest () {
    if (perm !== 'granted') {
      const ok = await handleRequestPerm()
      if (!ok) return
    }
    setTesting(true)

    // Works in dev mode too: direct Notification API + ringtone after 3 s
    setTimeout(async () => {
      playRingtone()
      if (Notification?.permission === 'granted') {
        new Notification('KOTIBAJON — Test bildirishnoma', {
          body : 'Bildirishnomalar muvaffaqiyatli ishlayapti!',
          icon : '/logo.png',
        })
      }
      setTesting(false)
    }, 3000)

    // Also try SW path (works in production)
    await sendTest()
  }

  function handleCancel (id: string) {
    cancel(id)
    setList(prev => prev.filter(n => n.id !== id))
  }

  const permLabel = {
    granted    : { text: 'Ruxsat berilgan',   icon: <CheckCircle2 className="w-4 h-4 text-emerald-500"/>,  cls: 'text-emerald-600 dark:text-emerald-400' },
    denied     : { text: 'Ruxsat rad etilgan', icon: <XCircle className="w-4 h-4 text-red-500"/>,           cls: 'text-red-600 dark:text-red-400' },
    default    : { text: "Ruxsat so'ralmagant", icon: <Bell className="w-4 h-4 text-neutral-400"/>,         cls: 'text-neutral-500 dark:text-neutral-400' },
    unsupported: { text: 'Qo\'llab-quvvatlanmaydi', icon: <XCircle className="w-4 h-4 text-neutral-400"/>, cls: 'text-neutral-400' },
  }[perm] ?? { text: perm, icon: null, cls: 'text-neutral-500' }

  return (
    <Card padding="lg">
      <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Bildirishnomalar</h2>

      <div className="space-y-6">

        {/* ── Permission status ──────────────────────────────────── */}
        <div className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.03]">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center">
            <BellRing className="w-5 h-5 text-neutral-600 dark:text-neutral-300"/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-neutral-900 dark:text-white mb-0.5">Brauzer bildirishnomalari</p>
            <div className="flex items-center gap-1.5">
              {permLabel.icon}
              <span className={cn('text-xs font-semibold', permLabel.cls)}>{permLabel.text}</span>
            </div>
            {perm !== 'granted' && perm !== 'denied' && (
              <Button size="sm" className="mt-3" onClick={handleRequestPerm}
                leftIcon={<Bell className="w-3.5 h-3.5"/>}>
                Ruxsat so'rash
              </Button>
            )}
            {perm === 'denied' && (
              <p className="text-xs text-red-500 mt-2">
                Brauzer sozlamalaridan bildirishnomalarni yoqing (qulf belgisi → Site settings → Notifications → Allow)
              </p>
            )}
          </div>
        </div>

        {/* ── Background notifications toggle ─────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mt-0.5">
              {bgEnabled ? <BellRing className="w-4 h-4 text-amber-500"/> : <BellOff className="w-4 h-4 text-neutral-400"/>}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">Fon bildirishnomalari</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Saytdan chiqsangiz ham eslatmalar ishlaydi (brauzer ochiq bo'lganda)
              </p>
            </div>
          </div>
          <Toggle on={bgEnabled} onChange={handleBgToggle}/>
        </div>

        {/* ── Sound toggle ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center mt-0.5">
              <Volume2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400"/>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">Ringtone</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Eslatma kelganda ohang chalinadi
              </p>
            </div>
          </div>
          <Toggle
            on={notifList.some(n => n.sound) || true}
            onChange={() => {}}/>
        </div>

        {/* ── Test buttons ──────────────────────────────────────── */}
        <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06]">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3">Test</p>
          <div className="flex flex-wrap gap-2">
            {/* Ringtone — immediate, no SW needed */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => playRingtone()}
              leftIcon={<Volume2 className="w-3.5 h-3.5"/>}>
              Ringtone sinash
            </Button>

            {/* Full notification test — via SW (production only) */}
            <Button
              size="sm"
              variant={testing ? 'ghost' : 'outline'}
              onClick={handleTest}
              disabled={testing}
              leftIcon={<Send className="w-3.5 h-3.5"/>}>
              {testing ? '3 soniyadan keyin keladi...' : 'To\'liq bildirishnoma test'}
            </Button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
            "Ringtone sinash" — ovozni hoziroq eshiting.<br/>
            "To'liq test" — 3 soniyada OS bildirishnomasini yuboradi (faqat production)
          </p>
        </div>

        {/* ── Scheduled notifications list ─────────────────────── */}
        <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06]">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3">
            Rejalashtirilgan eslatmalar
            {notifList.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 font-black">
                {notifList.length}
              </span>
            )}
          </p>

          {notifList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-neutral-200 dark:border-white/[0.08]">
              <Bell className="w-8 h-8 text-neutral-200 dark:text-neutral-700 mb-2"/>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Rejalashtirilgan eslatma yo'q</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                Vazifa qo'shishda "Eslatma qo'shish" ni yoqing
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifList
                .sort((a, b) => a.scheduledAt - b.scheduledAt)
                .map(n => (
                  <div key={n.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-neutral-100 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.03]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-500"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{n.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {new Date(n.scheduledAt).toLocaleDateString('uz-UZ', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {n.sound && <Volume2 className="w-3.5 h-3.5 text-emerald-500"/>}
                      <button
                        onClick={() => handleCancel(n.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                        <X className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </Card>
  )
}

/* ── Sound wave bars animation ──────────────────────────────────── */
const SOUND_WAVE_CSS = `
  @keyframes soundWave {
    from { transform: scaleY(0.35); }
    to   { transform: scaleY(1.25); }
  }
`

function SoundWaveBars ({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const h = size === 'md' ? [6,10,7] : [5,8,6]
  return (
    <>
      <style>{SOUND_WAVE_CSS}</style>
      <span className="flex items-end gap-px" style={{ height: h[1] + 2 }}>
        {h.map((px, i) => (
          <span key={i}
            className="w-0.5 rounded-full bg-violet-500"
            style={{
              height: px,
              transformOrigin: 'bottom',
              animation: `soundWave .65s ease-in-out ${i * 0.12}s infinite alternate`,
            }}
          />
        ))}
      </span>
    </>
  )
}

/* ================================================================
   SOUND SETTINGS
   ================================================================ */
function SoundSettings () {
  const [soundOn,  setSoundOn]  = useState(true)
  const [volume,   setVolume]   = useState(70)
  const [ringtone, setRingtone] = useState<RingtoneId>('classic')
  const [playing,  setPlaying]  = useState<RingtoneId | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSoundOn(localStorage.getItem('kj_sound_enabled') !== '0')
    const v = Number(localStorage.getItem('kj_volume'))
    setVolume(v > 0 ? v : 70)
    setRingtone((localStorage.getItem('kj_ringtone') as RingtoneId) ?? 'classic')
  }, [])

  function saveSoundOn (val: boolean) {
    setSoundOn(val)
    localStorage.setItem('kj_sound_enabled', val ? '1' : '0')
  }

  function saveVolume (v: number) {
    setVolume(v)
    localStorage.setItem('kj_volume', String(v))
  }

  function saveRingtone (id: RingtoneId) {
    setRingtone(id)
    localStorage.setItem('kj_ringtone', id)
  }

  function preview (id: RingtoneId) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPlaying(id)
    playRingtone(id, volume)
    const dur = RINGTONES.find(r => r.id === id)?.duration ?? 2000
    timerRef.current = setTimeout(() => setPlaying(null), dur)
  }

  const volIcon = volume === 0
    ? <VolumeX className="w-4 h-4 text-neutral-400 flex-shrink-0"/>
    : <Volume2 className="w-4 h-4 text-neutral-400 flex-shrink-0"/>

  return (
    <Card padding="lg">
      <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-50 mb-6">Musiqa & Ovoz</h2>

      <div className="space-y-7">

        {/* ── Master toggle ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className={cn(
              'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5',
              soundOn ? 'bg-violet-50 dark:bg-violet-500/10' : 'bg-neutral-100 dark:bg-white/[0.05]',
            )}>
              {soundOn
                ? <Volume2 className="w-4 h-4 text-violet-500"/>
                : <VolumeX className="w-4 h-4 text-neutral-400"/>}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">Bildirishnoma ovozi</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Eslatma kelganda ohang chalinadi
              </p>
            </div>
          </div>
          <Toggle on={soundOn} onChange={() => saveSoundOn(!soundOn)}/>
        </div>

        {soundOn && (
          <>
            {/* ── Volume ──────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Ovoz balandligi
                </p>
                <span className="text-xs font-black tabular-nums text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-white/[0.08] px-2 py-0.5 rounded-full">
                  {volume}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-neutral-400 flex-shrink-0"/>
                <div className="relative flex-1 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 cursor-pointer group"
                  onClick={e => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                    const v = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 20) * 5
                    saveVolume(v)
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-violet-500 dark:bg-violet-400 transition-[width]"
                    style={{ width: `${volume}%` }}
                  />
                  <input
                    type="range" min={0} max={100} step={5} value={volume}
                    onChange={e => saveVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    aria-label="Ovoz balandligi"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-violet-500 dark:border-violet-400 shadow-md transition-[left]"
                    style={{ left: `calc(${volume}% - 8px)` }}
                  />
                </div>
                {volIcon}
              </div>
            </div>

            {/* ── Ringtone picker ──────────────────────────────────── */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Ringtone tanlash
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {RINGTONES.map(r => {
                  const active    = ringtone === r.id
                  const isPlaying = playing === r.id
                  return (
                    <div
                      key={r.id}
                      onClick={() => saveRingtone(r.id)}
                      className={cn(
                        'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all select-none',
                        active
                          ? 'border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-500/10'
                          : 'border-transparent bg-neutral-50 dark:bg-white/[0.03] hover:border-neutral-200 dark:hover:border-white/[0.10]',
                      )}
                    >
                      {/* Selected checkmark */}
                      {active && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-500 dark:bg-violet-400 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                          </svg>
                        </span>
                      )}

                      {/* Icon */}
                      <span className="text-2xl leading-none">{r.icon}</span>

                      {/* Label + desc */}
                      <div className="text-center">
                        <p className={cn(
                          'text-xs font-bold leading-tight',
                          active
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-neutral-700 dark:text-neutral-200',
                        )}>{r.label}</p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 leading-tight">{r.desc}</p>
                      </div>

                      {/* Preview button */}
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); preview(r.id) }}
                        className={cn(
                          'flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all',
                          isPlaying
                            ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'
                            : 'bg-neutral-100 dark:bg-white/[0.08] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.12]',
                        )}
                      >
                        {isPlaying ? (
                          <SoundWaveBars/>
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-current"/>
                        )}
                        {isPlaying ? 'Eshitilmoqda' : 'Sinash'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Quick test ───────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-white/[0.06]">
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Joriy sozlamani sinash</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  Tanlangan ringtone va balandlikda ijro etadi
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => preview(ringtone)}
                disabled={playing !== null}
                leftIcon={playing !== null
                  ? <SoundWaveBars size="md"/>
                  : <Play className="w-3.5 h-3.5 fill-current"/>
                }
              >
                {playing !== null ? 'Eshitilmoqda...' : "Test qilish"}
              </Button>
            </div>
          </>
        )}
      </div>

    </Card>
  )
}
