import { graphql } from '@/gql/storefront'

export const GetPrivacyPolicyQuery = graphql(`
  query GetPrivacyPolicy($language: LanguageCode!) @inContext(language: $language) {
    shop {
      privacyPolicy {
        ...ShopPolicy
      }
    }
  }
`)

export const GetTermsOfServiceQuery = graphql(`
  query GetTermsOfService($language: LanguageCode!) @inContext(language: $language) {
    shop {
      termsOfService {
        ...ShopPolicy
      }
    }
  }
`)

export const GetRefundPolicyQuery = graphql(`
  query GetRefundPolicy($language: LanguageCode!) @inContext(language: $language) {
    shop {
      refundPolicy {
        ...ShopPolicy
      }
    }
  }
`)

export const GetShippingPolicyQuery = graphql(`
  query GetShippingPolicy($language: LanguageCode!) @inContext(language: $language) {
    shop {
      shippingPolicy {
        ...ShopPolicy
      }
    }
  }
`)
