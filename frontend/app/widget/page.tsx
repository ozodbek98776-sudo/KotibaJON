'use client'

/**
 * /widget — Desktop floating mascot
 * Auto-starts voice. "Hey Tom" → TTS greeting → command execution.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const WAKE = /hey\s+tom|hey\s+tome/i

const WAKE_REPLIES = [
  "Hello! How can I help you today?",
  "Hey! What can I do for you?",
  "Yes, I'm listening.",
  "Hi there! How can I assist?",
]

interface Cmd { match: RegExp; run: (m: RegExpMatchArray) => string }
const CMDS: Cmd[] = [
  { match: /google\s+(.+)/i,    run: m => { window.open(`https://google.com/search?q=${encodeURIComponent(m[1].trim())}`, '_blank'); return `Opening Google for ${m[1].trim()}` } },
  { match: /google/i,            run: () => { window.open('https://google.com', '_blank'); return 'Google is now open' } },
  { match: /youtube\s+(.+)/i,   run: m => { window.open(`https://youtube.com/results?search_query=${encodeURIComponent(m[1].trim())}`, '_blank'); return `Playing YouTube for ${m[1].trim()}` } },
  { match: /youtube/i,           run: () => { window.open('https://youtube.com', '_blank'); return 'YouTube is now open' } },
  { match: /telegram/i,          run: () => { window.open('https://web.telegram.org', '_blank'); return 'Telegram is now open' } },
  { match: /instagram/i,         run: () => { window.open('https://instagram.com', '_blank'); return 'Instagram is now open' } },
  { match: /gmail|email/i,       run: () => { window.open('https://mail.google.com', '_blank'); return 'Gmail is now open' } },
  { match: /weather|ob.?havo/i,  run: () => { window.open('https://weather.com', '_blank'); return 'Opening weather' } },
  { match: /maps?|xarita/i,      run: () => { window.open('https://maps.google.com', '_blank'); return 'Google Maps is now open' } },
  { match: /chatgpt|gpt/i,       run: () => { window.open('https://chat.openai.com', '_blank'); return 'ChatGPT is now open' } },
  { match: /claude/i,            run: () => { window.open('https://claude.ai', '_blank'); return 'Claude is now open' } },
  { match: /wikipedia\s+(.+)/i,  run: m => { window.open(`https://uz.wikipedia.org/wiki/${encodeURIComponent(m[1].trim())}`, '_blank'); return `Opening Wikipedia for ${m[1].trim()}` } },
  { match: /wikipedia/i,         run: () => { window.open('https://wikipedia.org', '_blank'); return 'Wikipedia is now open' } },
  { match: /close|yop|закрой/i,  run: () => { window.close(); return 'Goodbye!' } },
]

function execCmd(text: string): string | null {
  for (const c of CMDS) {
    const m = text.match(c.match)
    if (m) return c.run(m)
  }
  return null
}

/* ── TTS ── */
let widgetTtsActive = false

function speak(text: string, onDone?: () => void) {
  if (!window.speechSynthesis) { onDone?.(); return }
  window.speechSynthesis.cancel()
  const u    = new SpeechSynthesisUtterance(text)
  u.lang     = 'en-US'
  u.rate     = 0.92
  u.pitch    = 1.08
  u.volume   = 1
  u.onstart  = () => { widgetTtsActive = true }
  u.onend    = () => { widgetTtsActive = false; onDone?.() }
  u.onerror  = () => { widgetTtsActive = false; onDone?.() }
  const go   = () => {
    const vs = window.speechSynthesis.getVoices()
    const v  = vs.find(v => v.lang === 'en-US' && /google|natural|neural|premium/i.test(v.name))
            || vs.find(v => v.lang.startsWith('en-')) || vs[0]
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  }
  window.speechSynthesis.getVoices().length > 0 ? go()
    : window.speechSynthesis.addEventListener('voiceschanged', go, { once: true })
}

