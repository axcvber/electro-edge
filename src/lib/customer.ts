import { CustomerEmailMarketingState, CustomerMarketingOptInLevel } from '@/gql/admin/graphql'
import {
  CustomerCreateByEmailMutation,
  CustomerSubscriptionUpdateMutation,
} from '@/lib/shopify/admin/mutations/customer'
import { adminClient } from '@/lib/shopify'
import { GetCustomerByEmailQuery } from './shopify/admin/queries/customer'

export const findUserByEmail = async (email: string) => {
  if (!email) {
    throw new Error('Missed user email')
  }

  const { customers } = await adminClient.request(GetCustomerByEmailQuery, {
    email,
  })

  const customer = customers.nodes[0]

  return customer
}

export const createUserByEmail = async (email: string) => {
  if (!email) {
    throw new Error('Missed user email')
  }

  const { customerCreate } = await adminClient.request(CustomerCreateByEmailMutation, {
    input: {
      email,
      tags: ['newsletter'],
      emailMarketingConsent: {
        marketingOptInLevel: CustomerMarketingOptInLevel.SingleOptIn,
        marketingState: CustomerEmailMarketingState.Subscribed,
      },
    },
  })

  if (customerCreate?.userErrors.length) {
    throw new Error(customerCreate.userErrors[0].message)
  }
}

export const updateUserSubscription = async (customerId: string) => {
  if (!customerId) {
    throw new Error('Missed user id')
  }

  const { customerEmailMarketingConsentUpdate } = await adminClient.request(CustomerSubscriptionUpdateMutation, {
    input: {
      customerId,
      emailMarketingConsent: {
        marketingOptInLevel: CustomerMarketingOptInLevel.SingleOptIn,
        marketingState: CustomerEmailMarketingState.Subscribed,
      },
    },
  })

  if (customerEmailMarketingConsentUpdate?.userErrors.length) {
    throw new Error(customerEmailMarketingConsentUpdate.userErrors[0].message)
  }
}
