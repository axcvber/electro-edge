import { LanguageCode, Metaobject } from '@/gql/storefront/graphql'
import { normalizeMetaobject } from '@/lib/normalize'
import { storefrontClient } from '@/lib/shopify'
import { GetPageQuery } from '@/lib/shopify/storefront/queries/page'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const getPage = async (slug: string) => {
  const locale = await getLocale()
  const { page } = await storefrontClient.request(GetPageQuery, {
    language: locale.toUpperCase() as LanguageCode,
    slug,
  })

  if (!page) {
    notFound()
  }

  const normalizedBlocks = page.blocks?.references?.nodes.map((item) => normalizeMetaobject(item as Metaobject)) || []

  const { blocks, ...rest } = page

  return { ...rest, blocks: normalizedBlocks }
}
