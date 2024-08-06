'use server'

import { auth } from '@/auth'
import { ReturnReason } from '@/gql/admin/graphql'
import { UnauthorizedError } from '@/lib/exceptions'
import { adminClient } from '@/lib/shopify'
import { RequestReturnMutation } from '@/lib/shopify/admin/mutations/order'
import { getErrorMessage } from '@/lib/utils'
import { AppRoutes } from '@/routes'
import { ReturnOrderFormSchemaType, returnOrderFormSchema } from '@/validation'
import { revalidatePath } from 'next/cache'

export const createReturnRequest = async (orderId: string, returnLineItems: ReturnOrderFormSchemaType) => {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      throw new UnauthorizedError()
    }

    if (!orderId) {
      throw new Error('Missed Order ID')
    }

    const validatedFields = returnOrderFormSchema.safeParse(returnLineItems)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const selectedItems = validatedFields.data.lineItems.filter((item) => item.selected)

    const data = selectedItems.map(({ fulfillmentLineItemId, quantity, returnReason, customerNote }) => ({
      fulfillmentLineItemId,
      quantity,
      returnReason: returnReason ?? ReturnReason.Unknown,
      customerNote,
    }))

    const { returnRequest } = await adminClient.request(RequestReturnMutation, {
      input: {
        orderId: `gid://shopify/Order/${orderId}`,
        returnLineItems: data,
      },
    })

    if (returnRequest?.userErrors.length) {
      throw new Error(returnRequest?.userErrors[0].message)
    }
    revalidatePath(`${AppRoutes.ACCOUNT_ORDERS_RETURNABLE_FULFILLMENT}/[orderId]`, 'page')
  } catch (error) {
    console.error('Error during createReturnRequest:', error)
    return { error: getErrorMessage(error) }
  }
}
