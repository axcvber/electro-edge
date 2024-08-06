import React from 'react'
import ProductListItem from './product-list-item'
import { IReshapedProduct } from '@/lib/normalize'

interface IProductList {
  data: IReshapedProduct[]
}

const ProductList: React.FC<IProductList> = ({ data }) => {
  return (
    <div className='space-y-3'>
      {data.map((item) => (
        <ProductListItem key={item.id} {...item} />
      ))}
    </div>
  )
}

export default ProductList
