import { useMutation, useQueryClient } from '@tanstack/react-query'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { addItem } from '@/actions/cart/add-item'
import { useToast } from '../use-toast'

export const useAddCartItem = () => {
  const showModal = useModalStore((state) => state.showModal)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: addCartItem, isPending } = useMutation({
    mutationFn: addItem,
    onError(error) {
      toast({
        title: error.message,
        variant: 'destructive',
      })
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      showModal(ModalTypeEnum.CART)
    },
  })

  return {
    addCartItem,
    isPending,
  }
}
