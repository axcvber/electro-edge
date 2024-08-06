'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, localesList, usePathname } from '@/navigation'
import { ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'

const LocaleMenu = () => {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('labels')
  const [currentLocale, setCurrentLocale] = useState(
    localesList.find((item) => item.locale === locale) || localesList[0]
  )

  useEffect(() => {
    const currentLocale = localesList.find((item) => item.locale === locale)
    if (currentLocale) {
      setCurrentLocale(currentLocale)
    }
  }, [locale])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'unstyled'} className='gap-2 text-sm font-normal'>
          <Image priority src={currentLocale.image} width={22} height={22} alt={currentLocale.label} />
          <span className='hidden sm:block'>{currentLocale.label}</span>
          <ChevronDown className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10}>
        <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className='space-y-1'>
          {localesList
            .filter((item) => item.locale !== locale)
            .map((item, inx) => (
              <Fragment key={item.locale}>
                {inx !== 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem asChild>
                  <Link href={pathname} locale={item.locale}>
                    <div className='flex items-center gap-2'>
                      <Image width={22} height={22} src={item.image} alt={item.label} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </Fragment>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LocaleMenu
