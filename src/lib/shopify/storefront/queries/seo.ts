import { graphql } from '@/gql/storefront'

export const GetSeoMetadataQuery = graphql(`
  query GetSeoMetadata($language: LanguageCode!) @inContext(language: $language) {
    seo: metaobject(handle: { handle: "seo", type: "seo" }) {
      fields {
        type
        value
        key
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
    }
  }
`)
