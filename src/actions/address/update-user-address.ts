'use server'

import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerAddressUpdateMutation } from '@/lib/shopify/storefront/mutations/address'
import { getErrorMessage } from '@/lib/utils'
import { AddressSchemaType, addressSchema } from '@/validation'
import { updateDefaultUserAddress } from './update-default-user-address'

export const updateUserAddress = async (values: AddressSchemaType, addressId: string) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    if (!addressId) {
      throw new Error('Missed Address Id')
    }

    const validatedFields = addressSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      throw new Error(errors[0].message)
    }

    const { defaultAddress, ...rest } = validatedFields.data

    const { customerAddressUpdate } = await storefrontClient.request(CustomerAddressUpdateMutation, {
      customerAccessToken: session.accessToken,
      id: addressId,
      address: { ...rest },
    })

    if (customerAddressUpdate?.customerUserErrors.length) {
      throw new Error(customerAddressUpdate.customerUserErrors[0].message)
    }

    if (!customerAddressUpdate?.customerAddress?.id) {
      throw new Error('Failed to update address')
    }

    if (defaultAddress) {
      await updateDefaultUserAddress(addressId)
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
