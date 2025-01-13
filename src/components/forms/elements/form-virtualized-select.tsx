import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { VirtualizedCombobox, VirtualizedComboboxProps } from '@/components/ui/virtualized-combobox'
import { FormInputProps } from './form-input'

interface IFormVirtualizedSelect extends FormInputProps, VirtualizedComboboxProps {}

const FormVirtualizedSelect: React.FC<IFormVirtualizedSelect> = ({
  control,
  name,
  label,
  placeholder,
  searchPlaceholder,
  disabled,
  required = false,
  className,
  options,
  onSelectValue,
  defaultValue,
  loading,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={label} required={required}>
            {label}
          </FormLabel>
          <FormControl>
            <VirtualizedCombobox
              id={label}
              defaultValue={defaultValue}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              options={options}
              onSelectValue={onSelectValue}
              height='200px'
              disabled={disabled}
              loading={loading}
              validationError={!!error}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormVirtualizedSelect
