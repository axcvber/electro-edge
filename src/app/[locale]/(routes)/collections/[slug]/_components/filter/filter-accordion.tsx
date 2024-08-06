'use client'

import React, { useState } from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import FilterItem from './filter-item'
import { Button } from '@/components/ui/button'
import PriceRange from './price-range'
import { Filter, FilterType } from '@/gql/storefront/graphql'
import useQueryParams from '@/hooks/use-query-params'

const FilterAccordion: React.FC<Filter> = ({ id, label, type, values }) => {
  const { toggleSearchParam, hasParam } = useQueryParams()

  const limit = 10
  const [showAll, setShowAll] = useState(false)
  const [displayedItemCount, setDisplayedItemCount] = useState(limit)
  const [displayedItems, setDisplayedItems] = useState(values)
  const displayedValues = showAll ? displayedItems : displayedItems.slice(0, displayedItemCount)

  const handleShowMore = () => {
    setShowAll(!showAll)
    setDisplayedItemCount(showAll ? limit : displayedItems.length)
  }

  const handleOption = (key: string, input: string, shouldSelect: boolean) => {
    const object = JSON.parse(input)
    let value

    if (key.includes('filter.v.option')) {
      value = object.variantOption?.value
    } else if (key === 'filter.v.availability') {
      value = String(object.available)
    } else {
      value = Object.values(object)[0]
    }

    if (shouldSelect) {
      toggleSearchParam(key, value)
    } else {
      return value ? hasParam(key, value) : false
    }

    return true
  }

  const handleSearch = (search: string) => {
    setDisplayedItems(values.filter((option) => option.label.toLowerCase().includes(search.toLowerCase() ?? [])))
  }

  switch (type) {
    case FilterType.List:
      return (
        <AccordionItem value={id}>
          <AccordionTrigger className='px-2 text-primary text-sm hover:text-primary/90'>
            <p>
              {label} <span className='text-neutral-400 font-normal text-xs'>({values.length})</span>
            </p>
          </AccordionTrigger>
          <AccordionContent>
            {values.length > limit ? (
              <Command>
                <CommandInput
                  onValueChange={handleSearch}
                  className='border rounded-md'
                  placeholder='Search brands...'
                />
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className='px-0 pt-2'>
                  <div className='space-y-1'>
                    {displayedValues.map((item) => (
                      <CommandItem key={item.id} className='p-0 !bg-transparent' value={item.label}>
                        <FilterItem
                          value={item.label}
                          count={item.count}
                          isChecked={handleOption(id, item.input, false)}
                          onChange={() => handleOption(id, item.input, true)}
                        />
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </Command>
            ) : (
              <div className='space-y-1'>
                {values.map((item) => (
                  <FilterItem
                    key={item.id}
                    value={item.label}
                    count={item.count}
                    isChecked={handleOption(id, item.input, false)}
                    onChange={() => handleOption(id, item.input, true)}
                  />
                ))}
              </div>
            )}
            {displayedItems.length > limit && (
              <Button className='mx-2 text-xs underline' variant={'link'} onClick={handleShowMore}>
                {showAll ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      )

    case FilterType.PriceRange:
      return (
        <AccordionItem value={id} className='border-b-0'>
          <AccordionTrigger className='px-2 text-primary text-sm hover:text-primary/90'>{label}</AccordionTrigger>
          <AccordionContent>
            <PriceRange initialValue={values[0].input} />
          </AccordionContent>
        </AccordionItem>
      )

    default:
      return null
  }
}

export default FilterAccordion
