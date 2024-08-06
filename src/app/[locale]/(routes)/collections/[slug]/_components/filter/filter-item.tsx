import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import React from 'react'

interface IFilterItem {
  value: string
  isChecked: boolean
  count: number
  onChange: () => void
}

const FilterItem: React.FC<IFilterItem> = ({ value, count, isChecked, onChange }) => {
  return (
    <Button
      asChild
      className={cn(
        'justify-start w-full px-2 h-auto cursor-pointer',
        isChecked && 'bg-primary/10 text-primary hover:bg-primary/10'
      )}
      variant={'ghost'}
      onClick={onChange}
    >
      <div>
        <Checkbox checked={isChecked} className='border-neutral-400 data-[state=checked]:border-ring' />

        <Label className='cursor-pointer'>{value}</Label>
        <span className='ml-auto text-xs text-neutral-400 font-normal select-none'>({count})</span>
      </div>
    </Button>
  )
}

export default FilterItem
