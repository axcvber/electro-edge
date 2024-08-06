'use server'

import { LanguageCode, Product } from '@/gql/storefront/graphql'
import { storefrontClient } from '@/lib/shopify'
import { SearchProductsQuery } from '@/lib/shopify/storefront/queries/product'
import { getLocale } from 'next-intl/server'

export const searchProducts = async (query: string) => {
  const locale = await getLocale()

  const { search } = await storefrontClient.request(SearchProductsQuery, {
    first: 10,
    query,
    language: locale.toUpperCase() as LanguageCode,
  })

  const products = search.nodes as Product[]

  return { products, totalCount: search.totalCount }
}
