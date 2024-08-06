'use client'

import React, { ComponentProps } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const FooterLink = ({ href, className, ...rest }: ComponentProps<typeof Link>) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      href={href}
      className={cn(
        'text-sm hover:text-white transition-colors',
        isActive ? 'text-white font-medium' : 'text-white/50',
        className
      )}
      {...rest}
    />
  )
}

export default FooterLink
