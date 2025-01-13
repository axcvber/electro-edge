import React from 'react'
import NextImage from '@/components/ui/next-image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import QuantityCounter from '../common/quantity-counter'
import { cn, formatPrice, getLegacyResourceId } from '@/lib/utils'
import { BaseCartLine } from '@/gql/storefront/graphql'
import { useRemoveCartItem } from '@/hooks/cart/use-remove-cart-item'
import { useUpdateCartItemQuantity } from '@/hooks/cart/use-update-cart-item-quantity'

const CartItem: React.FC<BaseCartLine> = ({ id: lineId, merchandise, quantity, cost }) => {
  const { title, image, price, product, id } = merchandise
  const variantId = getLegacyResourceId(id)
  const productPath = `/products/${product.handle}/${variantId}`

  const { updateQuantity, isUpdating } = useUpdateCartItemQuantity()
  const { removeCartItem, isRemoving } = useRemoveCartItem()

  const handleRemoveCartItem = () => {
    removeCartItem(lineId)
  }

  const handleChangeQuantity = (n = 1) => {
    const val = quantity + n
    updateQuantity({ lineId, quantity: val, variantId: id })
  }

  return (
    <div className='grid grid-cols-7 items-center gap-5 xl:gap-12'>
      <div className='flex items-start gap-5 flex-1 col-span-6 xl:col-span-4 col-start-1 row-start-1'>
        <Link href={productPath} className='w-[80px] h-[80px] relative'>
          <NextImage fill src={image?.url} alt={image?.altText} className='object-contain' />
        </Link>
        <div className='flex-1 space-y-1 '>
          <h3 className='!leading-6 !text-base'>
            <Link className='inline-flex transition-colors hover:text-primary' href={productPath}>
              {product.title}
            </Link>
          </h3>
          {title !== 'Default Title' && <p className='text-sm text-neutral-500'>{title}</p>}
          <div className={cn('hidden sm:block')}>
            <p className='font-medium'>{formatPrice(price.amount, price.currencyCode)}</p>
          </div>
        </div>
      </div>

      <div className='flex col-start-1 col-end-3 xl:col-start-auto xl:col-end-auto row-start-2 xl:row-start-1'>
        <QuantityCounter
          quantity={quantity}
          isLoading={isUpdating}
          onIncrement={() => handleChangeQuantity(1)}
          onDecrement={() => handleChangeQuantity(-1)}
        />
      </div>

      <div className='text-end col-start-3 col-end-8 xl:col-start-auto xl:col-end-auto row-start-2 xl:row-start-1'>
        <p className='font-medium'>{formatPrice(cost.subtotalAmount.amount, cost.subtotalAmount.currencyCode)}</p>
      </div>

      <div className='text-end col-start-6 col-end-8 row-start-1 self-start xl:self-center'>
        <Button
          aria-label='Remove'
          isLoading={isRemoving}
          onClick={handleRemoveCartItem}
          variant={'outline-destructive'}
          size={'icon-xs'}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
