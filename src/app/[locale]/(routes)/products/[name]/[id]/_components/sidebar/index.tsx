'use client'

import { Button } from '@/components/ui/button'
import { Heart, HeartHandshake, PackageCheck, ShoppingCart } from 'lucide-react'
import React from 'react'
import ProductVariants from './product-variants'
import AdditionalInfo from './additional-info'
import { IReshapedVariant } from '@/lib/normalize'
import { cn, formatPrice, modifyProductTitle } from '@/lib/utils'
import ProductInfo from '@/components/product/product-info'
import StockBadge from '../../../../../../../../components/product/stock-badge'
import { useAddCartItem } from '@/hooks/cart/use-add-cart-item'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { useUpdateWishlist } from '@/hooks/wishlist/use-update-wishlist'
import { useIsAddedToWishlist } from '@/hooks/wishlist/use-is-added-to-wishlist'
import { useTranslations } from 'next-intl'
import { useIsItemAdded } from '@/hooks/cart/use-is-item-added'

type IProductSidebar = Omit<IReshapedVariant, 'productId' | 'images' | 'specification' | 'descriptionHtml'>

const ProductSidebar: React.FC<IProductSidebar> = ({
  id,
  title,
  sku,
  price,
  compareAtPrice,
  selectedOptions,
  availableForSale,
  quantityAvailable,
  productPath,
  productTitle,
  productVariants,
  productOptions,
  previewInfo,
}) => {
  const isEnds = quantityAvailable && quantityAvailable <= 3
  const { addCartItem, isPending: cartAdding } = useAddCartItem()
  const { updateWishlistItem, isPending: wishlistAdding } = useUpdateWishlist()
  const showModal = useModalStore((state) => state.showModal)
  const isAddedToCart = useIsItemAdded(id)
  const isAddedToWishlist = useIsAddedToWishlist(id)
  const t = useTranslations('buttons')

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      addCartItem(id)
    } else {
      showModal(ModalTypeEnum.CART)
    }
  }

  const handleAddToWishlist = () => {
    updateWishlistItem(id)
  }

  return (
    <div className='w-full space-y-4 '>
      <h1 className='h3'>{modifyProductTitle(productTitle, title)}</h1>
      <p className='text-sm text-neutral-600 font-semibold'>Product SKU: {sku}</p>

      <StockBadge isAvailable={availableForSale} isEnds={!!isEnds} />

      <div className='flex items-center flex-wrap'>
        <p
          className={cn(
            'font-semibold text-base sm:text-2xl mr-1.5',
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

      <ProductInfo data={previewInfo} />

      <ProductVariants
        productPath={productPath}
        variants={productVariants}
        options={productOptions}
        selectedOptions={selectedOptions}
      />

      <div className='flex gap-2'>
        <Button
          onClick={handleAddToCart}
          isLoading={cartAdding}
          loadingText='Adding...'
          disabled={!availableForSale || cartAdding}
          className='px-10 w-full flex-1 md:flex-initial'
        >
          {isAddedToCart ? <PackageCheck /> : <ShoppingCart />}
          {!availableForSale ? t('sold_out') : isAddedToCart ? t('in_cart') : t('add_to_cart')}
        </Button>
        <Button isLoading={wishlistAdding} onClick={handleAddToWishlist} size={'icon'} variant={'outline-primary'}>
          {isAddedToWishlist ? <HeartHandshake /> : <Heart />}
        </Button>
      </div>

      <AdditionalInfo />
    </div>
  )
}

export default ProductSidebar
