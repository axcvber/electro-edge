import { graphql } from '@/gql/storefront'

export const ProductCardFragment = graphql(`
  fragment ProductCard on Product {
    id
    handle
    title
    isGiftCard
    variants(first: 50) {
      nodes {
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
        previewInfo: metafield(namespace: "custom", key: "preview_info") {
          references(first: 5) {
            nodes {
              __typename
              ... on Metaobject {
                fields {
                  type
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`)
