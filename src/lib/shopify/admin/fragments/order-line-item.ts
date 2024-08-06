import { graphql } from '@/gql/admin'

export const OrderLineItemFragment = graphql(`
  fragment OrderLineItem on LineItem {
    title
    variantTitle
    quantity
    discountAllocations {
      allocatedAmountSet {
        presentmentMoney {
          amount
          currencyCode
        }
      }
    }
    discountedTotalSet {
      presentmentMoney {
        amount
        currencyCode
      }
    }
    image {
      url
      altText
    }
    product {
      handle
    }
    variant {
      legacyResourceId
    }
  }
`)
