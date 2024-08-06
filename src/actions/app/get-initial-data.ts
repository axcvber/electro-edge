'use server'

import { Image, Metaobject } from '@/gql/storefront/graphql'
import { NormalizedMetaobject, normalizeMetaobject } from '@/lib/normalize'
import { GetInitialDataQuery } from '@/lib/shopify/storefront/queries/initial'
import { storefrontClient } from '@/lib/shopify'

export interface GlobalDataFields {
  light_logo?: Image
  dark_logo?: Image
  payment_logos?: Image[]
}

interface SocialIconFields extends NormalizedMetaobject {
  fields: {
    icon_name: string
    label: string
    link: string
  }
}

export interface ContactsFields {
  address?: string
  phone?: string
  email?: string
  social_icons?: SocialIconFields[]
}

export const getInitialData = async () => {
  const { global, contacts: contactsData } = await storefrontClient.request(GetInitialDataQuery)

  const globalData = global ? normalizeMetaobject<GlobalDataFields>(global as Metaobject) : null
  const contacts = contactsData ? normalizeMetaobject<ContactsFields>(contactsData as Metaobject) : null

  return { globalData, contacts }
}
