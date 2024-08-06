import { auth } from '@/auth'
import { AddressFragment } from '@/gql/storefront/graphql'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { GetCustomerAddressesQuery } from '@/lib/shopify/storefront/queries/customer'

export const getUserAddresses = async () => {
  const session = await auth()

  if (!session?.accessToken) {
    throw new UnauthorizedError()
  }

  const { customer } = await storefrontClient.request(GetCustomerAddressesQuery, {
    customerAccessToken: session.accessToken,
  })

  const defaultAddress = customer?.defaultAddress as AddressFragment
  const addresses = customer?.addresses.nodes as AddressFragment[]

  return { defaultAddress, addresses }
}
