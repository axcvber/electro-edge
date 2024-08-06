'use client'

import React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import BackgroundImage from '@/components/ui/bg-image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Image } from '@/gql/storefront/graphql'
import { NormalizedMetaobject } from '@/lib/normalize'
import { useTranslations } from 'next-intl'

interface HeroSliderFields {
  slider_items: NormalizedSliderItem[]
}

interface NormalizedSliderItem extends NormalizedMetaobject {
  fields: {
    button_link: string
    description: string
    image: Image
    title: string
  }
}

const HeroSlider: React.FC<HeroSliderFields> = ({ slider_items }) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const plugin = React.useRef(Autoplay({ delay: 5000 }))
  const t = useTranslations('buttons')

  const handlePrevClick = () => {
    plugin.current.stop()
    api?.scrollPrev()
  }

  const handleNextClick = () => {
    plugin.current.stop()
    api?.scrollNext()
  }

  if (!slider_items.length) {
    return null
  }

  return (
    <div className='w-full'>
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        <CarouselContent>
          {slider_items.map((item, inx) => (
            <CarouselItem key={inx} className='relative flex min-h-screen'>
              <div className='container flex items-center'>
                <div className='max-w-lg space-y-4 text-white'>
                  <h1>{item.fields.title}</h1>
                  <p className='text-sm sm:text-base'>{item.fields.description}</p>
                  {item.fields.button_link && (
                    <Button asChild className='px-10'>
                      <Link href={item.fields.button_link}>{t('shop_now')}</Link>
                    </Button>
                  )}
                </div>
              </div>

              <BackgroundImage img={item.fields.image.url} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant={'unstyled'}
          className='hidden xl:block left-5 text-primary [&_svg]:w-8 [&_svg]:h-8 hover:text-primary/80'
          onClick={handlePrevClick}
        />
        <CarouselNext
          variant={'unstyled'}
          className='hidden xl:block right-5 text-primary [&_svg]:w-8 [&_svg]:h-8 hover:text-primary/80'
          onClick={handleNextClick}
        />
        <CarouselDots className='absolute bottom-10 left-1/2 -translate-x-1/2' />
      </Carousel>
    </div>
  )
}

export default HeroSlider
