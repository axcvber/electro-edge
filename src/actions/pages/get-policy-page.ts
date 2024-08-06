import { LanguageCode, ShopPolicy } from '@/gql/storefront/graphql'
import { storefrontClient } from '@/lib/shopify'
import {
  GetPrivacyPolicyQuery,
  GetRefundPolicyQuery,
  GetShippingPolicyQuery,
  GetTermsOfServiceQuery,
} from '@/lib/shopify/storefront/queries/policies'
import { getLocale } from 'next-intl/server'

export const getPolicyPage = async (slug: string) => {
  const locale = await getLocale()
  const queryMapping: any = {
    'privacy-policy': GetPrivacyPolicyQuery,
    'refund-policy': GetRefundPolicyQuery,
    'shipping-policy': GetShippingPolicyQuery,
    'terms-of-service': GetTermsOfServiceQuery,
  }

  const query = queryMapping[slug]

  if (!query) {
    return
  }

  const { shop } = await storefrontClient.request<any>(query, {
    language: locale.toUpperCase() as LanguageCode,
  })

  const data = shop[Object.keys(shop)[0]] as ShopPolicy | undefined

  return data
}
