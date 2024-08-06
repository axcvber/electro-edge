'use client'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

import React from 'react'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import NextImage from '@/components/ui/next-image'
import { CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Image } from '@/gql/storefront/graphql'

interface ImageGalleryProps {
  images: Image[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <LightGallery
      addClass='gallery'
      selector={'#gallery-item'}
      download={false}
      getCaptionFromTitleOrAlt={false}
      startAnimationDuration={0}
      actualSize={false}
      showZoomInOutIcons
      hideScrollbar
      thumbMargin={8}
      plugins={[lgThumbnail, lgZoom]}
      loop
    >
      <CarouselContent>
        {images.length > 0 ? (
          images.map((item) => (
            <CarouselItem key={item.id} id='gallery-item' data-src={item.url}>
              <div className='flex relative aspect-square cursor-zoom-in'>
                <NextImage fill priority src={item.url} alt={item.altText} className='object-contain' />
              </div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <div className='flex relative aspect-square border bg-muted'>
              <NextImage fill priority src={'/placeholder-image.webp'} alt={'Placeholder'} className='object-contain' />
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
    </LightGallery>
  )
}

export default ImageGallery
