import { cookies } from 'next/headers'
import { removeFromCart, updateCart } from '@/lib/cart'
import { updateItemQuantity } from '@/actions/cart/update-item-quantity'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/cart', () => ({
  removeFromCart: jest.fn(),
  updateCart: jest.fn(),
}))

describe('updateItemQuantity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('throws an error if cart ID is missing', async () => {
    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    })

    await expect(updateItemQuantity({ lineId: 'lineId', variantId: 'variantId', quantity: 1 })).rejects.toThrow(
      'Missing cart ID'
    )
  })

  test('throws an error if line ID or variant ID is missing', async () => {
    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'cartId' }),
    })

    await expect(updateItemQuantity({ lineId: '', variantId: 'variantId', quantity: 1 })).rejects.toThrow(
      'Missing line ID or variant ID'
    )

    await expect(updateItemQuantity({ lineId: 'lineId', variantId: '', quantity: 1 })).rejects.toThrow(
      'Missing line ID or variant ID'
    )
  })

  test('removes item from cart if quantity is zero', async () => {
    const mockCartId = 'cartId'
    const mockLineId = 'lineId'
    const mockVariantId = 'variantId'

    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: mockCartId }),
    })

    await updateItemQuantity({ lineId: mockLineId, variantId: mockVariantId, quantity: 0 })

    expect(removeFromCart).toHaveBeenCalledWith({
      cartId: mockCartId,
      lineIds: [mockLineId],
    })
    expect(updateCart).not.toHaveBeenCalled()
  })

  test('updates item quantity in cart', async () => {
    const mockCartId = 'cartId'
    const mockLineId = 'lineId'
    const mockVariantId = 'variantId'
    const mockQuantity = 2

    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: mockCartId }),
    })

    await updateItemQuantity({ lineId: mockLineId, variantId: mockVariantId, quantity: mockQuantity })

    expect(updateCart).toHaveBeenCalledWith({
      cartId: mockCartId,
      lines: [
        {
          id: mockLineId,
          merchandiseId: mockVariantId,
          quantity: mockQuantity,
        },
      ],
    })
    expect(removeFromCart).not.toHaveBeenCalled()
  })
})
