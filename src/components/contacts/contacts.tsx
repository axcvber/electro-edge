'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useInitialData } from '@/hooks/use-initial-data'

const Contacts = () => {
  const { contacts } = useInitialData()

  const data = contacts?.fields

  return (
    <div className='flex flex-col items-start gap-4'>
      <Button asChild variant={'unstyled'} className='hover:text-primary'>
        <a href={`tel:${data?.phone}`}>
          <Phone />
          {data?.phone}
        </a>
      </Button>

      <Button asChild variant={'unstyled'} className='hover:text-primary'>
        <a href={`mailto:${data?.email}`}>
          <Mail />
          {data?.email}
        </a>
      </Button>

      <Button asChild variant={'unstyled'} className='hover:text-primary'>
        <a href={`https://www.google.com/search?q=${data?.address}`} target='_blank' rel='noopener noreferrer'>
          <MapPin />
          {data?.address}
        </a>
      </Button>
    </div>
  )
}

export default Contacts
