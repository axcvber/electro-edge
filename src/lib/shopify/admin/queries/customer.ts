import { graphql } from '@/gql/admin'

export const GetCustomerByEmailQuery = graphql(`
  query GetCustomerByEmail($email: String!) {
    customers(first: 1, query: $email) {
      nodes {
        id
        email
        numberOfOrders
        emailMarketingConsent {
          marketingState
          marketingOptInLevel
        }
      }
    }
  }
`)
