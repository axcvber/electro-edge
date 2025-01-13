import { cookies } from 'next/headers'
import { storefrontClient } from '@/lib/shopify'
import { reshapeCart } from '@/lib/normalize'
import { GetCartQuery } from '@/lib/shopify/storefront/queries/cart'
import { getCart } from '@/actions/cart/get-cart'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/shopify', () => ({
  storefrontClient: {
    request: jest.fn(),
  },
}))

jest.mock('@/lib/normalize', () => ({
  reshapeCart: jest.fn(),
}))

describe('getCart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns null if no cart ID in cookies', async () => {
    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    })

    const result = await getCart()

    expect(result).toBeNull()
    expect(storefrontClient.request).not.toHaveBeenCalled()
  })

  test('returns reshaped cart data if cart ID is present and cart is returned', async () => {
    const mockCartId = 'mockCartId'
    const mockCart = { id: mockCartId }
    const mockReshapedCart = { id: mockCartId, items: [] }

    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: mockCartId }),
    })

    ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cart: mockCart })
    ;(reshapeCart as jest.Mock).mockReturnValue(mockReshapedCart)

    const result = await getCart()

    expect(result).toEqual(mockReshapedCart)
    expect(storefrontClient.request).toHaveBeenCalledWith(GetCartQuery, { cartId: mockCartId })
    expect(reshapeCart).toHaveBeenCalledWith(mockCart)
  })

  test('returns null if cart ID is present but no cart is returned', async () => {
    const mockCartId = 'mockCartId'

    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: mockCartId }),
    })

    ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cart: null })

    const result = await getCart()

    expect(result).toBeNull()
    expect(storefrontClient.request).toHaveBeenCalledWith(GetCartQuery, { cartId: mockCartId })
    expect(reshapeCart).not.toHaveBeenCalled()
  })
})
