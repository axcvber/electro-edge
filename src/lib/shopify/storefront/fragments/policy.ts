import { graphql } from '@/gql/storefront'

export const ShopPolicyFragment = graphql(`
  fragment ShopPolicy on ShopPolicy {
    id
    handle
    title
    body
  }
`)
