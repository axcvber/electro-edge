import React from 'react'
import NextImage from './next-image'
import { cn } from '@/lib/utils'

interface IBackgroundImage {
  img: string
  gradientPlacement?: 'left' | 'right' | 'none'
  zoomed?: boolean
  blurred?: boolean
  sizes?: string
}

const BackgroundImage: React.FC<IBackgroundImage> = ({
  img,
  gradientPlacement = 'none',
  zoomed,
  blurred,
  sizes = '100vw',
}) => {
  return (
    <div
      className={cn(
        `bg-neutral-200 
        absolute top-0 left-0 w-full h-full -z-[1] select-none
        after:absolute 
        after:top-0 
        after:left-0 
        after:w-full 
        after:h-full
      `,
        gradientPlacement === 'left' &&
          `
          after:bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_50%)]
          md:after:bg-[linear-gradient(270deg,rgba(255,255,255,0)_20%,rgba(255,255,255,1)_60%)]
          lg:after:bg-[linear-gradient(270deg,rgba(255,255,255,0)_40%,rgba(255,255,255,1)_70%)]`,
        gradientPlacement === 'right' &&
          `
        after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_50%)]
        md:after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_20%,rgba(255,255,255,1)_60%)]
        lg:after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_40%,rgba(255,255,255,1)_70%)]`,
        blurred && 'after:backdrop-blur-[2px] after:bg-black/30'
      )}
    >
      <NextImage
        fill
        priority
        quality={100}
        src={img}
        alt='Banner Background'
        sizes={sizes}
        className={cn('object-cover', zoomed && 'group-hover:scale-110 !duration-300')}
      />
    </div>
  )
}

export default BackgroundImage
