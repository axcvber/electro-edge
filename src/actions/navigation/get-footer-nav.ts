'use server'

import { LanguageCode, MenuItem } from '@/gql/storefront/graphql'
import { storefrontClient } from '@/lib/shopify'
import { GetFooterNavigationQuery } from '@/lib/shopify/storefront/queries/navigation'
import { getLocale } from 'next-intl/server'

export const getFooterNavigation = async () => {
  const locale = await getLocale()

  const { footerMenu } = await storefrontClient.request(GetFooterNavigationQuery, {
    language: locale.toUpperCase() as LanguageCode,
  })
  const data = (footerMenu?.items as MenuItem[]) || []

  return data
}
