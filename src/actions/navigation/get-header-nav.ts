'use server'

import { GetHeaderNavigationQuery } from '@/lib/shopify/storefront/queries/navigation'
import { LanguageCode, MenuItem } from '@/gql/storefront/graphql'
import { storefrontClient } from '@/lib/shopify'
import { getLocale } from 'next-intl/server'

export const getHeaderNavigation = async () => {
  const locale = await getLocale()

  const { mainMenu: main, catalogMenu: catalog } = await storefrontClient.request(GetHeaderNavigationQuery, {
    language: locale.toUpperCase() as LanguageCode,
  })

  const mainMenu = (main?.items as MenuItem[]) || []
  const catalogMenu = (catalog?.items as MenuItem[]) || []

  return { mainMenu, catalogMenu }
}
