'use client'

import React, { MouseEvent } from 'react'
import NextImage from '../ui/next-image'
import Link from 'next/link'
import { Heart, HeartHandshake, PackageCheck, ShoppingCart } from 'lucide-react'
import { cn, formatPrice, getLegacyResourceId, modifyProductTitle } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { getVariantByUrlParams } from '@/lib/filtration'
import StockBadge from '@/components/product/stock-badge'
import { IReshapedProduct } from '@/lib/normalize'
import ProductColors from '../product/product-colors'
import SalePercentBadge from '../product/sale-percent-badge'
import { useAddCartItem } from '@/hooks/cart/use-add-cart-item'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { Button } from '../ui/button'
import { useIsAddedToWishlist } from '@/hooks/wishlist/use-is-added-to-wishlist'
import { useUpdateWishlist } from '@/hooks/wishlist/use-update-wishlist'
import { useIsItemAdded } from '@/hooks/cart/use-is-item-added'

const ProductCard: React.FC<IReshapedProduct> = ({ handle, title, variants }) => {
  const searchParams = useSearchParams()
  const filteredVariant = getVariantByUrlParams(searchParams, variants)
  const selectedVariant = filteredVariant || variants[0]
  const variantId = getLegacyResourceId(selectedVariant.id)
  const isAvailable = selectedVariant.availableForSale
  const isEnds = selectedVariant.quantityAvailable && selectedVariant.quantityAvailable <= 3
  const { addCartItem, isPending: cartAdding } = useAddCartItem()
  const { updateWishlistItem, isPending: wishlistAdding } = useUpdateWishlist()
  const showModal = useModalStore((state) => state.showModal)
  const isAddedToCart = useIsItemAdded(selectedVariant.id)
  const isAddedToWishlist = useIsAddedToWishlist(selectedVariant.id)

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    if (!isAddedToCart) {
      addCartItem(selectedVariant.id)
    } else {
      showModal(ModalTypeEnum.CART)
    }
  }

  const handleAddToWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    updateWishlistItem(selectedVariant.id)
  }

  return (
    <div className='w-ful bg-background border rounded-md p-4 space-y-2 transition-all duration-200 lg:hover:scale-[1.03] lg:hover:shadow-md'>
      <Link href={`/products/${handle}/${variantId}`} className='relative group block'>
        <div className='aspect-square relative'>
          <NextImage
            fill
            priority
            src={selectedVariant.image?.url}
            alt={selectedVariant.image?.altText}
            className='object-contain'
          />
        </div>
        {selectedVariant.compareAtPrice && (
          <SalePercentBadge
            price={selectedVariant.price.amount}
            compareAtPrice={selectedVariant.compareAtPrice.amount}
          />
        )}

        <div className='w-full absolute -bottom-4 left-0'>
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

        <ProductColors handle={handle} variants={variants} selectedVariantColorHex={selectedVariant.colorHex?.value} />

        <div className='space-y-1'>
          <Link
            className='text-sm sm:text-base leading-5 transition-colors duration-150 hover:text-primary line-clamp-3 font-semibold font-display'
            href={`/products/${handle}/${variantId}`}
          >
            {modifyProductTitle(title, selectedVariant.title)}
          </Link>
        </div>
        <div className='flex items-center flex-wrap'>
          <p
            className={cn(
              'font-semibold text-base sm:text-lg mr-1.5',
              selectedVariant.compareAtPrice ? 'text-destructive' : 'text-inherit'
            )}
          >
            {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
          </p>
          {selectedVariant.compareAtPrice && (
            <p className='font-medium text-xs text-neutral-400 line-through'>
              {formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
