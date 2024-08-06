import { graphql } from '@/gql/admin'

export const GetReturnableFulfillmentsQuery = graphql(`
  query GetReturnableFulfillments($orderId: ID!) {
    returnableFulfillments(orderId: $orderId, first: 150) {
      nodes {
        returnableFulfillmentLineItems(first: 150) {
          nodes {
            quantity
            fulfillmentLineItem {
              id
              originalTotalSet {
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              lineItem {
                variantTitle
                title
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`)

export const GetCustomerOrdersQuery = graphql(`
  query GetCustomerOrders(
    $first: Int = 250
    $after: String
    $query: String
    $sortKey: OrderSortKeys
    $reverse: Boolean
  ) {
    orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...OrderItem
      }
    }
  }
`)
