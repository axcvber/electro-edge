'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const UserAvatar = () => {
  return (
    <Avatar size={'xl'}>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback />
    </Avatar>
  )
}

export default UserAvatar
