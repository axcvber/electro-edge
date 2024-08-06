import { IReshapedVariant } from '@/lib/normalize'
import Link from 'next/link'
import React, { MouseEvent } from 'react'
import NextImage from '../ui/next-image'
import SalePercentBadge from '../product/sale-percent-badge'
import { Button } from '../ui/button'
import { useAddCartItem } from '@/hooks/cart/use-add-cart-item'
import { useUpdateWishlist } from '@/hooks/wishlist/use-update-wishlist'
import useModalStore from '@/store/use-modal-store'
import { useIsAddedToWishlist } from '@/hooks/wishlist/use-is-added-to-wishlist'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { Heart, HeartHandshake, PackageCheck, ShoppingCart } from 'lucide-react'
import StockBadge from '../product/stock-badge'
import { cn, formatPrice, getLegacyResourceId, modifyProductTitle } from '@/lib/utils'
import { useIsItemAdded } from '@/hooks/cart/use-is-item-added'

const ProductVariantCard: React.FC<IReshapedVariant> = ({
  id,
  title,
  price,
  image,
  compareAtPrice,
  availableForSale,
  quantityAvailable,
  productPath,
  productTitle,
}) => {
  const isAvailable = availableForSale
  const isEnds = quantityAvailable && quantityAvailable <= 3
  const { addCartItem, isPending: cartAdding } = useAddCartItem()
  const { updateWishlistItem, isPending: wishlistAdding } = useUpdateWishlist()
  const showModal = useModalStore((state) => state.showModal)
  const isAddedToCart = useIsItemAdded(id)
  const isAddedToWishlist = useIsAddedToWishlist(id)
  const variantId = getLegacyResourceId(id)

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    if (!isAddedToCart) {
      addCartItem(id)
    } else {
      showModal(ModalTypeEnum.CART)
    }
  }

  const handleAddToWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    updateWishlistItem(id)
  }

  return (
    <div className='w-ful bg-background border rounded-md p-4 space-y-2 transition-all duration-200 lg:hover:scale-[1.03] lg:hover:shadow-md'>
      <Link href={`/products/${productPath}/${variantId}`} className='relative group block'>
        <div className='aspect-square relative'>
          <NextImage fill src={image?.url} alt={image?.altText} className='object-contain' />
        </div>
        {compareAtPrice && <SalePercentBadge price={price.amount} compareAtPrice={compareAtPrice.amount} />}

        <div className='absolute w-full -bottom-4 left-0'>
          <div className='flex justify-end gap-2'>
            <Button
              size={'icon'}
              variant={'outline-primary'}
              className='rounded-full hover:bg-primary hover:text-primary-foreground disabled:bg-primary disabled:text-primary-foreground'
              isLoading={cartAdding}
              disabled={!isAvailable || cartAdding}
              onClick={handleAddToCart}
            >
              {isAddedToCart ? <PackageCheck /> : <ShoppingCart />}
            </Button>
            <Button
              size={'icon'}
              variant={'outline-primary'}
              className='rounded-full hover:bg-primary hover:text-primary-foreground disabled:bg-primary disabled:text-primary-foreground'
              isLoading={wishlistAdding}
              onClick={handleAddToWishlist}
            >
              {isAddedToWishlist ? <HeartHandshake /> : <Heart />}
            </Button>
          </div>
        </div>
      </Link>

      <div className='space-y-3'>
        <StockBadge isAvailable={isAvailable} isEnds={!!isEnds} />

        <div className='space-y-1'>
          <Link
            className='text-sm sm:text-base leading-5 transition-colors duration-150 hover:text-primary line-clamp-2 font-semibold font-display'
            href={`/products/${productPath}/${variantId}`}
          >
            {modifyProductTitle(productTitle, title)}
          </Link>
        </div>
        <div className='flex items-center flex-wrap'>
          <p
            className={cn(
              'font-semibold text-base sm:text-lg mr-1.5',
              compareAtPrice ? 'text-destructive' : 'text-inherit'
            )}
          >
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          {compareAtPrice && (
            <p className='font-medium text-xs text-neutral-400 line-through'>
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductVariantCard
