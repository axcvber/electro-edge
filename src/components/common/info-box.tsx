'use client'

import React, { ReactNode } from 'react'

interface InfoBoxProps {
  icon: ReactNode
  title: string
  desc?: string
  button?: ReactNode
}

const InfoBox: React.FC<InfoBoxProps> = ({ icon, title, desc, button }) => {
  return (
    <div className='flex items-center justify-center min-h-[500px]'>
      <div className='space-y-3 text-center max-w-md'>
        <div className='[&_svg]:w-12 [&_svg]:h-12 [&_svg]:mx-auto'>{icon}</div>
        <div className='space-y-1'>
          <h5>{title}</h5>
          {desc && <p className='text-sm text-neutral-600'>{desc}</p>}
        </div>
        {button}
      </div>
    </div>
  )
}

export default InfoBox
