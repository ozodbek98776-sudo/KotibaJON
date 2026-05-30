import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const bgColors = [
  'bg-primary-600',
  'bg-accent-600',
  'bg-emerald-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-primary-800',
]

function pickColor(name: string) {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return bgColors[sum % bgColors.length]
}

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img src={src} alt={name}
           className={cn('flex-shrink-0 rounded-full object-cover', sizes[size], className)} />
    )
  }
  return (
    <div className={cn(
      'flex flex-shrink-0 items-center justify-center rounded-full font-black text-white ring-2 ring-white/20',
      sizes[size],
      name ? pickColor(name) : 'bg-primary-700',
      className,
    )}>
      {getInitials(name || '?')}
    </div>
  )
}
