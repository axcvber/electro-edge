'use client'

import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from '../ui/button'
import Link from 'next/link'
import { CountdownTimer } from '@/components/ui/countdown-timer'
import { reshapeProductVariant } from '@/lib/normalize'
import { ProductVariant } from '@/gql/storefront/graphql'
import ProductVariantCard from '../cards/product-variant-card'
import { useTranslations } from 'next-intl'

interface SaleCountdownFields {
  heading: string
  countdown_time: string
  button_link: string
  products: ProductVariant[]
}

const SaleCountdown: React.FC<SaleCountdownFields> = ({ heading, products, countdown_time, button_link }) => {
  const t = useTranslations('buttons')

  const productVariants = products.map((item) => reshapeProductVariant(item as any)) || []
  const countdownDate = new Date(countdown_time)

  return (
    <div className='bg-accent py-12'>
      <div className='container flex flex-col md:flex-row gap-8'>
        <div className='md:w-1/2 flex flex-col justify-center items-start gap-6'>
          <h3 className='h2'>{heading}</h3>
          <CountdownTimer targetDate={countdownDate.getTime()} />
          {button_link && (
            <Button asChild>
              <Link href={button_link}>{t('shop_now')}</Link>
            </Button>
          )}
        </div>
        <Carousel
          opts={{
            dragFree: true,
          }}
          className='md:w-1/2'
        >
          <CarouselContent className='my-4 mx-2'>
            {productVariants.map((item) => (
              <CarouselItem key={item.id} className='basis-[70%] sm:basis-1/2 md:basis-[70%] lg:basis-1/2 px-2'>
                <ProductVariantCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default SaleCountdown
