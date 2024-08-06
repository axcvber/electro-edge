import { getReturnableFulfillments } from '@/actions/order/get-returnable-fulfillments'
import { notFound } from 'next/navigation'
import React from 'react'
import ReturnOrderItemsForm from './_components/return-order-items-form'
import InfoBox from '@/components/common/info-box'
import { PackageX } from 'lucide-react'
import BackButton from '@/components/back-button'

const ReturnableFulfillmentPage = async ({ params: { orderId } }: { params: { orderId?: string } }) => {
  if (!orderId) {
    notFound()
  }

  const data = await getReturnableFulfillments(orderId)

  return (
    <div className='space-y-6'>
      <BackButton />
      {!data.length ? (
        <InfoBox
          icon={<PackageX />}
          title='No returnable fulfillment available'
          desc='It looks like this order has no returnable fulfillment items.'
        />
      ) : (
        <>
          <h1 className='h3'>Select items to return</h1>
          <ReturnOrderItemsForm orderId={orderId} data={data} />
        </>
      )}
    </div>
  )
}

export default ReturnableFulfillmentPage
