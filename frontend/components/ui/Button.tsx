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
        primary:  'bg-primary-500 hover:bg-primary-600 text-white [box-shadow:0_3px_10px_rgba(5,150,105,0.30)] hover:[box-shadow:0_5px_16px_rgba(5,150,105,0.40)]',
        accent:   'bg-accent-500 hover:bg-accent-600 text-white [box-shadow:0_3px_10px_rgba(245,158,11,0.30)]',
        outline:  'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30',
        ghost:    'text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30',
        danger:   'bg-red-500 hover:bg-red-600 text-white [box-shadow:0_3px_10px_rgba(239,68,68,0.25)]',
        success:  'bg-emerald-500 hover:bg-emerald-600 text-white',
        dark:     'bg-primary-800 hover:bg-primary-900 text-white dark:bg-primary-700',
        link:     'text-primary-500 hover:underline p-0 h-auto shadow-none',
      },
      size: {
        xs:   'h-7  px-2.5 text-xs  rounded-lg',
        sm:   'h-8  px-3.5 text-sm  rounded-lg',
        md:   'h-10 px-4   text-sm  rounded-button',
        lg:   'h-11 px-6   text-base rounded-button',
        xl:   'h-12 px-8   text-base rounded-button',
        icon: 'h-9  w-9            rounded-button',
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
