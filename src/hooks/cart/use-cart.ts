import { getCart } from '@/actions/cart/get-cart'
import { useQuery } from '@tanstack/react-query'

export const useCart = () => {
  const {
    data: cart,
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => await getCart(),
    refetchOnMount: false,
    initialData: null,
  })

  return {
    cart,
    isLoading,
    isFetching,
    isPending,
  }
}
