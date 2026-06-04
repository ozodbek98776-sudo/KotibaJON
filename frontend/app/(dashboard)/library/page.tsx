'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Search, X, BookOpen, Star, Clock, ChevronLeft, ChevronRight,
  Bookmark, BookMarked, ArrowLeft, Sparkles, Trophy,
  Flame, Coins, Brain, Briefcase, Leaf, Zap, Inbox,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BOOKS, CATEGORY_META, type Book, type BookCat } from './data'

/* ── Category icon components (replaces emoji strings in CATEGORY_META) ── */
const CAT_ICON: Record<BookCat, LucideIcon> = {
  odatlar     : Flame,
  moliya      : Coins,
  psixologiya : Brain,
  biznes      : Briefcase,
  falsafa     : Leaf,
  motivatsiya : Zap,
}
function CatIcon({ cat, size = 14 }: { cat: BookCat; size?: number }) {
  const Icon = CAT_ICON[cat]
  return <Icon style={{ width: size, height: size, flexShrink: 0 }}/>
}

interface Progress {
  bookId    : string
  chapter   : number
  page      : number
  startedAt : string
  finished  : boolean
  bookmarks : number[]
}

const LS = 'kj_library'

function loadProgress(): Progress[] {
  try { return JSON.parse(localStorage.getItem(LS) || '[]') } catch { return [] }
}
function saveProgress(p: Progress[]) {
  localStorage.setItem(LS, JSON.stringify(p))
}
function getBookProgress(bookId: string, allProgress: Progress[]): Progress | null {
  return allProgress.find(p => p.bookId === bookId) ?? null
}
function upsertProgress(bookId: string, updates: Partial<Progress>, all: Progress[]): Progress[] {
  const existing = all.find(p => p.bookId === bookId)
  if (existing) return all.map(p => p.bookId === bookId ? { ...p, ...updates } : p)
  const fresh: Progress = {
    bookId, chapter: 0, page: 0,
    startedAt: new Date().toISOString().slice(0, 10),
    finished: false, bookmarks: [],
    ...updates,
  }
  return [...all, fresh]
}

/* ================================================================
   CSS
   ================================================================ */
const CSS = `
  @keyframes book-open {
    from { transform: perspective(1400px) rotateY(-55deg) scale(0.88) translateX(40px); opacity:0; }
    to   { transform: perspective(1400px) rotateY(0deg)   scale(1)    translateX(0);    opacity:1; }
  }

  /* ── Professional 3D Page Flip ─────────────────────────────── */
  /* Slow lift → fast through 90° → slow land  (physical feel) */
  @keyframes flip-fwd {
    0%   { transform: rotateY(0deg);    }
    14%  { transform: rotateY(-22deg);  }
    86%  { transform: rotateY(-158deg); }
    100% { transform: rotateY(-180deg); }
  }
  @keyframes flip-bck {
    0%   { transform: rotateY(-180deg); }
    14%  { transform: rotateY(-158deg); }
    86%  { transform: rotateY(-22deg);  }
    100% { transform: rotateY(0deg);    }
  }

  /* Curl shadow on the "going-away" face (peaks at the 90° midpoint) */
  @keyframes curl-away {
    0%   { opacity: 0;    }
    42%  { opacity: 0.72; }
    50%  { opacity: 0;    }
    100% { opacity: 0;    }
  }
  /* Depth shadow on the "arriving" face (starts dark, clears as page lands) */
  @keyframes curl-arrive {
    0%,50% { opacity: 0.6;  }
    88%    { opacity: 0;    }
    100%   { opacity: 0;    }
  }

  /* Shadow cast onto the static underlying page */
  @keyframes cast-shadow {
    0%   { opacity: 0;    }
    14%  { opacity: 0.40; }
    86%  { opacity: 0.06; }
    100% { opacity: 0;    }
  }

  /* Subtle page-corner lift hint (CSS hover driven via inline style) */
  @keyframes corner-peel {
    0%,100% { transform: perspective(180px) rotateY(0deg) rotateX(0deg);  }
    50%     { transform: perspective(180px) rotateY(-14deg) rotateX(4deg); }
  }

  @keyframes lib-fade-up {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes shelf-in {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0);     }
  }
`

/* ================================================================
   3D BOOK COVER
   ================================================================ */
const BOOK_W = 88
const BOOK_H = 128
const SPINE  = 16

