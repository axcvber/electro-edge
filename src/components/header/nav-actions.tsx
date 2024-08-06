'use client'

import React, { ReactNode } from 'react'
import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import { Separator } from '../ui/separator'
import { useRouter } from '@/navigation'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'
import { useCurrentUser } from '@/hooks/use-current-user'
import { AppRoutes } from '@/routes'
import { useCart } from '@/hooks/cart/use-cart'
import { formatPrice } from '@/lib/utils'
import { useWishlistCount } from '@/hooks/wishlist/use-wishlist-count'
import { useTranslations } from 'next-intl'
import { CurrencyCode } from '@/gql/storefront/graphql'
import UserAvatar from '../common/user-avatar'

const NavActions = () => {
  const showModal = useModalStore((state) => state.showModal)
  const { wishlistCount } = useWishlistCount()
  const t = useTranslations('labels')
  const user = useCurrentUser()
  const { cart } = useCart()
  const router = useRouter()

  const subtotalCartAmount = cart?.cost.subtotalAmount.amount || 0
  const cartCurrencyCode = cart?.cost.subtotalAmount.currencyCode || CurrencyCode.Usd

  const handleWishlistClick = () => {
    router.push(AppRoutes.ACCOUNT_WISHLIST)
  }

  const handleCartClick = () => {
    showModal(ModalTypeEnum.CART)
  }

  const handleAccountClick = () => {
    if (user) {
      router.replace(AppRoutes.ACCOUNT)
    } else {
      showModal(ModalTypeEnum.LOGIN)
    }
  }

  const handleSearchClick = () => {
    showModal(ModalTypeEnum.SEARCH)
  }

  return (
    <div className='flex gap-5 text-primary-foreground items-center'>
      <div className='lg:hidden hover:opacity-85 transition-opacity' onClick={handleSearchClick}>
        <Search className='w-6 h-6' />
      </div>

      <ActionItem
        icon={<Heart />}
        label={t('wishlist')}
        text={`${wishlistCount} items`}
        count={wishlistCount}
        onClick={handleWishlistClick}
      />
      <Separator orientation='vertical' className='h-5 hidden lg:block' />

      <ActionItem
        icon={<ShoppingCart />}
        label={t('cart')}
        text={formatPrice(subtotalCartAmount, cartCurrencyCode)}
        count={cart?.totalQuantity}
        onClick={handleCartClick}
      />

      <Separator orientation='vertical' className='h-5 hidden lg:block' />

      <div className='hidden sm:block'>
        <ActionItem
          icon={user?.email ? <UserAvatar /> : <User />}
          label={t('user')}
          text={user?.firstName ? user.firstName : t('account')}
          onClick={handleAccountClick}
        />
      </div>
    </div>
  )
}

interface IActionItem {
  icon: ReactNode
  label: string
  text: string
  count?: number
  onClick: () => void
}

export const ActionItem: React.FC<IActionItem> = ({ icon, label, text, count, onClick }) => {
  return (
    <div
      className='flex relative items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity'
      onClick={onClick}
    >
      <div className='relative [&_svg]:w-6 [&_svg]:h-6'>
        {!!count && (
          <div
            className={`
              absolute 
              -top-1 
              -right-2 
              w-4
              h-4
              rounded-full
              inline-flex
              items-center
              justify-center
              bg-secondary 
              text-[10px]
              leading-5
              overflow-hidden
              `}
          >
            {count}
          </div>
        )}
        {icon}
      </div>

      <div className='hidden lg:block'>
        <p className='text-sm'>{label}</p>
        <span className='font-semibold whitespace-nowrap'>{text}</span>
      </div>
    </div>
  )
}

export default NavActions
