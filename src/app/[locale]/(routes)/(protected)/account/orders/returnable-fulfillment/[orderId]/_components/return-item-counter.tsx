'use client'

import { FormInputProps } from '@/components/forms/elements/form-input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import React from 'react'

interface IReturnItemQuantityCounter extends FormInputProps {
  initialQuantity: number
  onIncrement: () => void
  onDecrement: () => void
}

const ReturnItemQuantityCounter: React.FC<IReturnItemQuantityCounter> = ({
  control,
  name,
  initialQuantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
        <FormItem>
          <FormLabel required>Quantity</FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                error={!!error}
                placeholder={'placeholder'}
                value={value.toString()}
                onChange={(event) => onChange(Number(event.target.value))}
                type={'number'}
                className='pr-16'
                {...rest}
              />
              <div className='absolute top-0 right-0 h-full flex items-center gap-3 px-3'>
                <Button
                  variant={'unstyled'}
                  size={'sm'}
                  className='!h-full'
                  onClick={onDecrement}
                  disabled={value <= 1}
                >
                  <Minus />
                </Button>
                <Button
                  variant={'unstyled'}
                  size={'sm'}
                  className='!h-full'
                  onClick={onIncrement}
                  disabled={value >= initialQuantity}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default ReturnItemQuantityCounter
