import React from 'react'
import { getWishlist } from '@/actions/wishlist/get-wishlist'
import WishlistData from './_components/wishlist-data'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'

const WishlistPage = async () => {
  const queryClient = new QueryClient()
  const t = await getTranslations('wishlist')

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['wishlist'],
    initialPageParam: '',
    queryFn: async () => await getWishlist(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section>
        <h1 className='h3 mb-3'>{t('title')}</h1>
        <WishlistData />
      </section>
    </HydrationBoundary>
  )
}

export default WishlistPage