function Book3D({ book, progress, onClick }: {
  book     : Book
  progress : Progress | null
  onClick  : () => void
}) {
  const [hovered, setHovered] = useState(false)
  const pct = progress
    ? Math.min(Math.round(((progress.chapter * 2 + (progress.finished ? Infinity : 0))
        / (book.chapters.length * 2)) * 100), 100)
    : 0

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      style={{ perspective: '900px', width: BOOK_W + SPINE, paddingBottom: 20 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: BOOK_W * 0.85, height: 8,
          background: 'rgba(0,0,0,0.4)', filter: 'blur(6px)',
          transition: 'all .4s ease',
          transform: hovered
            ? 'translateX(-50%) scaleX(1.1) translateY(-4px)'
            : 'translateX(-50%) scaleX(0.85) translateY(0px)',
          opacity: hovered ? 0.6 : 0.35,
        }}/>

      <div style={{
        width: BOOK_W, height: BOOK_H, position: 'relative',
        transformStyle: 'preserve-3d',
        transform: hovered
          ? 'rotateY(-38deg) rotateX(5deg) translateY(-10px)'
          : 'rotateY(-22deg) rotateX(3deg)',
        transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
        marginLeft: SPINE,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(145deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})`,
          borderRadius: '0 4px 4px 0', overflow: 'hidden',
          boxShadow: 'inset -2px 0 6px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(255,255,255,0.08), rgba(0,0,0,0.05))',
          }}/>
          <div style={{ position: 'absolute', inset: 0, padding: '10px 8px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: book.textColor, lineHeight: 1.3, letterSpacing: 0.2, marginBottom: 4 }}>
              {book.title}
            </div>
            <div style={{ fontSize: 8, color: book.textColor === '#fff' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)', fontWeight: 600 }}>
              {book.author}
            </div>
            <div style={{
              marginTop: 'auto', width: 16, height: 16, borderRadius: '50%',
              background: CATEGORY_META[book.category].color, opacity: 0.9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CatIcon cat={book.category} size={9}/>
            </div>
          </div>
          {pct > 0 && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: `${pct}%`, height: 3, background: 'rgba(255,255,255,0.6)',
            }}/>
          )}
        </div>

        <div style={{
          position: 'absolute', width: SPINE, height: '100%', left: 0,
          transformOrigin: 'left center', transform: 'rotateY(-90deg)',
          background: `linear-gradient(to bottom, ${book.spineColor}, ${book.spineColor}dd)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <span style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontSize: 7, fontWeight: 900, color: 'rgba(255,255,255,0.7)',
            letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap',
            overflow: 'hidden', maxHeight: '90%',
          }}>
            {book.title}
          </span>
        </div>

        <div style={{
          position: 'absolute', width: SPINE * 0.7, height: '98%',
          top: '1%', right: -SPINE * 0.7,
          transformOrigin: 'left center', transform: 'rotateY(90deg)',
          background: 'repeating-linear-gradient(to bottom, #f5f5ef, #f5f5ef 1px, #e8e8e2 1px, #e8e8e2 2px)',
        }}/>

        <div style={{
          position: 'absolute', width: '100%', height: SPINE * 0.5, bottom: -SPINE * 0.5,
          transformOrigin: 'bottom center', transform: 'rotateX(-90deg)',
          background: 'linear-gradient(to right, #e8e8e2, #f5f5ef)',
        }}/>
      </div>

      {hovered && (
        <div style={{
          position: 'absolute', bottom: -4, left: '50%',
          transform: 'translateX(-50%)', whiteSpace: 'nowrap',
          fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.8)',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)', pointerEvents: 'none',
        }}>
          {progress?.finished ? '✓ Tugallangan' :
           pct > 0 ? `${pct}% o'qilgan` : "Bosing — o'qing"}
        </div>
      )}
    </div>
  )
}

/* ================================================================
   MARKDOWN RENDERER
   ================================================================ */
function mdRender(text: string): React.ReactNode {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**'))
        return <strong key={j} className="font-extrabold text-neutral-900">{p.slice(2, -2)}</strong>
      if (p.startsWith('*') && p.endsWith('*'))
        return <em key={j} style={{ color: '#b45309' }}>{p.slice(1, -1)}</em>
      if (p.startsWith('•'))
        return (
          <span key={j} style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
            <span style={{ color: '#f59e0b', fontWeight: 900, flexShrink: 0 }}>•</span>
            <span>{p.slice(1)}</span>
          </span>
        )
      return p
    })
    return <span key={i} style={{ display: 'block', lineHeight: 1.75, marginBottom: 2 }}>{parts}</span>
  })
}

