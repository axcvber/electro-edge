import { addItem } from '@/actions/cart/add-item'
import { getCart } from '@/actions/cart/get-cart'
import { addToCart, createCart } from '@/lib/cart'

jest.mock('@/actions/cart/get-cart')
jest.mock('@/lib/cart')

describe('addItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('throws an error if product variant ID is missing', async () => {
    await expect(addItem('')).rejects.toThrow('Missing product variant ID')
  })

  test('adds item to existing cart', async () => {
    const mockCartId = 'existingCartId'
    const mockVariantId = 'variantId'

    ;(getCart as jest.Mock).mockResolvedValue({ id: mockCartId })
    ;(addToCart as jest.Mock).mockResolvedValue(undefined)

    await addItem(mockVariantId)

    expect(getCart).toHaveBeenCalled()
    expect(addToCart).toHaveBeenCalledWith({
      cartId: mockCartId,
      lines: [{ merchandiseId: mockVariantId, quantity: 1 }],
    })
    expect(createCart).not.toHaveBeenCalled()
  })

  test('creates a new cart and adds item if no cart exists', async () => {
    const mockNewCartId = 'newCartId'
    const mockVariantId = 'variantId'

    ;(getCart as jest.Mock).mockResolvedValue(null)
    ;(createCart as jest.Mock).mockResolvedValue(mockNewCartId)
    ;(addToCart as jest.Mock).mockResolvedValue(undefined)

    await addItem(mockVariantId)

    expect(getCart).toHaveBeenCalled()
    expect(createCart).toHaveBeenCalled()
    expect(addToCart).toHaveBeenCalledWith({
      cartId: mockNewCartId,
      lines: [{ merchandiseId: mockVariantId, quantity: 1 }],
    })
  })
})
