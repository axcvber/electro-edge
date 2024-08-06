'use server'

import { getErrorMessage } from '@/lib/utils'
import { auth } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { adminClient } from '@/lib/shopify'
import { CustomerDeleteMutation } from '@/lib/shopify/admin/mutations/customer'

export const deleteUser = async () => {
  const session = await auth()

  try {
    if (!session?.accessToken || !session.user.id) {
      throw new UnauthorizedError()
    }
    const { customerDelete } = await adminClient.request(CustomerDeleteMutation, {
      input: {
        id: session.user.id,
      },
    })

    if (customerDelete?.userErrors.length) {
      throw new Error(customerDelete.userErrors[0].message)
    }
    if (!customerDelete?.deletedCustomerId) {
      throw new Error('Failed to delete your account')
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
