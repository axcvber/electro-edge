import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { getWishlistValues } from '@/actions/wishlist/get-wishlist-values'
import { useIsAddedToWishlist } from '@/hooks/wishlist/use-is-added-to-wishlist'

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('@/actions/wishlist/get-wishlist-values', () => ({
  getWishlistValues: jest.fn(),
}))

describe('useIsAddedToWishlist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns true when variantId is in the wishlist', async () => {
    const mockWishlistValues = JSON.stringify(['variant-1', 'variant-2', 'variant-3'])
    ;(useQuery as jest.Mock).mockReturnValue({
      data: true,
    })
    ;(getWishlistValues as jest.Mock).mockResolvedValue(mockWishlistValues)

    const { result } = renderHook(() => useIsAddedToWishlist('variant-1'))

    await waitFor(() => {
      expect(result.current).toBe(true)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })

  test('returns false when variantId is not in the wishlist', async () => {
    const mockWishlistValues = JSON.stringify(['variant-1', 'variant-2', 'variant-3'])
    ;(useQuery as jest.Mock).mockReturnValue({
      data: false,
    })
    ;(getWishlistValues as jest.Mock).mockResolvedValue(mockWishlistValues)

    const { result } = renderHook(() => useIsAddedToWishlist('variant-4'))

    await waitFor(() => {
      expect(result.current).toBe(false)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })

  test('returns false when data is null', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
    })

    const { result } = renderHook(() => useIsAddedToWishlist('variant-1'))

    await waitFor(() => {
      expect(result.current).toBe(false)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })
})
