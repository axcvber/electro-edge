import React from 'react'
import CatalogButton from './catalog-button'
import { MenuItem } from '@/gql/storefront/graphql'
import ProductSearch from '../common/product-search'
import { cn } from '@/lib/utils'

const SearchBar: React.FC<{ catalogMenu: MenuItem[] }> = ({ catalogMenu }) => {
  return (
    <div className={cn('hidden lg:flex max-w-[700px] w-full items-center rounded-md bg-white')}>
      <CatalogButton catalogMenu={catalogMenu} />
      <ProductSearch />
    </div>
  )
}

export default SearchBar
