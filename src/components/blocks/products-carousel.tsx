'use client'

import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import ProductVariantCard from '../cards/product-variant-card'
import { ProductVariantWithMetafields, reshapeProductVariant } from '@/lib/normalize'
import { ProductVariant } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'

interface ProductsCarouselFields {
  heading: string
  products: ProductVariant[]
  button_link?: string
}

const ProductsCarousel: React.FC<ProductsCarouselFields> = ({ heading, products, button_link }) => {
  const t = useTranslations('links')

  const productVariants = products.map((item) => reshapeProductVariant(item as ProductVariantWithMetafields)) || []
  const showArrows = productVariants.length > 5

  return (
    <div className='container space-y-4 my-12'>
      <div className='flex justify-between items-center gap-4 flex-wrap'>
        <h3>{heading}</h3>
        {button_link && (
          <Button asChild variant={'link'} className='font-semibold'>
            <Link href={button_link}>
              {t('view_all')}
              <MoveRight />
            </Link>
          </Button>
        )}
      </div>
      <Carousel
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className='my-4 mx-2'>
          {productVariants.map((item) => (
            <CarouselItem
              key={item.id}
              className={cn(`flex-[0_0_70%] px-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5`)}
            >
              <ProductVariantCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && <CarouselPrevious />}
        {showArrows && <CarouselNext />}
      </Carousel>
    </div>
  )
}

export default ProductsCarousel
