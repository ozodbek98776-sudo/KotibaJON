'use client'

/**
 * /widget — Desktop voice assistant
 * Auto-listens. "Hey Tom" → AI chat + app commands.
 * Works even when user has left kotibajon.vercel.app.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

/* ─────────────────────────────────────────────────────────────────
   WAKE WORD
───────────────────────────────────────────────────────────────── */
const WAKE = /hey\s+tom|hey\s+tome/i

const WAKE_REPLIES = [
  "Yes? How can I help?",
  "I'm listening.",
  "Hey! What do you need?",
  "Hello! Go ahead.",
]

/* ─────────────────────────────────────────────────────────────────
   APP COMMANDS
   Professional yechim: har bir buyruq { text, href } qaytaradi.
   href mavjud bo'lsa — chat ichida bosiladigan havola ko'rsatiladi.
   Foydalanuvchi bosadi (real user gesture) → URI scheme/URL ochiladi.
───────────────────────────────────────────────────────────────── */
interface CmdResult { text: string; href?: string }
interface Cmd { match: RegExp; run: (m: RegExpMatchArray) => CmdResult }

const CMDS: Cmd[] = [
  /* ── Desktop apps (URI scheme) ── */
  { match: /telegram/i,               run: () => ({ text: '📱 Telegram',   href: 'tg://' }) },
  { match: /whatsapp/i,               run: () => ({ text: '📱 WhatsApp',   href: 'whatsapp://' }) },
  { match: /discord/i,                run: () => ({ text: '🎮 Discord',    href: 'discord://' }) },
  { match: /spotify/i,                run: () => ({ text: '🎵 Spotify',    href: 'spotify://' }) },
  { match: /zoom/i,                   run: () => ({ text: '📹 Zoom',       href: 'zoommtg://zoom.us/join' }) },
  { match: /slack/i,                  run: () => ({ text: '💬 Slack',      href: 'slack://' }) },
  { match: /notion/i,                 run: () => ({ text: '📓 Notion',     href: 'notion://' }) },
  { match: /figma/i,                  run: () => ({ text: '🎨 Figma',      href: 'figma://' }) },
  { match: /vscode|visual\s*studio/i, run: () => ({ text: '💻 VS Code',    href: 'vscode://' }) },
  { match: /teams/i,                  run: () => ({ text: '👥 Teams',      href: 'msteams://' }) },
  { match: /steam/i,                  run: () => ({ text: '🎮 Steam',      href: 'steam://' }) },
  { match: /obsidian/i,               run: () => ({ text: '🔮 Obsidian',   href: 'obsidian://' }) },

  /* ── Web apps with query ── */
  { match: /claude.*(?:and|then|ask|write|type|about)\s+(.+)/i,
    run: m => ({ text: `🤖 Claude — "${m[1].trim()}"`, href: 'https://claude.ai/new' }) },
  { match: /chatgpt.*(?:and|then|ask|about)\s+(.+)/i,
    run: m => ({ text: `🤖 ChatGPT — "${m[1].trim()}"`, href: `https://chatgpt.com/?q=${encodeURIComponent(m[1].trim())}` }) },
  { match: /google.*(?:search|find|look up|yoz|qidir)\s+(.+)/i,
    run: m => ({ text: `🔍 Google: "${m[1].trim()}"`, href: `https://google.com/search?q=${encodeURIComponent(m[1].trim())}` }) },
  { match: /(?:^|\s)google\s+(.+)/i,
    run: m => ({ text: `🔍 Google: "${m[1].trim()}"`, href: `https://google.com/search?q=${encodeURIComponent(m[1].trim())}` }) },
  { match: /youtube.*(?:search|find|play|watch|yoz)\s+(.+)/i,
    run: m => ({ text: `▶️ YouTube: "${m[1].trim()}"`, href: `https://youtube.com/results?search_query=${encodeURIComponent(m[1].trim())}` }) },
  { match: /(?:^|\s)youtube\s+(.+)/i,
    run: m => ({ text: `▶️ YouTube: "${m[1].trim()}"`, href: `https://youtube.com/results?search_query=${encodeURIComponent(m[1].trim())}` }) },
  { match: /github.*(?:search|find)\s+(.+)/i,
    run: m => ({ text: `🐙 GitHub: "${m[1].trim()}"`, href: `https://github.com/search?q=${encodeURIComponent(m[1].trim())}` }) },
  { match: /wikipedia\s+(.+)/i,
    run: m => ({ text: `📖 Wikipedia: "${m[1].trim()}"`, href: `https://en.wikipedia.org/wiki/${encodeURIComponent(m[1].trim())}` }) },

  /* ── Web apps ── */
  { match: /claude/i,        run: () => ({ text: '🤖 Claude AI',    href: 'https://claude.ai' }) },
  { match: /chatgpt|gpt/i,   run: () => ({ text: '🤖 ChatGPT',      href: 'https://chatgpt.com' }) },
  { match: /google/i,        run: () => ({ text: '🔍 Google',        href: 'https://google.com' }) },
  { match: /youtube/i,       run: () => ({ text: '▶️ YouTube',       href: 'https://youtube.com' }) },
  { match: /github/i,        run: () => ({ text: '🐙 GitHub',        href: 'https://github.com' }) },
  { match: /gmail|email/i,   run: () => ({ text: '📧 Gmail',         href: 'https://mail.google.com' }) },
  { match: /instagram/i,     run: () => ({ text: '📸 Instagram',     href: 'https://instagram.com' }) },
  { match: /twitter|x\.com/i,run: () => ({ text: '🐦 X (Twitter)',   href: 'https://x.com' }) },
  { match: /weather|ob.?havo/i, run: () => ({ text: '🌤 Weather',    href: 'https://weather.com' }) },
  { match: /wikipedia/i,     run: () => ({ text: '📖 Wikipedia',     href: 'https://wikipedia.org' }) },
  { match: /maps?|xarita/i,  run: () => ({ text: '🗺 Google Maps',   href: 'https://maps.google.com' }) },
  { match: /translate|tarjima/i, run: () => ({ text: '🌐 Translate', href: 'https://translate.google.com' }) },

  /* ── KotibaJON sections ── */
  { match: /kotibajon|kotiba.*(?:open|go|launch)/i,
    run: () => ({ text: '🏠 KotibaJON',    href: 'https://kotibajon.vercel.app/dashboard' }) },
  { match: /task|vazifa/i,
    run: () => ({ text: '✅ Vazifalar',     href: 'https://kotibajon.vercel.app/tasks' }) },
  { match: /financ|moliya/i,
    run: () => ({ text: '💰 Moliya',        href: 'https://kotibajon.vercel.app/finance' }) },
  { match: /librar|kutubxon/i,
    run: () => ({ text: '📚 Kutubxona',     href: 'https://kotibajon.vercel.app/library' }) },
  { match: /goal|maqsad/i,
    run: () => ({ text: '🎯 Maqsadlar',     href: 'https://kotibajon.vercel.app/goals' }) },

  /* ── Widget control ── */
  { match: /close|yop|закрой/i, run: () => { window.close(); return { text: 'Goodbye! 👋' } } },
]

