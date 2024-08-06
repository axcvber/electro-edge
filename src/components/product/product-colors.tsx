import { IReshapedProduct } from '@/lib/normalize'
import { getVariantIdByColor } from '@/lib/utils'
import ColorCircle from '../common/color-circle'
import Link from 'next/link'

interface ProductColorsProps extends Pick<IReshapedProduct, 'handle' | 'variants'> {
  selectedVariantColorHex?: string | null
}

const ProductColors: React.FC<ProductColorsProps> = ({ handle, variants, selectedVariantColorHex }) => {
  const uniqueColorHexValues = new Set(
    variants.flatMap((variant) => (variant.colorHex ? [variant.colorHex.value] : []))
  )

  if (uniqueColorHexValues.size === 0) {
    return null
  }

  const MAX_COLOR_CIRCLES = 5
  const colorHexArray = Array.from(uniqueColorHexValues)

  return (
    <div className='flex items-center gap-2'>
      {colorHexArray.slice(0, MAX_COLOR_CIRCLES).map((color, index) => (
        <Link key={`${color}-${index}`} href={`/products/${handle}/${getVariantIdByColor(color, variants)}`}>
          <ColorCircle color={color} isSelected={selectedVariantColorHex === color} />
        </Link>
      ))}
    </div>
  )
}

export default ProductColors
