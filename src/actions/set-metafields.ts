'use server'

import { Metafield, MetafieldsSetMutationVariables } from '@/gql/admin/graphql'
import { MetafieldsSetMutation } from '@/lib/shopify/admin/mutations/metafields'
import { adminClient } from '@/lib/shopify'

export const setMetafields = async (variables: MetafieldsSetMutationVariables) => {
  try {
    const { metafieldsSet } = await adminClient.request(MetafieldsSetMutation, variables)

    if (metafieldsSet?.userErrors.length) {
      throw new Error(metafieldsSet.userErrors[0].message)
    }

    const data = (metafieldsSet?.metafields as Metafield[]) || []

    return { data }
  } catch (error) {
    console.error('Error during setMetafields:', error)
    throw error
  }
}
