'use client'

import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn, filterMenuItemsByUrl, replaceShopifyLink } from '@/lib/utils'
import { MenuItem } from '@/gql/storefront/graphql'
import { Link } from '@/navigation'
import CatalogButton from './catalog-button'
import SocialIcons from '@/components/social-icons'
import { Menu, User } from 'lucide-react'
import { ActionItem } from './nav-actions'
import UserAvatar from '@/components/common/user-avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { AppRoutes } from '@/routes'
import useModalStore from '@/store/use-modal-store'
import { usePathname, useRouter } from 'next/navigation'
import { ModalTypeEnum } from '@/providers/modal-provider'

const MobileMenu: React.FC<{ mainMenu: MenuItem[]; catalogMenu: MenuItem[] }> = ({ mainMenu, catalogMenu }) => {
  const showModal = useModalStore((state) => state.showModal)
  const [open, setOpen] = useState(false)
  const user = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()

  const leftSideItems = filterMenuItemsByUrl(mainMenu, '#left')
  const rightSideItems = filterMenuItemsByUrl(mainMenu, '#right')
  const allMenuItems = [...leftSideItems, ...rightSideItems]

  const handleCloseMenu = () => {
    setOpen(false)
  }

  const handleAccountClick = () => {
    if (user) {
      router.replace(AppRoutes.ACCOUNT)
    } else {
      showModal(ModalTypeEnum.LOGIN)
    }
  }

  useEffect(() => {
    handleCloseMenu()
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='lg:hidden text-primary-foreground'>
        <Menu />
      </SheetTrigger>
      <SheetContent className='w-[350px] flex flex-col'>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className='flex-1'>
          <ul className='space-y-3'>
            <CatalogButton catalogMenu={catalogMenu} onClick={handleCloseMenu} />
            {allMenuItems.map((item) => (
              <li key={item.id} className='ml-1'>
                <MenuLink label={item.title} link={replaceShopifyLink(item.url)} onCloseMenu={handleCloseMenu} />
              </li>
            ))}
          </ul>
        </div>
        <div className='flex justify-between gap-3'>
          <ActionItem
            icon={user?.email ? <UserAvatar /> : <User />}
            label={''}
            text={''}
            onClick={handleAccountClick}
          />
          <SocialIcons />
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface IMenuLink {
  link: string
  label: string
  onCloseMenu: () => void
}

const MenuLink: React.FC<IMenuLink> = ({ link, label, onCloseMenu }) => {
  const pathname = usePathname()
  return (
    <Link
      aria-current={pathname === link ? 'page' : undefined}
      href={link}
      className={cn('text-sm font-medium active:text-primary', pathname === link && 'text-primary')}
      onClick={onCloseMenu}
    >
      {label}
    </Link>
  )
}

export default MobileMenu
