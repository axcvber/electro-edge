import { MoneyV2, ReturnableFulfillment } from '@/gql/admin/graphql'
import {
  Image,
  MetafieldReference,
  ProductVariant,
  Metaobject,
  Metafield,
  MetafieldReferenceConnection,
  ProductOption,
  Product,
  Cart,
  BaseCartLine,
} from '@/gql/storefront/graphql'

export interface ProductVariantWithMetafields extends ProductVariant {
  images: Metafield
  colorHex: Metafield
  previewInfo: Metafield
  specification: Metafield
}

export interface IReshapedVariant extends Omit<ProductVariant, 'product'> {
  images: Image[]
  previewInfo: Metaobject[]
  colorHex: Metafield
  specification: Metaobject[]
  descriptionHtml: string
  productId: string
  productPath: string
  productTitle: string
  productVariants: IReshapedVariant[]
  productOptions: ProductOption[]
}

export const reshapeProductVariant = (variant: ProductVariantWithMetafields): IReshapedVariant => {
  const { images, specification, colorHex, metafield, product, previewInfo, ...rest } = variant
  const reshapedImages = (images?.references?.nodes.map((item: any) => item.image) as Image[]) || []
  const reshapedPreviewInfo = (previewInfo?.references?.nodes.map((item: any) => item) as Metaobject[]) || []
  const reshapedSpecification = (specification?.references?.nodes.map((item: any) => item) as Metaobject[]) || []

  const productVariants =
    product?.variants?.nodes.map((item) => reshapeProductVariant(item as ProductVariantWithMetafields)) || []

  const productOptions = product?.options?.filter((o) => o.name !== 'Title') || []

  return {
    productId: product?.id || '',
    productPath: product?.handle || '',
    productTitle: product?.title || '',
    productVariants,
    productOptions,
    images: reshapedImages.length > 0 ? reshapedImages : product?.images?.nodes,
    descriptionHtml: product?.descriptionHtml || '',
    previewInfo: reshapedPreviewInfo,
    specification: reshapedSpecification,
    colorHex,
    ...rest,
  }
}

export interface IReshapedProduct extends Omit<Product, 'variants'> {
  variants: IReshapedVariant[]
}

export const reshapeProduct = (product: Product): IReshapedProduct => {
  const { variants, ...rest } = product

  const productVariants =
    variants.nodes.map((item) => reshapeProductVariant(item as ProductVariantWithMetafields)) || []

  return {
    variants: productVariants,
    ...rest,
  }
}

export interface ReshapedReturnableFulfillment {
  fulfillmentLineItemId: string
  title: string
  variantTitle?: string
  image?: Image
  initialQuantity?: number
  price: MoneyV2
}

export const reshapeReturnableFulfillments = (data: ReturnableFulfillment[]): ReshapedReturnableFulfillment[] => {
  return data.flatMap((item) =>
    item.returnableFulfillmentLineItems.nodes.map((item) => ({
      fulfillmentLineItemId: item.fulfillmentLineItem.id,
      title: item.fulfillmentLineItem.lineItem.title,
      variantTitle: item.fulfillmentLineItem.lineItem.variantTitle || undefined,
      image: item.fulfillmentLineItem.lineItem.image || undefined,
      initialQuantity: item.quantity || undefined,
      price: item.fulfillmentLineItem.originalTotalSet.presentmentMoney,
    }))
  )
}

export interface NormalizedMetaobject<T extends Record<string, any> = Record<string, any>> {
  type: string
  handle: string
  fields: T
}

export function normalizeMetaobject<T extends Record<string, any>>(metaobject: Metaobject): NormalizedMetaobject<T> {
  const normalizedFields: Record<string, any> = {}
  metaobject.fields.forEach((field) => {
    const { key, value, reference, references } = field
    normalizedFields[key] = value
    if (reference) {
      normalizedFields[key] = normalizeMetaobjectReference(reference)
    } else if (references) {
      normalizedFields[key] = normalizeMetaobjectReferenceConnection(references)
    }
  })

  return {
    type: metaobject.type,
    handle: metaobject.handle,
    fields: normalizedFields as T,
  }
}

function normalizeMetaobjectReference(reference: MetafieldReference) {
  if (reference.__typename === 'MediaImage') {
    return reference.image
  }
  if (reference.__typename === 'Metaobject') {
    return normalizeMetaobject(reference)
  }
  // Implement logic to normalize MetafieldReference data
  return reference
}

function normalizeMetaobjectReferenceConnection(connection: MetafieldReferenceConnection) {
  return connection.nodes.map((node) => {
    if (node.__typename === 'Metaobject') {
      return normalizeMetaobject(node)
    }
    if (node.__typename === 'MediaImage') {
      return node.image
    }
    if (node.__typename === 'Collection') {
      const { metafield, ...rest } = node
      return {
        ...rest,
        icon: metafield?.reference?.__typename === 'MediaImage' ? metafield?.reference.image : null,
      }
    }
    // Implement logic to normalize other node types
    return node
  })
}

export interface ReshapedCard extends Omit<Cart, 'lines'> {
  lines: BaseCartLine[]
}

export const reshapeCart = (cart: Cart): ReshapedCard => {
  return {
    ...cart,
    lines: cart.lines.nodes,
  }
}
