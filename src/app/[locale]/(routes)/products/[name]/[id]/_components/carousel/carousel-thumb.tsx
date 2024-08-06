import React from 'react'
import { CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import NextImage from '@/components/ui/next-image'
import { Image, Maybe } from '@/gql/storefront/graphql'

interface ICarouselThumb {
  image?: Maybe<Image>
  selected: boolean
  index: number
  onClick: () => void
}

const CarouselThumb: React.FC<ICarouselThumb> = ({ image, selected, index, onClick }) => {
  return (
    <CarouselItem key={index} className='basis-auto pl-2' onClick={onClick}>
      <div
        className={cn(
          'flex relative w-[90px] h-[90px] grayscale cursor-pointer border border-transparent opacity-70 rounded-md overflow-hidden transition-all',
          selected && 'border-border opacity-100 grayscale-0'
        )}
      >
        <NextImage fill priority src={image?.url} alt={image?.altText} className='object-contain p-1' />
      </div>
    </CarouselItem>
  )
}

export default CarouselThumb
