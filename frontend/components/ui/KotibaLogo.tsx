interface LogoProps {
  size?: number
  variant?: 'color' | 'white' | 'dark'
  showText?: boolean
  className?: string
}

/* ── Pixel-perfect reproduction of the KOTIBAJON logo ────────── */
export function KotibaLogo({ size = 36, variant = 'color', showText = true, className = '' }: LogoProps) {
  const isWhite = variant === 'white'
  const blue    = isWhite ? '#ffffff' : '#2563EB'
  const blue2   = isWhite ? '#ffffffcc' : '#60A5FA'
  const textCol = isWhite ? 'text-white' : 'text-slate-900 dark:text-white'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <KotibaIcon size={size} variant={variant} />
      {showText && (
        <span className={`font-black tracking-tight ${textCol}`}
              style={{ fontSize: size * 0.48, lineHeight: 1 }}>
          KOTIBA<span style={{ color: blue }}>JON</span>
        </span>
      )}
    </div>
  )
}

/* ── Icon-only component ─────────────────────────────────────── */
export function KotibaIcon({ size = 36, variant = 'color', className = '' }:
  { size?: number; variant?: 'color' | 'white' | 'dark'; className?: string }) {

  const isWhite = variant === 'white'
  const c1 = isWhite ? '#ffffff' : '#2563EB'   // main blue
  const c2 = isWhite ? '#ffffffaa' : '#3B82F6'  // lighter blue
  const glowId = `glow-${size}-${variant}`

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`bg-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </linearGradient>
      </defs>

      {/* ── Clock circle ──────────────────────────────────────── */}
      <circle
        cx="118" cy="100" r="68"
        stroke={c1} strokeWidth="9" fill="none"
        filter={`url(#${glowId})`}
      />

      {/* 12-o'clock tick (vertical pill) */}
      <rect x="112" y="22" width="12" height="20" rx="6"
            fill={c2} filter={`url(#${glowId})`} />

      {/* 3-o'clock tick (horizontal dash) */}
      <rect x="176" y="94" width="18" height="12" rx="6"
            fill={c2} filter={`url(#${glowId})`} />

      {/* ── Clock needle (sharp triangular pointer) ────────────── */}
      {/* Goes from center (118,100) toward 1–2 o'clock (~150,38) */}
      <polygon
        points="118,100  152,34  112,96"
        fill={c1} filter={`url(#${glowId})`}
      />
      {/* Needle center pivot dot */}
      <circle cx="118" cy="100" r="7" fill={c1} filter={`url(#${glowId})`} />

      {/* ── K letter ──────────────────────────────────────────── */}
      {/* Vertical bar — italic, full height */}
      <path
        d="M 18 18 L 36 18 L 54 182 L 36 182 Z"
        fill={`url(#bg-${size})`} filter={`url(#${glowId})`}
      />

      {/* Upper arm — thick diagonal from mid-left to upper-right */}
      <path
        d="M 36 108 L 50 100 L 148 18 L 164 34 L 64 120 Z"
        fill={`url(#bg-${size})`} filter={`url(#${glowId})`}
      />

      {/* Lower arm — longer, sweeps to lower right, sharp end */}
      <path
        d="M 42 118 L 58 112 L 168 180 L 152 196 L 44 132 Z"
        fill={`url(#bg-${size})`} filter={`url(#${glowId})`}
      />
    </svg>
  )
}
