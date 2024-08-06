import BackgroundImage from '@/components/ui/bg-image'
import Link from 'next/link'
import React from 'react'

interface IBanner {
  title: string
  desc: string
  image: string
  link: string
}

const Banner: React.FC<IBanner> = ({ title, desc, image, link }) => {
  return (
    <Link href={link} className='flex-1 min-h-36 rounded-md p-6 relative overflow-hidden border group'>
      <p className='h4'>{title}</p>
      <p className='text-neutral-400 text-sm'>{desc}</p>
      <BackgroundImage zoomed img={image} gradientPlacement='left' />
    </Link>
  )
}

export default Banner
