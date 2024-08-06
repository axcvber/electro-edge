'use client'

import React from 'react'
import { ProductViewType } from './product-view'
import ProductGrid from './product-grid'
import ProductList from './product-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getCollectionProducts } from '@/actions/collection/get-collection-products'
import InfoBox from '@/components/common/info-box'
import { PackageSearch } from 'lucide-react'
import InfiniteScroll from '@/components/infinite-scroll'
import { useParams, useSearchParams } from 'next/navigation'
import { useFilterStore } from '@/store/use-filter-store'
import { productsSort } from '@/lib/constants'
import { formatSearchParams } from '@/lib/filtration'
import { getSortValues } from '@/lib/utils'
import ProductsSkeleton from './products-skeleton'
import ErrorSection from '@/components/common/error-section'

interface IProductList {
  view: ProductViewType
}

const ProductData: React.FC<IProductList> = ({ view }) => {
  const searchParams = useSearchParams()
  const params = useParams<{ slug: string }>()
  const setFilters = useFilterStore((s) => s.setFilters)
  const filters = formatSearchParams(searchParams)
  const sort = searchParams.get('sort')
  const { sortKey, reverse } = getSortValues(productsSort, sort)

  const { data, error, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['products', filters, sortKey, reverse],
    initialPageParam: '',
    queryFn: async ({ pageParam = '' }) =>
      await getCollectionProducts({
        handle: params.slug,
        after: pageParam ? pageParam : undefined,
        filters,
        sortKey,
        reverse,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo?.hasNextPage) {
        return lastPage.pageInfo?.endCursor
      }
    },
  })

  React.useEffect(() => {
    if (data?.pages[0].filters?.length) {
      setFilters(data.pages[0].filters)
    }
  }, [data])

  if (error) {
    return <ErrorSection errorMessage={error.message} resetCallback={() => refetch()} />
  }

  if (isLoading) {
    return <ProductsSkeleton view={view} />
  }

  if (data?.pages[0].products?.length === 0) {
    return <InfoBox icon={<PackageSearch />} title='No products found' desc='Try changing the filters.' />
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || []

  return (
    <>
      {view === 'grid' && <ProductGrid data={allProducts} />}
      {view === 'list' && <ProductList data={allProducts} />}
      <InfiniteScroll hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
    </>
  )
}

export default ProductData
