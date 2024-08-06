import { NormalizedMetaobject } from '@/lib/normalize'
import HeroSlider from './hero-slider'
import SpecialDeals from './special-deals'
import Categories from './categories'
import AccordionSection from './acc-section'
import ProductsCarousel from './products-carousel'
import SaleCountdown from './sale-countdown'
import Newsletter from './newsletter'
import Values from './values'
import ContactFormSection from './contact-form-section'
import ShopBanner from './shop-banner'
import Map from './map'

const componentMapping: any = {
  'slider': HeroSlider,
  'categories': Categories,
  'product_carousel': ProductsCarousel,
  'special_deals': SpecialDeals,
  'sale_countdown': SaleCountdown,
  'accordion': AccordionSection,
  'newsletter': Newsletter,
  'values': Values,
  'map': Map,
  'shop_banner': ShopBanner,
  'contact_form': ContactFormSection,
}

const getBlockComponent = (item: NormalizedMetaobject, index: number) => {
  const Block = item?.type ? componentMapping[item.type] : null

  return Block ? (
    <section key={`${item?.type}-${index}`}>
      <Block {...item.fields} />
    </section>
  ) : null
}

const BlockManager: React.FC<{ blocks?: NormalizedMetaobject[] }> = ({ blocks }) => {
  return <>{blocks?.map(getBlockComponent)}</>
}

export default BlockManager
