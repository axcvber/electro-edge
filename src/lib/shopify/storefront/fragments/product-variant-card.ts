import { graphql } from '@/gql/storefront'

export const ProductVariantCardFragment = graphql(`
  fragment ProductVariantCard on ProductVariant {
    product {
      id
      handle
      title
      options {
        id
        name
        values
      }
      variants(first: 10) {
        nodes {
          title
          id
          sku
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          colorHex: metafield(namespace: "custom", key: "color") {
            id
            value
            key
            description
            type
          }
          quantityAvailable
          availableForSale
          image {
            url
            altText
          }
        }
      }
    }
    id
    title
    sku
    availableForSale
    image {
      url
      altText
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    quantityAvailable
    colorHex: metafield(namespace: "custom", key: "color") {
      id
      value
      key
      description
      type
    }
  }
`)
