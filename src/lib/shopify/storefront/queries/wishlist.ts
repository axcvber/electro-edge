import { graphql } from '@/gql/storefront'

export const GetWishlistValuesQuery = graphql(`
  query GetWishlistValues($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      wishlist: metafield(key: "wishlist", namespace: "custom") {
        value
      }
    }
  }
`)

export const GetCustomerWishlistQuery = graphql(`
  query GetCustomerWishlist($accessToken: String!, $first: Int = 250, $after: String) {
    customer(customerAccessToken: $accessToken) {
      wishlist: metafield(key: "wishlist", namespace: "custom") {
        id
        references(first: $first, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            ...ProductVariantCard
          }
        }
      }
    }
  }
`)
