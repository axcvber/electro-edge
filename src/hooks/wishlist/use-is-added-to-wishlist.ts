import { getWishlistValues } from '@/actions/wishlist/get-wishlist-values'
import { useQuery } from '@tanstack/react-query'

export const useIsAddedToWishlist = (variantId: string) => {
  const { data: isAdded } = useQuery({
    queryKey: ['wishlist-values'],
    queryFn: async () => await getWishlistValues(),
    initialData: null,
    select: (value) => {
      if (value) {
        const wishlist = JSON.parse(value)
        return wishlist.includes(variantId)
      }
      return false
    },
  })

  return !!isAdded
}
