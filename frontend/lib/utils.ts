import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Raqamni minglik ajratgich bilan formatlaydi.
 * Locale ishlatilmaydi — server/client hydration farqini oldini olish uchun.
 */
function separateThousands(n: number, separator = ' '): string {
  return Math.floor(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export function formatCurrency(amount: number, currency = 'UZS'): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  switch (currency) {
    case 'UZS':
      return `${sign}${separateThousands(abs)} so'm`
    case 'USD':
      return `${sign}$${separateThousands(abs, ',')}`
    case 'EUR':
      return `${sign}€${separateThousands(abs, ',')}`
    case 'RUB':
      return `${sign}${separateThousands(abs)} ₽`
    default:
      return `${sign}${separateThousands(abs)} ${currency}`
  }
}

export function formatDate(date: Date | string, format = 'dd.MM.yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const day   = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year  = d.getFullYear()
  const hh    = d.getHours().toString().padStart(2, '0')
  const mm    = d.getMinutes().toString().padStart(2, '0')

  switch (format) {
    case 'dd.MM.yyyy':          return `${day}.${month}.${year}`
    case 'dd.MM.yyyy HH:mm':    return `${day}.${month}.${year} ${hh}:${mm}`
    case 'dd MMM':              return `${day} ${getMonthShort(d.getMonth())}`
    case 'MMM yyyy':            return `${getMonthShort(d.getMonth())} ${year}`
    default:                    return `${day}.${month}.${year}`
  }
}

const MONTHS_SHORT = ['Yan','Fev','Mar','Apr','May','Iyu','Iyl','Avg','Sen','Okt','Noy','Dek']
function getMonthShort(m: number) { return MONTHS_SHORT[m] }

export function getDaysUntil(date: Date | string): number {
  const target = new Date(date)
  const today  = new Date()
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export function getRelativeTime(date: Date | string): string {
  const diff    = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)

  if (minutes < 1)  return 'Hozir'
  if (minutes < 60) return `${minutes} daqiqa oldin`
  if (hours   < 24) return `${hours} soat oldin`
  if (days    <  7) return `${days} kun oldin`
  return formatDate(new Date(date))
}

export function getPriorityLabel(priority: string): string {
  const map: Record<string, string> = {
    urgent: 'Shoshilinch', high: 'Yuqori', medium: "O'rta", low: 'Past',
  }
  return map[priority] ?? priority
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    todo: 'Bajarilmagan', in_progress: 'Jarayonda', done: 'Bajarildi', cancelled: 'Bekor qilindi',
  }
  return map[status] ?? status
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}
