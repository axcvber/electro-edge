import { renderHook, act, waitFor } from '@testing-library/react'
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { updateItemQuantity } from '@/actions/cart/update-item-quantity'
import { useToast } from '@/hooks/use-toast'
import { useUpdateCartItemQuantity } from '@/hooks/cart/use-update-cart-item-quantity'

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

jest.mock('@/actions/cart/update-item-quantity', () => ({
  updateItemQuantity: jest.fn(),
}))
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

describe('useUpdateCartItemQuantity', () => {
  const mockInvalidateQueries = jest.fn()
  const mockToast = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries: mockInvalidateQueries({ queryKey: ['cart'] }) })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  test('successful mutation', async () => {
    ;(useMutation as jest.Mock).mockImplementation(
      (options: UseMutationOptions<void, Error, { id: string; quantity: number }>) => ({
        mutate: (variables: { id: string; quantity: number }, { onSuccess }: { onSuccess: () => void }) => {
          if (options.mutationFn) {
            options
              .mutationFn(variables)
              .then(onSuccess)
              .catch(() => {})
          }
        },
        isPending: false,
      })
    )

    jest.mocked(updateItemQuantity).mockResolvedValue()

    const { result } = renderHook(() => useUpdateCartItemQuantity())

    act(() => {
      result.current.updateQuantity(
        { variantId: 'test-id', lineId: 'test-line-id', quantity: 2 },
        { onSuccess: () => {} }
      )
    })

    await waitFor(() => {
      expect(updateItemQuantity).toHaveBeenCalledWith({ variantId: 'test-id', lineId: 'test-line-id', quantity: 2 })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] })
    })
  })

  test('error mutation', async () => {
    const mockError = new Error('Test Error')
    ;(useMutation as jest.Mock).mockImplementation(
      (options: UseMutationOptions<void, Error, { id: string; quantity: number }>) => ({
        mutate: (variables: { id: string; quantity: number }, { onError }: { onError: (error: Error) => void }) => {
          if (options.mutationFn) {
            options
              .mutationFn(variables)
              .then(() => {})
              .catch(onError)
          }
        },
        isPending: false,
      })
    )

    jest.mocked(updateItemQuantity).mockRejectedValue(mockError)

    const { result } = renderHook(() => useUpdateCartItemQuantity())

    act(() => {
      result.current.updateQuantity(
        { variantId: 'test-id', lineId: 'test-line-id', quantity: 2 },
        {
          onError: (error) => {
            mockToast({
              title: error.message,
              variant: 'destructive',
            })
          },
        }
      )
    })

    await waitFor(() => {
      expect(updateItemQuantity).toHaveBeenCalledWith({ variantId: 'test-id', lineId: 'test-line-id', quantity: 2 })
      expect(mockToast).toHaveBeenCalledWith({
        title: mockError.message,
        variant: 'destructive',
      })
    })
  })
})
