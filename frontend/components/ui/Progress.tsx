import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md'
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'secondary'
  showLabel?: boolean
  className?: string
}

const fillColor: Record<string, string> = {
  primary:   'bg-gradient-to-r from-primary-500 to-primary-400',
  accent:    'bg-gradient-to-r from-accent-600 to-accent-400',
  secondary: 'bg-primary-400',
  success:   'bg-gradient-to-r from-emerald-600 to-emerald-400',
  warning:   'bg-gradient-to-r from-amber-500 to-amber-400',
  danger:    'bg-gradient-to-r from-red-600 to-red-400',
}

const heights: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
}

export function Progress({
  value, max = 100, size = 'sm', color = 'primary',
  showLabel = false, className,
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <p className="mb-1 text-xs font-bold text-primary-400">{Math.round(pct)}%</p>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/40', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', fillColor[color] ?? fillColor.primary)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
