import { graphql } from '@/gql/storefront'

export const ADDRESS_FRAGMENT = graphql(`
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    name
    company
    address1
    address2
    country
    province
    provinceCode
    city
    zip
    phone
  }
`)
