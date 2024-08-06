'use server'

import { UnauthorizedError } from '@/lib/exceptions'
import { setMetafields } from '../set-metafields'
import { getWishlistValues } from './get-wishlist-values'
import { auth } from '@/auth'

export const updateWishlist = async (variantId: string) => {
  const session = await auth()

  if (!session?.user.id) {
    throw new UnauthorizedError()
  }

  if (!variantId) {
    throw new Error('Missed variantId')
  }

  const currentWishlist = await getWishlistValues()
  const parsedData: Array<string> = currentWishlist ? JSON.parse(currentWishlist) : []

  const newValues = parsedData.includes(variantId)
    ? parsedData.filter((id) => id !== variantId)
    : [...parsedData, variantId]

  const finalValue = JSON.stringify(newValues)

  await setMetafields({
    metafields: {
      key: 'wishlist',
      namespace: 'custom',
      ownerId: session.user.id,
      type: 'list.variant_reference',
      value: finalValue,
    },
  })

  const message = parsedData.includes(variantId) ? 'Product removed from wishlist' : 'Product added to wishlist'

  return { message }
}
