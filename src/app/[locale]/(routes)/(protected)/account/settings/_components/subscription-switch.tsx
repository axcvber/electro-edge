'use client'

import { changeSubscription } from '@/actions/user/change-subscription'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useSession } from 'next-auth/react'
import { useTransition } from 'react'

const SubscriptionSwitch = () => {
  const user = useCurrentUser()
  const { toast } = useToast()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const handleChange = (checked: boolean) => {
    startTransition(() => {
      changeSubscription(checked).then((data) => {
        if (data?.error) {
          toast({
            title: data.error,
            variant: 'destructive',
          })
        } else {
          update()
          toast({
            title: 'Your subscription was successfully changed.',
            variant: 'success',
          })
        }
      })
    })
  }

  return (
    <Switch
      className='justify-self-end lg:justify-self-start'
      checked={user?.acceptsMarketing}
      onCheckedChange={handleChange}
      disabled={isPending}
    />
  )
}

export default SubscriptionSwitch
