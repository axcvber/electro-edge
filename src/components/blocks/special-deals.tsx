'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BackgroundImage from '@/components/ui/bg-image'
import { cn } from '@/lib/utils'
import { NormalizedMetaobject } from '@/lib/normalize'
import { Image } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'

interface SpecialDealsFields {
  items: SpecialDealItem[]
}

interface SpecialDealItem extends NormalizedMetaobject {
  fields: {
    button_link: string
    description: string
    image: Image
    title: string
  }
}

const SpecialDeals: React.FC<SpecialDealsFields> = ({ items }) => {
  const t = useTranslations('buttons')

  return (
    <div className='container my-12'>
      <div className='grid md:grid-cols-3 gap-6 min-h-[500px]'>
        {items.map((item, inx) => (
          <Link
            key={inx}
            href={item.fields.button_link || '/'}
            className={cn(
              'relative flex items-center p-10 border rounded-md group overflow-hidden',
              inx === 0 && 'md:col-span-2 md:row-span-2'
            )}
          >
            <div className='max-w-sm space-y-4 text-white'>
              <h3 className={cn(inx === 0 && 'h2')}>{item.fields.title}</h3>
              <p className={cn(inx !== 0 && 'text-sm')}>{item.fields.description}</p>
              <Button>{t('shop_now')}</Button>
            </div>
            <BackgroundImage img={item.fields.image.url} sizes='50vw' zoomed blurred />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialDeals
