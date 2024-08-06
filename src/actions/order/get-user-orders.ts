'use server'

import { auth } from '@/auth'
import { GetCustomerOrdersQueryVariables, Order } from '@/gql/admin/graphql'
import { UnauthorizedError } from '@/lib/exceptions'
import { GetCustomerOrdersQuery } from '@/lib/shopify/admin/queries/order'
import { adminClient } from '@/lib/shopify'

export const getUserOrders = async ({ query = '', ...rest }: GetCustomerOrdersQueryVariables) => {
  const session = await auth()

  if (!session?.user.id || !session.accessToken) {
    throw new UnauthorizedError()
  }

  const customerId = session.user.id.split('/').pop()

  const { orders } = await adminClient.request(GetCustomerOrdersQuery, {
    ...rest,
    first: 12,
    query: `customer_id:${customerId} ${query}`,
  })

  const data = orders.nodes as Order[]

  return { orders: data, pageInfo: orders.pageInfo }
}
