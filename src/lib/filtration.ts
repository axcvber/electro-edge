import { Filter as StoreFontFilter } from '@/gql/storefront/graphql'
import { IReshapedVariant } from './normalize'

export interface Filter {
  variantOption?: {
    name: string
    value: string
  }
  price?: {
    min?: number
    max?: number
  }
  productType?: string
  available?: boolean
  productVendor?: string
  tag?: string
}

export const formatSearchParams = (searchParams: URLSearchParams) => {
  const filters: Filter[] = []

  const priceFilter: Filter = {}
  const variantOptionFilters: Filter[] = []
  const otherFilters: Filter[] = []

  for (const [key, value] of searchParams.entries()) {
    if (key === 'filter.v.price.gte') {
      priceFilter.price = { min: parseFloat(value) }
    } else if (key === 'filter.v.price.lte') {
      priceFilter.price = priceFilter.price || {}
      priceFilter.price.max = parseFloat(value)
    } else if (key.startsWith('filter.v.option')) {
      const [, , , optionName] = key.split('.')
      variantOptionFilters.push({
        variantOption: {
          name: optionName,
          value,
        },
      })
    } else if (key === 'filter.v.availability') {
      otherFilters.push({ available: value === 'true' })
    } else if (key === 'filter.p.vendor') {
      otherFilters.push({ productVendor: value })
    } else if (key === 'filter.p.product_type') {
      otherFilters.push({ productType: value })
    } else if (key === 'filter.p.tag') {
      otherFilters.push({ tag: value })
    }
  }

  if (Object.keys(priceFilter.price || {}).length > 0) {
    filters.push(priceFilter)
  }

  filters.push(...variantOptionFilters)
  filters.push(...otherFilters)

  return filters
}

export const calculateTotalProductCount = (filtersData: StoreFontFilter[], appliedFilters: Filter[]) => {
  const availabilityFilter = filtersData.find((filter) => filter.id === 'filter.v.availability')

  if (availabilityFilter) {
    const [availableCount, notAvailableCount] = getAvailableAndNotAvailableCounts(availabilityFilter.values)
    const sumCount = availableCount + notAvailableCount

    const appliedAvailabilityFilter = appliedFilters.find((filter) => filter.available !== undefined)

    return appliedAvailabilityFilter
      ? appliedAvailabilityFilter.available
        ? availableCount
        : notAvailableCount
      : sumCount
  }

  return 0
}

const getAvailableAndNotAvailableCounts = (
  values: {
    input: string
    count: number
  }[]
) => {
  const availableCount = values.find((value) => value.input.includes('"available":true'))?.count ?? 0
  const notAvailableCount = values.find((value) => value.input.includes('"available":false'))?.count ?? 0

  return [availableCount, notAvailableCount]
}

type ObjectWithStringKeys = { [key: string]: any }

export const getVariantByUrlParams = (searchParams: URLSearchParams, variants: IReshapedVariant[]) => {
  const filters = formatSearchParams(searchParams)

  const variantOptionFilters = new Map<string, string>()
  const otherFilters: ObjectWithStringKeys = {}

  filters.forEach((filter) => {
    if ('variantOption' in filter) {
      const { name, value } = filter.variantOption || { name: '', value: '' }
      if (!variantOptionFilters.has(name)) {
        variantOptionFilters.set(name, value)
      }
    } else {
      otherFilters[Object.keys(filter)[0]] = Object.values(filter)[0]
    }
  })

  const matchesSelectedOptions = (variant: IReshapedVariant) => {
    const variantOptions = new Map(
      variant.selectedOptions.map((option) => [option.name.toLowerCase(), option.value.toLowerCase()])
    )

    for (const [name, value] of variantOptionFilters) {
      const variantOptionValue = variantOptions.get(name.toLowerCase())
      if (variantOptionValue !== value.toLowerCase()) {
        return false
      }
    }

    if (otherFilters.available !== undefined && variant.availableForSale !== otherFilters.available) {
      return false
    }

    return true
  }

  return variants.find((variant) => matchesSelectedOptions(variant)) || null
}
