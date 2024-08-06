import { storefrontClient } from '@/lib/shopify'
import { GetCustomerQuery } from '@/lib/shopify/storefront/queries/customer'

export const getUser = async (accessToken: string) => {
  const { customer } = await storefrontClient.request(GetCustomerQuery, {
    customerAccessToken: accessToken,
  })

  return customer
}
