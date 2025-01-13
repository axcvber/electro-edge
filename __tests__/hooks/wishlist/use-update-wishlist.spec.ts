import { renderHook, act, waitFor } from '@testing-library/react'
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { updateWishlist } from '@/actions/wishlist/update-wishlist'
import { UnauthorizedError } from '@/lib/exceptions'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'
import { useToast } from '@/hooks/use-toast'
import { useUpdateWishlist } from '@/hooks/wishlist/use-update-wishlist'

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

jest.mock('@/actions/wishlist/update-wishlist', () => ({
  updateWishlist: jest.fn(),
}))
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))
jest.mock('@/store/use-modal-store', () => jest.fn())

describe('useUpdateWishlist', () => {
  const mockInvalidateQueries = jest.fn()
  const mockToast = jest.fn()
  const mockShowModal = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries({ queryKey: ['wishlist-values'] }),
    })
    ;(useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries({ queryKey: ['wishlist'] }),
    })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({ showModal: mockShowModal })
  })

  test('successful mutation', async () => {
    ;(useMutation as jest.Mock).mockImplementation((options: UseMutationOptions<any, Error, any>) => ({
      mutate: (variables: string, { onSuccess }: { onSuccess: ({ message }: { message: string }) => void }) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then((message) => {
              onSuccess(message)
              mockShowModal(ModalTypeEnum.CART)
            })
            .catch(() => {})
        }
      },
      isPending: false,
    }))

    jest.mocked(updateWishlist).mockResolvedValue({ message: 'Product added to wishlist' })

    const { result } = renderHook(() => useUpdateWishlist())

    act(() => {
      result.current.updateWishlistItem('Product added to wishlist', {
        onSuccess(data) {
          mockToast({
            title: data.message,
            variant: 'info',
          })
        },
      })
    })

    await waitFor(() => {
      expect(updateWishlist).toHaveBeenCalledWith('Product added to wishlist')
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['wishlist-values'] })
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['wishlist'] })
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Product added to wishlist',
        variant: 'info',
      })
    })
  })

  test('error mutation with unauthorized error', async () => {
    const mockError = new UnauthorizedError()
    ;(useMutation as jest.Mock).mockImplementation((options: UseMutationOptions<any, Error, any>) => ({
      mutate: (variables: string, { onError }: { onError: (error: Error) => void }) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then(() => {})
            .catch((error) => {
              onError(error)
              mockShowModal(ModalTypeEnum.LOGIN)
            })
        }
      },
      isPending: false,
    }))

    jest.mocked(updateWishlist).mockRejectedValue(mockError)

    const { result } = renderHook(() => useUpdateWishlist())

    act(() => {
      result.current.updateWishlistItem('Authorization required', {
        onError: (error) => {
          mockToast({
            title: error.message,
            variant: 'destructive',
          })
        },
      })
    })

    await waitFor(() => {
      expect(updateWishlist).toHaveBeenCalledWith('Authorization required')
      expect(mockShowModal).toHaveBeenCalledWith(ModalTypeEnum.LOGIN)
      expect(mockToast).toHaveBeenCalledWith({
        title: mockError.message,
        variant: 'destructive',
      })
    })
  })

  test('error mutation with other error', async () => {
    const mockError = new Error('Test Error')
    ;(useMutation as jest.Mock).mockImplementation((options: UseMutationOptions<any, Error, any>) => ({
      mutate: (variables: string, { onError }: { onError: (error: Error) => void }) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then(() => {})
            .catch(onError)
        }
      },
      isPending: false,
    }))

    jest.mocked(updateWishlist).mockRejectedValue(mockError)

    const { result } = renderHook(() => useUpdateWishlist())

    act(() => {
      result.current.updateWishlistItem('Failed to add to wish list', {
        onError: (error) => {
          mockToast({
            title: error.message,
            variant: 'destructive',
          })
        },
      })
    })

    await waitFor(() => {
      expect(updateWishlist).toHaveBeenCalledWith('Failed to add to wish list')
      expect(mockShowModal).not.toHaveBeenCalled()
      expect(mockToast).toHaveBeenCalledWith({
        title: mockError.message,
        variant: 'destructive',
      })
    })
  })
})
