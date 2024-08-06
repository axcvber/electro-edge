'use server'

import { addToCart, createCart } from '@/lib/cart'
import { getCart } from './get-cart'

export const addItem = async (selectedVariantId: string) => {
  if (!selectedVariantId) {
    throw new Error('Missing product variant ID')
  }

  const cart = await getCart()

  let cartId = cart?.id

  if (!cartId) {
    const newCartId = await createCart()
    cartId = newCartId
  }

  await addToCart({
    cartId,
    lines: [{ merchandiseId: selectedVariantId, quantity: 1 }],
  })
}
