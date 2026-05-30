'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        primary:   'bg-emerald-500 hover:bg-emerald-600 text-white [box-shadow:0_3px_10px_rgba(16,185,129,0.28)] hover:[box-shadow:0_5px_16px_rgba(16,185,129,0.40)]',
        accent:    'bg-amber-500 hover:bg-amber-600 text-white [box-shadow:0_3px_10px_rgba(245,158,11,0.28)] hover:[box-shadow:0_5px_16px_rgba(245,158,11,0.40)]',
        outline:   'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10',
        ghost:     'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/[0.07]',
        danger:    'bg-red-500 hover:bg-red-600 text-white [box-shadow:0_3px_10px_rgba(239,68,68,0.25)]',
        success:   'bg-emerald-500 hover:bg-emerald-600 text-white',
        dark:      'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600',
        link:      'text-emerald-600 dark:text-emerald-400 hover:underline p-0 h-auto shadow-none',
        secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-white/[0.07] dark:hover:bg-white/[0.12] dark:text-neutral-200',
      },
      size: {
        xs:   'h-7  px-2.5 text-xs  rounded-lg',
        sm:   'h-8  px-3.5 text-sm  rounded-lg',
        md:   'h-10 px-4   text-sm  rounded-lg',
        lg:   'h-11 px-6   text-base rounded-xl',
        xl:   'h-12 px-8   text-base rounded-xl',
        icon: 'h-9  w-9            rounded-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon ?? null}
      {children}
      {!loading && rightIcon}
    </button>
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
