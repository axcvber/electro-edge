'use client'

import React, { useEffect, useState } from 'react'
import ProductCombobox from '@/components/product/product-combobox'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/actions/product/search-products'
import { Product } from '@/gql/storefront/graphql'

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  const { data, isFetching } = useQuery({
    enabled: !!searchQuery,
    initialData: null,
    queryKey: ['search-products', searchQuery],
    queryFn: async () => await searchProducts(searchQuery),
    select(data) {
      return data?.products || []
    },
  })

  useEffect(() => {
    setProducts(data)
  }, [searchQuery, data])

  return (
    <ProductCombobox
      items={products}
      isLoading={isFetching}
      onSearchChange={(value) => setSearchQuery(value)}
      isActive={!!searchQuery}
    />
  )
}

export default ProductSearch