/* Buyruq vs savol farqi:
   - Buyruq: "telegram och", "open spotify", qisqa iborat (≤3 so'z)
   - Savol: "telegram haqida nima bilasan?", "qanday ishlataman?" */
const CMD_VERBS = /\b(och|oching|open|launch|go|start|yoq|yop|find|search|qidir|kir|close|play)\b/i
const QUESTION_WORDS = /\b(nima|qanday|qachon|qayerda|kim|nega|nima\s*uchun|what|how|when|where|who|why|haqida|about|tell|explain|что|как|когда|где|кто|почему|расскажи)\b/i

function isCommandIntent(text: string): boolean {
  const words = text.trim().split(/\s+/)
  if (words.length <= 2) return true          // qisqa → buyruq
  if (CMD_VERBS.test(text)) return true       // ochiq fe'l → buyruq
  if (QUESTION_WORDS.test(text)) return false // savol so'zi → savol
  return true                                  // default → buyruq
}

function execCmd(text: string): CmdResult | null {
  if (!isCommandIntent(text)) return null
  for (const c of CMDS) {
    const m = text.match(c.match)
    if (m) return c.run(m)
  }
  return null
}

/* ─────────────────────────────────────────────────────────────────
   MINI AI KNOWLEDGE BASE
───────────────────────────────────────────────────────────────── */
const AI_KB: { match: RegExp; reply: string }[] = [
  { match: /what.*claude|claude.*what|tell.*claude|about.*claude/i,
    reply: "Claude is Anthropic's AI assistant. Opus 4.8 is the most powerful model. Say 'open Claude' and I'll launch it!" },
  { match: /what.*chatgpt|chatgpt.*what|about.*gpt/i,
    reply: "ChatGPT is OpenAI's AI. GPT-4o is the current main model. Say 'open ChatGPT' to launch it!" },
  { match: /best.*ai|ai.*best|compare.*ai/i,
    reply: "Top AI models: Claude Opus 4.8 (best for reasoning), GPT-4o (versatile), Gemini 1.5 Pro (long context). Say any name to open it!" },
  { match: /time|soat|vaqt|what time/i,
    reply: `Current time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` },
  { match: /date|sana|today|bugun/i,
    reply: `Today: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` },
  { match: /weather|ob-?havo/i,
    reply: "I'll open weather for you! Say 'open weather' and I'll launch it." },
  { match: /hello|hi\b|hey\b|salom|привет/i,
    reply: "Hello! I'm Tom, your desktop AI. Ask me anything or give a command!" },
  { match: /thank|rahmat|спасибо/i,
    reply: "You're welcome! Always here to help." },
  { match: /help|yordam|помощь|what can you do/i,
    reply: "I can: open apps (Telegram, Discord, Spotify, VS Code...), search Google/YouTube, answer questions, navigate KotibaJON. Just say 'hey tom' + your command!" },
  { match: /how are you|qalaysan|как дела/i,
    reply: "I'm doing great, always listening! How can I help you?" },
  { match: /who.*you|who are you|kimsan/i,
    reply: "I'm Tom — KotibaJON's desktop AI assistant. I listen for 'hey tom' and execute your commands!" },
]

