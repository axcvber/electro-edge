import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { getWishlistValues } from '@/actions/wishlist/get-wishlist-values'
import { useWishlistCount } from '@/hooks/wishlist/use-wishlist-count'

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('@/actions/wishlist/get-wishlist-values', () => ({
  getWishlistValues: jest.fn(),
}))

describe('useWishlistCount', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns wishlist count when data is available', async () => {
    const mockWishlistValues = JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }])
    ;(useQuery as jest.Mock).mockReturnValue({
      data: 3,
    })
    ;(getWishlistValues as jest.Mock).mockResolvedValue(mockWishlistValues)

    const { result } = renderHook(() => useWishlistCount())

    await waitFor(() => {
      expect(result.current.wishlistCount).toBe(3)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })

  test('returns 0 when data is null', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
    })

    const { result } = renderHook(() => useWishlistCount())

    await waitFor(() => {
      expect(result.current.wishlistCount).toBe(0)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })

  test('returns 0 when data is an empty array', async () => {
    const mockWishlistValues = JSON.stringify([])
    ;(useQuery as jest.Mock).mockReturnValue({
      data: 0,
    })
    ;(getWishlistValues as jest.Mock).mockResolvedValue(mockWishlistValues)

    const { result } = renderHook(() => useWishlistCount())

    await waitFor(() => {
      expect(result.current.wishlistCount).toBe(0)
    })

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['wishlist-values'],
      queryFn: expect.any(Function),
      initialData: null,
      select: expect.any(Function),
    })
  })
})
