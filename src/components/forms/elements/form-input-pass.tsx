'use client'

import React, { useState } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormInputProps } from './form-input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

const FormInputPass: React.FC<FormInputProps> = ({ control, name, label, placeholder, disabled }) => {
  const [show, setShow] = useState(false)

  const handleShowPass = () => setShow(!show)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel required>{label}</FormLabel>
          <FormControl>
            <div className='relative overflow-hidden'>
              <Input
                error={!!error}
                placeholder={placeholder}
                type={show ? 'text' : 'password'}
                disabled={disabled}
                className='pr-10'
                {...field}
              />
              <Button
                variant={'ghost'}
                size={'icon'}
                className='absolute top-1/2 right-1 -translate-y-1/2 p-2 w-8 h-8'
                onClick={handleShowPass}
              >
                {show ? <Eye /> : <EyeOff />}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInputPass
