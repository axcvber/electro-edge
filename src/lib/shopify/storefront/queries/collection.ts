import { graphql } from '@/gql/storefront'

export const GetCollectionPageQuery = graphql(`
  query GetCollectionPage($handle: String!, $language: LanguageCode!) @inContext(language: $language) {
    collection(handle: $handle) {
      seo {
        description
        title
      }
      handle
      title
      description
      metafield(namespace: "custom", key: "background") {
        value
        type
        reference {
          __typename
          ... on MediaImage {
            image {
              url
              altText
            }
          }
        }
      }
      products(first: 1) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
`)

export const GetCollectionProductsQuery = graphql(`
  query GetCollectionProducts(
    $handle: String!
    $first: Int = 250
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $language: LanguageCode!
  ) @inContext(language: $language) {
    collection(handle: $handle) {
      products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          ...ProductCard
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
      }
    }
  }
`)
