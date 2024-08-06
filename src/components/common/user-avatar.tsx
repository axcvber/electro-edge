import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'

const UserAvatar = () => {
  const user = useCurrentUser()

  return (
    <Avatar className='h-9 w-9'>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback className='text-neutral-700'>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
