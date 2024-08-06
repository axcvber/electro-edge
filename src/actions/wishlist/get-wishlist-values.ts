'use server'

import { auth } from '@/auth'
import { storefrontClient } from '@/lib/shopify'
import { GetWishlistValuesQuery } from '@/lib/shopify/storefront/queries/wishlist'

export const getWishlistValues = async () => {
  const session = await auth()

  if (!session?.accessToken) return null

  const { customer } = await storefrontClient.request(GetWishlistValuesQuery, {
    accessToken: session.accessToken,
  })

  const value = customer?.wishlist?.value || null

  return value
}
