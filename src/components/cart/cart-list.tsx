import React from 'react'
import CartItem from './cart-item'
import { Separator } from '../ui/separator'
import { BaseCartLine } from '@/gql/storefront/graphql'
import Image from 'next/image'
import { ScrollArea } from '../ui/scroll-area'

interface ICartList {
  data?: BaseCartLine[]
}

const CartList: React.FC<ICartList> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className='w-full h-full flex justify-center items-center flex-col gap-3'>
        <Image src={'/empty.png'} width={80} height={80} alt='Empty' />
        <p className='font-medium'>Your cart is empty</p>
      </div>
    )
  }

  return (
    <ScrollArea className='h-full px-6'>
      <div className='my-5 space-y-5'>
        {data?.map((item, inx) => (
          <React.Fragment key={inx}>
            {inx !== 0 && <Separator />}
            <CartItem {...item} />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

export default CartList
