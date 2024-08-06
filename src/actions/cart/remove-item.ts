'use server'

import { removeFromCart } from '@/lib/cart'
import { cookies } from 'next/headers'

export const removeItem = async (lineId: string) => {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) {
    throw new Error('Missing cart ID')
  }

  if (!lineId) {
    throw new Error('Missing line ID')
  }

  await removeFromCart({
    cartId,
    lineIds: [lineId],
  })
}
