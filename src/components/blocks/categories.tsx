'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Link from 'next/link'
import { NormalizedMetaobject } from '@/lib/normalize'
import { Image } from '@/gql/storefront/graphql'
import NextImage from '@/components/ui/next-image'
import { useTranslations } from 'next-intl'

interface CategoryFields {
  items: CategoryItem[]
}

interface CategoryItem extends NormalizedMetaobject {
  title: string
  handle: string
  icon?: Image
}

const Categories: React.FC<CategoryFields> = ({ items }) => {
  const t = useTranslations('headings')

  return (
    <div className='container space-y-4 my-16'>
      <h3>{t('categories')}</h3>
      <div className='flex justify-between items-center'></div>
      <Carousel
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className='justify-between'>
          {items.map((item) => (
            <CarouselItem key={item.handle} className='basis-28 '>
              <div className='flex flex-col items-center gap-3 text-center'>
                <Button
                  asChild
                  variant={'outline-primary'}
                  size={'icon'}
                  className='w-12 h-12 bg-primary/10 hover:bg-primary/20 hover:text-white'
                >
                  <Link href={`/collections/${item.handle}`}>
                    <NextImage width={20} height={20} src={item.icon?.url} alt={item.icon?.altText || ''} />
                  </Link>
                </Button>
                <p className='font-semibold text-xs md:text-sm'>{item.title}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default Categories
