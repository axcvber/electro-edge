'use server'

import { auth, unstable_update } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerUpdateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { NewPassSchemaType, newPassSchema } from '@/validation'

export const changePassword = async (values: NewPassSchemaType) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    const validatedFields = newPassSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const { confirmPassword } = validatedFields.data

    const { customerUpdate } = await storefrontClient.request(CustomerUpdateMutation, {
      customer: {
        password: confirmPassword,
      },
      customerAccessToken: session.accessToken,
    })

    if (customerUpdate?.customerUserErrors?.length) {
      throw new Error(customerUpdate?.customerUserErrors[0].message)
    }

    const newAccessToken = customerUpdate?.customerAccessToken?.accessToken

    if (!newAccessToken) {
      throw new Error('Failed to update password')
    }

    await unstable_update({
      accessToken: newAccessToken,
    })
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
