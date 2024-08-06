'use client'

import { Button } from '@/components/ui/button'
import NextImage from '@/components/ui/next-image'
import { Heart, HeartHandshake, PackageCheck, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { IReshapedProduct } from '@/lib/normalize'
import { useSearchParams } from 'next/navigation'
import { getVariantByUrlParams } from '@/lib/filtration'
import { cn, formatPrice, getLegacyResourceId, modifyProductTitle } from '@/lib/utils'
import StockBadge from '@/components/product/stock-badge'
import ProductInfo from '@/components/product/product-info'
import ProductColors from '@/components/product/product-colors'
import SalePercentBadge from '@/components/product/sale-percent-badge'
import { useAddCartItem } from '@/hooks/cart/use-add-cart-item'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { useUpdateWishlist } from '@/hooks/wishlist/use-update-wishlist'
import { useIsAddedToWishlist } from '@/hooks/wishlist/use-is-added-to-wishlist'
import { useTranslations } from 'next-intl'
import { useIsItemAdded } from '@/hooks/cart/use-is-item-added'

const ProductListItem: React.FC<IReshapedProduct> = ({ handle, title, variants }) => {
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
  const t = useTranslations('buttons')

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      addCartItem(selectedVariant.id)
    } else {
      showModal(ModalTypeEnum.CART)
    }
  }

  const handleAddToWishlist = () => {
    updateWishlistItem(selectedVariant.id)
  }

  return (
    <div
      className={
        'w-ful grid md:grid-cols-3 bg-background border rounded-md p-5 gap-4 transition-all duration-200 lg:hover:scale-[1.03] lg:hover:shadow-lg'
      }
    >
      <div className='flex flex-col md:flex-col xl:flex-row col-span-2 gap-8'>
        <div className='space-y-3'>
          <Link href={`/products/${handle}/${variantId}`} className='flex flex-col items-center gap-4 relative'>
            <div className='aspect-square w-[80%] sm:w-[50%] md:w-40 relative'>
              <NextImage
                fill
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
          </Link>
          <div className='flex justify-center'>
            <ProductColors
              handle={handle}
              variants={variants}
              selectedVariantColorHex={selectedVariant.colorHex?.value}
            />
          </div>
        </div>

        <div className='w-full space-y-3'>
          <div className='space-y-2'>
            <StockBadge isAvailable={isAvailable} isEnds={!!isEnds} />
            <Link
              className='leading-5 transition-colors duration-150 hover:text-primary line-clamp-2 font-semibold font-display'
              href={`/products/${handle}/${variantId}`}
            >
              {modifyProductTitle(title, selectedVariant.title)}
            </Link>
            <ProductInfo data={selectedVariant.previewInfo} />
          </div>
        </div>
      </div>

      <div className='w-full col-span-2 md:col-span-1 space-y-5 md:border-l border-dashed md:pl-8'>
        <p className='text-xs text-neutral-600 font-semibold'>Product SKU: {selectedVariant.sku}</p>

        <div className='space-y-1'>
          <p className='text-xs text-neutral-400 font-medium'>Price:</p>
          <div>
            <p
              className={cn(
                'font-semibold text-lg',
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

        <div className='flex flex-wrap gap-2'>
          <Button
            className='flex-1'
            onClick={handleAddToCart}
            isLoading={cartAdding}
            loadingText='Adding...'
            disabled={!isAvailable || cartAdding}
          >
            {isAddedToCart ? <PackageCheck /> : <ShoppingCart />}
            {!isAvailable ? t('sold_out') : isAddedToCart ? t('in_cart') : t('add_to_cart')}
          </Button>
          <Button onClick={handleAddToWishlist} isLoading={wishlistAdding} size={'icon'} variant={'outline-primary'}>
            {isAddedToWishlist ? <HeartHandshake /> : <Heart />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductListItem
