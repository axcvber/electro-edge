'use server'

import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerAddressCreateMutation } from '@/lib/shopify/storefront/mutations/address'
import { getErrorMessage } from '@/lib/utils'
import { AddressSchemaType, addressSchema } from '@/validation'
import { updateDefaultUserAddress } from './update-default-user-address'

export const addUserAddress = async (values: AddressSchemaType) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    const validatedFields = addressSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      throw new Error(errors[0].message)
    }

    const { defaultAddress, ...rest } = validatedFields.data

    const { customerAddressCreate } = await storefrontClient.request(CustomerAddressCreateMutation, {
      customerAccessToken: session.accessToken,
      address: { ...rest },
    })

    if (customerAddressCreate?.customerUserErrors.length) {
      throw new Error(customerAddressCreate.customerUserErrors[0].message)
    }

    if (!customerAddressCreate?.customerAddress?.id) {
      throw new Error('Failed to add an address')
    }

    if (defaultAddress) {
      await updateDefaultUserAddress(customerAddressCreate.customerAddress.id)
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
