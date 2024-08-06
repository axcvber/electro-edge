'use server'

import { LanguageCode, Product, ProductVariant } from '@/gql/storefront/graphql'
import { reshapeProduct } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetProductRecommendationsQuery } from '@/lib/shopify/storefront/queries/product'
import { getLocale } from 'next-intl/server'

export const getRelatedProducts = async (productId: string) => {
  const locale = await getLocale()
  const { productRecommendations } = await storefrontClient.request(GetProductRecommendationsQuery, {
    productId,
    language: locale.toUpperCase() as LanguageCode,
  })

  const relatedProducts = productRecommendations?.map((item) => reshapeProduct(item as Product)) || []

  return relatedProducts
}
