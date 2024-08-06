import Markdown from '@/components/markdown'
import React from 'react'

interface IProductDesc {
  data?: string
}

const ProductDesc: React.FC<IProductDesc> = ({ data }) => {
  if (!data) {
    return null
  }
  return (
    <div className='text-neutral-500 text-sm leading-relaxed'>
      <Markdown content={data} parseRichText={false} />
    </div>
  )
}

export default ProductDesc
