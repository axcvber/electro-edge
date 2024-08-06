import React from 'react'
import { Accordion } from '@/components/ui/accordion'
import FilterAccordion from './filter-accordion'
import { useFilterStore } from '@/store/use-filter-store'
import { FilterX } from 'lucide-react'

const FilterList = () => {
  const data = useFilterStore((s) => s.data)

  if (data.length === 0) {
    return (
      <div className='p-6 flex items-center gap-2 text-neutral-500'>
        <FilterX className='w-5 h-5' />
        <p>No filters available</p>
      </div>
    )
  }

  return (
    <Accordion type='multiple' defaultValue={data.map((item) => item.id)}>
      {data.map((item) => (
        <FilterAccordion key={item.id} {...item} />
      ))}
    </Accordion>
  )
}

export default FilterList
