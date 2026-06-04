'use client'

/**
 * useNotifications — KOTIBAJON notification scheduling hook
 *
 * Provides:
 *   schedule(notif)   → saves to LS + sends to SW
 *   cancel(id)        → removes from LS + cancels SW timer
 *   getAll()          → current LS list
 *   requestPermission → asks browser for notification permission
 *   hasPermission     → current permission status
 *   playRingtone      → Web Audio API — supports 5 ringtone types + volume
 */

import { useEffect, useCallback, useRef } from 'react'

/* ── Public types ───────────────────────────────────────────────── */
export interface ScheduledNotif {
  id          : string
  title       : string
  body        : string
  scheduledAt : number     // Unix ms
  url         : string
  sound       : boolean
  taskId      ?: number
  firedAt     ?: number    // set after firing
}

/* ── Ringtone system ─────────────────────────────────────────────── */
export type RingtoneId = 'classic' | 'bell' | 'chime' | 'soft' | 'digital'

export const RINGTONES: {
  id       : RingtoneId
  label    : string
  icon     : string
  desc     : string
  duration : number
}[] = [
  { id: 'classic', label: 'Klassik',     icon: '🎵', desc: 'Do-Mi-Sol akkord',    duration: 3100 },
  { id: 'bell',    label: "Qo'ng'iroq",  icon: '🔔', desc: "Yumshoq qo'ng'iroq", duration: 1800 },
  { id: 'chime',   label: 'Jarang',      icon: '✨', desc: 'Shaffof ton',          duration: 1300 },
  { id: 'soft',    label: 'Mayin',       icon: '🌊', desc: 'Xotirjam ohang',       duration: 2000 },
  { id: 'digital', label: 'Raqamli',    icon: '💻', desc: 'Retro signal',          duration:  600 },
]

