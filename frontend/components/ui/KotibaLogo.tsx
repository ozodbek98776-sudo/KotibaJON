import Image from 'next/image'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
  textColor?: string
}

/* ── Full logo: icon + wordmark ──────────────────────────────── */
export function KotibaLogo({
  size = 36,
  showText = true,
  className = '',
  textColor,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <KotibaIcon size={size} />
      {showText && (
        <span
          className={`font-black tracking-tight ${textColor ?? 'text-slate-900 dark:text-white'}`}
          style={{ fontSize: size * 0.48, lineHeight: 1 }}
        >
          KOTIBA<span className="text-blue-600">JON</span>
        </span>
      )}
    </div>
  )
}

/* ── Icon only ───────────────────────────────────────────────── */
export function KotibaIcon({
  size = 36,
  className = '',
}: {
  size?: number
  variant?: string   // kept for backwards-compat, unused
  className?: string
}) {
  return (
    <Image
      src="/logo.png"
      alt="KOTIBAJON logo"
      width={size}
      height={size}
      className={`rounded-xl flex-shrink-0 ${className}`}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
