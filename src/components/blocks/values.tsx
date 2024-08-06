import React from 'react'
import { Image } from '@/gql/storefront/graphql'
import NextImage from '../ui/next-image'

interface ValueFields {
  items: ValueItem[]
}

interface ValueItem {
  fields: {
    title: string
    subtitle: string
    icon?: Image
  }
}

const Values: React.FC<ValueFields> = ({ items }) => {
  return (
    <div className='container my-12'>
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {items.map((item, inx) => (
          <div key={inx} className='flex items-center gap-5'>
            <div className='shrink-0 w-8 h-8 relative'>
              <NextImage fill src={item.fields.icon?.url} alt={item.fields.icon?.altText || 'icon'} />
            </div>
            <div>
              <p className='font-bold'>{item.fields.title}</p>
              <p className='text-sm'>{item.fields.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Values
