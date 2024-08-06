'use server'

import { LanguageCode } from '@/gql/storefront/graphql'
import { ProductVariantWithMetafields, reshapeProductVariant } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetProductVariantQuery } from '@/lib/shopify/storefront/queries/product'
import { getLocale } from 'next-intl/server'

export const getProductVariant = async (variantId: string) => {
  const locale = await getLocale()
  const { node } = await storefrontClient.request(GetProductVariantQuery, {
    variantId: `gid://shopify/ProductVariant/${variantId}`,
    language: locale.toUpperCase() as LanguageCode,
  })

  const data = node ? reshapeProductVariant(node as ProductVariantWithMetafields) : null

  return data
}
