'use server'

import { auth, unstable_update } from '@/auth'
import { UnauthorizedError } from '@/lib/exceptions'
import { storefrontClient } from '@/lib/shopify'
import { CustomerUpdateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'

export const changeSubscription = async (newValue: boolean) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    if (typeof newValue === 'undefined') {
      throw new Error('Missed new value')
    }

    const { customerUpdate } = await storefrontClient.request(CustomerUpdateMutation, {
      customer: {
        acceptsMarketing: newValue,
      },
      customerAccessToken: session.accessToken,
    })

    if (customerUpdate?.customerUserErrors?.length) {
      throw new Error(customerUpdate?.customerUserErrors[0].message)
    }

    if (!customerUpdate?.customer?.id) {
      throw new Error('Failed to update user information')
    }

    await unstable_update({
      user: {
        acceptsMarketing: newValue,
      },
    })
  } catch (error) {
    console.error(error)
    return { error: getErrorMessage(error) }
  }
}
