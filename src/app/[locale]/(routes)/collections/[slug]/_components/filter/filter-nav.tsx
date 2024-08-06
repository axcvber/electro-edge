import React from 'react'
import SortBy from '@/components/sort-by'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductViewType } from '../product/product-view'
import MobileFilter from './mobile-filter'
import AppliedFilters from './applied-filters'
import { productsSort } from '@/lib/constants'
import { useFilterStore } from '@/store/use-filter-store'
import useQueryParams from '@/hooks/use-query-params'
import { calculateTotalProductCount, formatSearchParams } from '@/lib/filtration'
import { useTranslations } from 'next-intl'

interface IFilterNav {
  view: ProductViewType
  onChangeView: (view: ProductViewType) => void
}

const FilterNav: React.FC<IFilterNav> = ({ view, onChangeView }) => {
  const filters = useFilterStore((s) => s.data)
  const { searchParams } = useQueryParams()
  const appliedFilters = formatSearchParams(searchParams)
  const totalProductCount = calculateTotalProductCount(filters, appliedFilters)
  const t = useTranslations('labels')

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-3 items-center justify-between'>
        <h6>
          {t('all_results')}: {totalProductCount}
        </h6>
        <div className='flex items-center gap-1'>
          <MobileFilter />
          <SortBy data={productsSort} />
          <Button
            size={'icon-sm'}
            variant={view === 'grid' ? 'default' : 'outline-primary'}
            onClick={() => onChangeView('grid')}
          >
            <LayoutGrid />
          </Button>
          <Button
            size={'icon-sm'}
            variant={view === 'list' ? 'default' : 'outline-primary'}
            onClick={() => onChangeView('list')}
          >
            <List />
          </Button>
        </div>
      </div>
      <AppliedFilters />
    </div>
  )
}

export default FilterNav
