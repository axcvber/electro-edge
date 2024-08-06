'use client'

import { useInitialData } from '@/hooks/use-initial-data'
import Image from 'next/image'
import React from 'react'

const Payments = () => {
  const { globalData } = useInitialData()
  const data = globalData?.fields.payment_logos

  return (
    <ul className='grid grid-cols-[38px_38px] sm:grid-cols-[38px_38px_38px_38px] gap-2 flex-wrap'>
      {data?.map((item, inx) => (
        <li key={inx}>
          <Image
            width={38}
            height={26}
            sizes='38px'
            src={item.url}
            alt={item.altText || 'Payment option'}
            className='object-contain'
          />
        </li>
      ))}
    </ul>
  )
}

export default Payments
