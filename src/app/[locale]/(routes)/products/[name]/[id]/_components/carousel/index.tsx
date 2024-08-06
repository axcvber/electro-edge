'use client'

import React, { useCallback, useRef } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { IReshapedVariant } from '@/lib/normalize'
import CarouselThumb from './carousel-thumb'
import ImageGallery from './image-gallery'

interface IProductCarousel {
  data: IReshapedVariant['images']
}

const ProductCarousel: React.FC<IProductCarousel> = ({ data }) => {
  const [emblaMainApi, setEmblaMainApi] = React.useState<CarouselApi>()
  const [emblaThumbsApi, setEmblaThumbsApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const elementRef = useRef<HTMLDivElement>(null)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index, true)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  React.useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect)
    emblaMainApi.on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div ref={elementRef} className='w-full space-y-2'>
      <Carousel
        setApi={setEmblaMainApi}
        opts={{
          active: data.length > 1,
          breakpoints: {
            '(min-width: 768px)': { watchDrag: false },
          },
        }}
        className='w-full'
      >
        <ImageGallery images={data} />
        {data.length > 1 && <CarouselPrevious variant={'outline'} className='-left-4' />}
        {data.length > 1 && <CarouselNext variant={'outline'} className='-right-4' />}
      </Carousel>
      {data.length > 1 && (
        <Carousel
          setApi={setEmblaThumbsApi}
          opts={{
            containScroll: 'keepSnaps',
            dragFree: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2'>
            {data?.map((item, index) => (
              <CarouselThumb
                key={index}
                image={item}
                index={index}
                selected={index === selectedIndex}
                onClick={() => onThumbClick(index)}
              />
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  )
}

export default ProductCarousel
