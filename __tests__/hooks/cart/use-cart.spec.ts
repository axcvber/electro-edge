import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '@/hooks/cart/use-cart'

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return initial state', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isPending: false,
    })

    const { result } = renderHook(() => useCart())

    await waitFor(() => {
      expect(result.current.cart).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isPending).toBe(false)
    })
  })

  test('should return loading state', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: true,
      isPending: true,
    })

    const { result } = renderHook(() => useCart())

    await waitFor(() => {
      expect(result.current.cart).toBeNull()
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isFetching).toBe(true)
      expect(result.current.isPending).toBe(true)
    })
  })

  test('should return success state with cart data', async () => {
    const mockCart = { id: 'cartId', items: [] }

    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockCart,
      isLoading: false,
      isFetching: false,
      isPending: false,
    })

    const { result } = renderHook(() => useCart())

    await waitFor(() => {
      expect(result.current.cart).toEqual(mockCart)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isPending).toBe(false)
    })
  })

  test('should handle error state', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isPending: false,
      error: new Error('Failed to fetch cart'),
    })

    const { result } = renderHook(() => useCart())

    await waitFor(() => {
      expect(result.current.cart).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.isPending).toBe(false)
    })
  })
})
