import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Control } from 'react-hook-form'

export interface FormInputProps {
  control: Control<any>
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  type?: React.HTMLInputTypeAttribute
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  label,
  placeholder,
  disabled,
  required = false,
  className,
  type = 'text',
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input error={!!error} placeholder={placeholder} disabled={disabled} type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInput
