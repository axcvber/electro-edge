import { graphql } from '@/gql/admin'

export const RequestReturnMutation = graphql(`
  mutation RequestReturnMutation($input: ReturnRequestInput!) {
    returnRequest(input: $input) {
      return {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`)
