import { useCart } from './use-cart'

export const useIsItemAdded = (variantId: string) => {
  const { cart } = useCart()
  const isAdded = !!cart?.lines.find((item) => item.merchandise.id === variantId)

  return isAdded
}
