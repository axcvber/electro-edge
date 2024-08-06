import ProductCarousel from './_components/carousel'
import ProductSidebar from './_components/sidebar'
import RelatedProducts from './_components/related-products'
import ProductInfo from './_components/info'
import { getProductVariant } from '@/actions/product/get-product-variant'
import { getRelatedProducts } from '@/actions/product/get-related-products'
import { notFound } from 'next/navigation'

const ProductVariantPage = async ({ params }: { params: { id: string } }) => {
  const data = await getProductVariant(params.id)

  if (!data) {
    notFound()
  }

  const { productId, images, specification, descriptionHtml, ...rest } = data
  const relatedProducts = await getRelatedProducts(productId)

  return (
    <div className='my-12'>
      <div className='container flex flex-col items-start md:flex-row gap-8 lg:gap-20 my-12'>
        <div className='w-full md:w-1/2 md:sticky top-[140px]'>
          <ProductCarousel data={images} />
        </div>
        <div className='w-full md:w-[500px]'>
          <ProductSidebar {...rest} />
        </div>
      </div>
      <div className='container space-y-12'>
        <ProductInfo description={descriptionHtml} specification={specification} />

        <RelatedProducts data={relatedProducts} />
      </div>
    </div>
  )
}

export default ProductVariantPage
