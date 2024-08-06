import React from 'react'
import { ProductViewType } from './product-view'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface IProductsSkeleton {
  view: ProductViewType
}

const ProductsSkeleton: React.FC<IProductsSkeleton> = ({ view }) => {
  const fillCount = view === 'grid' ? 8 : 4

  return (
    <div className={cn(view === 'grid' ? 'grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3' : 'space-y-3')}>
      {Array(fillCount)
        .fill(0)
        .map((_, inx) => (
          <Skeleton key={inx} className={cn('w-full', view === 'grid' ? 'h-[340px]' : 'h-[250px]')} />
        ))}
    </div>
  )
}

export default ProductsSkeleton
