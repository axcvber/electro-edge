import { removeItem } from '@/actions/cart/remove-item'
import { removeFromCart } from '@/lib/cart'
import { cookies } from 'next/headers'

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/cart', () => ({
  removeFromCart: jest.fn(),
}))

describe('removeItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('throws an error if cart ID is missing', async () => {
    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    })

    await expect(removeItem('lineId')).rejects.toThrow('Missing cart ID')
  })

  test('throws an error if line ID is missing', async () => {
    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'cartId' }),
    })

    await expect(removeItem('')).rejects.toThrow('Missing line ID')
  })

  test('removes item from cart if cart ID and line ID are provided', async () => {
    const mockCartId = 'cartId'
    const mockLineId = 'lineId'

    ;(cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: mockCartId }),
    })

    await removeItem(mockLineId)

    expect(cookies().get).toHaveBeenCalledWith('cartId')
    expect(removeFromCart).toHaveBeenCalledWith({
      cartId: mockCartId,
      lineIds: [mockLineId],
    })
  })
})