function getAiReply(text: string): string {
  return AI_KB.find(k => k.match.test(text))?.reply
    ?? "I'm not sure about that. Try asking something else or say 'help' to see what I can do!"
}

/* ─────────────────────────────────────────────────────────────────
   TTS
───────────────────────────────────────────────────────────────── */
let ttsOn = false

function speak(text: string, onDone?: () => void) {
  if (!window.speechSynthesis) { onDone?.(); return }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.92; u.pitch = 1.08; u.volume = 1
  u.onstart = () => { ttsOn = true }
  u.onend   = () => { ttsOn = false; onDone?.() }
  u.onerror = () => { ttsOn = false; onDone?.() }
  const go = () => {
    const vs = window.speechSynthesis.getVoices()
    const v  = vs.find(v => v.lang === 'en-US' && /google|natural|neural|premium/i.test(v.name))
            || vs.find(v => v.lang.startsWith('en-')) || vs[0]
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }
  window.speechSynthesis.getVoices().length > 0 ? go()
    : window.speechSynthesis.addEventListener('voiceschanged', go, { once: true })
}

/* ─────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────── */
type St = 'off' | 'listening' | 'awake' | 'processing'
interface Msg { id: number; role: 'user' | 'ai'; text: string; href?: string; loading?: boolean }

/* ─────────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────────── */
const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { background:transparent; overflow:hidden; font-family:-apple-system,system-ui,sans-serif; }
  @keyframes idle   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes happy  { 0%,100%{transform:scale(1)} 40%{transform:scale(1.08) rotate(-2deg)} 70%{transform:scale(1.1) rotate(2deg)} }
  @keyframes ring   { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.7)} 60%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }
  @keyframes green  { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.8)} 60%{box-shadow:0 0 0 12px rgba(16,185,129,0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  ::-webkit-scrollbar{ width:3px } ::-webkit-scrollbar-track{ background:transparent }
  ::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.15); border-radius:4px }
