'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePathname } from '@/navigation'
import { AppRoutes } from '@/routes'
import { ArchiveX, Package } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

const tabsList = [
  {
    icon: <Package />,
    link: AppRoutes.ACCOUNT_ORDERS,
    label: 'all_orders',
  },
  {
    icon: <ArchiveX />,
    link: AppRoutes.ACCOUNT_ORDERS_RETURNS,
    label: 'returns',
  },
]

const OrderTabs = () => {
  const pathname = usePathname()
  const t = useTranslations('order')

  return (
    <ul className='flex gap-4 border-b'>
      {tabsList.map((item, inx) => (
        <li key={inx}>
          <Button
            asChild
            className={cn(
              'text-neutral-400 flex !py-2 !px-1 font-semibold border-b-2 h-full border-transparent hover:border-b-primary hover:text-primary',
              pathname === item.link && 'text-primary border-b-primary'
            )}
            variant={'unstyled'}
          >
            <Link href={item.link}>
              {item.icon}
              {t(item.label)}
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  )
}

export default OrderTabs
