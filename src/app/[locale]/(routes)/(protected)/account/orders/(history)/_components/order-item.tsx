import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import NextImage from '@/components/ui/next-image'
import { cn, formatDate, formatOrderStatus, formatPrice, getCancelReasonMessage } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { ArrowsUpFromLine } from 'lucide-react'
import { Order, OrderDisplayFulfillmentStatus, OrderReturnStatus } from '@/gql/admin/graphql'
import { AppRoutes } from '@/routes'
import OrderLineItem from './order-line-item'

const OrderItem: React.FC<Order> = ({
  id,
  name,
  legacyResourceId,
  processedAt,
  cancelReason,
  cancelledAt,
  displayFulfillmentStatus,
  returnStatus,
  lineItems,
  displayFinancialStatus,
  currentSubtotalPriceSet,
  currentTotalPriceSet,
  currentTotalTaxSet,
  totalRefundedSet,
  totalShippingPriceSet,
  fulfillments,
  shippingAddress,
  email,
  phone,
  shippingLine,
}) => {
  const shippingDiscount = shippingLine?.discountAllocations[0]?.allocatedAmountSet.presentmentMoney

  const renderOrderStatus = () => {
    if (cancelReason) {
      return <p className='text-destructive font-medium'>Canceled: {getCancelReasonMessage(cancelReason)}</p>
    }

    const statusText = formatOrderStatus(displayFulfillmentStatus)
    const statusColor =
      displayFulfillmentStatus === OrderDisplayFulfillmentStatus.Fulfilled ? 'text-green-500' : 'text-amber-500'

    return <p className={cn('font-medium', statusColor)}>{statusText}</p>
  }

  const renderDeliveryAddress = () => {
    if (!shippingAddress) {
      return <p className='text-destructive'>No delivery address defined</p>
    }

    return (
      <>
        {shippingAddress ? (
          <>
            {shippingAddress.formatted && shippingAddress.formatted.map((line, inx) => <p key={line + inx}>{line}</p>)}
          </>
        ) : (
          <p className='text-destructive'>No delivery address defined</p>
        )}
      </>
    )
  }

  const renderTrackingInfo = () => {
    if (!fulfillments?.length || !fulfillments[0].trackingInfo.length) {
      return null
    }

    const trackingInfo = fulfillments[0].trackingInfo[0]

    return (
      <div>
        <p>
          {trackingInfo.company} <span className='font-semibold'>#{trackingInfo.number}</span>
        </p>
        <Button asChild variant='link'>
          <Link href={trackingInfo.url ?? '#'}>Track shipment</Link>
        </Button>
      </div>
    )
  }

  return (
    <AccordionItem value={id} className='border rounded-md my-3'>
      <AccordionTrigger className='group items-start px-4'>
        <div className='w-full grid xl:grid-cols-3 gap-3 xl:gap-6 text-sm font-normal items-center'>
          <div className='text-left'>
            <div className='flex items-center gap-2'>
              <p className='font-medium'>{name}</p>
              <span className='text-xs text-neutral-400'>on {formatDate(processedAt)}</span>
            </div>
            {returnStatus && returnStatus !== OrderReturnStatus.NoReturn && (
              <p className='text-blue-500 font-medium'>Return Status: {formatOrderStatus(returnStatus)}</p>
            )}

            {renderOrderStatus()}
          </div>
          <div className='flex gap-3 col-span-2'>
            <div className='flex flex-wrap flex-1 xl:justify-end gap-3 xl:group-data-[state=open]:opacity-0 transition-opacity'>
              {lineItems.nodes.slice(0, 3).map((item, inx) => (
                <div key={inx} className='relative w-10 h-10'>
                  <NextImage fill src={item.image?.url} alt={item.image?.altText} className='object-contain' />
                </div>
              ))}

              {lineItems.nodes.length > 3 && (
                <div className='w-[40px] h-[40px] bg-secondary flex items-center justify-center rounded-md'>
                  <span className='text-xs text-white font-medium'>+{lineItems.nodes.length - 3}</span>
                </div>
              )}
            </div>
            <div className='text-right flex-1 xl:mr-4 group-data-[state=open]:opacity-0 transition-opacity'>
              <span className='text-xs text-neutral-400'>{formatOrderStatus(displayFinancialStatus)}</span>
              <p className='font-semibold'>
                {formatPrice(
                  currentTotalPriceSet.presentmentMoney.amount,
                  currentTotalPriceSet.presentmentMoney.currencyCode
                )}
              </p>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className='px-4'>
        <div className='grid xl:grid-cols-3 gap-6'>
          <div className='space-y-3'>
            {cancelledAt && <p className='font-medium'>Cancellation date: {formatDate(cancelledAt)}</p>}
            {renderTrackingInfo()}

            {displayFulfillmentStatus === OrderDisplayFulfillmentStatus.Fulfilled && (
              <Button asChild className='w-full' variant={'secondary'}>
                <Link href={`${AppRoutes.ACCOUNT_ORDERS_RETURNABLE_FULFILLMENT}/${legacyResourceId}`}>
                  <ArrowsUpFromLine />
                  Request Return
                </Link>
              </Button>
            )}

            <div className='space-y-1'>
              <div>
                <span className='text-xs text-neutral-400'>Delivery address</span>
                {renderDeliveryAddress()}
              </div>
              <div>
                <span className='text-xs text-neutral-400'>Order recipient</span>
                <p>{shippingAddress?.name}</p>
                <p>{phone}</p>
                <p>{email}</p>
              </div>
            </div>
          </div>
          <div className='xl:col-span-2'>
            <ul>
              {lineItems.nodes.map((item, inx) => (
                <OrderLineItem key={inx} {...item} />
              ))}
            </ul>

            <div className='space-y-2 border-t pt-4'>
              <div className='flex justify-between gap-3'>
                <span>Subtotal:</span>
                <p className='text-right'>
                  {formatPrice(
                    currentSubtotalPriceSet.presentmentMoney.amount,
                    currentSubtotalPriceSet.presentmentMoney.currencyCode
                  )}
                </p>
              </div>

              {currentTotalTaxSet?.presentmentMoney.amount && currentTotalTaxSet.presentmentMoney.amount > 0 && (
                <div className='flex justify-between gap-3'>
                  <span>Taxes:</span>
                  <p className='text-right'>
                    {formatPrice(
                      currentTotalTaxSet.presentmentMoney.amount,
                      currentTotalTaxSet.presentmentMoney.currencyCode
                    )}
                  </p>
                </div>
              )}

              <div className='flex justify-between gap-3'>
                <span>Shipping:</span>
                <div className='text-right'>
                  <p className={cn(shippingDiscount && 'line-through text-xs text-neutral-400')}>
                    {formatPrice(
                      totalShippingPriceSet.presentmentMoney.amount,
                      totalShippingPriceSet.presentmentMoney.currencyCode
                    )}
                  </p>
                  {shippingDiscount && (
                    <p>
                      {formatPrice(
                        totalShippingPriceSet.presentmentMoney.amount - shippingDiscount.amount,
                        shippingDiscount.currencyCode
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex justify-between font-semibold gap-3'>
                <span>Total:</span>
                <p className='text-right'>
                  {formatPrice(
                    currentTotalPriceSet.presentmentMoney.amount,
                    currentTotalPriceSet.presentmentMoney.currencyCode
                  )}
                </p>
              </div>

              {totalRefundedSet.presentmentMoney.amount > 0 && (
                <div className='flex justify-between gap-3 text-green-500 font-medium'>
                  <span>Refunded:</span>
                  <p className='text-right'>
                    -
                    {formatPrice(
                      totalRefundedSet.presentmentMoney.amount,
                      totalRefundedSet.presentmentMoney.currencyCode
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default OrderItem
