import React from 'react'
import ProductCard from '@/components/cards/product-card'
import { IReshapedProduct } from '@/lib/normalize'

interface IProductGrid {
  data: IReshapedProduct[]
}

const ProductGrid: React.FC<IProductGrid> = ({ data }) => {
  return (
    <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 items-start'>
      {data.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  )
}

export default ProductGrid
