import React from 'react'
import { Badge } from '../ui/badge'
import { getSalePercent } from '@/lib/utils'

interface ISalePercentBadge {
  price: number
  compareAtPrice: number
}

const SalePercentBadge: React.FC<ISalePercentBadge> = ({ price, compareAtPrice }) => {
  return (
    <div className='absolute top-0 left-0'>
      <Badge className='flex' variant='destructive'>
        {getSalePercent(price, compareAtPrice)}
      </Badge>
    </div>
  )
}

export default SalePercentBadge
