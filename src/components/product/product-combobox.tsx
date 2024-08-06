'use client'

import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import { Product } from '@/gql/storefront/graphql'
import Link from 'next/link'
import NextImage from '../ui/next-image'
import { Command as CommandPrimitive } from 'cmdk'
import { Skeleton } from '../ui/skeleton'
import { useTranslations } from 'next-intl'
import { getLegacyResourceId } from '@/lib/utils'

interface ProductComboboxProps {
  items: Product[]
  isLoading: boolean
  isActive: boolean
  onSearchChange: (value: string) => void
}

const ProductCombobox: React.FC<ProductComboboxProps> = ({ items, isLoading, isActive, onSearchChange }) => {
  const [open, setOpen] = useState(isActive)
  const t = useTranslations('placeholders')

  const handleOnSearchChange = useDebouncedCallback((value: string) => {
    onSearchChange(value)
  }, 300)

  useEffect(() => {
    setOpen(isActive)
  }, [isActive])

  return (
    <Popover open={open} modal={false} onOpenChange={setOpen}>
      <Command>
        <PopoverTrigger className='outline-none' onClick={(e) => (isActive && !open ? () => {} : e.preventDefault())}>
          <CommandInput
            className='h-10 border-b-0'
            placeholder={`${t('search_products')}...`}
            onValueChange={handleOnSearchChange}
          />
        </PopoverTrigger>

        <PopoverContent className='p-0 space-y-12' onOpenAutoFocus={(e) => e.preventDefault()}>
          <ScrollArea className='h-[300px] overflow-auto'>
            {isLoading && (
              <CommandPrimitive.Loading>
                <div className='p-1 space-y-2'>
                  {Array(6)
                    .fill(0)
                    .map((_, inx) => (
                      <Skeleton key={inx} className={'w-full h-12'} />
                    ))}
                </div>
              </CommandPrimitive.Loading>
            )}

            {items.length > 0 && !isLoading && (
              <CommandGroup>
                <div className='space-y-2'>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.handle}/${getLegacyResourceId(item.variants.nodes[0].id)}`}
                      className='block'
                    >
                      <CommandItem
                        className='gap-2 items-start border rounded-md cursor-pointer'
                        value={item.title.replace(/"/g, '&quot;')}
                        onSelect={() => setOpen(false)}
                      >
                        <div className='w-[35px] h-[35px] relative shrink-0'>
                          <NextImage
                            fill
                            priority
                            src={item.featuredImage?.url}
                            alt={item.featuredImage?.altText}
                            className='object-contain'
                          />
                        </div>

                        <p className='font-medium'>{item.title.replace(/"/g, '&quot;')}</p>
                      </CommandItem>
                    </Link>
                  ))}
                </div>
              </CommandGroup>
            )}

            {!isLoading && items.length === 0 && (
              <div className='p-6 text-center text-sm text-neutral-500'>No results found.</div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Command>
    </Popover>
  )
}

export default ProductCombobox
