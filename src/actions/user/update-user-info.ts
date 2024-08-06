'use server'

import { auth, unstable_update } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerUpdateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { UserInfoFormSchemaType, userInfoFormSchema } from '@/validation'

export const updateUserInfo = async (values: UserInfoFormSchemaType) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    const validatedFields = userInfoFormSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const formData = validatedFields.data

    const { customerUpdate } = await storefrontClient.request(CustomerUpdateMutation, {
      customer: formData,
      customerAccessToken: session.accessToken,
    })

    if (customerUpdate?.customerUserErrors?.length) {
      throw new Error(customerUpdate?.customerUserErrors[0].message)
    }

    if (!customerUpdate?.customer?.id) {
      throw new Error('Failed to update user information')
    }

    await unstable_update({
      user: formData,
    })
  } catch (error) {
    console.error(error)
    return { error: getErrorMessage(error) }
  }
}
