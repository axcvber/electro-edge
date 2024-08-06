'use server'

import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerAddressDeleteMutation } from '@/lib/shopify/storefront/mutations/address'
import { getErrorMessage } from '@/lib/utils'

export const deleteUserAddress = async (addressId: string) => {
  try {
    if (!addressId) {
      throw new Error('Missed Address Id')
    }

    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    const { customerAddressDelete } = await storefrontClient.request(CustomerAddressDeleteMutation, {
      customerAccessToken: session.accessToken,
      id: addressId,
    })

    if (customerAddressDelete?.customerUserErrors.length) {
      throw new Error(customerAddressDelete.customerUserErrors[0].message)
    }

    if (!customerAddressDelete?.deletedCustomerAddressId) {
      throw new Error('Failed to delete your address')
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