`

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function WidgetPage() {
  const [st,        setSt]      = useState<St>('off')
  const [msgs,      setMsgs]    = useState<Msg[]>([
    { id: 0, role: 'ai', text: 'Say "Hey Tom" to start!' }
  ])
  const [input,     setInput]   = useState('')
  const [emotion,   setEmotion] = useState<'idle'|'happy'>('idle')
  const [installable, setInstallable] = useState(false)
  const deferredPrompt = useRef<any>(null)
  const nextId  = useRef(1)
  const stRef   = useRef<St>('off')
  const recRef  = useRef<any>(null)
  const awakeT  = useRef<ReturnType<typeof setTimeout>|null>(null)
  const cmdBuf  = useRef('')
  const cmdTimer= useRef<ReturnType<typeof setTimeout>|null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const set = useCallback((s: St) => { stRef.current = s; setSt(s) }, [])

  const addMsg = useCallback((role: 'user'|'ai', text: string, href?: string, loading?: boolean) => {
    const id = nextId.current++
    setMsgs(p => [...p.slice(-6), { id, role, text, href, loading }])
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
    return id
  }, [])

  const updateMsg = useCallback((id: number, text: string) => {
    setMsgs(p => p.map(m => m.id === id ? { ...m, text, loading: false } : m))
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 50)
  }, [])

  /* ── Process input (command OR AI) ── */
  const process = useCallback(async (text: string) => {
    addMsg('user', text)
    set('processing')

    /* 1. Buyruqmi? */
    const result = execCmd(text)
    if (result) {
      addMsg('ai', result.text, result.href)
      const toSpeak = result.text.replace(/^[\p{Emoji}\s]+/u, '').split('—')[0].trim()
      speak(result.href ? `Opening ${toSpeak}` : toSpeak)
      setEmotion('happy')
      setTimeout(() => setEmotion('idle'), 2000)
      if (awakeT.current) clearTimeout(awakeT.current)
      setTimeout(() => { if (stRef.current !== 'off') set('listening') }, 1500)
      return
    }

    /* 2. Savol — real Claude API */
    setEmotion('happy')
    const loadId = addMsg('ai', '...', undefined, true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const reply: string = data.reply ?? 'Javob topilmadi.'
      updateMsg(loadId, reply)
      speak(reply.slice(0, 120))  // TTS uchun qisqartir
    } catch {
      updateMsg(loadId, 'Tarmoq xatosi. Internet aloqasini tekshiring.')
    }

    setTimeout(() => setEmotion('idle'), 3000)
    if (awakeT.current) clearTimeout(awakeT.current)
    setTimeout(() => { if (stRef.current !== 'off') set('listening') }, 2000)
  }, [addMsg, updateMsg, set])

  /* ── Debounce flush ── */
  const schedFlush = useCallback(() => {
    if (cmdTimer.current) clearTimeout(cmdTimer.current)
    cmdTimer.current = setTimeout(() => {
      const cmd = cmdBuf.current.trim()
      cmdBuf.current = ''
      if (!cmd || cmd.length < 2) return
      set('processing')
      process(cmd)
    }, 1000)
  }, [set, process])

  /* ── Voice session ── */
  const startSession = useCallback(() => {
    if (stRef.current === 'off') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    try { recRef.current?.abort() } catch (_) {}

    const rec: any = new SR()
    recRef.current = rec
    rec.lang = 'en-US'; rec.continuous = true
    rec.interimResults = true; rec.maxAlternatives = 3

    rec.onresult = (e: any) => {
      if (ttsOn) return
      const batch = e.results[e.resultIndex]
      if (!batch) return
      const alts: string[] = []
      for (let j = 0; j < batch.length; j++)
        alts.push(batch[j].transcript.toLowerCase().trim())
      const tx = alts[0]; const isFin = batch.isFinal

      if (stRef.current === 'listening') {
        if (alts.some(a => WAKE.test(a))) {
          const after = tx.replace(WAKE, '').replace(/^\W+/, '').trim()
          if (isFin && after.length > 1) {
            /* "hey tom open claude" — bitta gapda */
            set('awake')
            const wr = WAKE_REPLIES[Math.floor(Math.random() * WAKE_REPLIES.length)]
            addMsg('ai', wr); speak(wr)
            cmdBuf.current = after; schedFlush()
          } else {
            if (awakeT.current) clearTimeout(awakeT.current)
            cmdBuf.current = ''
            const wr = WAKE_REPLIES[Math.floor(Math.random() * WAKE_REPLIES.length)]
            set('awake'); setEmotion('happy')
            addMsg('ai', wr); speak(wr)
            awakeT.current = setTimeout(() => {
              if (stRef.current === 'awake') { cmdBuf.current = ''; set('listening') }
            }, 20_000)
          }
        }
      } else if (stRef.current === 'awake' && isFin) {
        const clean = tx.replace(WAKE, '').replace(/^\W+/, '').trim()
        if (!clean || clean.length < 2) return
        if (awakeT.current) clearTimeout(awakeT.current)
        awakeT.current = setTimeout(() => {
          if (stRef.current === 'awake') { cmdBuf.current = ''; set('listening') }
        }, 20_000)
        set('processing')
        cmdBuf.current = (cmdBuf.current + ' ' + clean).trim()
        schedFlush()
      }
    }

    rec.onend = () => { if (stRef.current !== 'off') setTimeout(startSession, 50) }
    rec.onerror = (ev: any) => {
      if (ev.error === 'not-allowed') { set('off'); addMsg('ai', 'Mic permission denied!') }
    }
    try { rec.start() } catch (_) { setTimeout(startSession, 400) }
  }, [set, addMsg, schedFlush])

  /* PWA install prompt */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e
      setInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installApp = useCallback(async () => {
    if (!deferredPrompt.current) return
    deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    if (outcome === 'accepted') {
      setInstallable(false)
      addMsg('ai', 'Tom AI installed! Now launch it from your desktop anytime.')
    }
    deferredPrompt.current = null
  }, [addMsg])

  /* Window size — popup va standalone PWA uchun */
  useEffect(() => {
    try {
      const sw = window.screen.width
      const sh = window.screen.height
      window.resizeTo(220, 440)
      window.moveTo(sw - 240, sh - 520)
    } catch (_) {}
  }, [])

  /* Auto-start */
  useEffect(() => {
    set('listening'); setTimeout(startSession, 500)
    return () => {
      stRef.current = 'off'
      if (awakeT.current) clearTimeout(awakeT.current)
      if (cmdTimer.current) clearTimeout(cmdTimer.current)
      try { recRef.current?.abort() } catch (_) {}
      window.speechSynthesis?.cancel()
    }
  }, [set, startSession])

  /* Text input send */
  const sendText = useCallback(() => {
    const t = input.trim(); if (!t) return
    setInput(''); set('processing'); process(t)
  }, [input, set, process])

  /* Drag */
  const drag = useRef({ on: false, ox: 0, oy: 0 })
  const onPD = (e: React.PointerEvent) => {
    drag.current = { on: true, ox: e.screenX - window.screenX, oy: e.screenY - window.screenY }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (drag.current.on) window.moveTo(e.screenX - drag.current.ox, e.screenY - drag.current.oy)
  }
  const onPU = () => { drag.current.on = false }

  /* Colors */
  const micColor = st === 'awake' ? '#10b981' : st === 'listening' ? '#818cf8' : '#6b7280'
  const micBg    = st === 'off'   ? 'rgba(255,255,255,0.1)' : micColor
  const ringAnim = st === 'awake' ? 'green 1.1s ease-in-out infinite' : st === 'listening' ? 'ring 2.2s ease-in-out infinite' : undefined

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        width: 220, height: 440,
        background: 'linear-gradient(160deg,#0f0f1a 0%,#1a1025 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>

        {/* ── Top bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px 4px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', letterSpacing: 1 }}>TOM AI</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {installable && (
              <button onClick={installApp} title="Install as Desktop App" style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                fontSize: 8, color: '#fff', fontWeight: 800, padding: '2px 6px',
                letterSpacing: 0.3,
              }}>⬇ Install</button>
            )}
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: st === 'awake' ? '#10b981' : st === 'listening' ? '#818cf8' : '#4b5563',
              animation: ringAnim, cursor: 'default',
            }} title={st === 'awake' ? 'Command mode' : st === 'listening' ? 'Say "hey tom"' : 'Off'}/>
            <button onClick={() => window.close()} style={{
              width: 14, height: 14, borderRadius: '50%', background: '#ef4444',
              border: 'none', cursor: 'pointer', fontSize: 8, color: '#fff', fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {/* ── Bot image (draggable) ── */}
        <div
          onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          style={{
            cursor: 'grab', display: 'flex', justifyContent: 'center',
            padding: '8px 0 4px', flexShrink: 0,
          }}>
          <div style={{
            width: 72, height: 92,
            animation: emotion === 'happy' ? 'happy .5s ease-in-out 3' : 'idle 3.2s ease-in-out infinite',
          }}>
            <Image src="/bot.png" alt="Tom" width={72} height={92} priority
              style={{ borderRadius: 12, objectFit: 'cover', objectPosition: 'center top', display: 'block' }}/>
          </div>
        </div>

        {/* ── Chat history ── */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto', padding: '4px 8px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {msgs.map(m => (
            <div key={m.id} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadein .2s ease',
            }}>
              <div style={{
                maxWidth: '85%', borderRadius: 10, overflow: 'hidden',
                fontSize: 10, lineHeight: 1.4, fontWeight: 500,
                background: m.role === 'user'
                  ? 'linear-gradient(135deg,#7c3aed,#6366f1)'
                  : 'rgba(255,255,255,0.08)',
                color: m.role === 'user' ? '#fff' : '#d1d5db',
                borderBottomRightRadius: m.role === 'user' ? 2 : 10,
                borderBottomLeftRadius:  m.role === 'ai'   ? 2 : 10,
              }}>
                <div style={{ padding: '5px 8px' }}>
                  {m.loading
                    ? <span style={{ display:'inline-flex', gap:3, alignItems:'center' }}>
                        {[0,1,2].map(i => (
                          <span key={i} style={{
                            width:4, height:4, borderRadius:'50%',
                            background:'rgba(255,255,255,0.5)',
                            display:'inline-block',
                            animation:`fadein .6s ease-in-out ${i*0.18}s infinite alternate`,
                          }}/>
                        ))}
                      </span>
                    : m.text}
                </div>
                {m.href && (
                  <a href={m.href} target="_blank" rel="noopener noreferrer"
                     style={{
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                       padding: '5px 8px',
                       background: 'rgba(99,102,241,0.35)',
                       color: '#a5b4fc',
                       fontSize: 9, fontWeight: 800,
                       textDecoration: 'none',
                       borderTop: '1px solid rgba(255,255,255,0.07)',
                       letterSpacing: 0.5,
                       cursor: 'pointer',
                     }}>
                    ↗ Ochish
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Mic status ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '4px 8px',
        }}>
          <button
            onClick={() => {
              if (st === 'off') { set('listening'); setTimeout(startSession, 100) }
              else {
                if (awakeT.current) clearTimeout(awakeT.current)
                if (cmdTimer.current) clearTimeout(cmdTimer.current)
                try { recRef.current?.abort() } catch (_) {}
                set('off')
              }
            }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `2px solid ${micColor}`,
              background: micBg,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: ringAnim, transition: 'all .2s',
            }}>
            {st === 'processing'
              ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid', borderColor: '#818cf8 transparent transparent transparent', animation: 'spin .6s linear infinite' }}/>
              : <svg viewBox="0 0 24 24" fill="none" stroke={st === 'off' ? '#6b7280' : '#fff'} strokeWidth="2.2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
            }
          </button>
          <span style={{ fontSize: 9, fontWeight: 700, color: micColor }}>
            {st === 'awake' ? '🎤 Speak now...' : st === 'listening' ? '👂 Hey Tom' : st === 'processing' ? '⚡ Working...' : '🔇 Off'}
          </span>
        </div>

        {/* ── Text input ── */}
        <div style={{
          display: 'flex', gap: 4, padding: '4px 8px 8px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendText() }}
            placeholder="Type a command..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '5px 8px',
              fontSize: 10, color: '#e5e7eb', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={sendText} style={{
            width: 28, height: 28, borderRadius: 8,
            background: input.trim() ? '#6366f1' : 'rgba(255,255,255,0.06)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

      </div>
    </>
  )
}
