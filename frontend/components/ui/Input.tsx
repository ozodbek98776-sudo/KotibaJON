'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-lg border text-sm font-semibold outline-none transition-all',
              'bg-white text-neutral-900 placeholder-neutral-400',
              'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600',
              leftIcon  ? 'pl-9 pr-3.5'  : 'px-3.5',
              rightIcon ? 'pr-9' : '',
              error
                ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:bg-red-950/20 dark:focus:ring-red-900'
                : 'border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:hover:border-neutral-600 dark:focus:border-neutral-500 dark:focus:ring-neutral-800',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{rightIcon}</div>
          )}
        </div>
        {error  && <p className="mt-1.5 text-xs font-semibold text-red-500">⚠ {error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string; hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm font-semibold outline-none transition-all',
            'bg-white text-neutral-900 placeholder-neutral-400',
            'dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-600',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:focus:border-neutral-500 dark:focus:ring-neutral-800',
            className,
          )}
          {...props}
        />
        {error  && <p className="mt-1.5 text-xs font-semibold text-red-500">⚠ {error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
