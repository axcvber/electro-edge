import { Badge } from '@/components/ui/badge'
import NextImage from '@/components/ui/next-image'
import { LineItem } from '@/gql/admin/graphql'
import { cn, formatPrice } from '@/lib/utils'
import { TicketPercent } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const OrderLineItem: React.FC<LineItem> = ({
  title,
  variant,
  variantTitle,
  product,
  image,
  quantity,
  discountedTotalSet,
  discountAllocations,
}) => {
  const productPath = `/products/${product?.handle}/${variant?.legacyResourceId}`
  const allocatedAmount = discountAllocations[0]?.allocatedAmountSet?.presentmentMoney

  const renderUnitPrice = () => {
    const unitPrice = discountedTotalSet.presentmentMoney.amount / quantity
    const discountedUnitPrice = allocatedAmount
      ? (discountedTotalSet.presentmentMoney.amount - allocatedAmount.amount) / quantity
      : unitPrice

    return (
      <div>
        <p className={cn(allocatedAmount && 'line-through text-xs text-neutral-400')}>
          {formatPrice(unitPrice, discountedTotalSet.presentmentMoney.currencyCode)}
        </p>
        {allocatedAmount && <p>{formatPrice(discountedUnitPrice, allocatedAmount.currencyCode)}</p>}
      </div>
    )
  }

  const renderTotalPrice = () => (
    <div className='font-medium text-right flex-1 hidden xl:block'>
      <p className={cn(allocatedAmount && 'line-through text-xs text-neutral-400')}>
        {formatPrice(discountedTotalSet.presentmentMoney.amount, discountedTotalSet.presentmentMoney.currencyCode)}
      </p>
      {allocatedAmount && <p>{formatPrice(allocatedAmount.amount, allocatedAmount.currencyCode)}</p>}
    </div>
  )

  return (
    <li className='flex items-start gap-3 text-sm py-4 border-t xl:first:border-t-0 xl:first:pt-0'>
      <Link href={productPath} className='flex relative shrink-0 w-16 h-16'>
        <NextImage fill src={image?.url} alt={image?.altText} className='object-contain' />
      </Link>
      <div className='flex flex-col gap-1 xl:gap-6 xl:flex-row w-full'>
        <div className='gap-1 flex-1 flex flex-col items-start'>
          <Link href={productPath} className='hover:underline'>
            {title}
          </Link>
          <span className='text-xs text-neutral-400'>{variantTitle}</span>
          {allocatedAmount && (
            <Badge variant='outline'>
              <TicketPercent className='w-3.5 h-3.5' />
              (-{formatPrice(allocatedAmount.amount, allocatedAmount.currencyCode)})
            </Badge>
          )}
        </div>

        <div className='flex flex-1 gap-6 items-start'>
          <div className='flex gap-3 items-end'>
            {renderUnitPrice()}
            <span className='font-medium'>(x{quantity})</span>
          </div>
          {renderTotalPrice()}
        </div>
      </div>
    </li>
  )
}

export default OrderLineItem
