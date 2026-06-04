interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
  textColor?: string
}

export function KotibaLogo({ size = 36, showText = true, className = '', textColor }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <KotibaIcon size={size} />
      {showText && (
        <span
          className={`font-black tracking-tight ${textColor ?? 'text-slate-900 dark:text-white'}`}
          style={{ fontSize: size * 0.48, lineHeight: 1 }}
        >
          KOTIBA<span className="text-amber-500">JON</span>
        </span>
      )}
    </div>
  )
}

export function KotibaIcon({ size = 36, className = '' }: { size?: number; variant?: string; className?: string }) {
  const r = Math.round(size * 0.22)
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      style={{ borderRadius: r, display: 'block' }}
      aria-label="KOTIBAJON logo"
    >
      <defs>
        <linearGradient id="kj-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24"/>
          <stop offset="100%" stopColor="#D97706"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#kj-g)"/>
      <rect x="0" y="0" width="100" height="54" rx="22" fill="rgba(255,255,255,0.18)"/>
      <line x1="28" y1="22" x2="28" y2="78" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      <line x1="28" y1="50" x2="72" y2="22" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      <line x1="36" y1="43" x2="72" y2="78" stroke="white" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  )
}
