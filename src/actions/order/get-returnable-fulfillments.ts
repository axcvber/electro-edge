'use server'

import { auth } from '@/auth'
import { ReturnableFulfillment } from '@/gql/admin/graphql'
import { UnauthorizedError } from '@/lib/exceptions'
import { reshapeReturnableFulfillments } from '@/lib/normalize'
import { adminClient } from '@/lib/shopify'
import { GetReturnableFulfillmentsQuery } from '@/lib/shopify/admin/queries/order'

export const getReturnableFulfillments = async (orderId: string) => {
  const session = await auth()

  if (!session?.accessToken) {
    throw new UnauthorizedError()
  }

  if (!orderId) {
    throw new Error('Missed Order ID')
  }

  const { returnableFulfillments } = await adminClient.request(GetReturnableFulfillmentsQuery, {
    orderId: `gid://shopify/Order/${orderId}`,
  })

  const response = (returnableFulfillments.nodes as ReturnableFulfillment[]) ?? []
  const data = reshapeReturnableFulfillments(response)

  return data
}