/* ================================================================
   RIGHT PAGE CONTENT
   ================================================================ */
function RightPageContent({ chapter, isBookmarked }: {
  chapter: Book['chapters'][0]
  isBookmarked: boolean
}) {
  return (
    <div className="h-full">
      <div className="mb-5 pb-4 border-b border-neutral-200">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
            {chapter.title}
          </h3>
          {isBookmarked && <Bookmark className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>}
        </div>
        {chapter.quote && (
          <blockquote className="mt-3 pl-3 border-l-2 border-amber-400 italic text-[11.5px] text-amber-800 leading-relaxed">
            {chapter.quote}
          </blockquote>
        )}
      </div>
      <div className="text-[12px] text-neutral-700 leading-relaxed space-y-0.5">
        {mdRender(chapter.content)}
      </div>
      <div className="absolute bottom-4 right-5 text-[10px] text-neutral-300 font-medium select-none">
        {chapter.pages} bet
      </div>
    </div>
  )
}

/* ================================================================
   BOOK READER — 3D Page Flip
   ================================================================ */
function BookReader({ book, progress, onClose, onProgressChange }: {
  book             : Book
  progress         : Progress | null
  onClose          : () => void
  onProgressChange : (p: Partial<Progress>) => void
}) {
  const [chapterIdx,     setChapterIdx]  = useState(progress?.chapter ?? 0)
  const [pendingChapter, setPending]     = useState(progress?.chapter ?? 0)
  const [flip,           setFlip]        = useState<'fwd' | 'bck' | null>(null)
  const [opened,         setOpened]      = useState(false)
  const [bookmarks,      setBookmarks]   = useState<number[]>(progress?.bookmarks ?? [])
  const [cornerHovered,  setCornerHover] = useState(false)

  const chapter    = book.chapters[chapterIdx]
  const isLast     = chapterIdx >= book.chapters.length - 1
  const isFirst    = chapterIdx === 0
  const isBookmarked = bookmarks.includes(chapterIdx)

  useEffect(() => { setTimeout(() => setOpened(true), 80) }, [])

  const FLIP_MS = 720

  function goNext() {
    if (isLast || flip) return
    const target = chapterIdx + 1
    setPending(target)
    setFlip('fwd')
    setTimeout(() => {
      setChapterIdx(target)
      setFlip(null)
      onProgressChange({ chapter: target, finished: target >= book.chapters.length - 1 })
    }, FLIP_MS)
  }

  function goPrev() {
    if (isFirst || flip) return
    const target = chapterIdx - 1
    setPending(target)
    setFlip('bck')
    setTimeout(() => {
      setChapterIdx(target)
      setFlip(null)
      onProgressChange({ chapter: target })
    }, FLIP_MS)
  }

  function goChapter(i: number) {
    if (i === chapterIdx || flip) return
    const dir = i > chapterIdx ? 'fwd' : 'bck'
    setPending(i)
    setFlip(dir)
    setTimeout(() => {
      setChapterIdx(i)
      setFlip(null)
      onProgressChange({ chapter: i })
    }, FLIP_MS)
  }

  function toggleBookmark() {
    const nb = bookmarks.includes(chapterIdx)
      ? bookmarks.filter(b => b !== chapterIdx)
      : [...bookmarks, chapterIdx]
    setBookmarks(nb)
    onProgressChange({ bookmarks: nb })
  }

  /* Compute face content based on flip direction:
     fwd: front=current(going away), back=target(arriving)
     bck: back=current(going away),  front=target(arriving)  */
  const isFwd            = flip === 'fwd'
  const targetChapter    = book.chapters[pendingChapter] ?? chapter
  const frontChapter     = isFwd ? chapter : targetChapter
  const backChapter      = isFwd ? targetChapter : chapter
  const frontBookmarked  = isFwd ? isBookmarked : bookmarks.includes(pendingChapter)
  const backBookmarked   = isFwd ? bookmarks.includes(pendingChapter) : isBookmarked
  /* Curl gradient: darkens toward the folding edge */
  const frontCurlGrad    = isFwd
    ? 'linear-gradient(to right, transparent 20%, rgba(0,0,0,0.6) 100%)'
    : 'linear-gradient(to left,  transparent 20%, rgba(0,0,0,0.6) 100%)'
  const backCurlGrad     = isFwd
    ? 'linear-gradient(to left,  transparent 20%, rgba(0,0,0,0.6) 100%)'
    : 'linear-gradient(to right, transparent 20%, rgba(0,0,0,0.6) 100%)'
  const frontCurlAnim    = isFwd ? 'curl-away' : 'curl-arrive'
  const backCurlAnim     = isFwd ? 'curl-arrive' : 'curl-away'

  const easing = `${FLIP_MS}ms cubic-bezier(0.645,0.045,0.355,1.000) both`

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,8,5,0.93)', backdropFilter: 'blur(14px)' }}>
      <style>{CSS}</style>

      <div style={{
        maxWidth: 820, width: '100%',
        animation: opened ? 'book-open 0.55s cubic-bezier(.22,1,.36,1) both' : undefined,
      }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-3">
            <button onClick={onClose}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-bold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5"/> Kutubxonaga qaytish
            </button>
            <div className="w-px h-4 bg-white/20"/>
            <span className="text-white/50 text-xs">{book.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleBookmark}
              className={cn(
                'flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all',
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/10',
              )}>
              {isBookmarked ? <BookMarked className="w-3.5 h-3.5"/> : <Bookmark className="w-3.5 h-3.5"/>}
              {isBookmarked ? 'Belgili' : "Belgilab qo'y"}
            </button>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Book spread */}
        <div style={{ perspective: '2200px' }}>
          <div className="flex rounded-xl overflow-hidden"
            style={{
              background: '#fdf8f0',
              boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.15)',
              minHeight: 500,
            }}>

            {/* ── LEFT PAGE (chapter nav) ── */}
            <div className="w-[38%] flex-shrink-0 relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})`,
                borderRight: '1px solid rgba(0,0,0,0.14)',
                /* Center binding shadow on left page right edge */
                boxShadow: 'inset -8px 0 20px rgba(0,0,0,0.18)',
              }}>
              <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
              <div style={{ position:'absolute', bottom:-60, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(0,0,0,0.1)' }}/>

              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="mb-6">
                  <p style={{ color: book.textColor==='#fff'?'rgba(255,255,255,0.6)':'rgba(0,0,0,0.5)', fontSize:9, fontWeight:800, letterSpacing:2, textTransform:'uppercase', marginBottom:6, display:'flex', alignItems:'center', gap:4 }}>
                    <CatIcon cat={book.category} size={10}/> {CATEGORY_META[book.category].label}
                  </p>
                  <h2 style={{ color: book.textColor, fontSize:18, fontWeight:900, lineHeight:1.2, marginBottom:4 }}>
                    {book.title}
                  </h2>
                  <p style={{ color: book.textColor==='#fff'?'rgba(255,255,255,0.65)':'rgba(0,0,0,0.55)', fontSize:11, fontWeight:600 }}>
                    {book.author} · {book.year}
                  </p>
                </div>

                <div className="flex-1 space-y-1.5 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
                  <p style={{ color:book.textColor==='#fff'?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.4)', fontSize:8, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>
                    Boblar
                  </p>
                  {book.chapters.map((ch, i) => (
                    <button key={i} onClick={() => goChapter(i)}
                      className={cn(
                        'w-full text-left rounded-lg px-2.5 py-2 transition-all',
                        i === chapterIdx ? 'bg-white/20' : 'hover:bg-white/10',
                      )}>
                      <span style={{
                        color: i === chapterIdx
                          ? (book.textColor==='#fff' ? '#fff' : '#111')
                          : (book.textColor==='#fff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'),
                        fontSize: 10, fontWeight: i === chapterIdx ? 800 : 600,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        {bookmarks.includes(i) && <Bookmark style={{ width:9, height:9, color:'#F59E0B' }}/>}
                        {ch.title}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color:book.textColor==='#fff'?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.4)', fontSize:9, fontWeight:700 }}>
                      O'qish jarayoni
                    </span>
                    <span style={{ color:book.textColor==='#fff'?'rgba(255,255,255,0.7)':'rgba(0,0,0,0.6)', fontSize:10, fontWeight:900 }}>
                      {chapterIdx + 1}/{book.chapters.length}
                    </span>
                  </div>
                  <div style={{ height:3, borderRadius:4, background:'rgba(255,255,255,0.15)' }}>
                    <div style={{
                      height:'100%', borderRadius:4, background:'rgba(255,255,255,0.7)',
                      width:`${((chapterIdx + 1) / book.chapters.length) * 100}%`,
                      transition:'width .5s ease',
                    }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PAGE (content + 3D flip) ── */}
            <div className="flex-1 relative overflow-hidden"
              style={{ background: '#fdf8f0', perspective: '2200px' }}>

              {/* Center binding shadow on right page left edge */}
              <div style={{
                position:'absolute', top:0, left:0, bottom:0, width:32, zIndex:5, pointerEvents:'none',
                background:'linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.04) 60%, transparent 100%)',
              }}/>

              {/* Static underlying page — shows target during flip */}
              <div className="absolute inset-0 p-7 overflow-y-auto" style={{ scrollbarWidth:'none' }}>
                <RightPageContent
                  chapter={flip ? targetChapter : chapter}
                  isBookmarked={bookmarks.includes(flip ? pendingChapter : chapterIdx)}
                />
              </div>

              {/* ── Cast shadow from flipping page onto underlying content ── */}
              {flip && (
                <div style={{
                  position:'absolute', inset:0, zIndex:16, pointerEvents:'none',
                  background: isFwd
                    ? 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)'
                    : 'linear-gradient(to left,  rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)',
                  animation: `cast-shadow ${easing}`,
                }}/>
              )}

              {/* ── 3D FLIPPING PAGE ── */}
              {flip && (
                <div style={{
                  position:'absolute', inset:0,
                  transformOrigin:'left center',
                  transformStyle:'preserve-3d',
                  animation:`flip-${flip} ${easing}`,
                  zIndex:20,
                }}>

                  {/* FRONT FACE */}
                  <div style={{
                    position:'absolute', inset:0,
                    backfaceVisibility:'hidden',
                    background:'#fdf8f0',
                    overflow:'hidden',
                  }}>
                    <div style={{ padding:28, height:'100%', overflow:'hidden' }}>
                      <RightPageContent chapter={frontChapter} isBookmarked={frontBookmarked}/>
                    </div>
                    {/* Spine shadow on front face */}
                    <div style={{
                      position:'absolute', top:0, left:0, bottom:0, width:30, pointerEvents:'none',
                      background:'linear-gradient(to right, rgba(0,0,0,0.16), transparent)',
                    }}/>
                    {/* Paper edge hint (right side lifts) */}
                    <div style={{
                      position:'absolute', top:0, right:0, bottom:0, width:3, pointerEvents:'none',
                      background:'linear-gradient(to left, rgba(0,0,0,0.12), transparent)',
                    }}/>
                    {/* Curl depth gradient */}
                    <div style={{
                      position:'absolute', inset:0, pointerEvents:'none',
                      background: frontCurlGrad,
                      animation:`${frontCurlAnim} ${easing}`,
                    }}/>
                  </div>

                  {/* BACK FACE */}
                  <div style={{
                    position:'absolute', inset:0,
                    backfaceVisibility:'hidden',
                    transform:'rotateY(180deg)',
                    background:'#f7f3e9',   /* slightly warmer — back of paper */
                    overflow:'hidden',
                  }}>
                    <div style={{ padding:28, height:'100%', overflow:'hidden' }}>
                      <RightPageContent chapter={backChapter} isBookmarked={backBookmarked}/>
                    </div>
                    {/* Spine shadow on back face (opposite side since mirrored) */}
                    <div style={{
                      position:'absolute', top:0, right:0, bottom:0, width:30, pointerEvents:'none',
                      background:'linear-gradient(to left, rgba(0,0,0,0.16), transparent)',
                    }}/>
                    {/* Curl depth gradient */}
                    <div style={{
                      position:'absolute', inset:0, pointerEvents:'none',
                      background: backCurlGrad,
                      animation:`${backCurlAnim} ${easing}`,
                    }}/>
                  </div>
                </div>
              )}

              {/* ── Page corner peel hint ── */}
              {!flip && !isLast && (
                <div
                  onClick={goNext}
                  onMouseEnter={() => setCornerHover(true)}
                  onMouseLeave={() => setCornerHover(false)}
                  style={{
                    position:'absolute', bottom:0, right:0,
                    width:56, height:56, zIndex:10, cursor:'pointer',
                    transformOrigin:'bottom right',
                    transition:'transform 0.25s ease',
                  }}>
                  {/* Folded corner triangle */}
                  <div style={{
                    position:'absolute', bottom:0, right:0,
                    width:0, height:0,
                    borderStyle:'solid',
                    borderWidth:`0 0 ${cornerHovered ? 56 : 40}px ${cornerHovered ? 56 : 40}px`,
                    borderColor:`transparent transparent ${cornerHovered ? 'rgba(0,0,0,0.11)' : 'rgba(0,0,0,0.06)'} transparent`,
                    transition:'all 0.25s ease',
                  }}/>
                  {/* Shine on fold */}
                  <div style={{
                    position:'absolute', bottom:2, right:2,
                    fontSize:11, color: cornerHovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)',
                    fontWeight:700, transition:'color 0.25s ease',
                    userSelect:'none', lineHeight:1,
                  }}>›</div>
                </div>
              )}

              {/* ── Click zones ── */}
              {!flip && (
                <>
                  {!isFirst && (
                    <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-start pl-2"
                      onClick={goPrev} style={{ cursor:'w-resize', zIndex:8 }}>
                      <div className="opacity-0 hover:opacity-100 transition-opacity
                        w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4 text-neutral-600"/>
                      </div>
                    </div>
                  )}
                  {!isLast && (
                    <div className="absolute right-0 top-0 bottom-14 w-14 flex items-center justify-end pr-2"
                      onClick={goNext} style={{ cursor:'e-resize', zIndex:8 }}>
                      <div className="opacity-0 hover:opacity-100 transition-opacity
                        w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-neutral-600"/>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between mt-4 px-1">
          <button onClick={goPrev} disabled={isFirst || !!flip}
            className={cn(
              'flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all',
              isFirst || flip
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/10',
            )}>
            <ChevronLeft className="w-3.5 h-3.5"/>
            {chapterIdx > 0 ? book.chapters[chapterIdx-1]?.title.slice(0, 28)+'...' : 'Oldingi bob'}
          </button>

          <div className="flex items-center gap-1.5">
            {book.chapters.map((_, i) => (
              <div key={i}
                className={cn('rounded-full transition-all cursor-pointer',
                  i === chapterIdx
                    ? 'w-5 h-1.5 bg-white/80'
                    : bookmarks.includes(i)
                      ? 'w-1.5 h-1.5 bg-amber-400/60'
                      : 'w-1.5 h-1.5 bg-white/20'
                )}
                onClick={() => goChapter(i)}
              />
            ))}
          </div>

          <button onClick={goNext} disabled={isLast || !!flip}
            className={cn(
              'flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all',
              isLast || flip
                ? 'text-white/20 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/10',
            )}>
            {!isLast ? book.chapters[chapterIdx+1]?.title.slice(0, 28)+'...' : (
              <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5"/> Tugallandi!</span>
            )}
            {!isLast && <ChevronRight className="w-3.5 h-3.5"/>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   LIBRARY PAGE
   ================================================================ */
export default function LibraryPage() {
  const [progress,   setProgress]  = useState<Progress[]>([])
  const [activecat,  setActiveCat] = useState<BookCat | 'all' | 'top'>('all')
  const [search,     setSearch]    = useState('')
  const [openBook,   setOpenBook]  = useState<Book | null>(null)
  const [mounted,    setMounted]   = useState(false)

  useEffect(() => { setProgress(loadProgress()); setMounted(true) }, [])

  const onProgressChange = useCallback((book: Book, updates: Partial<Progress>) => {
    setProgress(prev => {
      const next = upsertProgress(book.id, updates, prev)
      saveProgress(next)
      return next
    })
  }, [])

  const TOP_RATING = 4.8

  const filtered = useMemo(() => {
    const books = BOOKS.filter(b => {
      const matchCat    = activecat === 'all' || activecat === 'top' || b.category === activecat
      const matchTop    = activecat !== 'top' || b.rating >= TOP_RATING
      const matchSearch = !search || [b.title, b.author, b.originalTitle ?? '']
        .some(s => s.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchTop && matchSearch
    })
    return activecat === 'top'
      ? [...books].sort((a, b) => b.rating - a.rating)
      : books
  }, [activecat, search])

  const cats = useMemo<BookCat[]>(() => {
    const seen = new Set<BookCat>()
    filtered.forEach(b => seen.add(b.category))
    return [...seen]
  }, [filtered])

  const currentlyReading = useMemo(() =>
    BOOKS.filter(b => {
      const p = getBookProgress(b.id, progress)
      return p && !p.finished && p.chapter > 0
    })
  , [progress])

  if (!mounted) return null

  return (
    <>
      <style>{CSS}</style>
      <div className="space-y-6 animate-fade-in">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500"/>
              Kutubxona
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {BOOKS.length} ta kitob · o'sish va ilhom uchun
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400"/>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Kitob yoki muallif..."
              className="pl-9 pr-3 py-2 rounded-xl text-xs font-medium
                border border-neutral-200 dark:border-white/[0.10]
                bg-white dark:bg-neutral-900
                text-neutral-900 dark:text-white
                placeholder:text-neutral-400 outline-none
                focus:border-amber-400 dark:focus:border-amber-500/50 transition-colors w-52"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X className="w-3 h-3"/>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCat('all')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              activecat === 'all'
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.10] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300',
            )}>
            <BookOpen className="w-3.5 h-3.5"/> Barchasi ({BOOKS.length})
          </button>
          <button onClick={() => setActiveCat('top')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              activecat === 'top'
                ? 'text-white shadow-sm'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.10] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300',
            )}
            style={activecat === 'top' ? { background: 'linear-gradient(135deg, #F59E0B, #EF4444)' } : {}}>
            <Star className="w-3.5 h-3.5" style={activecat === 'top' ? { fill: 'white' } : {}}/> Eng yaxshilari ({BOOKS.filter(b => b.rating >= TOP_RATING).length})
          </button>
          {(Object.keys(CATEGORY_META) as BookCat[]).map(c => {
            const count = BOOKS.filter(b => b.category === c).length
            if (!count) return null
            const m = CATEGORY_META[c]
            return (
              <button key={c} onClick={() => setActiveCat(c)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                  activecat === c
                    ? 'text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.10] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300',
                )}
                style={activecat === c ? { background: m.color } : {}}>
                {m.icon} {m.label} ({count})
              </button>
            )
          })}
        </div>

        {currentlyReading.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500"/> Hozir o'qilyapti
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
              {currentlyReading.map(book => {
                const p = getBookProgress(book.id, progress)!
                const pct = Math.round((p.chapter / book.chapters.length) * 100)
                return (
                  <button key={book.id} onClick={() => setOpenBook(book)}
                    className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl
                      border border-neutral-200 dark:border-white/[0.08]
                      bg-white dark:bg-neutral-900
                      hover:shadow-md transition-all text-left"
                    style={{ minWidth: 220 }}>
                    <div className="w-10 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
                      style={{ background:`linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})` }}>
                      {book.chapters[p.chapter]?.title.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-neutral-800 dark:text-white truncate">{book.title}</p>
                      <p className="text-[10px] text-neutral-400 mb-1.5">{book.author}</p>
                      <div className="h-1 rounded-full bg-neutral-100 dark:bg-white/[0.07] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${pct}%`, background: book.coverGradient[0] }}/>
                      </div>
                      <p className="text-[9px] text-neutral-400 mt-1">{pct}% · {p.chapter+1}/{book.chapters.length} bob</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {activecat === 'top' && (
          <div style={{ animation:'lib-fade-up .4s ease both' }}>
            <h2 className="text-sm font-extrabold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500"/> Eng yaxshi kitoblar — {filtered.length} ta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((book, i) => {
                const p    = getBookProgress(book.id, progress)
                const pct  = p ? Math.round(((p.chapter + 1) / book.chapters.length) * 100) : 0
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                return (
                  <button key={book.id} onClick={() => setOpenBook(book)}
                    className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all
                      border border-neutral-100 dark:border-white/[0.07]
                      bg-white dark:bg-neutral-900
                      hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-500/20 group"
                    style={{ animation:`lib-fade-up .35s ease ${i * 0.07}s both` }}>
                    {/* Rank badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                      style={{ background:`linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})` }}>
                      {medal ?? <span className="text-white text-xs">{i + 1}</span>}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight truncate">
                        {book.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{book.author} · {book.year}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({length:5},(_,si) => (
                            <Star key={si} className={cn('w-3 h-3',
                              si < Math.floor(book.rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-200 dark:text-neutral-700')}/>
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-500">{book.rating}</span>
                        <span className="text-[9px] text-neutral-400 ml-auto flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5"/>{book.readTime}
                        </span>
                      </div>
                    </div>
                    {/* Progress ring */}
                    {pct > 0 && (
                      <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black"
                          style={{
                            background: `conic-gradient(${book.coverGradient[0]} ${pct * 3.6}deg, #e5e7eb ${pct * 3.6}deg)`,
                          }}>
                          <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center">
                            <span className="text-[8px] font-black text-neutral-600 dark:text-neutral-300">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {activecat !== 'top' && cats.map((cat, ci) => {
          const catBooks = filtered.filter(b => b.category === cat)
          const meta = CATEGORY_META[cat]
          return (
            <div key={cat} style={{ animation:`shelf-in .4s ease ${ci * 0.08}s both` }}>
              <div className="flex items-center gap-2 mb-4">
                <CatIcon cat={cat} size={16}/>
                <h2 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100">{meta.label}</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-neutral-400 bg-neutral-100 dark:bg-white/[0.07]">
                  {catBooks.length} ta kitob
                </span>
              </div>

              <div className="relative">
                <div className="flex items-end gap-5 px-4 pb-4 overflow-x-auto"
                  style={{
                    background:`linear-gradient(to bottom,
                      transparent 85%,
                      rgba(120,80,40,0.18) 85%,
                      rgba(100,65,30,0.25) 87%,
                      rgba(80,50,20,0.15) 89%,
                      transparent 100%)`,
                    scrollbarWidth:'none',
                  }}>
                  {catBooks.map(book => (
                    <Book3D key={book.id} book={book}
                      progress={getBookProgress(book.id, progress)}
                      onClick={() => setOpenBook(book)}/>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {catBooks.map(book => {
                    const p = getBookProgress(book.id, progress)
                    const pct = p ? Math.round(((p.chapter + 1) / book.chapters.length) * 100) : 0
                    return (
                      <button key={book.id} onClick={() => setOpenBook(book)}
                        className="text-left p-3 rounded-xl border border-neutral-100 dark:border-white/[0.06]
                          bg-neutral-50 dark:bg-white/[0.02]
                          hover:border-neutral-200 dark:hover:border-white/[0.12]
                          hover:bg-white dark:hover:bg-white/[0.05]
                          transition-all group">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ background:`linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})` }}>
                            <CatIcon cat={book.category} size={14}/>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-extrabold text-neutral-800 dark:text-neutral-100 leading-tight truncate">
                              {book.title}
                            </p>
                            <p className="text-[9px] text-neutral-400 truncate">{book.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 rounded-full bg-neutral-200 dark:bg-white/[0.08] overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width:`${pct}%`, background: book.coverGradient[0] }}/>
                          </div>
                          <span className="text-[9px] font-bold text-neutral-400 flex-shrink-0">
                            {pct === 0 ? 'Boshlash' : pct === 100 ? '✓' : `${pct}%`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          {Array.from({length:5},(_,i) => (
                            <Star key={i} className={cn('w-2.5 h-2.5',
                              i < Math.floor(book.rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-200 dark:text-neutral-700')}/>
                          ))}
                          <span className="text-[9px] text-neutral-400">{book.rating}</span>
                          <span className="ml-auto flex items-center gap-0.5 text-[9px] text-neutral-400">
                            <Clock className="w-2.5 h-2.5"/> {book.readTime}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center mb-3">
              <Inbox className="w-8 h-8 text-neutral-400"/>
            </div>
            <p className="text-sm font-bold text-neutral-500">"{search}" bo'yicha kitob topilmadi</p>
            <button onClick={() => { setSearch(''); setActiveCat('all') }}
              className="mt-3 text-xs font-bold text-amber-600 hover:text-amber-700">
              Barcha kitoblarni ko'rish →
            </button>
          </div>
        )}
      </div>

      {openBook && (
        <BookReader
          book={openBook}
          progress={getBookProgress(openBook.id, progress)}
          onClose={() => setOpenBook(null)}
          onProgressChange={updates => onProgressChange(openBook, updates)}
        />
      )}
    </>
  )
}
