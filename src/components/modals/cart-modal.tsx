import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Modal } from '@/components/ui/modal'
import useModalStore from '@/store/use-modal-store'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/cart/use-cart'
import { formatPrice } from '@/lib/utils'
import { redirectToCheckout } from '@/actions/cart/redirect-to-checkout'
import CheckoutButton from '@/components/cart/checkout-button'
import CartList from '@/components/cart/cart-list'

const CartModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)
  const { cart } = useCart()

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-3xl xl:max-w-5xl p-0 flex flex-col'>
      <DialogHeader>
        <DialogTitle>Cart</DialogTitle>
        <DialogDescription>{cart?.totalQuantity} Items</DialogDescription>
      </DialogHeader>
      <div className='h-full sm:h-[500px] overflow-hidden'>
        <CartList data={cart?.lines} />
      </div>
      {cart && (
        <DialogFooter className='sticky bottom-0'>
          <div>
            <p className='text-md font-medium text-neutral-500'>Estimated total:</p>
            <span className='text-xl font-semibold'>
              {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
            </span>
          </div>
          <div className='flex flex-row-reverse sm:flex-row items-center gap-4'>
            <Button variant={'link'} onClick={hideModal}>
              Continue Shopping
            </Button>
            <form action={redirectToCheckout}>
              <CheckoutButton url={cart.checkoutUrl} />
            </form>
          </div>
        </DialogFooter>
      )}
    </Modal>
  )
}

export default CartModal
