import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeItem } from '@/actions/cart/remove-item'
import { useToast } from '../use-toast'

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: removeCartItem, isPending: isRemoving } = useMutation({
    mutationFn: removeItem,
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
    removeCartItem,
    isRemoving,
  }
}
