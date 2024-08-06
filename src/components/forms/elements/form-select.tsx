import React, { Fragment } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormInputProps } from './form-input'
import { SelectOption } from '@/types'

interface IFormSelect extends FormInputProps {
  options: SelectOption[]
}

const FormSelect: React.FC<IFormSelect> = ({
  control,
  name,
  label,
  placeholder,
  disabled,
  required = false,
  className,
  options,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger error={!!error} disabled={disabled}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((item, inx) => (
                <Fragment key={inx}>
                  {inx !== 0 && <SelectSeparator />}
                  <SelectItem value={item.value}>{item.label}</SelectItem>
                </Fragment>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormSelect
