'use client'

import React, { useState } from 'react'
import FilterNav from '../filter/filter-nav'
import ProductData from './product-data'

export type ProductViewType = 'grid' | 'list'

const ProductView = () => {
  const [view, setView] = useState<ProductViewType>('grid')

  const handleChangeView = (view: ProductViewType) => {
    setView(view)
  }

  return (
    <div className='w-full space-y-4'>
      <FilterNav view={view} onChangeView={handleChangeView} />
      <ProductData view={view} />
    </div>
  )
}

export default ProductView
