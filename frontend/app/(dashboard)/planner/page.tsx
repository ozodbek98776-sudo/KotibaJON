'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, Trash2, X,
  Play, Pause, RotateCcw, Coffee, Zap, Timer,
  CheckCircle2, Circle, GripVertical, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { playRingtone } from '@/hooks/useNotifications'

/* ================================================================
   CONSTANTS
   ================================================================ */
const HOUR_H   = 64       // px per hour on grid
const SNAP_MIN = 15       // snap to 15 minutes
const SNAP_PX  = HOUR_H * SNAP_MIN / 60   // 16px per snap
const START_H  = 6        // grid starts at 06:00
const END_H    = 23       // grid ends   at 23:00
const TOTAL_H  = END_H - START_H          // 17 hours visible

const toPx     = (min: number) => (min - START_H * 60) / 60 * HOUR_H
const toH      = (dur: number) => dur / 60 * HOUR_H
const snapM    = (px: number)  => Math.round(px / SNAP_PX) * SNAP_MIN
const clamp    = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/* ================================================================
   TYPES
   ================================================================ */
type Cat = 'ish' | 'tanaffus' | 'shaxsiy' | 'uchrashuv' | 'sport'

interface Block {
  id       : string
  title    : string
  start    : number     // minutes from midnight
  duration : number     // minutes
  cat      : Cat
  done     : boolean
  note     : string
  dateKey  : string
}

/* ================================================================
   CATEGORY CONFIG
   ================================================================ */
const CAT: Record<Cat, { label: string; dot: string; bg: string; border: string; text: string }> = {
  ish       : { label:'Ish',       dot:'#3B82F6', bg:'bg-blue-500/10   dark:bg-blue-500/20',    border:'border-blue-400/50',  text:'text-blue-700   dark:text-blue-300'   },
  tanaffus  : { label:'Tanaffus',  dot:'#10B981', bg:'bg-emerald-500/10 dark:bg-emerald-500/20', border:'border-emerald-400/50',text:'text-emerald-700 dark:text-emerald-300'},
  shaxsiy   : { label:'Shaxsiy',   dot:'#8B5CF6', bg:'bg-violet-500/10 dark:bg-violet-500/20',  border:'border-violet-400/50', text:'text-violet-700 dark:text-violet-300' },
  uchrashuv : { label:'Uchrashuv', dot:'#F59E0B', bg:'bg-amber-500/10  dark:bg-amber-500/20',   border:'border-amber-400/50',  text:'text-amber-700  dark:text-amber-300'  },
  sport     : { label:'Sport',     dot:'#EF4444', bg:'bg-rose-500/10   dark:bg-rose-500/20',    border:'border-rose-400/50',   text:'text-rose-700   dark:text-rose-300'   },
}

/* ================================================================
   DATE HELPERS
   ================================================================ */
const UZ_DAYS   = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba']
const UZ_MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']

