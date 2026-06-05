import Image from 'next/image'

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

export function KotibaIcon({
  size = 36,
  className = '',
}: {
  size?: number
  variant?: string
  className?: string
}) {
  return (
    <Image
      src="/icons/icon-192.png"
      alt="KOTIBAJON"
      width={size}
      height={size}
      priority
      className={`flex-shrink-0 rounded-xl ${className}`}
      style={{ objectFit: 'cover', display: 'block' }}
    />
  )
}
