'use server'

import { GetCollectionProductsQueryVariables, LanguageCode, Product } from '@/gql/storefront/graphql'
import { GetCollectionProductsQuery } from '@/lib/shopify/storefront/queries/collection'
import { storefrontClient } from '@/lib/shopify'
import { reshapeProduct } from '@/lib/normalize'
import { getLocale } from 'next-intl/server'

type GetCollectionProductsVariables = Omit<GetCollectionProductsQueryVariables, 'language'>

export const getCollectionProducts = async (variables: GetCollectionProductsVariables) => {
  const locale = await getLocale()

  const { collection } = await storefrontClient.request(GetCollectionProductsQuery, {
    first: 8,
    ...variables,
    language: locale.toUpperCase() as LanguageCode,
  })

  const products = collection?.products.nodes.map((item) => reshapeProduct(item as Product)) || []
  const pageInfo = collection?.products.pageInfo
  const filters = collection?.products.filters

  return { products, pageInfo, filters }
}
