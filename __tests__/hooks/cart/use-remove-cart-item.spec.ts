import { renderHook, act, waitFor } from '@testing-library/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeItem } from '@/actions/cart/remove-item'
import { useToast } from '@/hooks/use-toast'
import { useRemoveCartItem } from '@/hooks/cart/use-remove-cart-item'

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

jest.mock('@/actions/cart/remove-item', () => ({
  removeItem: jest.fn(),
}))
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

describe('useRemoveCartItem', () => {
  const mockInvalidateQueries = jest.fn()
  const mockToast = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries: mockInvalidateQueries })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  test('successful mutation', async () => {
    ;(useMutation as jest.Mock).mockImplementation((options) => ({
      mutate: (variables: string) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then(() => {
              options.onSuccess()
            })
            .catch(() => {})
        }
      },
      isPending: false,
    }))

    jest.mocked(removeItem).mockResolvedValue()

    const { result } = renderHook(() => useRemoveCartItem())

    act(() => {
      result.current.removeCartItem('test-id')
    })

    await waitFor(() => {
      expect(removeItem).toHaveBeenCalledWith('test-id')
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] })
    })
  })

  test('error mutation', async () => {
    const mockError = new Error('Test Error')
    ;(useMutation as jest.Mock).mockImplementation((options) => ({
      mutate: (variables: string) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then(() => {})
            .catch((error: Error) => {
              options.onError(error)
            })
        }
      },
      isPending: false,
    }))

    jest.mocked(removeItem).mockRejectedValue(mockError)

    const { result } = renderHook(() => useRemoveCartItem())

    act(() => {
      result.current.removeCartItem('test-id')
    })

    await waitFor(() => {
      expect(removeItem).toHaveBeenCalledWith('test-id')
      expect(mockToast).toHaveBeenCalledWith({
        title: mockError.message,
        variant: 'destructive',
      })
    })
  })
})
