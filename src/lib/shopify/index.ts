import { ClientError, GraphQLClient, ResponseMiddleware } from 'graphql-request'

const handleClientError = (error: ClientError) => {
  if (error.response.errors) {
    console.error(`GraphQL Error: ${error.response.errors[0].message}`)
    throw new Error(error.response.errors[0].message)
  }
}

const responseMiddleware: ResponseMiddleware = (response) => {
  if (response instanceof ClientError) {
    handleClientError(response)
  }
  return response
}

const storefrontClient = new GraphQLClient(`${process.env.STOREFRONT_API!}/graphql`, {
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    'Content-Type': 'application/json',
  },
  responseMiddleware,
  cache: 'no-store',
})

const adminClient = new GraphQLClient(`${process.env.ADMIN_API!}/graphql`, {
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
    'Accept': 'application/json',
  },
  responseMiddleware,
  cache: 'no-store',
})

export { storefrontClient, adminClient }
