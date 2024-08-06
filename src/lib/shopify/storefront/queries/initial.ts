import { graphql } from '@/gql/storefront'

export const GetInitialDataQuery = graphql(`
  query GetInitialData {
    global: metaobject(handle: { handle: "global", type: "global" }) {
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
        references(first: 10) {
          nodes {
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
    contacts: metaobject(handle: { handle: "contacts", type: "contacts" }) {
      fields {
        type
        value
        key
        references(first: 10) {
          __typename
          ... on MetafieldReferenceConnection {
            nodes {
              __typename
              ... on Metaobject {
                type
                handle
                fields {
                  key
                  type
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
