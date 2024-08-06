import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'
import { Spinner } from '../ui/spinner'

interface IQuantityCounter {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  isLoading?: boolean
}

const QuantityCounter: React.FC<IQuantityCounter> = ({ quantity, onIncrement, onDecrement, isLoading }) => {
  return (
    <div className='flex h-9'>
      <Button
        onClick={onDecrement}
        disabled={isLoading}
        size={'icon-xs'}
        className='shrink-0 text-primary'
        variant={'unstyled'}
      >
        <Minus />
      </Button>
      <div className='w-[40px] px-3 flex items-center justify-center'>
        {isLoading ? (
          <Spinner className='w-4 h-4' />
        ) : (
          <span className='w-full text-sm text-center font-semibold'>{quantity}</span>
        )}
      </div>

      <Button
        onClick={onIncrement}
        disabled={isLoading}
        size={'icon-xs'}
        className='shrink-0 text-primary'
        variant={'unstyled'}
      >
        <Plus />
      </Button>
    </div>
  )
}

export default QuantityCounter
