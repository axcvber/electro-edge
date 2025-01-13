import { useCart } from '@/hooks/cart/use-cart'
import { useIsItemAdded } from '@/hooks/cart/use-is-item-added'
import { renderHook } from '@testing-library/react'

jest.mock('@/hooks/cart/use-cart')

describe('useIsItemAdded', () => {
  const mockUseCart = useCart as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns true if the item is added to the cart', () => {
    const variantId = 'test-variant-id'
    const cart = {
      lines: [{ merchandise: { id: 'test-variant-id' } }, { merchandise: { id: 'another-variant-id' } }],
    }

    mockUseCart.mockReturnValue({ cart })

    const { result } = renderHook(() => useIsItemAdded(variantId))

    expect(result.current).toBe(true)
  })

  test('returns false if the item is not added to the cart', () => {
    const variantId = 'test-variant-id'
    const cart = {
      lines: [{ merchandise: { id: 'another-variant-id' } }],
    }

    mockUseCart.mockReturnValue({ cart })

    const { result } = renderHook(() => useIsItemAdded(variantId))

    expect(result.current).toBe(false)
  })

  test('returns false if the cart is empty', () => {
    const variantId = 'test-variant-id'
    const cart = {
      lines: [],
    }

    mockUseCart.mockReturnValue({ cart })

    const { result } = renderHook(() => useIsItemAdded(variantId))

    expect(result.current).toBe(false)
  })

  test('returns false if the cart is undefined', () => {
    const variantId = 'test-variant-id'

    mockUseCart.mockReturnValue({ cart: undefined })

    const { result } = renderHook(() => useIsItemAdded(variantId))

    expect(result.current).toBe(false)
  })
})
