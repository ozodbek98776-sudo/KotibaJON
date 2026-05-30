import { cn } from '@/lib/utils'

const pads = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glow?: boolean
}

export function Card({ className, hover = false, padding = 'md', glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-colors',
        'bg-white dark:bg-[#111111]',
        'border-neutral-200 dark:border-white/[0.08]',
        pads[padding],
        hover && 'duration-200 hover:-translate-y-0.5 cursor-pointer hover:border-neutral-300 dark:hover:border-white/[0.15]',
        className,
      )}
      style={{ boxShadow: glow ? '0 0 20px rgba(16,185,129,0.20)' : '0 2px 8px rgba(0,0,0,0.06)' }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-black text-neutral-900 dark:text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props}>{children}</div>
}

// ── Stat Card ──────────────────────────────────────────────────
const iconThemes = {
  primary:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  accent:    'bg-amber-100   text-amber-700   dark:bg-amber-500/15   dark:text-amber-400',
  success:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning:   'bg-amber-100   text-amber-700   dark:bg-amber-500/15   dark:text-amber-400',
  danger:    'bg-red-100     text-red-600     dark:bg-red-500/15     dark:text-red-400',
  secondary: 'bg-neutral-100 text-neutral-600 dark:bg-white/[0.07]  dark:text-neutral-400',
}

export function StatCard({
  title, value, change, changeType = 'neutral',
  icon, color = 'primary', className,
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: keyof typeof iconThemes
  className?: string
}) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {title}
          </p>
          <p className="font-mono text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={cn(
              'mt-1.5 text-xs font-semibold',
              changeType === 'up'      && 'text-emerald-600 dark:text-emerald-400',
              changeType === 'down'    && 'text-red-500 dark:text-red-400',
              changeType === 'neutral' && 'text-neutral-400 dark:text-neutral-500',
            )}>
              {changeType === 'up' && '↑ '}
              {changeType === 'down' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('flex-shrink-0 rounded-xl p-2.5', iconThemes[color])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
