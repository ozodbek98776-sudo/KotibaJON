'use client'

/**
 * /widget — Desktop floating mascot window
 * Opened by openDesktopWidget() as a small popup.
 * Has its own voice recognition: says "hey tom" → gives commands.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, Mic, MicOff } from 'lucide-react'

/* ── Wake word & commands (same as main bot) ────────────────────── */
const WAKE = /hey\s+tom|hey\s+tome|хэй\s+том/i

interface Cmd { match: RegExp; run: (m: RegExpMatchArray) => string }
const CMDS: Cmd[] = [
  { match: /google\s+(.+)/i,   run: m => { window.open(`https://google.com/search?q=${encodeURIComponent(m[1].trim())}`, '_blank'); return `Google: "${m[1].trim()}"` } },
  { match: /google/i,           run: () => { window.open('https://google.com', '_blank'); return 'Google ochildi' } },
  { match: /youtube\s+(.+)/i,  run: m => { window.open(`https://youtube.com/results?search_query=${encodeURIComponent(m[1].trim())}`, '_blank'); return `YouTube: "${m[1].trim()}"` } },
  { match: /youtube/i,          run: () => { window.open('https://youtube.com', '_blank'); return 'YouTube ochildi' } },
  { match: /telegram/i,         run: () => { window.open('https://web.telegram.org', '_blank'); return 'Telegram ochildi' } },
  { match: /instagram/i,        run: () => { window.open('https://instagram.com', '_blank'); return 'Instagram ochildi' } },
  { match: /gmail|pochta/i,     run: () => { window.open('https://mail.google.com', '_blank'); return 'Gmail ochildi' } },
  { match: /ob.?havo|weather/i, run: () => { window.open('https://weather.com', '_blank'); return 'Ob-havo' } },
  { match: /maps?|xarita/i,     run: () => { window.open('https://maps.google.com', '_blank'); return 'Maps ochildi' } },
  { match: /chatgpt|gpt/i,      run: () => { window.open('https://chat.openai.com', '_blank'); return 'ChatGPT ochildi' } },
  { match: /claude/i,           run: () => { window.open('https://claude.ai', '_blank'); return 'Claude ochildi' } },
  { match: /wikipedia\s+(.+)/i, run: m => { window.open(`https://uz.wikipedia.org/wiki/${encodeURIComponent(m[1].trim())}`, '_blank'); return `Wikipedia: "${m[1].trim()}"` } },
  { match: /wikipedia/i,        run: () => { window.open('https://wikipedia.org', '_blank'); return 'Wikipedia ochildi' } },
  { match: /yop|close|закрой/i, run: () => { window.close(); return 'Yopildi' } },
]

function execCmd(text: string): string | null {
  for (const c of CMDS) {
    const m = text.match(c.match)
    if (m) return c.run(m)
  }
  return null
}

type St = 'off' | 'listening' | 'awake' | 'processing'

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:transparent; overflow:hidden; font-family:system-ui,sans-serif; user-select:none; }
  @keyframes idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes happy { 0%,100%{transform:scale(1) rotate(0)} 30%{transform:scale(1.1) rotate(-3deg)} 60%{transform:scale(1.12) rotate(3deg)} }
  @keyframes pulse { 0%,100%{opacity:.5;transform:scale(.9)} 50%{opacity:1;transform:scale(1.1)} }
  @keyframes ring  { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.6)} 50%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
  @keyframes green { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.7)} 50%{box-shadow:0 0 0 14px rgba(16,185,129,0)} }
  @keyframes spin  { to{transform:rotate(360deg)} }
