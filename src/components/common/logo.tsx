'use client'

import { useInitialData } from '@/hooks/use-initial-data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ILogo {
  variant?: 'light' | 'dark'
}

const Logo: React.FC<ILogo> = ({ variant = 'light' }) => {
  const { globalData } = useInitialData()

  const lightLogo = globalData?.fields.light_logo
  const darkLogo = globalData?.fields.dark_logo

  const url = variant === 'light' ? lightLogo?.url : darkLogo?.url

  if (!url) return null

  return (
    <Link href={'/'} className='inline-flex'>
      <Image
        priority
        width={220}
        height={50}
        sizes='220px'
        alt='Logo'
        src={url}
        quality={100}
        className='sm:min-w-[180px]'
      />
    </Link>
  )
}

export default Logo
