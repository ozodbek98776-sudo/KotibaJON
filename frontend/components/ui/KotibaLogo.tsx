interface LogoProps {
  size?: number
  variant?: 'color' | 'white' | 'dark'
  showText?: boolean
  className?: string
}

export function KotibaLogo({ size = 36, variant = 'color', showText = true, className = '' }: LogoProps) {
  const blue  = variant === 'white' ? '#fff'     : variant === 'dark' ? '#1D4ED8' : '#2563EB'
  const blue2 = variant === 'white' ? '#ffffffcc': variant === 'dark' ? '#3B82F6' : '#3B82F6'
  const text  = variant === 'white' ? 'text-white' : variant === 'dark' ? 'text-blue-800' : 'text-slate-900 dark:text-white'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer arc — stopwatch ring, gap at top-right */}
        <circle
          cx="26" cy="26" r="18"
          stroke={blue2}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="88 24"
          transform="rotate(-115 26 26)"
        />

        {/* Clock hand — long diagonal pointer */}
        <line x1="26" y1="26" x2="40" y2="10" stroke={blue} strokeWidth="2.8" strokeLinecap="round" />

        {/* Center pivot dot */}
        <circle cx="26" cy="26" r="2.5" fill={blue} />

        {/* Tick at 12-o'clock top of arc */}
        <line x1="26" y1="7" x2="26" y2="11" stroke={blue} strokeWidth="2.5" strokeLinecap="round" />

        {/* ── K letter (path-based, no font dependency) ── */}
        {/* Vertical stroke of K */}
        <line x1="7" y1="10" x2="7" y2="40" stroke={blue} strokeWidth="4.5" strokeLinecap="round" />
        {/* Upper diagonal of K */}
        <line x1="7" y1="25" x2="21" y2="10" stroke={blue} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lower diagonal of K */}
        <line x1="7" y1="25" x2="22" y2="40" stroke={blue} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Small inner notch of K */}
        <line x1="7" y1="25" x2="14" y2="18" stroke={blue} strokeWidth="4.5" strokeLinecap="round" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <div className="leading-none">
          <span className={`text-[17px] font-black tracking-tight ${text}`}>
            KOTIBA<span style={{ color: blue }}>JON</span>
          </span>
        </div>
      )}
    </div>
  )
}

/* Icon only (no text) — for favicon, avatar, etc. */
export function KotibaIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <KotibaLogo size={size} showText={false} className={className} />
}
