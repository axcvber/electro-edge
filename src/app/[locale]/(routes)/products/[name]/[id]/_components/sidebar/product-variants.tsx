'use client'

import React, { useEffect, useState } from 'react'
import ColorCircle from '@/components/common/color-circle'
import VariantButton from '@/components/product/variant-button'
import { ProductOption, SelectedOption } from '@/gql/storefront/graphql'
import { IReshapedVariant } from '@/lib/normalize'
import { ProductChoices, getLegacyResourceId, getSelectedVariant } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface IProductVariants {
  productPath: string
  variants: IReshapedVariant[]
  selectedOptions: SelectedOption[]
  options: ProductOption[]
}

const ProductVariants: React.FC<IProductVariants> = ({ productPath, variants, selectedOptions, options }) => {
  const defaultChoices = getDefaultChoices(selectedOptions)
  const [choices, setChoices] = useState<ProductChoices>(defaultChoices)
  const selectedVariant = getSelectedVariant(variants, choices)
  const variantId = getLegacyResourceId(selectedVariant?.id)
  const router = useRouter()

  useEffect(() => {
    router.push(`/products/${productPath}/${variantId}`)
  }, [variantId])

  const handleOptionSelect = (name: string, value: string) => {
    setChoices((prevChoices) => ({
      ...prevChoices,
      [name.toLowerCase()]: value.toLowerCase(),
    }))
  }

  return (
    <div className='space-y-4'>
      {options.map((option) => (
        <div key={option.id} className='space-y-2'>
          <span className='font-semibold text-sm'>
            {option.name} ({getSelectedOptionValue(selectedOptions, option.name)})
          </span>
          <div className='flex flex-wrap gap-3'>
            {option.name === 'Color' || option.name === 'Couleur'
              ? renderColorCircles(option, selectedOptions, variants, handleOptionSelect)
              : renderVariantButtons(option, selectedOptions, handleOptionSelect)}
          </div>
        </div>
      ))}
    </div>
  )
}

const renderVariantButtons = (
  option: ProductOption,
  selectedOptions: SelectedOption[],
  onOptionSelect: (name: string, value: string) => void
) => {
  return option.values.map((optValue) => {
    const isSelected = isOptionSelected(selectedOptions, option.name, optValue)

    return (
      <VariantButton
        key={`${option.id}-${optValue}`}
        label={optValue}
        isSelected={isSelected}
        onClick={() => onOptionSelect(option.name, optValue)}
      />
    )
  })
}

const renderColorCircles = (
  option: ProductOption,
  selectedOptions: SelectedOption[],
  variants: IReshapedVariant[],
  onOptionSelect: (name: string, value: string) => void
) => {
  return option.values.map((optValue) => {
    const variant = getVariantByOption(variants, option.name, optValue)
    const colorHex = variant?.colorHex?.value
    const isSelected = isOptionSelected(selectedOptions, option.name, optValue)

    return (
      <ColorCircle
        key={`${option.id}-${optValue}`}
        color={colorHex}
        isSelected={isSelected}
        isLarge
        onClick={() => onOptionSelect(option.name, optValue)}
      />
    )
  })
}

const getDefaultChoices = (selectedOptions: SelectedOption[]) =>
  selectedOptions.reduce(
    (obj, item) => ({
      ...obj,
      [item.name.toLocaleLowerCase()]: item.value.toLocaleLowerCase(),
    }),
    {}
  )

const getSelectedOptionValue = (selectedOptions: SelectedOption[], optionName: string) =>
  selectedOptions.find((option) => option.name === optionName)?.value

const getVariantByOption = (variants: IReshapedVariant[], optionName: string, optionValue: string) =>
  variants.find((v) =>
    v.selectedOptions.find(
      (o) => o.name.toLowerCase() === optionName.toLowerCase() && o.value.toLowerCase() === optionValue.toLowerCase()
    )
  )

const isOptionSelected = (selectedOptions: SelectedOption[], optionName: string, optionValue: string) => {
  const selectedOption = selectedOptions.find((o) => o.name.toLocaleLowerCase() === optionName.toLocaleLowerCase())
  return selectedOption && selectedOption.value.toLocaleLowerCase() === optionValue.toLocaleLowerCase()
}

export default ProductVariants
