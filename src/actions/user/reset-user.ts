'use server'

import { storefrontClient } from '@/lib/shopify'
import { CustomerResetMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { NewPassSchemaType, newPassSchema } from '@/validation'

export const resetUser = async (values: NewPassSchemaType, userId: string, resetToken: string) => {
  try {
    if (!userId || !resetToken) {
      throw new Error('Customer token or id not found')
    }

    const validatedFields = newPassSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const { confirmPassword } = validatedFields.data

    const { customerReset } = await storefrontClient.request(CustomerResetMutation, {
      id: `gid://shopify/Customer/${userId}`,
      input: {
        password: confirmPassword,
        resetToken,
      },
    })

    if (customerReset?.customerUserErrors?.length) {
      throw new Error(customerReset.customerUserErrors[0].message)
    }

    if (!customerReset?.customer?.id) {
      throw new Error('Failed to reset the password')
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
