import { graphql } from '@/gql/storefront'

export const GetHeaderNavigationQuery = graphql(`
  query GetHeaderNavigation($language: LanguageCode!) @inContext(language: $language) {
    mainMenu: menu(handle: "main-menu") {
      id
      handle
      title
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    catalogMenu: menu(handle: "catalog-menu") {
      id
      handle
      title
      items {
        id
        title
        type
        url
        resource {
          __typename
          ... on Collection {
            handle
            icon: metafield(namespace: "custom", key: "icon") {
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
      }
    }
  }
`)

export const GetFooterNavigationQuery = graphql(`
  query GetFooterNavigation($language: LanguageCode!) @inContext(language: $language) {
    footerMenu: menu(handle: "footer") {
      id
      handle
      title
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`)
