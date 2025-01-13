import { renderHook, act, waitFor } from '@testing-library/react'
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'
import { useToast } from '@/hooks/use-toast'
import { useAddCartItem } from '@/hooks/cart/use-add-cart-item'
import { addItem } from '@/actions/cart/add-item'

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}))

jest.mock('@/store/use-modal-store', () => jest.fn())
jest.mock('@/actions/cart/add-item', () => ({
  addItem: jest.fn(),
}))
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

describe('useAddCartItem', () => {
  const mockShowModal = jest.fn()
  const mockInvalidateQueries = jest.fn()
  const mockToast = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({ showModal: mockShowModal })
    ;(useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries: mockInvalidateQueries({ queryKey: ['cart'] }) })
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  test('successful mutation', async () => {
    ;(useMutation as jest.Mock).mockImplementation((options: UseMutationOptions<void, Error, string>) => ({
      mutate: (variables: string, { onSuccess }: { onSuccess: () => void }) => {
        if (options.mutationFn) {
          options
            .mutationFn(variables)
            .then(() => {
              onSuccess()
              mockShowModal(ModalTypeEnum.CART)
            })
            .catch(() => {})
        }
      },
      isPending: false,
    }))

    jest.mocked(addItem).mockResolvedValue()

    const { result } = renderHook(() => useAddCartItem())

    act(() => {
      result.current.addCartItem('test-id', {
        onSuccess() {},
      })
    })

    await waitFor(() => {
      expect(addItem).toHaveBeenCalledWith('test-id')
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['cart'] })
      expect(mockShowModal).toHaveBeenCalledWith(ModalTypeEnum.CART)
    })
  })

  test('error mutation', async () => {
    const mockError = new Error('Test Error')
    ;(useMutation as jest.Mock).mockImplementation((options: UseMutationOptions<void, Error, string>) => ({
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

    jest.mocked(addItem).mockRejectedValue(mockError)

    const { result } = renderHook(() => useAddCartItem())

    act(() => {
      result.current.addCartItem('test-id', {
        onError: (error) => {
          mockToast({
            title: error.message,
            variant: 'destructive',
          })
        },
      })
    })

    await waitFor(() => {
      expect(addItem).toHaveBeenCalledWith('test-id')
      expect(mockToast).toHaveBeenCalledWith({
        title: mockError.message,
        variant: 'destructive',
      })
    })
  })
})
