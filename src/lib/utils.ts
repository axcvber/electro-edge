import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { locales } from '@/navigation'
import { Path, UseFormSetError } from 'react-hook-form'
import { ZodIssue } from 'zod'
import { CurrencyCode, MenuItem, OrderCancelReason } from '@/gql/storefront/graphql'
import { SortFilterItem } from './constants'
import { ReturnReason } from '@/gql/admin/graphql'
import { IReshapedVariant } from './normalize'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePathnameRegex = (routes: string[]) => {
  return new RegExp(
    `^(/(${locales.join('|')}))?(${routes.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?$`,
    'i'
  )
}

export const getErrorMessage = (error: unknown): string => {
  let message: string
  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong'
  }
  return message
}

export const setFormErrors = <T extends object>(errors: ZodIssue[], setError: UseFormSetError<T>) => {
  errors.forEach(({ path, message, code }) => {
    const formFieldName = path.join('.') as Path<T>
    setError(formFieldName, { type: code, message })
  })
}

export function formatDate(dateString?: string) {
  if (!dateString) {
    return null
  }
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

export function formatOrderStatus(str?: string | null) {
  if (!str) {
    return null
  }
  const words = str.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  return words.join(' ')
}

export function getCancelReasonMessage(str: OrderCancelReason) {
  switch (str) {
    case OrderCancelReason.Customer:
      return 'The customer wanted to cancel the order.'
    case OrderCancelReason.Declined:
      return 'Payment was declined.'
    case OrderCancelReason.Fraud:
      return 'The order was fraudulent.'
    case OrderCancelReason.Inventory:
      return 'There was insufficient inventory.'
    case OrderCancelReason.Other:
      return 'The order was canceled for an unlisted reason.'
    case OrderCancelReason.Staff:
      return 'Staff made an error.'
    default:
      return ''
  }
}

export function formatPrice(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export const getSalePercent = (discountPrice: number, fullPrice: number) => {
  return Math.floor(((discountPrice - fullPrice) / fullPrice) * 100) + '%'
}

export const getSortValues = (sortArr: SortFilterItem<any>[], slug?: string | null) => {
  const sortItem = sortArr.find((item) => item.slug === slug) || sortArr[0]
  return {
    sortKey: sortItem.sortKey,
    reverse: sortItem.reverse,
  }
}

export function convertToURLSearchParams(searchParams?: {
  [key: string]: string | string[] | undefined
}): URLSearchParams {
  const urlSearchParams = new URLSearchParams()

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          urlSearchParams.append(key, v)
        }
      } else if (value !== undefined) {
        urlSearchParams.append(key, value)
      }
    }
  }

  return urlSearchParams
}

export const parseJsonInput = (input?: string) => {
  if (!input) {
    return null
  }
  const parsedInput = JSON.parse(input.replace(/\\"/g, '"'))

  if (
    parsedInput &&
    typeof parsedInput === 'object' &&
    parsedInput.price &&
    typeof parsedInput.price === 'object' &&
    typeof parsedInput.price.min === 'number' &&
    typeof parsedInput.price.max === 'number'
  ) {
    const { min, max } = parsedInput.price
    return { price: { min, max } }
  }

  return null
}

export const modifyProductTitle = (productTitle: string, variantTitle: string) => {
  const modifyVariantTitle = (title: string) => {
    if (title.includes('Default Title')) {
      return null
    }

    const titleParts = title.split(' / ')
    const numParts = titleParts.length
    const modifiedParts = [titleParts[numParts - 1]]

    for (let i = 0; i < numParts - 1; i++) {
      modifiedParts.push(titleParts[i])
    }

    return modifiedParts.join(' ')
  }

  const modifiedVariantTitle = modifyVariantTitle(variantTitle)

  if (modifiedVariantTitle) {
    return `${productTitle} ${modifiedVariantTitle}`
  }

  return productTitle
}

export function getReturnReasonMessage(reason: ReturnReason) {
  switch (reason) {
    case ReturnReason.Color:
      return 'Color'
    case ReturnReason.Defective:
      return 'Damaged or defective.'
    case ReturnReason.NotAsDescribed:
      return 'Item not as described'
    case ReturnReason.Other:
      return 'Other'
    case ReturnReason.SizeTooLarge:
      return 'Size was too large.'
    case ReturnReason.SizeTooSmall:
      return 'Size was too small.'
    case ReturnReason.Style:
      return 'Style'
    case ReturnReason.Unwanted:
      return 'Changed my mind'
    case ReturnReason.WrongItem:
      return 'Received the wrong item'
    default:
      return null
  }
}

export type ProductChoices = {
  [P in string]: string
}

export const getSelectedVariant = (variants: IReshapedVariant[], choices: ProductChoices) =>
  variants.find((variant) =>
    variant.selectedOptions.every((variantOption) => {
      const optionName = variantOption.name.toLocaleLowerCase()
      return optionName in choices && choices[optionName] === variantOption.value.toLocaleLowerCase()
    })
  )

export const getLegacyResourceId = (id?: string) => id?.split('/').pop()

export const getVariantIdByColor = (color: string, variants: IReshapedVariant[]) => {
  const variant = variants.find((v) => v.colorHex?.value === color)
  return variant ? getLegacyResourceId(variant.id) : null
}

export const filterMenuItemsByUrl = (items: MenuItem[], title: string) => {
  return items.find((item) => item?.url.includes(title))?.items || []
}

export const replaceShopifyLink = (link: string) => {
  const newLink = link.replace(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!, '')
  return newLink
}
