'use server'

import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerDefaultAddressUpdateMutation } from '@/lib/shopify/storefront/mutations/address'

export const updateDefaultUserAddress = async (addressId: string) => {
  const session = await auth()

  if (!session?.accessToken) {
    throw new UnauthorizedError()
  }

  if (!addressId) {
    throw new Error('Missed Address Id')
  }

  const { customerDefaultAddressUpdate } = await storefrontClient.request(CustomerDefaultAddressUpdateMutation, {
    customerAccessToken: session.accessToken,
    addressId,
  })
  if (customerDefaultAddressUpdate?.customerUserErrors.length) {
    throw new Error(customerDefaultAddressUpdate.customerUserErrors[0].message)
  }
  if (!customerDefaultAddressUpdate?.customer?.defaultAddress?.id) {
    throw new Error('Failed to update default address')
  }
}
