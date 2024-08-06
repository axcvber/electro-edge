import { graphql } from '@/gql/storefront'

export const GetPageQuery = graphql(`
  query GetPage($slug: String!, $language: LanguageCode!) @inContext(language: $language) {
    page(handle: $slug) {
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
      blocks: metafield(namespace: "custom", key: "blocks") {
        references(first: 25) {
          nodes {
            __typename
            ... on Metaobject {
              handle
              type
              fields {
                key
                type
                value
                reference {
                  __typename
                  ... on Metaobject {
                    type
                    fields {
                      __typename
                      key
                      type
                      value
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
                  ... on MediaImage {
                    image {
                      url
                      altText
                    }
                  }
                }
                references(first: 50) {
                  nodes {
                    __typename
                    ... on Metaobject {
                      id
                      fields {
                        value
                        key
                        type
                        __typename
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
                    ... on Collection {
                      title
                      handle
                      metafield(namespace: "custom", key: "icon") {
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
                    ...ProductVariantCard
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
