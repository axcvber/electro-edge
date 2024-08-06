import { graphql } from '@/gql/storefront'

export const GetCustomerQuery = graphql(`
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      acceptsMarketing
      email
      phone
      defaultAddress {
        id
      }
      cartId: metafield(key: "cart_id", namespace: "custom") {
        value
      }
      wishlistId: metafield(key: "wishlist_id", namespace: "custom") {
        value
      }
    }
  }
`)

export const GetCustomerAddressesQuery = graphql(`
  query GetCustomerAddresses($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        ...Address
      }
      addresses(first: 50) {
        nodes {
          ...Address
        }
      }
    }
  }
`)
