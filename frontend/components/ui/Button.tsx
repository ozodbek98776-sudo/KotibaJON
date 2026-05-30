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
        primary:
          'bg-neutral-900 text-white hover:bg-neutral-700 shadow-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100',
        accent:
          'bg-amber-500 text-white hover:bg-amber-600 shadow-amber',
        outline:
          'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800',
        ghost:
          'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
        danger:
          'bg-red-500 text-white hover:bg-red-600',
        success:
          'bg-green-500 text-white hover:bg-green-600',
        link:
          'text-neutral-600 hover:text-neutral-900 underline-offset-4 hover:underline p-0 shadow-none dark:text-neutral-400 dark:hover:text-white',
      },
      size: {
        xs:   'h-7  px-2.5 text-xs  rounded-md',
        sm:   'h-8  px-3   text-sm  rounded-lg',
        md:   'h-10 px-4   text-sm  rounded-lg',
        lg:   'h-11 px-6   text-base rounded-xl',
        xl:   'h-12 px-8   text-base rounded-xl',
        icon: 'h-9  w-9            rounded-lg',
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
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
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
