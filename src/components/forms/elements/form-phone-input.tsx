import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FormInputProps } from './form-input'
import { PhoneInput } from '@/components/ui/phone-input'

const FormPhoneInput: React.FC<FormInputProps> = ({
  control,
  name,
  label,
  placeholder,
  disabled,
  required = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { ref, ...rest }, fieldState: { error } }) => (
        <FormItem>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <PhoneInput error={!!error} placeholder={placeholder} disabled={disabled} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormPhoneInput
