import { ordersSort } from '@/lib/constants'
import SortBy from '@/components/sort-by'
import OrderTabs from './_components/order-tabs'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <h1 className='h3'>Order History</h1>
        <SortBy data={ordersSort} />
      </div>
      <OrderTabs />
      <div className='w-full mt-6'>{children}</div>
    </section>
  )
}
