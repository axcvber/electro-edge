'use server'

import { Image, LanguageCode, Metaobject } from '@/gql/storefront/graphql'
import { normalizeMetaobject } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetSeoMetadataQuery } from '@/lib/shopify/storefront/queries/seo'
import { getLocale } from 'next-intl/server'

export interface SeoMetadataFields {
  meta_title?: string
  meta_description?: string
  meta_image?: Image
  site_icon?: Image
}

export const getSeoMetaData = async () => {
  const locale = await getLocale()
  const { seo } = await storefrontClient.request(GetSeoMetadataQuery, {
    language: locale.toUpperCase() as LanguageCode,
  })

  const data = seo ? normalizeMetaobject<SeoMetadataFields>(seo as Metaobject) : null

  return data
}
