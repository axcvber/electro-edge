import React from 'react'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { getUserOrders } from '@/actions/order/get-user-orders'
import { ordersSort } from '@/lib/constants'
import OrderList from './_components/order-list'
import { getSortValues } from '@/lib/utils'

const OrdersPage = async ({ searchParams }: { searchParams?: { sort?: string } }) => {
  const { sortKey, reverse } = getSortValues(ordersSort, searchParams?.sort)

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['orders', sortKey, reverse],
    initialPageParam: '',
    queryFn: async () =>
      await getUserOrders({
        query: "return_status:'NO_RETURN'",
        reverse,
        sortKey,
      }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderList />
    </HydrationBoundary>
  )
}

export default OrdersPage
