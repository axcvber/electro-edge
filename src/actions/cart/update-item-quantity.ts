'use server'

import { removeFromCart, updateCart } from '@/lib/cart'
import { cookies } from 'next/headers'

export async function updateItemQuantity({
  lineId,
  variantId,
  quantity,
}: {
  lineId: string
  variantId: string
  quantity: number
}) {
  const cartId = cookies().get('cartId')?.value

  if (!cartId) {
    throw new Error('Missing cart ID')
  }

  if (!lineId || !variantId) {
    throw new Error('Missing line ID or variant ID')
  }

  if (quantity === 0) {
    await removeFromCart({
      cartId,
      lineIds: [lineId],
    })
    return
  }

  await updateCart({
    cartId,
    lines: [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity,
      },
    ],
  })
}
