import React from 'react'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { FormInputProps } from './form-input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface IFormCheckbox extends FormInputProps {
  checkboxClassName?: string
  labelClassName?: string
}

const FormCheckbox: React.FC<IFormCheckbox> = ({
  control,
  name,
  label,
  disabled,
  labelClassName,
  checkboxClassName,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex gap-2 space-y-0'}>
          <FormControl>
            <Checkbox
              className={cn('mt-0.5', checkboxClassName)}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          {label && <FormLabel className={cn('text-xs text-neutral-500', labelClassName)}>{label}</FormLabel>}
        </FormItem>
      )}
    />
  )
}

export default FormCheckbox
