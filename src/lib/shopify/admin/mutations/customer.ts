import { graphql } from '@/gql/admin'

export const CustomerDeleteMutation = graphql(`
  mutation CustomerDelete($input: CustomerDeleteInput!) {
    customerDelete(input: $input) {
      deletedCustomerId
      userErrors {
        field
        message
      }
    }
  }
`)

export const CustomerCreateByEmailMutation = graphql(`
  mutation CustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`)

export const CustomerSubscriptionUpdateMutation = graphql(`
  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`)
