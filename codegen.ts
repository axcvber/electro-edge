import { CodegenConfig } from '@graphql-codegen/cli'
import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  overwrite: true,
  generates: {
    './src/gql/storefront/': {
      schema: [
        {
          [`${process.env.STOREFRONT_API}/graphql`]: {
            headers: {
              'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
            },
          },
        },
      ],
      documents: ['src/lib/shopify/storefront/**/*.ts'],
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: [],
    },
    './src/gql/admin/': {
      schema: [
        {
          [`${process.env.ADMIN_API!}/graphql`]: {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
            },
          },
        },
      ],
      documents: ['src/lib/shopify/admin/**/*.ts'],
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
