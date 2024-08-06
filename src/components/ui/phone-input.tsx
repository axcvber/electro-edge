'use client'

import 'react-international-phone/style.css'
import React from 'react'
import {
  CountryData,
  CountryIso2,
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone'
import { Input, InputProps } from './input'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ScrollArea } from './scroll-area'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface IPhoneInput extends Omit<InputProps, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

const PhoneInput: React.FC<IPhoneInput> = ({ className, type, error, value, onChange, ...props }) => {
  const { inputValue, country, setCountry, handlePhoneValueChange, inputRef } = usePhoneInput({
    defaultCountry: 'us',
    disableDialCodePrefill: true,
    value,
    countries: defaultCountries,
    onChange: ({ phone }) => {
      onChange(phone)
    },
  })

  return (
    <div className='flex'>
      <CountrySelect
        inputRef={inputRef}
        value={country.iso2}
        onChange={setCountry}
        options={defaultCountries}
        error={!!error}
        disabled={props.disabled}
      />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        error={!!error}
        type='tel'
        className='rounded-s-none'
        {...props}
      />
    </div>
  )
}

type CountrySelectProps = {
  value: string
  onChange: (value: CountryIso2) => void
  options: CountryData[]
  disabled?: boolean
  error?: boolean
  inputRef: React.RefObject<HTMLInputElement>
}

const CountrySelect = ({ value, onChange, options, disabled, error, inputRef }: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (country: CountryIso2) => {
    onChange(country)
    setOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role='combobox'
          aria-expanded={open}
          className={cn('flex gap-1 rounded-e-none border-r-0 pr-2 pl-3', error && 'border-destructive')}
          disabled={disabled}
        >
          <FlagImage iso2={value} />
          <ChevronsUpDown className={'!h-3 !w-3 opacity-50 shrink-0'} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align='start' className='p-0 w-[350px]  relative z-[9999999]'>
        <Command>
          <CommandInput placeholder='Search country...' />
          <ScrollArea className='h-56'>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options.map((c) => {
                const country = parseCountry(c)
                return (
                  <CommandItem key={country.iso2} value={country.name} onSelect={() => handleSelect(country.iso2)}>
                    <FlagImage iso2={country.iso2} style={{ marginRight: '8px' }} />
                    <span className='mr-2'>{country.name}</span>
                    <span className='text-neutral-400'>(+{country.dialCode})</span>
                    <Check className={cn('ml-auto h-4 w-4', country.iso2 === value ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { PhoneInput }
