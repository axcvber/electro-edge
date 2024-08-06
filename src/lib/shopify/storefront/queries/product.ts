import { graphql } from '@/gql/storefront'

export const GetProductVariantQuery = graphql(`
  query GetProductVariant($variantId: ID!, $language: LanguageCode!) @inContext(language: $language) {
    node(id: $variantId) {
      ... on ProductVariant {
        id
        title
        sku
        selectedOptions {
          name
          value
        }
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        quantityAvailable
        images: metafield(namespace: "custom", key: "images") {
          references(first: 50) {
            nodes {
              __typename
              ... on MediaImage {
                image {
                  id
                  url
                  altText
                }
              }
            }
          }
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
        specification: metafield(namespace: "custom", key: "specification") {
          references(first: 50) {
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
        colorHex: metafield(namespace: "custom", key: "color") {
          id
          value
          key
          description
          type
        }
        product {
          id
          handle
          title
          descriptionHtml
          isGiftCard
          options {
            id
            name
            values
          }

          images(first: 50) {
            nodes {
              id
              altText
              url
            }
          }

          variants(first: 50) {
            nodes {
              id
              title
              selectedOptions {
                name
                value
              }
              colorHex: metafield(namespace: "custom", key: "color") {
                id
                value
                key
                description
                type
              }
              quantityAvailable
            }
          }
        }
      }
    }
  }
`)

export const GetProductRecommendationsQuery = graphql(`
  query GetProductRecommendations($productId: ID!, $language: LanguageCode!) @inContext(language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductCard
    }
  }
`)

export const SearchProductsQuery = graphql(`
  query SearchProducts($query: String!, $first: Int, $language: LanguageCode!) @inContext(language: $language) {
    search(query: $query, first: $first, types: PRODUCT) {
      nodes {
        ... on Product {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            nodes {
              id
            }
          }
        }
      }
      totalCount
    }
  }
`)
