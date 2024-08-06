import React, { ReactNode } from 'react'
import Logo from '../common/logo'

interface IAuthCard {
  title: string
  desc?: string
  children: ReactNode
}

const AuthCard: React.FC<IAuthCard> = ({ title, desc, children }) => {
  return (
    <div className='max-w-[350px] w-full mx-auto'>
      <Logo variant='dark' />
      <div className='my-5'>
        <h1 className='h3'>{title}</h1>
        {desc && <p className='mt-2 text-sm leading-6 text-neutral-400'>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export default AuthCard
