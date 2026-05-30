'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export function Modal({ open, onClose, title, description, size = 'md', children, footer }: ModalProps) {
  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Don't render on server or when closed
  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        'relative z-10 w-full animate-scale-in',
        'rounded-2xl bg-white shadow-2xl',
        'border border-border-light dark:border-primary-700',
        'dark:bg-primary-800',
        sizes[size],
      )}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-light px-6 py-4 dark:border-primary-700/50">
          <div>
            <h2 className="text-base font-black tracking-tight text-primary-900 dark:text-primary-50">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-primary-500 dark:text-primary-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-700 dark:hover:text-primary-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border-light px-6 py-4 dark:border-primary-700/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
