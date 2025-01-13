import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Spinner } from './spinner'
import { SelectOption } from '@/types'

export interface VirtualizedComboboxProps {
  options: SelectOption[]
  onSelectValue: (data: SelectOption) => void
  placeholder?: string
  searchPlaceholder?: string
  height?: string
  defaultValue?: string
  validationError?: boolean
  disabled?: boolean
  loading?: boolean
  id?: string
}

export function VirtualizedCombobox({
  options,
  onSelectValue,
  defaultValue = '',
  placeholder,
  searchPlaceholder = 'Search items...',
  height = '300px',
  disabled,
  validationError,
  loading,
  id,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const [selectedOption, setSelectedOption] = React.useState<string>(defaultValue)

  React.useEffect(() => {
    setSelectedOption(defaultValue)
  }, [defaultValue])

  const handleSelectValue = ({ value, label }: SelectOption) => {
    setSelectedOption(value)
    onSelectValue({ label, value })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={validationError ? 'outline-destructive' : 'outline'}
          role='combobox'
          aria-expanded={open}
          className='justify-between w-full'
          disabled={disabled || loading}
        >
          <span className='line-clamp-1'>
            {options.find((option) => option.value === selectedOption)?.label || placeholder}
          </span>

          {loading ? (
            <Spinner className='ml-2 h-4 w-4 shrink-0 opacity-50 text-inherit' />
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <VirtualizedCommand
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption}
          onSelectOption={handleSelectValue}
        />
      </PopoverContent>
    </Popover>
  )
}

interface VirtualizedCommandProps {
  height: string
  options: SelectOption[]
  placeholder: string
  selectedOption: string
  onSelectOption: (option: SelectOption) => void
  isLoading?: boolean
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedOption,
  onSelectOption,
  isLoading,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] = React.useState<SelectOption[]>(options)
  const parentRef = React.useRef(null)

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  })

  const virtualOptions = virtualizer.getVirtualItems()

  const handleSearch = (search: string) => {
    setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase() ?? [])))
  }

  return (
    <Command shouldFilter={false}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandGroup
        ref={parentRef}
        className='no-scrollbar'
        style={{
          height: height,
          width: '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {isLoading && virtualOptions.length == 0 ? (
            <div className='flex justify-center items-center py-6'>
              <Spinner size={'xs'} className='text-neutral-300' />
            </div>
          ) : (
            <CommandEmpty>No item found.</CommandEmpty>
          )}

          {virtualOptions.map((virtualOption) => (
            <CommandItem
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualOption.size}px`,
                transform: `translateY(${virtualOption.start}px)`,
              }}
              key={filteredOptions[virtualOption.index].value}
              value={filteredOptions[virtualOption.index].value}
              onSelect={() => {
                onSelectOption({
                  value: filteredOptions[virtualOption.index].value,
                  label: filteredOptions[virtualOption.index].label,
                })
              }}
            >
              <span className='line-clamp-1'>{filteredOptions[virtualOption.index].label}</span>
              <Check
                className={cn(
                  'ml-auto h-4 w-4',
                  selectedOption === filteredOptions[virtualOption.index].value ? 'opacity-100' : 'opacity-0'
                )}
              />
            </CommandItem>
          ))}
        </div>
      </CommandGroup>
    </Command>
  )
}
