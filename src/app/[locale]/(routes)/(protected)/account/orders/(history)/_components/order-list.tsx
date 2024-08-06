'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { Accordion } from '@/components/ui/accordion'
import { ReceiptText } from 'lucide-react'
import { ordersSort } from '@/lib/constants'
import InfoBox from '@/components/common/info-box'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from '@/components/infinite-scroll'
import { getUserOrders } from '@/actions/order/get-user-orders'
import OrderItem from './order-item'
import { useSearchParams } from 'next/navigation'

interface IOrderList {
  variant?: 'all' | 'returns'
}

const OrderList: React.FC<IOrderList> = ({ variant = 'all' }) => {
  const searchParams = useSearchParams()
  const sortBy = searchParams.get('sort')

  const { sortKey, reverse } = ordersSort.find((item) => item.slug === sortBy) || ordersSort[0]
  const queryKey = variant === 'all' ? 'orders' : 'returns'
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [queryKey, sortKey, reverse],
    throwOnError: true,
    initialPageParam: '',
    queryFn: async ({ pageParam = '' }) =>
      await getUserOrders({
        query: variant === 'returns' ? "-return_status:'NO_RETURN'" : "return_status:'NO_RETURN'",
        after: pageParam ? pageParam : undefined,
        sortKey,
        reverse,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.pageInfo.endCursor
      }
    },
  })

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array(6)
          .fill(0)
          .map((_, inx) => (
            <Skeleton key={inx} className='w-full h-[72px] rounded-md border' />
          ))}
      </div>
    )
  }

  if (data?.pages[0].orders.length === 0) {
    return (
      <InfoBox
        icon={<ReceiptText />}
        title={`You have no ${queryKey}`}
        desc={`It looks like you don't have any ${queryKey} yet.`}
      />
    )
  }

  return (
    <>
      {data?.pages.map((item, inx) => (
        <Accordion key={inx} type='multiple'>
          {item.orders.map((item) => (
            <OrderItem key={item.id} {...item} />
          ))}
        </Accordion>
      ))}
      <InfiniteScroll hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
    </>
  )
}

export default OrderList
