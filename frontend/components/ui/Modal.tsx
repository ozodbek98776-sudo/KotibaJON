'use client'

import { useEffect, useState } from 'react'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        'relative w-full animate-scale-in',
        'rounded-2xl border bg-white shadow-2xl',
        'border-border-light dark:border-primary-700',
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
            onClick={onClose}
            className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-primary-400 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-700 dark:hover:text-primary-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border-light px-6 py-4 dark:border-primary-700/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
