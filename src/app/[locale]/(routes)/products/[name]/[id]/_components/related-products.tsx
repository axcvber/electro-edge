import ProductCard from '@/components/cards/product-card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { IReshapedProduct } from '@/lib/normalize'
import { cn } from '@/lib/utils'

interface IRelatedProducts {
  data: IReshapedProduct[]
}

const RelatedProducts: React.FC<IRelatedProducts> = ({ data }) => {
  return (
    <div className='space-y-4'>
      <h3>Related Products</h3>
      <Carousel
        className='px-1'
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className='py-4 px-1'>
          {data.map((item) => (
            <CarouselItem
              key={item.id}
              className={cn(`flex-[0_0_70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5`)}
            >
              <ProductCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='-left-3' />
        <CarouselNext className='-right-3' />
      </Carousel>
    </div>
  )
}

export default RelatedProducts
