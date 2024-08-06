'use server'

import { Cart } from '@/gql/storefront/graphql'
import { reshapeCart } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetCartQuery } from '@/lib/shopify/storefront/queries/cart'
import { cookies } from 'next/headers'

export const getCart = async () => {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) return null

  const { cart } = await storefrontClient.request(GetCartQuery, {
    cartId: cartId,
  })

  const data = cart ? reshapeCart(cart as Cart) : null

  return data
}
