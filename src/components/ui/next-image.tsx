'use client'

import Image, { ImageProps } from 'next/image'
import React, { useState } from 'react'

export interface INextImage extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null
  alt?: string | null
  blurred?: boolean
}

const NextImage: React.FC<INextImage> = ({ blurred = true, quality, src, alt, ...props }) => {
  const [isLoading, setLoading] = useState(true)

  if (!src) {
    return null
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt ? alt : ''}
      style={{
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isLoading && blurred ? 'blur(2px) grayscale(100%)' : 'grayscale(0) blur(0px)',
        ...props.style,
      }}
      onLoad={() => setLoading(false)}
    />
  )
}

export default NextImage
