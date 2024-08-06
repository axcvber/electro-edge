import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { getInitialData } from '@/actions/app/get-initial-data'
import { getCart } from '@/actions/cart/get-cart'
import { getWishlistValues } from '@/actions/wishlist/get-wishlist-values'
import Footer from '@/components/footer'
import Header from '@/components/header'

export default async function RoutesLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  await queryClient.prefetchQuery({
    queryKey: ['wishlist-values'],
    queryFn: getWishlistValues,
  })

  await queryClient.prefetchQuery({
    queryKey: ['initial-data'],
    queryFn: getInitialData,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex flex-col'>
        <Header />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </HydrationBoundary>
  )
}