const dkey   = (d: Date) => d.toISOString().slice(0, 10)
const isToday = (d: Date) => dkey(d) === dkey(new Date())
const fmtDate = (d: Date) => `${UZ_DAYS[d.getDay()]}, ${d.getDate()} ${UZ_MONTHS[d.getMonth()]} ${d.getFullYear()}`
const fmtTime = (m: number) => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`
const addDays = (d: Date, n: number) => { const r=new Date(d); r.setDate(r.getDate()+n); return r }

/* ================================================================
   LOCAL STORAGE
   ================================================================ */
const LS = 'kj_planner'
const uid = () => Math.random().toString(36).slice(2,10)

function loadBlocks(): Block[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS)||'[]') } catch { return [] }
}
function saveBlocks(b: Block[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS, JSON.stringify(b))
}

/* ================================================================
   POMODORO WIDGET
   ================================================================ */
const POMO: Record<string, number> = { work:25*60, short:5*60, long:15*60 }

function PomodoroWidget() {
  const [mode,    setMode]    = useState<'work'|'short'|'long'>('work')
  const [secs,    setSecs]    = useState(POMO.work)
  const [running, setRunning] = useState(false)
  const [sess,    setSess]    = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null)
  const modeRef  = useRef(mode)
  const sessRef  = useRef(sess)
  useEffect(()=>{ modeRef.current=mode },[mode])
  useEffect(()=>{ sessRef.current=sess },[sess])

  useEffect(()=>{
    if (!running) { if(timerRef.current) clearInterval(timerRef.current); return }
    timerRef.current = setInterval(()=>{
      setSecs(s=>{
        if (s>1) return s-1
        clearInterval(timerRef.current!)
        setRunning(false)
        playRingtone(undefined, 60)
        const m = modeRef.current
        const ns = m==='work' ? sessRef.current+1 : sessRef.current
        if (m==='work') setSess(ns)
        const next: 'work'|'short'|'long' = m==='work' ? (ns%4===0?'long':'short') : 'work'
        setMode(next)
        return POMO[next]
      })
    },1000)
    return ()=>{ if(timerRef.current) clearInterval(timerRef.current) }
  },[running])

  function switchMode(m:'work'|'short'|'long') {
    if(timerRef.current) clearInterval(timerRef.current)
    setRunning(false); setMode(m); setSecs(POMO[m])
  }

  const mm  = String(Math.floor(secs/60)).padStart(2,'0')
  const ss  = String(secs%60).padStart(2,'0')
  const pct = 1 - secs/POMO[mode]
  const col = mode==='work' ? '#EF4444' : '#10B981'

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-neutral-500"/>
          <span className="text-xs font-extrabold text-neutral-700 dark:text-neutral-200">Pomodoro</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.07] text-neutral-500">
          {sess} sessiya
        </span>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-0.5 bg-neutral-100 dark:bg-white/[0.06] rounded-xl p-0.5 mb-4">
        {(['work','short','long'] as const).map(m=>(
          <button key={m} onClick={()=>switchMode(m)}
            className={cn('flex-1 py-1 rounded-[10px] text-[10px] font-bold transition-all',
              mode===m
                ?'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                :'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300')}>
            {m==='work'?'Ish':m==='short'?'Qisqa':'Uzoq'}
          </button>
        ))}
      </div>

      {/* Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none"
              className="stroke-neutral-100 dark:stroke-white/[0.07]" strokeWidth="2.8"/>
            <circle cx="18" cy="18" r="15.9" fill="none"
              stroke={col} strokeWidth="2.8"
              strokeDasharray={`${pct*100} 100`} strokeLinecap="round"
              style={{transition:'stroke-dasharray 1s linear'}}/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[22px] font-black tabular-nums text-neutral-900 dark:text-white leading-none">
              {mm}:{ss}
            </span>
            <span className="text-[8px] text-neutral-400 font-semibold">
              {mode==='work'?'Ish vaqti':mode==='short'?'Qisqa':'Uzoq tanaffus'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={()=>switchMode(mode)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400
            hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all">
          <RotateCcw className="w-3.5 h-3.5"/>
        </button>
        <button onClick={()=>setRunning(v=>!v)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white
            shadow-lg hover:opacity-90 active:scale-95 transition-all"
          style={{background:running?'#374151':col,
            boxShadow:running?undefined:`0 4px 16px ${col}55`}}>
          {running ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 ml-0.5"/>}
        </button>
        <div className="w-8 h-8 flex items-center justify-center">
          {mode==='work'
            ? <Zap className="w-4 h-4 text-amber-400"/>
            : <Coffee className="w-4 h-4 text-emerald-400"/>}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   BLOCK FORM (add / edit)
   ================================================================ */
interface FormState {
  open    : boolean
  editId  : string | null
  title   : string
  start   : number
  duration: number
  cat     : Cat
  note    : string
}

const INIT_FORM: FormState = {
  open:false, editId:null, title:'', start:9*60, duration:60, cat:'ish', note:'',
}

const DUR_OPTS = [15,30,45,60,90,120]

function BlockForm({
  form, onSave, onDelete, onClose,
}:{
  form:FormState
  onSave:(f:FormState)=>void
  onDelete:(id:string)=>void
  onClose:()=>void
}) {
  const startH = Math.floor(form.start/60)
  const startM = form.start%60

  function setField<K extends keyof FormState>(k:K, v:FormState[K]) {
    onSave({...form,[k]:v})
  }

  const handleTime = (h:number, m:number) => setField('start', h*60+m)

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl
        border border-neutral-200 dark:border-white/[0.08] w-full max-w-sm p-5 z-10"
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
            {form.editId ? 'Bloкni tahrirlash' : 'Yangi blok'}
          </h3>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Title */}
        <input
          autoFocus
          value={form.title}
          onChange={e=>setField('title',e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') onSave(form) }}
          placeholder="Nima qilmoqchisiz?"
          className="w-full rounded-xl border border-neutral-200 dark:border-white/[0.10]
            bg-neutral-50 dark:bg-white/[0.04] px-3 py-2.5
            text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400
            outline-none focus:border-neutral-400 dark:focus:border-white/[0.25] mb-4 transition-colors"
        />

        {/* Category */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2">Kategoriya</p>
          <div className="flex gap-1.5">
            {(Object.keys(CAT) as Cat[]).map(c=>(
              <button key={c} onClick={()=>setField('cat',c)}
                className={cn('flex-1 py-1.5 rounded-xl text-[10px] font-bold border transition-all',
                  form.cat===c
                    ? `${CAT[c].bg} ${CAT[c].border} ${CAT[c].text}`
                    : 'border-neutral-100 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-500 hover:border-neutral-200')}>
                {CAT[c].label}
              </button>
            ))}
          </div>
        </div>

        {/* Time + Duration */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">Boshlanish</p>
            <div className="flex gap-1">
              <select value={startH} onChange={e=>handleTime(+e.target.value,startM)}
                className="flex-1 rounded-xl border border-neutral-200 dark:border-white/[0.10]
                  bg-neutral-50 dark:bg-white/[0.04] px-2 py-2 text-xs font-bold
                  text-neutral-900 dark:text-white outline-none">
                {Array.from({length:END_H-START_H},(_,i)=>START_H+i).map(h=>(
                  <option key={h} value={h}>{String(h).padStart(2,'0')}</option>
                ))}
              </select>
              <select value={startM} onChange={e=>handleTime(startH,+e.target.value)}
                className="flex-1 rounded-xl border border-neutral-200 dark:border-white/[0.10]
                  bg-neutral-50 dark:bg-white/[0.04] px-2 py-2 text-xs font-bold
                  text-neutral-900 dark:text-white outline-none">
                {[0,15,30,45].map(m=>(
                  <option key={m} value={m}>{String(m).padStart(2,'0')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">Davomiyligi</p>
            <select value={form.duration} onChange={e=>setField('duration',+e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-white/[0.10]
                bg-neutral-50 dark:bg-white/[0.04] px-2 py-2 text-xs font-bold
                text-neutral-900 dark:text-white outline-none">
              {DUR_OPTS.map(d=>(
                <option key={d} value={d}>{d<60?`${d} daqiqa`:d===60?'1 soat':`${d/60} soat`}{d===60||d===90?d===90?' 30 daqiqa':''  :''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Note */}
        <textarea
          value={form.note}
          onChange={e=>setField('note',e.target.value)}
          placeholder="Izoh (ixtiyoriy)"
          rows={2}
          className="w-full rounded-xl border border-neutral-200 dark:border-white/[0.10]
            bg-neutral-50 dark:bg-white/[0.04] px-3 py-2
            text-xs text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400
            outline-none focus:border-neutral-400 dark:focus:border-white/[0.25] resize-none mb-4 transition-colors"
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {form.editId && (
            <button onClick={()=>onDelete(form.editId!)}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
              <Trash2 className="w-4 h-4"/>
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-bold
              border border-neutral-200 dark:border-white/[0.10]
              text-neutral-600 dark:text-neutral-400
              hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all">
            Bekor
          </button>
          <button
            onClick={()=>{ if(form.title.trim()) onSave({...form,open:false}) }}
            disabled={!form.title.trim()}
            className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all
              bg-neutral-900 dark:bg-white dark:text-neutral-900
              hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
            {form.editId?'Saqlash':'Qo\'shish'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   BLOCK ITEM (on the grid)
   ================================================================ */
function BlockItem({
  block, onDragStart, onResizeStart, onClick,
}:{
  block       : Block
  onDragStart : (e:React.PointerEvent)=>void
  onResizeStart:(e:React.PointerEvent)=>void
  onClick     : ()=>void
}) {
  const top    = toPx(block.start)
  const height = Math.max(toH(block.duration), 18)
  const c      = CAT[block.cat]
  const short  = height < 34

  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute left-1 right-1 rounded-xl border cursor-pointer select-none',
        'hover:brightness-105 active:brightness-95 transition-all',
        block.done ? 'opacity-50' : '',
        c.bg, c.border,
      )}
      style={{ top, height, zIndex: 5 }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={e=>{ e.stopPropagation(); onDragStart(e) }}
        className="absolute left-0 inset-y-0 w-5 flex items-center justify-center
          cursor-grab active:cursor-grabbing touch-none rounded-l-xl"
        onClick={e=>e.stopPropagation()}
      >
        <GripVertical className={cn('w-3 h-3 opacity-40', c.text)}/>
      </div>

      {/* Content */}
      <div className="pl-5 pr-2 py-1 h-full flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={e=>{ e.stopPropagation(); /* toggle done via parent */ onClick() }}
            className="flex-shrink-0"
          >
            {block.done
              ? <CheckCircle2 className={cn('w-3 h-3', c.text)}/>
              : <Circle className={cn('w-3 h-3 opacity-50', c.text)}/>}
          </button>
          <span className={cn(
            'font-bold truncate leading-tight',
            short ? 'text-[10px]' : 'text-[11px]',
            c.text,
            block.done && 'line-through opacity-60',
          )}>
            {block.title || c.label}
          </span>
        </div>
        {!short && (
          <span className={cn('text-[9px] opacity-60 pl-4 leading-none mt-0.5', c.text)}>
            {fmtTime(block.start)} · {block.duration}m
          </span>
        )}
      </div>

      {/* Resize handle */}
      <div
        onPointerDown={e=>{ e.stopPropagation(); onResizeStart(e) }}
        onClick={e=>e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 h-3 cursor-s-resize touch-none
          flex items-center justify-center group"
      >
        <div className="w-8 h-0.5 rounded-full bg-current opacity-0 group-hover:opacity-30 transition-opacity"
          style={{color:c.dot}}/>
      </div>
    </div>
  )
}

/* ================================================================
   TIME GRID
   ================================================================ */
function TimeGrid({
  blocks, dateKey: dk, onBlocksChange, onAddAt,
}:{
  blocks       : Block[]
  dateKey      : string
  onBlocksChange:(b:Block[])=>void
  onAddAt      :(start:number)=>void
}) {
  const gridRef      = useRef<HTMLDivElement>(null)
  const isDragging   = useRef(false)
  const pointerMoved = useRef(false)

  /* Current time indicator */
  const [nowMin, setNowMin] = useState<number|null>(null)
  useEffect(()=>{
    function update() {
      const n = new Date()
      setNowMin(n.getHours()*60+n.getMinutes())
    }
    update()
    const id = setInterval(update, 60_000)
    return ()=>clearInterval(id)
  },[])

  /* Drag/resize with document-level listeners */
  function startDrag(e:React.PointerEvent, id:string, type:'move'|'resize') {
    e.preventDefault()
    isDragging.current = true
    const block   = blocks.find(b=>b.id===id)!
    const startY  = e.clientY
    const origS   = block.start
    const origD   = block.duration

    function onMove(ev:PointerEvent) {
      const dMin = snapM(ev.clientY - startY)
      onBlocksChange(blocks.map(b=>{
        if (b.id!==id) return b
        if (type==='move') {
          return {...b, start: clamp(origS+dMin, START_H*60, END_H*60-b.duration)}
        } else {
          return {...b, duration: clamp(origD+dMin, SNAP_MIN, END_H*60-b.start)}
        }
      }))
    }

    function onUp() {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup',   onUp)
      setTimeout(()=>{ isDragging.current=false }, 100)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup',   onUp)
  }

  function handleGridClick(e:React.MouseEvent<HTMLDivElement>) {
    if (isDragging.current) return
    const rect   = gridRef.current!.getBoundingClientRect()
    const py     = e.clientY - rect.top
    const start  = clamp(
      Math.round(py / SNAP_PX) * SNAP_MIN + START_H*60,
      START_H*60, END_H*60-60
    )
    onAddAt(start)
  }

  const todayBlocks = blocks.filter(b=>b.dateKey===dk)

  return (
    <div className="flex min-w-0 flex-1">
      {/* Time labels */}
      <div className="flex-shrink-0 w-12 pr-2 select-none" style={{height:TOTAL_H*HOUR_H}}>
        {Array.from({length:TOTAL_H+1},(_,i)=>(
          <div key={i} style={{position:'absolute',top:i*HOUR_H-8,width:44}}
            className="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 text-right pr-2 leading-none">
            {i+START_H<10?`0${i+START_H}:00`:`${i+START_H}:00`}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        onClick={handleGridClick}
        className="relative flex-1 min-w-0 cursor-crosshair"
        style={{height:TOTAL_H*HOUR_H}}
      >
        {/* Hour lines */}
        {Array.from({length:TOTAL_H+1},(_,i)=>(
          <div key={i} className="absolute left-0 right-0 border-t
            border-neutral-200 dark:border-white/[0.07]"
            style={{top:i*HOUR_H}}/>
        ))}

        {/* Half-hour dashed lines */}
        {Array.from({length:TOTAL_H},(_,i)=>(
          <div key={i} className="absolute left-0 right-0 border-t border-dashed
            border-neutral-100 dark:border-white/[0.03]"
            style={{top:i*HOUR_H+HOUR_H/2}}/>
        ))}

        {/* Current time indicator */}
        {nowMin && nowMin >= START_H*60 && nowMin <= END_H*60 && (
          <div className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
            style={{top:toPx(nowMin)}}>
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 flex-shrink-0"/>
            <div className="flex-1 h-px bg-red-500 opacity-80"/>
          </div>
        )}

        {/* Blocks */}
        {todayBlocks.map(block=>(
          <BlockItem
            key={block.id}
            block={block}
            onDragStart={e=>startDrag(e,block.id,'move')}
            onResizeStart={e=>startDrag(e,block.id,'resize')}
            onClick={()=>{}} // handled by parent
          />
        ))}
      </div>
    </div>
  )
}

/* ================================================================
   DAY STATS
   ================================================================ */
function DayStats({ blocks }: { blocks: Block[] }) {
  const total   = blocks.reduce((s,b)=>s+b.duration, 0)
  const done    = blocks.filter(b=>b.done).reduce((s,b)=>s+b.duration, 0)
  const pct     = total ? Math.round(done/total*100) : 0

  const byCat = (Object.keys(CAT) as Cat[]).map(c=>({
    c, mins: blocks.filter(b=>b.cat===c).reduce((s,b)=>s+b.duration,0)
  })).filter(x=>x.mins>0)

  if (!blocks.length) return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
      bg-white dark:bg-neutral-900 p-4">
      <p className="text-xs font-extrabold text-neutral-700 dark:text-neutral-200 mb-2">Kun statistikasi</p>
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <Clock className="w-8 h-8 text-neutral-200 dark:text-neutral-700 mb-2"/>
        <p className="text-[11px] text-neutral-400">Bugun blok qo'shing</p>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.08]
      bg-white dark:bg-neutral-900 p-4 space-y-3">
      <p className="text-xs font-extrabold text-neutral-700 dark:text-neutral-200">Kun statistikasi</p>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-neutral-500">Bajarilgan</span>
          <span className="text-[10px] font-black text-neutral-700 dark:text-neutral-200">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.07] overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all"
            style={{width:`${pct}%`}}/>
        </div>
      </div>

      {/* Total time */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-neutral-500">Jami rejalashtirilgan</span>
        <span className="font-extrabold text-neutral-700 dark:text-neutral-200">
          {Math.floor(total/60)}s {total%60>0?`${total%60}m`:''}
        </span>
      </div>

      {/* Category breakdown */}
      {byCat.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-white/[0.06]">
          {byCat.map(({c,mins})=>(
            <div key={c} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{background:CAT[c].dot}}/>
                <span className="text-[10px] text-neutral-500">{CAT[c].label}</span>
              </div>
              <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                {Math.floor(mins/60)>0?`${Math.floor(mins/60)}s `:''}
                {mins%60>0?`${mins%60}m`:''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function PlannerPage() {
  const [date,   setDate]   = useState(()=>new Date())
  const [blocks, setBlocks] = useState<Block[]>([])
  const [form,   setForm]   = useState<FormState>(INIT_FORM)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Load from localStorage */
  useEffect(()=>{
    setBlocks(loadBlocks())
    setMounted(true)
    /* Scroll to current time (or 8:00) on mount */
    const scrollTo = () => {
      const n = new Date()
      const min = n.getHours()*60+n.getMinutes()
      const y = Math.max(0, toPx(min) - 200)
      scrollRef.current?.scrollTo({top:y, behavior:'smooth'})
    }
    setTimeout(scrollTo, 200)
  },[])

  /* Auto-save */
  const saveRef = useRef<ReturnType<typeof setTimeout>|null>(null)
  useEffect(()=>{
    if (!mounted) return
    if (saveRef.current) clearTimeout(saveRef.current)
    saveRef.current = setTimeout(()=>saveBlocks(blocks), 400)
  },[blocks, mounted])

  const dk = dkey(date)
  const todayBlocks = blocks.filter(b=>b.dateKey===dk)

  /* Block click → open edit form */
  function openEdit(block: Block) {
    setForm({open:true, editId:block.id, title:block.title,
      start:block.start, duration:block.duration, cat:block.cat, note:block.note})
  }

  /* Add at time */
  function openAdd(start: number) {
    setForm({...INIT_FORM, open:true, start})
  }

  /* Save form */
  function handleFormSave(f: FormState) {
    if (!f.title.trim()) return
    if (f.editId) {
      setBlocks(prev=>prev.map(b=>b.id===f.editId
        ? {...b, title:f.title, start:f.start, duration:f.duration, cat:f.cat, note:f.note}
        : b))
    } else {
      const nb: Block = {
        id:uid(), title:f.title, start:f.start, duration:f.duration,
        cat:f.cat, done:false, note:f.note, dateKey:dk,
      }
      setBlocks(prev=>[...prev,nb])
    }
    setForm(INIT_FORM)
  }

  /* Delete block */
  function handleDelete(id: string) {
    setBlocks(prev=>prev.filter(b=>b.id!==id))
    setForm(INIT_FORM)
  }

  /* Toggle done — detect click on block */
  function handleBlockClick(blockId: string) {
    const block = blocks.find(b=>b.id===blockId)!
    if (!block) return
    // If shift/ctrl: toggle done; otherwise open edit
    openEdit(block)
  }

  if (!mounted) return null

  return (
    <div className="flex h-[calc(100vh-112px)] gap-4 -mt-1">

      {/* ── Left: Grid ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden
        rounded-2xl border border-neutral-200 dark:border-white/[0.08]
        bg-white dark:bg-neutral-900">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3
          border-b border-neutral-100 dark:border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={()=>setDate(d=>addDays(d,-1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                  text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
                <ChevronLeft className="w-4 h-4"/>
              </button>
              <button onClick={()=>setDate(d=>addDays(d,1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                  text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/[0.07] transition-all">
                <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight">
                {fmtDate(date)}
              </h2>
              {isToday(date) && (
                <span className="text-[10px] text-emerald-500 font-bold">● Bugun</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isToday(date) && (
              <button onClick={()=>setDate(new Date())}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl
                  border border-neutral-200 dark:border-white/[0.10]
                  text-neutral-600 dark:text-neutral-400
                  hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all">
                Bugun
              </button>
            )}
            <button
              onClick={()=>openAdd(9*60)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl
                bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
                hover:opacity-90 active:scale-95 transition-all shadow-sm">
              <Plus className="w-3.5 h-3.5"/>
              Blok
            </button>
          </div>
        </div>

        {/* Scrollable grid */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2">
          <div className="relative" style={{height:TOTAL_H*HOUR_H}}>
            <TimeGrid
              blocks={blocks}
              dateKey={dk}
              onBlocksChange={b=>setBlocks(b)}
              onAddAt={openAdd}
            />
          </div>
        </div>
      </div>

      {/* ── Right: Panels ─────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3 overflow-y-auto pb-1
        kj-no-scrollbar">
        <PomodoroWidget/>
        <DayStats blocks={todayBlocks}/>

        {/* Quick add */}
        <div className="rounded-2xl border border-dashed border-neutral-200
          dark:border-white/[0.08] p-4">
          <p className="text-[10px] font-bold text-neutral-400 mb-2">Tezkor qo'shish</p>
          <div className="flex flex-col gap-1.5">
            {(Object.keys(CAT) as Cat[]).map(c=>(
              <button key={c} onClick={()=>{
                  const now = new Date()
                  const start = clamp(now.getHours()*60+now.getMinutes(), START_H*60, END_H*60-60)
                  setForm({...INIT_FORM, open:true, cat:c, start})
                }}
                className={cn('flex items-center gap-2 px-3 py-2 rounded-xl text-left',
                  'border transition-all hover:scale-[1.01] active:scale-[0.99]',
                  CAT[c].bg, CAT[c].border)}>
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{background:CAT[c].dot}}/>
                <span className={cn('text-[11px] font-bold', CAT[c].text)}>
                  {CAT[c].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Block form modal */}
      {form.open && (
        <BlockForm
          form={form}
          onSave={handleFormSave}
          onDelete={handleDelete}
          onClose={()=>setForm(INIT_FORM)}
        />
      )}

      <style>{`
        .kj-no-scrollbar::-webkit-scrollbar { display:none; }
        .kj-no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  )
}
