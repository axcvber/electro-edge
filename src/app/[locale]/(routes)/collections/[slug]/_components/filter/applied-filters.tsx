'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CurrencyCode } from '@/gql/storefront/graphql'
import useQueryParams from '@/hooks/use-query-params'
import { Filter, formatSearchParams } from '@/lib/filtration'
import { formatPrice } from '@/lib/utils'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

const AppliedFilters = () => {
  const { searchParams, clearAllParams, deleteSearchParams } = useQueryParams()
  const filters = formatSearchParams(searchParams)
  const t = useTranslations()

  const handleRemoveParam = ({ variantOption, price, productType, available, productVendor, tag }: Filter) => {
    const filterParams: Record<string, string | string[] | undefined> = {}

    if (variantOption) {
      const key = `filter.v.option.${variantOption.name}`
      filterParams[key] = variantOption.value
    } else if (price) {
      const minKey = 'filter.v.price.gte'
      const maxKey = 'filter.v.price.lte'
      filterParams[minKey] = price.min?.toString()
      filterParams[maxKey] = price.max?.toString()
    } else if (productType) {
      const key = 'filter.p.product_type'
      filterParams[key] = productType
    } else if (available !== undefined) {
      const key = 'filter.v.availability'
      filterParams[key] = available.toString()
    } else if (productVendor) {
      const key = 'filter.p.vendor'
      filterParams[key] = productVendor
    } else if (tag) {
      const key = 'filter.p.tag'
      filterParams[key] = tag
    }

    deleteSearchParams(filterParams)
  }

  if (filters.length === 0) {
    return null
  }

  return (
    <div className='space-y-3 hidden lg:block'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-neutral-500'>
          {t('labels.applied_filters')}: ({filters.length})
        </span>
        <Button variant={'link'} className='underline' onClick={clearAllParams}>
          {t('links.clear_all')}
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {filters.map((filter, inx) => (
          <FilterBadge key={inx} filter={filter} onRemove={handleRemoveParam} />
        ))}
      </div>
    </div>
  )
}

const FilterBadge: React.FC<{ filter: Filter; onRemove: (filter: Filter) => void }> = ({ filter, onRemove }) => {
  const { variantOption, price, productType, available, productVendor, tag } = filter

  let badgeText = ''

  if (variantOption) {
    badgeText = variantOption.value
  } else if (price?.min !== undefined && price.max !== undefined) {
    badgeText = `${formatPrice(price.min, CurrencyCode.Usd)} - ${formatPrice(price.max, CurrencyCode.Usd)}`
  } else if (productType) {
    badgeText = productType
  } else if (available !== undefined) {
    badgeText = available ? 'In Stock' : 'Out of Stock'
  } else if (productVendor) {
    badgeText = productVendor
  } else if (tag) {
    badgeText = tag
  }

  return (
    <Badge variant='default' className='gap-1 py-1'>
      {badgeText}
      <X className='w-3 h-3 cursor-pointer hover:text-white/80' onClick={() => onRemove(filter)} />
    </Badge>
  )
}

export default AppliedFilters
