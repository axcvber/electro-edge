'use client'

import { getWishlist } from '@/actions/wishlist/get-wishlist'
import ProductVariantCard from '@/components/cards/product-variant-card'
import InfoBox from '@/components/common/info-box'
import InfiniteScroll from '@/components/infinite-scroll'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PackageSearch } from 'lucide-react'

const WishlistData = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['wishlist'],
    initialPageParam: '',
    queryFn: async ({ pageParam = '' }) => await getWishlist(pageParam ? pageParam : undefined),
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo?.hasNextPage) {
        return lastPage.pageInfo?.endCursor
      }
    },
    throwOnError: true,
  })

  if (isLoading) {
    return <div>isLoading...</div>
  }

  if (data?.pages[0].productVariants.length === 0) {
    return <InfoBox icon={<PackageSearch />} title='No products found' desc='Try changing the filters.' />
  }

  const allProducts = data?.pages.flatMap((page) => page.productVariants) || []

  return (
    <>
      <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 items-start'>
        {allProducts.map((item) => (
          <ProductVariantCard key={item.id} {...item} />
        ))}
      </div>

      <InfiniteScroll hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
    </>
  )
}

export default WishlistData
