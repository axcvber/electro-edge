'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { usePathname } from '@/navigation'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { AppRoutes } from '@/routes'
import useModalStore from '@/store/use-modal-store'
import { Heart, Home, LogOut, Package2, Settings, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { logout } from '@/actions/user/logout'
import UserAvatar from './user-avatar'
import { useTranslations } from 'next-intl'

const Sidebar = () => {
  const showModal = useModalStore((state) => state.showModal)
  const pathname = usePathname()
  const user = useCurrentUser()
  const t = useTranslations('links')

  const handleCartClick = () => {
    showModal(ModalTypeEnum.CART)
  }

  const handleLogoutClick = async () => {
    await logout()
  }

  const showConfirmModal = () => {
    showModal(ModalTypeEnum.CONFIRMATION, {
      title: 'Are you absolutely sure?',
      description: '',
      onConfirm: handleLogoutClick,
      loadingText: 'Logging Out...',
    })
  }

  const menuList = [
    {
      icon: <User />,
      link: AppRoutes.ACCOUNT,
      label: t('account'),
    },
    {
      icon: <Package2 />,
      link: AppRoutes.ACCOUNT_ORDERS,
      label: t('orders'),
    },
    {
      icon: <Home />,
      link: AppRoutes.ACCOUNT_ADDRESSES,
      label: t('addresses'),
    },
    {
      icon: <Heart />,
      link: AppRoutes.ACCOUNT_WISHLIST,
      label: t('wishlist'),
    },
    {
      icon: <ShoppingCart />,
      label: t('cart'),
      onClick: handleCartClick,
    },

    {
      icon: <Settings />,
      link: AppRoutes.ACCOUNT_SETTINGS,
      label: t('settings'),
    },
    {
      icon: <LogOut />,
      label: t('log_out'),
      onClick: showConfirmModal,
    },
  ]

  return (
    <aside className='w-full md:max-w-[280px] border rounded-md px-4 py-6 space-y-8 md:sticky top-[140px]'>
      <div className='flex flex-col items-center gap-4'>
        <UserAvatar />
        <div className='text-center space-y-2'>
          <p className='h4'>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='text-neutral-400 text-sm'>{user?.email}</p>
        </div>
      </div>

      <Separator />

      <ul className='space-y-1.5'>
        {menuList.map((item, inx) => (
          <li key={inx}>
            <Button
              asChild
              className={cn(
                'justify-start w-full',
                pathname === item.link && 'bg-primary/10 text-primary hover:bg-primary/10'
              )}
              variant={'ghost'}
              onClick={item.onClick}
            >
              {item.link ? (
                <Link href={item.link}>
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className='cursor-pointer'>
                  {item.icon}
                  {item.label}
                </span>
              )}
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
