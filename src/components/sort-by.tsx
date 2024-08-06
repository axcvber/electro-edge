'use client'

import React, { Fragment, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ArrowDownUp, Check, ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SortFilterItem } from '@/lib/constants'
import useQueryParams from '@/hooks/use-query-params'
import { useTranslations } from 'next-intl'

interface ISortBy {
  data: SortFilterItem<any>[]
}

const SortBy: React.FC<ISortBy> = ({ data }) => {
  const { searchParams, updateSearchParam, deleteSearchParams } = useQueryParams()
  const sortBy = searchParams.get('sort')
  const defaultSort = data[0]
  const [activeSort, setActiveSort] = React.useState(sortBy || defaultSort.slug)
  const t = useTranslations()

  useEffect(() => {
    setActiveSort(sortBy || defaultSort.slug)
  }, [sortBy])

  const handleSort = (slug: string) => {
    if (activeSort !== slug) {
      if (slug === data[0].slug) {
        deleteSearchParams({ sort: undefined })
      } else {
        updateSearchParam({ sort: slug })
      }
      setActiveSort(slug)
    }
  }

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild className='lg:hidden'>
          <Button size={'icon-sm'} variant={'outline-primary'}>
            <ArrowDownUp />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t('labels.sort_by')}</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 space-y-2'>
            {data.map((item, inx) => (
              <Fragment key={item.slug}>
                {inx !== 0 && <Separator />}
                <DrawerClose asChild>
                  <Button
                    className='w-full !h-10 justify-start active:text-primary'
                    variant='unstyled'
                    onClick={() => handleSort(item.slug)}
                  >
                    {item.title}
                    {item.slug === activeSort && <Check className='ml-auto h-4 w-4' />}
                  </Button>
                </DrawerClose>
              </Fragment>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant={'outline-destructive'} className='bg-destructive/10'>
                {t('buttons.close')}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild className='hidden lg:flex'>
          <Button variant={'unstyled'} className='gap-1 text-sm mr-2 group'>
            {t('labels.sort_by')}:{' '}
            <span className='text-primary font-semibold group-hover:text-primary/80 ml-1'>
              {data.find((item) => item.slug === activeSort)?.title || defaultSort.title}
            </span>
            <ChevronDown className='w-4 h-4 text-primary group-hover:text-primary/80' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuGroup className='space-y-1'>
            {data.map((item, inx) => (
              <Fragment key={item.slug}>
                {inx !== 0 && <DropdownMenuSeparator />}
                <DropdownMenuCheckboxItem
                  checked={item.slug === activeSort}
                  onCheckedChange={() => handleSort(item.slug)}
                >
                  {item.title}
                </DropdownMenuCheckboxItem>
              </Fragment>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default SortBy
