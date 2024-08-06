import { Metaobject } from '@/gql/storefront/graphql'
import React from 'react'

interface IProductSpec {
  data: Metaobject[]
}

const ProductSpec: React.FC<IProductSpec> = ({ data }) => {
  return (
    <div className='grid lg:grid-cols-2 gap-6 items-center'>
      {data.map((item, inx) => (
        <div key={inx} className='grid grid-cols-[200px_1fr] gap-3'>
          <p className='font-bold'>{item.fields.find((item) => item.key === 'title')?.value}</p>
          <p className='text-sm text-neutral-500'>{item.fields.find((item) => item.key === 'desc')?.value}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductSpec
