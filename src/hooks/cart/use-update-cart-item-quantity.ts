import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateItemQuantity } from '@/actions/cart/update-item-quantity'
import { useToast } from '../use-toast'

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: updateQuantity, isPending: isUpdating } = useMutation({
    mutationFn: updateItemQuantity,
    onError(error) {
      toast({
        title: error.message,
        variant: 'destructive',
      })
    },
    onSuccess() {
      return queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  return {
    updateQuantity,
    isUpdating,
  }
}
