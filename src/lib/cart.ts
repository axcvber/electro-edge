import { setMetafields } from '@/actions/set-metafields'
import {
  AddToCartMutationVariables,
  CartBuyerIdentityInput,
  CountryCode,
  RemoveFromCartMutationVariables,
  UpdateCartItemsMutationVariables,
} from '@/gql/storefront/graphql'
import { storefrontClient } from '@/lib/shopify'
import {
  AddToCartMutation,
  CreateCartMutation,
  RemoveFromCartMutation,
  UpdateCartBuyerIdentityMutation,
  UpdateCartItemsMutation,
} from '@/lib/shopify/storefront/mutations/cart'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { CookieName } from './constants'

export const createCart = async () => {
  const session = await auth()

  const { cartCreate } = await storefrontClient.request(CreateCartMutation, {
    cartInput: {
      buyerIdentity: {
        countryCode: CountryCode.Us,
        customerAccessToken: session?.accessToken,
        email: session?.user.email,
        phone: session?.user.phone,
        deliveryAddressPreferences: session?.user?.defaultAddressId
          ? [{ customerAddressId: session?.user?.defaultAddressId }]
          : [],
      },
    },
  })

  if (cartCreate?.userErrors.length) {
    throw new Error(cartCreate.userErrors[0].message)
  }

  if (!cartCreate?.cart) {
    throw new Error('Failed to create cart')
  }

  if (session?.user.id) {
    await saveUserCart({
      cartId: cartCreate.cart.id,
      userId: session.user.id,
    })
  }

  const cartId = cartCreate.cart.id

  await setCartCookies(cartId)

  return cartId
}

export const addToCart = async ({ cartId, lines }: AddToCartMutationVariables) => {
  const { cartLinesAdd } = await storefrontClient.request(AddToCartMutation, {
    cartId,
    lines,
  })

  if (cartLinesAdd?.userErrors.length) {
    throw new Error(cartLinesAdd.userErrors[0].message)
  }

  if (!cartLinesAdd?.cart) {
    throw new Error('Failed to add item to cart')
  }
}

export const removeFromCart = async ({ cartId, lineIds }: RemoveFromCartMutationVariables) => {
  const { cartLinesRemove } = await storefrontClient.request(RemoveFromCartMutation, {
    cartId,
    lineIds,
  })

  if (cartLinesRemove?.userErrors.length) {
    throw new Error(cartLinesRemove.userErrors[0].message)
  }

  if (!cartLinesRemove?.cart) {
    throw new Error('Failed to remove a cart item')
  }
}

export const updateCart = async ({ cartId, lines }: UpdateCartItemsMutationVariables) => {
  const { cartLinesUpdate } = await storefrontClient.request(UpdateCartItemsMutation, {
    cartId,
    lines,
  })

  if (cartLinesUpdate?.userErrors.length) {
    throw new Error(cartLinesUpdate.userErrors[0].message)
  }

  if (!cartLinesUpdate?.cart) {
    throw new Error('Failed to update item quantity')
  }
}

export const updateBuyerIdentity = async ({
  cartId,
  buyerIdentity,
}: {
  cartId: string
  buyerIdentity: CartBuyerIdentityInput
}) => {
  const { cartBuyerIdentityUpdate } = await storefrontClient.request(UpdateCartBuyerIdentityMutation, {
    cartId,
    buyerIdentity,
  })

  if (cartBuyerIdentityUpdate?.userErrors.length) {
    throw new Error(cartBuyerIdentityUpdate.userErrors[0].message)
  }

  if (!cartBuyerIdentityUpdate?.cart) {
    throw new Error('Failed to update buyer identity')
  }
}

export const saveUserCart = async ({ userId, cartId }: { userId: string; cartId: string }) => {
  await setMetafields({
    metafields: {
      key: 'cart_id',
      ownerId: userId,
      value: cartId,
      namespace: 'custom',
      type: 'single_line_text_field',
    },
  })
}

export const setCartCookies = async (cartId: string) => {
  cookies().set(CookieName.CART_ID, cartId, { maxAge: 30 * 24 * 60 * 60 })
}
