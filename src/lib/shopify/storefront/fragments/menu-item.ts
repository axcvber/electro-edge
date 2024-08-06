import { graphql } from '@/gql/storefront'

export const MenuItemFragment = graphql(`
  fragment MenuItem on MenuItem {
    id
    title
    type
    url
  }
`)
