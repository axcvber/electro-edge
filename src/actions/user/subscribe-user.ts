'use server'

import { CustomerEmailMarketingState } from '@/gql/admin/graphql'
import { createUserByEmail, findUserByEmail, updateUserSubscription } from '@/lib/customer'
import { getErrorMessage } from '@/lib/utils'

export const subscribeUser = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Missed user email')
    }
    const customer = await findUserByEmail(email)

    if (customer?.id) {
      const marketingState = customer.emailMarketingConsent?.marketingState

      if (marketingState !== CustomerEmailMarketingState.Subscribed) {
        await updateUserSubscription(customer.id)
      } else {
        throw new Error(`It looks like you've already subscribed.`)
      }
    } else {
      await createUserByEmail(email)
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
