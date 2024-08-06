'use server'

import { LocationItem } from '@/types'

interface Provinces {
  provinces: LocationItem[]
}

export const getCountryProvinces = async (countryId: string) => {
  const response = await fetch(
    `https://tech-bud1.myshopify.com/admin/api/2024-01/countries/${countryId}/provinces.json?fields=id,name,code`,
    {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const data: Provinces = await response.json()
  return data.provinces.map((item) => ({ value: item.id.toString(), label: item.name }))
}
