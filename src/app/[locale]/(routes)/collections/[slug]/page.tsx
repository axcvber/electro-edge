import React from 'react'
import FilterBar from './_components/filter/filterbar'
import Heading from './_components/heading'
import ProductView from './_components/product/product-view'
import { getCollectionProducts } from '@/actions/collection/get-collection-products'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { FilterProvider } from '@/store/use-filter-store'
import { productsSort } from '@/lib/constants'
import { formatSearchParams } from '@/lib/filtration'
import { convertToURLSearchParams, getSortValues } from '@/lib/utils'
import { getCollectionPage } from '@/actions/collection/get-collection-page'
import { Metafield } from '@/gql/storefront/graphql'

const CollectionsSinglePage = async ({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const { pageData, defaultPriceRange } = await getCollectionPage(params.slug)
  const { sortKey, reverse } = getSortValues(productsSort, searchParams?.sort as string)
  const urlSearchParams = convertToURLSearchParams(searchParams)
  const filters = formatSearchParams(urlSearchParams)

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', filters, sortKey, reverse],
    initialPageParam: '',
    queryFn: async () =>
      await getCollectionProducts({
        handle: params.slug,
        filters,
        sortKey,
        reverse,
      }),
  })

  const prefetchedData = (await queryClient.getQueryData(['products', filters, sortKey, reverse])) as any
  const prefetchedFilters = prefetchedData?.pages[0]?.filters || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilterProvider data={prefetchedFilters} defaultPriceRange={defaultPriceRange}>
        <section>
          <Heading
            title={pageData?.title}
            description={pageData?.description}
            metafield={pageData?.metafield as Metafield}
          />
          <div className='container my-12 flex items-start gap-8'>
            <FilterBar />
            <ProductView />
          </div>
        </section>
      </FilterProvider>
    </HydrationBoundary>
  )
}

export default CollectionsSinglePage
