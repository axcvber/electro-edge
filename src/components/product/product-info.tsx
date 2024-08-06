import { Metaobject } from '@/gql/storefront/graphql'
import React from 'react'

interface IProductInfo {
  data: Metaobject[]
}

const ProductInfo: React.FC<IProductInfo> = ({ data }) => {
  return (
    <ul className='w-full text-xs space-y-2 relative '>
      {data.map((item, inx) => (
        <li key={inx} className='flex items-end'>
          <span className='flex whitespace-nowrap items-end after:mb-1 after:mx-2 after:w-full flex-1 after:border-b after:border-dashed'>
            {item.fields.find((item) => item.key === 'title')?.value}
          </span>
          <span className='text-end'>{item.fields.find((item) => item.key === 'desc')?.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default ProductInfo
