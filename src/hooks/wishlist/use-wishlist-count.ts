import { getWishlistValues } from '@/actions/wishlist/get-wishlist-values'
import { useQuery } from '@tanstack/react-query'

export const useWishlistCount = () => {
  const { data } = useQuery({
    queryKey: ['wishlist-values'],
    queryFn: async () => await getWishlistValues(),
    initialData: null,
    select: (value) => {
      if (value) {
        const wishlist = JSON.parse(value)
        return wishlist.length
      }
      return 0
    },
  })

  return { wishlistCount: data || 0 }
}
