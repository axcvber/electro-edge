'use server'

import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { ProductVariantWithMetafields, reshapeProductVariant } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetCustomerWishlistQuery } from '@/lib/shopify/storefront/queries/wishlist'

export const getWishlist = async (after?: string) => {
  const session = await auth()

  if (!session?.accessToken) {
    throw new UnauthorizedError()
  }

  const { customer } = await storefrontClient.request(GetCustomerWishlistQuery, {
    accessToken: session.accessToken,
    first: 8,
    after,
  })

  const productVariants =
    customer?.wishlist?.references?.nodes.map((item) => reshapeProductVariant(item as ProductVariantWithMetafields)) ||
    []
  const pageInfo = customer?.wishlist?.references?.pageInfo
  return { productVariants, pageInfo }
}
