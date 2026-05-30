'use client'

import { useState } from 'react'
import { User, Bell, Shield, Palette, Globe, CreditCard, Trash2, LogOut, Moon, Sun, ChevronRight, Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  { id: 'security', label: 'Xavfsizlik', icon: Shield },
  { id: 'appearance', label: 'Ko\'rinish', icon: Palette },
  { id: 'language', label: 'Til va Mintaqa', icon: Globe },
  { id: 'subscription', label: 'Obuna', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Sardor Toshmatov', email: 'sardor@example.com', phone: '+998 90 123 45 67' })
  const [notifs, setNotifs] = useState({ push: true, sms: true, email: false, telegram: true, dailyReminder: true, weeklyReport: true, budgetAlert: true })
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('uz')
  const [currency, setCurrency] = useState('UZS')

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sozlamalar</h1>

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
                        ? 'bg-neutral-900 dark:bg-white text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profil Ma'lumotlari</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar name={profile.name} size="xl" />
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                  <p className="text-sm text-gray-400">{profile.email}</p>
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
                  <Button variant="primary">Saqlash</Button>
                  <Button variant="ghost">Bekor qilish</Button>
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
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Bildirishnomalar</h2>
              <div className="space-y-4">
                {[
                  { key: 'push', label: 'Push bildirishnomalar', desc: 'Brauzer va mobil push' },
                  { key: 'sms', label: 'SMS eslatmalar', desc: 'O\'zbek SMS gateway orqali' },
                  { key: 'email', label: 'Email bildirishnomalar', desc: 'Email orqali xabar berish' },
                  { key: 'telegram', label: 'Telegram Bot', desc: '@KotibajonBot orqali' },
                  { key: 'dailyReminder', label: 'Kunlik eslatma', desc: 'Har kuni ertalab bugungi vazifalar' },
                  { key: 'weeklyReport', label: 'Haftalik hisobot', desc: 'Har juma kuni haftalik tahlil' },
                  { key: 'budgetAlert', label: 'Byudjet ogohlantirishlari', desc: '80% va 100% limitda xabar' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-all duration-200',
                        notifs[item.key as keyof typeof notifs] ? 'bg-neutral-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'
                      )}
                    >
                      <div className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                        notifs[item.key as keyof typeof notifs] ? 'left-6' : 'left-1'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ko'rinish</h2>
              <div>
                <label className="label mb-3">Mavzu</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Yorug\'', icon: <Sun className="w-5 h-5" /> },
                    { value: 'dark', label: 'Qorong\'u', icon: <Moon className="w-5 h-5" /> },
                    { value: 'system', label: 'Tizim', icon: <span className="text-lg">⚙️</span> },
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
                      <span className={theme === t.value ? 'text-neutral-900 dark:text-white' : 'text-gray-400'}>{t.icon}</span>
                      <span className={cn('text-sm font-medium', theme === t.value ? 'text-neutral-700 dark:text-primary-400' : 'text-gray-500')}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Language */}
          {activeSection === 'language' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Til va Mintaqa</h2>
              <div className="space-y-5">
                <div>
                  <label className="label mb-2">Interfeys tili</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ code: 'uz', label: "O'zbek (lotin)", flag: '🇺🇿' }, { code: 'ru', label: 'Русский', flag: '🇷🇺' }, { code: 'en', label: 'English', flag: '🇺🇸' }].map(l => (
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
                        <div className="text-xl mb-1">{l.flag}</div>
                        <div className={cn('text-xs font-medium', language === l.code ? 'text-neutral-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400')}>{l.label}</div>
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
                            : 'border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-300'
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Obuna</h2>
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
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
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

          {/* Security */}
          {activeSection === 'security' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Xavfsizlik</h2>
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Ikki bosqichli autentifikatsiya</p>
                      <p className="text-xs text-gray-400 mt-0.5">TOTP (Google Authenticator)</p>
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
                          <p className="text-xs text-gray-400">{s.location}</p>
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
