'use client'

import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import useQueryParams from '@/hooks/use-query-params'
import { parseJsonInput } from '@/lib/utils'
import { useFilterStore } from '@/store/use-filter-store'
import React, { useEffect, useState } from 'react'

interface IPriceRange {
  initialValue: string
}

const PriceRange: React.FC<IPriceRange> = ({ initialValue }) => {
  const { searchParams, updateSearchParam } = useQueryParams()
  const defaultPriceRange = useFilterStore((s) => s.defaultPriceRange)
  const initialPriceRange = parseJsonInput(initialValue)
  const priceRangeLimits = parseJsonInput(defaultPriceRange)

  const initMinPrice = initialPriceRange?.price.min || 0
  const initMaxPrice = initialPriceRange?.price.max || 100000

  const minPrice = priceRangeLimits?.price.min || 0
  const maxPrice = priceRangeLimits?.price.max || 100000

  const minVQuery = searchParams.get('filter.v.price.gte')
  const maxVQuery = searchParams.get('filter.v.price.lte')

  const [sliderValue, setSliderValue] = useState([initMinPrice, initMaxPrice])
  const [inputValue, setInputValue] = useState([initMinPrice, initMaxPrice])

  const minInpValue = inputValue[0]
  const maxInpValue = inputValue[1]

  useEffect(() => {
    const min = minVQuery ? Number(minVQuery) : minPrice
    const max = maxVQuery ? Number(maxVQuery) : maxPrice
    handleSliderChange([min, max])
  }, [minVQuery, maxVQuery])

  const handleValueCommit = (value: number[]) => {
    updateSearchParam({
      'filter.v.price.gte': value[0].toString(),
      'filter.v.price.lte': value[1].toString(),
    })
  }

  const handleSliderChange = (newValue: number[]) => {
    setInputValue(newValue)
    setSliderValue(newValue)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setInputValue(name === 'min' ? [parseInt(value), maxInpValue] : [minInpValue, parseInt(value)])
  }

  const handleInputBlur = () => {
    let newMinValue = isNaN(minInpValue) ? minPrice : minInpValue
    let newMaxValue = isNaN(maxInpValue) ? maxPrice : maxInpValue

    if (newMinValue >= newMaxValue) {
      newMinValue = newMaxValue
    } else if (newMaxValue >= maxPrice) {
      newMaxValue = maxPrice
    }

    const newValue: number[] = [newMinValue, newMaxValue]
    setInputValue(newValue)
    setSliderValue(newValue)
    handleValueCommit(newValue)
  }

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }

  return (
    <div className='px-2'>
      <div className='flex gap-3'>
        <PriceInput name='min' value={minInpValue} onChange={handleInputChange} onKeyDown={handleEnterPress} />
        <PriceInput name='max' value={maxInpValue} onChange={handleInputChange} onKeyDown={handleEnterPress} />
      </div>
      <div className='my-6'>
        <Slider
          value={sliderValue}
          min={minPrice}
          max={maxPrice}
          onValueChange={handleSliderChange}
          onValueCommit={handleValueCommit}
          minStepsBetweenThumbs={350}
        />
      </div>
    </div>
  )
}

interface IPriceInput {
  name: string
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const PriceInput: React.FC<IPriceInput> = ({ name, value, onChange, onKeyDown }) => {
  return (
    <div className='relative flex-1'>
      <span className='absolute top-1/2 left-0 -translate-y-1/2 px-3 font-medium'>$</span>
      <Input
        name={name}
        type='number'
        value={value.toString()}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className='pl-6'
      />
    </div>
  )
}

export default PriceRange
