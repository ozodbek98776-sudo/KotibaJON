import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-xs font-bold px-2.5 py-0.5',
  {
    variants: {
      variant: {
        default:   'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
        primary:   'bg-primary-500 text-white',
        accent:    'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',
        success:   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400',
        warning:   'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        danger:    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
        info:      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        urgent:    'bg-red-500 text-white',
        high:      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
        medium:    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        low:       'bg-primary-50 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400',
        outline:   'border border-primary-300 text-primary-600 dark:border-primary-700 dark:text-primary-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className={cn(
        'h-1.5 w-1.5 flex-shrink-0 rounded-full',
        variant === 'success' ? 'bg-emerald-500' :
        variant === 'warning' || variant === 'accent' ? 'bg-amber-500' :
        variant === 'danger'  || variant === 'urgent' ? 'bg-red-500' :
        'bg-primary-400',
      )} />}
      {children}
    </span>
  )
}
