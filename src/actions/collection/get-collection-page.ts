'use server'

import { GetCollectionPageQuery } from '@/lib/shopify/storefront/queries/collection'
import { storefrontClient } from '@/lib/shopify'
import { FilterType, LanguageCode } from '@/gql/storefront/graphql'
import { getLocale } from 'next-intl/server'

export const getCollectionPage = async (slug: string) => {
  const locale = await getLocale()
  const { collection } = await storefrontClient.request(GetCollectionPageQuery, {
    handle: slug,
    language: locale.toUpperCase() as LanguageCode,
  })

  const defaultPriceRange = collection?.products.filters.find((item) => item.type === FilterType.PriceRange)?.values[0]
    .input

  return { pageData: collection, defaultPriceRange }
}