`

export default function WidgetPage() {
  const [st,      setSt]     = useState<St>('off')
  const [msg,     setMsg]    = useState('')
  const [emotion, setEmotion]= useState<'idle'|'happy'>('idle')
  const stRef   = useRef<St>('off')
  const recRef  = useRef<any>(null)
  const timerRef= useRef<ReturnType<typeof setTimeout>|null>(null)
  const awakeT  = useRef<ReturnType<typeof setTimeout>|null>(null)

  const set = useCallback((s: St) => { stRef.current = s; setSt(s) }, [])

  /* ── Voice ─────────────────────────────────────────────────── */
  function startSession() {
    if (stRef.current === 'off') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    try { recRef.current?.abort() } catch (_) {}

    const rec: any = new SR()
    recRef.current = rec
    rec.lang           = 'en-US'
    rec.continuous     = true
    rec.interimResults = true
    rec.maxAlternatives = 3

    rec.onresult = (e: any) => {
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
          set('awake'); setMsg('Gapiravering...')
          setEmotion('happy')
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
        setMsg(result ?? `"${clean}" — tushunmadim`)
        setEmotion('happy')
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setMsg(''); setEmotion('idle')
          if (stRef.current !== 'off') set('listening')
        }, 3000)
      }
    }

    rec.onend  = () => { if (stRef.current !== 'off') setTimeout(startSession, 250) }
    rec.onerror = (ev: any) => {
      if (ev.error === 'not-allowed') { set('off'); setMsg('Mikrofon ruxsati yo\'q!') }
    }
    try { rec.start() } catch (_) { setTimeout(startSession, 400) }
  }

  function toggleVoice() {
    if (st === 'off') {
      set('listening'); setMsg('')
      setTimeout(startSession, 100)
    } else {
      if (awakeT.current)  clearTimeout(awakeT.current)
      if (timerRef.current)clearTimeout(timerRef.current)
      try { recRef.current?.abort() } catch (_) {}
      recRef.current = null
      set('off'); setMsg('')
    }
  }

  /* Auto-start on load */
  useEffect(() => {
    set('listening')
    setTimeout(startSession, 600)
    return () => {
      stRef.current = 'off'
      try { recRef.current?.abort() } catch (_) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Drag */
  const dragRef = useRef({ on:false, sx:0, sy:0 })
  function onPD(e: React.PointerEvent) {
    dragRef.current = { on:true, sx:e.screenX - window.screenX, sy:e.screenY - window.screenY }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  function onPM(e: React.PointerEvent) {
    if (!dragRef.current.on) return
    window.moveTo(e.screenX - dragRef.current.sx, e.screenY - dragRef.current.sy)
  }
  function onPU() { dragRef.current.on = false }

  const micColor = st==='awake' ? '#10b981' : st==='listening' ? '#6366f1' : '#9ca3af'
  const ringAnim = st==='awake' ? 'green 1s ease-in-out infinite' : st==='listening' ? 'ring 2s ease-in-out infinite' : undefined

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        width:160, height:230, position:'relative',
        display:'flex', flexDirection:'column', alignItems:'center',
        paddingTop:8,
      }}>
        {/* Close */}
        <button onClick={()=>window.close()} style={{
          position:'absolute', top:2, right:4, width:18, height:18,
          borderRadius:'50%', background:'rgba(0,0,0,0.15)', border:'none',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontSize:10,
        }}>✕</button>

        {/* Bot image */}
        <div
          onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
          style={{
            cursor:'grab', position:'relative',
            width:100, height:130,
            animation: emotion==='happy' ? 'happy .5s ease-in-out 3' : 'idle 3s ease-in-out infinite',
            borderRadius:20,
            boxShadow: st!=='off' ? undefined : undefined,
          }}>
          <Image src="/bot.png" alt="Tom" width={100} height={130} priority
            style={{borderRadius:16, objectFit:'cover', objectPosition:'center top', display:'block'}}/>
        </div>

        {/* Mic button */}
        <button onClick={toggleVoice} style={{
          marginTop:8, width:38, height:38, borderRadius:'50%',
          border:`2.5px solid ${micColor}`,
          background: st==='off' ? 'rgba(255,255,255,0.9)' : micColor,
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .2s ease',
          animation: ringAnim,
        }}>
          {st === 'processing'
            ? <div style={{width:14,height:14,borderRadius:'50%',border:'2.5px solid',borderColor:'#fff transparent transparent transparent',animation:'spin .6s linear infinite'}}/>
            : st === 'off'
              ? <MicOff size={16} color={micColor}/>
              : <Mic size={16} color='#fff'/>
          }
        </button>

        {/* Status label */}
        <div style={{
          marginTop:4, fontSize:9, fontWeight:700, textAlign:'center',
          color: st==='awake' ? '#10b981' : st==='listening' ? '#6366f1' : '#9ca3af',
          maxWidth:140, padding:'0 8px', lineHeight:1.4,
          textShadow:'0 1px 3px rgba(0,0,0,0.4)',
          minHeight:24,
        }}>
          {msg || (
            st === 'listening'  ? '👂 Hey Tom...' :
            st === 'off'        ? '🔇 Mikrofon o\'chiq' : ''
          )}
        </div>
      </div>
    </>
  )
}
