import { graphql } from '@/gql/storefront'

export const GetCartQuery = graphql(`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      buyerIdentity {
        email
        phone
        customer {
          id
        }
        countryCode
      }
      lines(first: 250) {
        nodes {
          id
          quantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                id
                title
                handle
              }
              quantityAvailable
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
      totalQuantity
      checkoutUrl
    }
  }
`)
