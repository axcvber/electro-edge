import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductReturn from './product-return'
import ProductSpec from './product-spec'
import ProductDesc from './product-desc'
import { Metaobject } from '@/gql/storefront/graphql'

interface IProductInfo {
  description: string
  specification: Metaobject[]
}

const ProductInfo: React.FC<IProductInfo> = ({ description, specification }) => {
  return (
    <Tabs defaultValue='description'>
      <TabsList className='mb-4 w-full overflow-x-auto'>
        <TabsTrigger value='description'>Description</TabsTrigger>
        <TabsTrigger value='specification'>Specification</TabsTrigger>
        <TabsTrigger value='return'>Return</TabsTrigger>
      </TabsList>
      <TabsContent value='description' asChild>
        <ProductDesc data={description} />
      </TabsContent>
      <TabsContent value='specification' asChild>
        <ProductSpec data={specification} />
      </TabsContent>
      <TabsContent value='return' asChild>
        <ProductReturn />
      </TabsContent>
    </Tabs>
  )
}

export default ProductInfo