type St = 'off' | 'listening' | 'awake' | 'processing'

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { background:transparent; overflow:hidden; font-family:system-ui,sans-serif; user-select:none; width:160px; height:230px; }
  @keyframes idle   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes happy  { 0%,100%{transform:scale(1)} 40%{transform:scale(1.1) rotate(-3deg)} 70%{transform:scale(1.12) rotate(3deg)} }
  @keyframes ring   { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.7)} 50%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
  @keyframes green  { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.8)} 50%{box-shadow:0 0 0 16px rgba(16,185,129,0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
`

export default function WidgetPage() {
  const [st,      setSt]      = useState<St>('off')
  const [msg,     setMsg]     = useState('')
  const [emotion, setEmotion] = useState<'idle'|'happy'>('idle')

  const stRef    = useRef<St>('off')
  const recRef   = useRef<any>(null)
  const msgTimer = useRef<ReturnType<typeof setTimeout>|null>(null)
  const awakeT   = useRef<ReturnType<typeof setTimeout>|null>(null)

  const set = useCallback((s: St) => { stRef.current = s; setSt(s) }, [])

  /* ── Voice session ── */
  const startSession = useCallback(() => {
    if (stRef.current === 'off') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    try { recRef.current?.abort() } catch (_) {}

    const rec: any = new SR()
    recRef.current  = rec
    rec.lang           = 'en-US'
    rec.continuous     = true
    rec.interimResults = true
    rec.maxAlternatives = 3

    rec.onresult = (e: any) => {
      if (widgetTtsActive) return
      const batch = e.results[e.resultIndex]
      if (!batch) return
      const alts: string[] = []
      for (let j = 0; j < batch.length; j++)
        alts.push(batch[j].transcript.toLowerCase().trim())
      const tx    = alts[0]
      const isFin = batch.isFinal

      if (stRef.current === 'listening') {
        if (alts.some(a => WAKE.test(a))) {
          if (awakeT.current) clearTimeout(awakeT.current)
          set('awake')
          setEmotion('happy')
          const reply = WAKE_REPLIES[Math.floor(Math.random() * WAKE_REPLIES.length)]
          setMsg(reply)
          speak(reply)
          awakeT.current = setTimeout(() => {
            if (stRef.current === 'awake') { set('listening'); setMsg('') }
          }, 7000)
        }
      } else if (stRef.current === 'awake' && isFin) {
        const clean = tx.replace(WAKE, '').replace(/^\W+/, '').trim()
        if (!clean || clean.length < 2) return
        if (awakeT.current) clearTimeout(awakeT.current)
        set('processing')
        const result = execCmd(clean)
        const speech = result ?? `I couldn't understand "${clean}"`
        setMsg(result ?? `"${clean}" — tushunmadim`)
        setEmotion('happy')
        speak(speech, () => {
          if (msgTimer.current) clearTimeout(msgTimer.current)
          msgTimer.current = setTimeout(() => {
            setMsg(''); setEmotion('idle')
            if (stRef.current !== 'off') set('listening')
          }, 800)
        })
      }
    }

    rec.onend = () => { if (stRef.current !== 'off') setTimeout(startSession, 200) }
    rec.onerror = (ev: any) => {
      if (ev.error === 'not-allowed') { set('off'); setMsg('Mikrofon ruxsati yo\'q!') }
    }
    try { rec.start() } catch (_) { setTimeout(startSession, 400) }
  }, [set])

  /* Auto-start */
  useEffect(() => {
    set('listening')
    setTimeout(startSession, 500)
    return () => {
      stRef.current = 'off'
      if (awakeT.current)  clearTimeout(awakeT.current)
      if (msgTimer.current) clearTimeout(msgTimer.current)
      try { recRef.current?.abort() } catch (_) {}
      window.speechSynthesis?.cancel()
    }
  }, [set, startSession])

  /* Drag window */
  const drag = useRef({ on:false, ox:0, oy:0 })
  const onPD = (e: React.PointerEvent) => {
    drag.current = { on:true, ox:e.screenX - window.screenX, oy:e.screenY - window.screenY }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (drag.current.on) window.moveTo(e.screenX - drag.current.ox, e.screenY - drag.current.oy)
  }
  const onPU = () => { drag.current.on = false }

  const dotColor  = st==='awake' ? '#10b981' : st==='listening' ? '#818cf8' : '#9ca3af'
  const ringAnim  = st==='awake' ? 'green 1.1s ease-in-out infinite' : st==='listening' ? 'ring 2s ease-in-out infinite' : undefined

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width:160, height:230, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:6, position:'relative' }}>

        {/* Close */}
        <button onClick={() => window.close()} style={{
          position:'absolute', top:3, right:5, width:17, height:17,
          borderRadius:'50%', background:'rgba(0,0,0,0.18)', border:'none',
          cursor:'pointer', color:'#fff', fontSize:9, fontWeight:900,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>✕</button>

        {/* Mascot — draggable */}
        <div onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          style={{
            cursor:'grab', width:102, height:132,
            animation: emotion==='happy' ? 'happy .5s ease-in-out 3' : 'idle 3.2s ease-in-out infinite',
          }}>
          <Image src="/bot.png" alt="Tom" width={102} height={132} priority
            style={{ borderRadius:16, objectFit:'cover', objectPosition:'center top', display:'block' }}/>
        </div>

        {/* Status dot + ring */}
        <div style={{
          marginTop:8, width:36, height:36, borderRadius:'50%',
          border:`2.5px solid ${dotColor}`,
          background: st === 'off' ? 'rgba(255,255,255,0.9)' : dotColor,
          display:'flex', alignItems:'center', justifyContent:'center',
          animation: ringAnim,
          transition:'all .25s ease',
        }}>
          {st === 'processing'
            ? <div style={{ width:14, height:14, borderRadius:'50%', border:'2.5px solid', borderColor:'#fff transparent transparent transparent', animation:'spin .6s linear infinite' }}/>
            : <svg viewBox="0 0 24 24" fill="none" stroke={st==='off' ? dotColor : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
          }
        </div>

        {/* Message / status */}
        <div style={{
          marginTop:5, fontSize:9, fontWeight:700, textAlign:'center',
          color: st==='awake' ? '#10b981' : st==='listening' ? '#818cf8' : '#9ca3af',
          maxWidth:148, padding:'0 6px', lineHeight:1.35, minHeight:20,
          animation: msg ? 'fadein .25s ease' : undefined,
        }}>
          {msg || (
            st==='listening'  ? '👂 Say "Hey Tom"' :
            st==='off'        ? 'Tap to enable mic' : ''
          )}
        </div>
      </div>
    </>
  )
}
