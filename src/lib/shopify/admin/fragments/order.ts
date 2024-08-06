import { graphql } from '@/gql/admin'

export const OrderFragment = graphql(`
  fragment OrderItem on Order {
    id
    name
    legacyResourceId
    createdAt
    processedAt
    updatedAt
    cancelReason
    cancelledAt
    displayFulfillmentStatus
    returnStatus
    displayFinancialStatus
    email
    phone
    lineItems(first: 250) {
      nodes {
        ...OrderLineItem
      }
    }
    shippingAddress {
      formatted
      name
    }
    fulfillments {
      trackingInfo {
        company
        number
        url
      }
    }
    currentSubtotalPriceSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
    currentTotalTaxSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
    totalShippingPriceSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
    shippingLine {
      discountAllocations {
        allocatedAmountSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
      }
    }
    currentTotalPriceSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
    totalRefundedSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
  }
`)
