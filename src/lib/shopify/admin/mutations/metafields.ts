import { graphql } from '@/gql/admin'

export const MetafieldsSetMutation = graphql(`
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        value
        key
      }
      userErrors {
        field
        message
      }
    }
  }
`)
