import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWishlist } from '@/actions/wishlist/update-wishlist'
import { useToast } from '../use-toast'
import { UnauthorizedError } from '@/lib/exceptions'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'

export const useUpdateWishlist = () => {
  const showModal = useModalStore((state) => state.showModal)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: updateWishlistItem, isPending } = useMutation({
    mutationFn: updateWishlist,
    onError(error) {
      const unauthorizedError = new UnauthorizedError()
      if (error.message === unauthorizedError.message) {
        showModal(ModalTypeEnum.LOGIN)
      }
      toast({
        title: error.message,
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      if (data.message) {
        toast({
          title: data.message,
          variant: 'info',
        })
      }
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wishlist-values'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
      ])
    },
  })

  return {
    updateWishlistItem,
    isPending,
  }
}
