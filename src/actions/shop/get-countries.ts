'use server'

import { LocationItem } from '@/types'

interface Countries {
  countries: LocationItem[]
}

export const getCountries = async () => {
  const response = await fetch('https://tech-bud1.myshopify.com/admin/api/2024-01/countries.json?fields=id,name,code', {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const data: Countries = await response.json()
  return data.countries.map((item) => ({ value: item.id.toString(), label: item.name, code: item.code }))
}
