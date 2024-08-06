'use server'

import { storefrontClient } from '@/lib/shopify'
import { CustomerActivateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { NewPassSchemaType, newPassSchema } from '@/validation'

export const activateUser = async (values: NewPassSchemaType, userId: string, activationToken: string) => {
  try {
    if (!userId || !activationToken) {
      throw new Error('Missing token. The link you followed might be wrong.')
    }

    const validatedFields = newPassSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const { confirmPassword } = validatedFields.data

    const { customerActivate } = await storefrontClient.request(CustomerActivateMutation, {
      id: `gid://shopify/Customer/${userId}`,
      input: {
        password: confirmPassword,
        activationToken,
      },
    })

    if (customerActivate?.customerUserErrors?.length) {
      throw new Error(customerActivate.customerUserErrors[0].message)
    }

    if (!customerActivate?.customer?.id) {
      throw new Error('Failed to activate account')
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
