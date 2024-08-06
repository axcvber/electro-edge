import { OrderSortKeys } from '@/gql/admin/graphql'
import { ProductCollectionSortKeys } from '@/gql/storefront/graphql'

export const STORE_COUNTRY = 'United States'
export const STORE_COUNTRY_CODE = 'US'
export const STORE_COUNTRY_ID = '468920434765'

export enum CookieName {
  CART_ID = 'cartId',
}

export type SortFilterItem<T extends string> = {
  title: string
  slug: string
  sortKey: T
  reverse: boolean
}

export const productsSort: SortFilterItem<ProductCollectionSortKeys>[] = [
  { title: 'Featured', slug: 'featured', sortKey: ProductCollectionSortKeys.CollectionDefault, reverse: false },
  { title: 'Best selling', slug: 'best-selling', sortKey: ProductCollectionSortKeys.BestSelling, reverse: false },
  { title: 'Alphabetically: A-Z', slug: 'title-asc', sortKey: ProductCollectionSortKeys.Title, reverse: false },
  { title: 'Alphabetically: Z-A', slug: 'title-desc', sortKey: ProductCollectionSortKeys.Title, reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: ProductCollectionSortKeys.Price, reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: ProductCollectionSortKeys.Price, reverse: true },
]

export const ordersSort: SortFilterItem<OrderSortKeys>[] = [
  { title: 'Relevance', slug: 'relevance', sortKey: OrderSortKeys.ProcessedAt, reverse: true },
  { title: 'Old to new', slug: 'processed-asc', sortKey: OrderSortKeys.ProcessedAt, reverse: false },
  { title: 'New to old', slug: 'processed-desc', sortKey: OrderSortKeys.ProcessedAt, reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: OrderSortKeys.TotalPrice, reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: OrderSortKeys.TotalPrice, reverse: true },

  //BUG WITH SHOPIFY STOREFRONT API WHEN USING PRICE SORTING
  // { title: 'Price: Low to high', slug: 'price-asc', sortKey: OrderSortKeys.TotalPrice, reverse: false },
  // { title: 'Price: High to low', slug: 'price-desc', sortKey: OrderSortKeys.TotalPrice, reverse: true },
]
