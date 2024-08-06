'use client'

import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import BackgroundImage from '../ui/bg-image'
import { Image } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'

interface ShopBannerFields {
  title: string
  description: string
  image: Image
  button_link: string
}

const ShopBanner: React.FC<ShopBannerFields> = ({ button_link, title, description, image }) => {
  const t = useTranslations('buttons')

  return (
    <div className='container my-12'>
      <div className='relative w-full flex items-center min-h-[400px] border overflow-hidden rounded-md px-10 md:px-16 py-16'>
        <div className='max-w-sm space-y-5'>
          <h2 className='text-4xl'>{title}</h2>
          <p>{description}</p>
          <Button size={'lg'}>
            <Link href={button_link}>{t('shop_now')}</Link>
          </Button>
        </div>
        <BackgroundImage img={image.url} gradientPlacement='left' />
      </div>
    </div>
  )
}

export default ShopBanner
