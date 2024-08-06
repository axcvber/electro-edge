import { CreditCard } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

const CheckoutButton = ({ url }: { url: string }) => {
  const { pending } = useFormStatus()
  return (
    <>
      <input type='hidden' name='url' value={url} hidden />
      <Button type='submit' isLoading={pending} loadingText='Processing...'>
        <CreditCard />
        Checkout Now
      </Button>
    </>
  )
}

export default CheckoutButton