/* ── Web Audio helpers ──────────────────────────────────────────── */
function addNote(
  ctx    : AudioContext,
  freq   : number,
  start  : number,
  dur    : number,
  maxVol : number,
  type   : OscillatorType = 'sine',
) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(maxVol, start + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

function playPattern(ctx: AudioContext, id: RingtoneId, offset: number, vol: number) {
  const t = ctx.currentTime + offset
  switch (id) {
    case 'classic':
      // C-major arpeggio — triangle wave, two passes
      ;([ [523.25,0.00], [659.25,0.18], [783.99,0.36],
           [1046.5,0.54], [783.99,0.78], [1046.5,0.96] ] as [number,number][])
        .forEach(([f, s]) => addNote(ctx, f, t + s, 0.15, vol * 0.4, 'triangle'))
      break
    case 'bell':
      // Damped bell with harmonics
      addNote(ctx, 440.0,  t, 1.40, vol * 0.40)
      addNote(ctx, 1212.0, t, 0.80, vol * 0.20)
      addNote(ctx, 2157.0, t, 0.40, vol * 0.10)
      break
    case 'chime':
      // Ascending clear chimes
      ;([ [880,0.00], [1047,0.14], [1319,0.28], [1568,0.44] ] as [number,number][])
        .forEach(([f, s]) => addNote(ctx, f, t + s, 0.50, vol * 0.30))
      break
    case 'soft':
      // Gentle descending sine tones
      ;([ [392,0.00,0.70], [349,0.35,0.70], [330,0.72,0.90] ] as [number,number,number][])
        .forEach(([f, s, d]) => addNote(ctx, f, t + s, d, vol * 0.22))
      break
    case 'digital':
      // Retro square-wave blips
      ;([ [880,0.00,0.07], [1320,0.10,0.07], [880,0.20,0.07], [1760,0.32,0.10] ] as [number,number,number][])
        .forEach(([f, s, d]) => addNote(ctx, f, t + s, d, vol * 0.12, 'square'))
      break
  }
}

/**
 * playRingtone(ringtoneId?, volume?)
 *   — ringtoneId : if omitted reads kj_ringtone from localStorage
 *   — volume     : 0-100; if omitted reads kj_volume from localStorage (default 70)
 */
export function playRingtone(ringtoneId?: string, volume?: number) {
  try {
    const Ctx = window.AudioContext ?? (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const id  = (ringtoneId ?? localStorage.getItem('kj_ringtone') ?? 'classic') as RingtoneId
    const vol = volume != null
      ? volume / 100
      : Number(localStorage.getItem('kj_volume') ?? 70) / 100

    playPattern(ctx, id, 0, vol)
    if (id === 'classic') playPattern(ctx, id, 1.45, vol)
  } catch (_) {
    // AudioContext unavailable (Safari strict mode) — silent fail
  }
}

/* ── localStorage helpers ───────────────────────────────────────── */
const LS_KEY = 'kj_notifs'

function lsRead (): ScheduledNotif[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}

function lsWrite (items: ScheduledNotif[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

function soundEnabled () {
  return localStorage.getItem('kj_sound_enabled') !== '0'
}

/* ── Get active service worker ──────────────────────────────────── */
async function getActiveSW (): Promise<ServiceWorker | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.ready
    return reg.active ?? null
  } catch { return null }
}

/* ── Send message to SW ─────────────────────────────────────────── */
async function swMessage (type: string, payload?: unknown) {
  const sw = await getActiveSW()
  sw?.postMessage({ type, payload })
}

/* ================================================================
   Hook
   ================================================================ */
export function useNotifications () {
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* Permission helpers */
  const hasPermission = useCallback((): 'granted' | 'denied' | 'default' | 'unsupported' => {
    if (typeof Notification === 'undefined') return 'unsupported'
    return Notification.permission
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false
    if (Notification.permission === 'granted') return true
    const res = await Notification.requestPermission()
    return res === 'granted'
  }, [])

  /* Schedule a notification */
  const schedule = useCallback(async (notif: ScheduledNotif) => {
    const all = lsRead()
    lsWrite([...all.filter(n => n.id !== notif.id), notif])
    await swMessage('KJ_SCHEDULE', notif)
  }, [])

  /* Cancel a scheduled notification */
  const cancel = useCallback(async (id: string) => {
    lsWrite(lsRead().filter(n => n.id !== id))
    await swMessage('KJ_CANCEL', { id })
  }, [])

  /* Get all (including fired) */
  const getAll    = useCallback(() => lsRead(), [])
  const getPending = useCallback(() =>
    lsRead().filter(n => !n.firedAt && n.scheduledAt > Date.now())
  , [])

  /* Trigger test notification (3 s delay) */
  const sendTest = useCallback(async () => {
    await swMessage('KJ_TEST')
  }, [])

  /* Mark a notification as fired in LS */
  const markFired = useCallback((id: string) => {
    lsWrite(lsRead().map(n => n.id === id ? { ...n, firedAt: Date.now() } : n))
  }, [])

  /* ── Setup on mount ───────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return

    /* 1. Sync LS → SW (re-registers timers after page load / browser restart) */
    swMessage('KJ_SYNC')

    /* 2. Listen for SW → page messages */
    const onSWMessage = (event: MessageEvent) => {
      const { type, id, playSound } = event.data || {}
      if (type === 'KJ_NOTIF_FIRED') {
        markFired(id)
        if (playSound !== false && soundEnabled()) playRingtone()
      }
      if (type === 'KJ_NAVIGATE' && event.data.url) {
        window.location.href = event.data.url
      }
    }
    navigator.serviceWorker?.addEventListener('message', onSWMessage)

    /* 3. Fallback poll — every 30 s when SW is unavailable */
    pollRef.current = setInterval(() => {
      const pending = lsRead().filter(n => !n.firedAt && n.scheduledAt <= Date.now())
      if (!pending.length) return
      pending.forEach(n => {
        if (Notification?.permission === 'granted') {
          new Notification(n.title, { body: n.body, icon: '/logo.svg', tag: n.id })
        }
        if (n.sound !== false && soundEnabled()) playRingtone()
        markFired(n.id)
      })
    }, 30_000)

    return () => {
      navigator.serviceWorker?.removeEventListener('message', onSWMessage)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    schedule,
    cancel,
    getAll,
    getPending,
    sendTest,
    requestPermission,
    hasPermission,
  }
}
