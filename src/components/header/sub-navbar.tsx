'use client'

import { MapPin, Phone } from 'lucide-react'
import { Separator } from '../ui/separator'
import LocaleMenu from '../locale-menu'
import SocialIcons from '../social-icons'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useInitialData } from '@/hooks/use-initial-data'

const SubNavbar = () => {
  const { contacts } = useInitialData()
  const data = contacts?.fields

  return (
    <div className='w-full py-3 border-b border-primary/80 relative'>
      <div className='container flex justify-between text-primary-foreground'>
        <div className='hidden lg:flex items-center gap-6'>
          <Button asChild variant={'link'} className='text-white hover:text-white'>
            <a href={`https://www.google.com/search?q=${data?.address}`} target='_blank' rel='noopener noreferrer'>
              <MapPin />
              {data?.address}
            </a>
          </Button>
          <Separator orientation='vertical' />
          <Button asChild variant={'link'} className='text-white hover:text-white'>
            <a href={`tel:${data?.phone}`}>
              <Phone />
              {data?.phone}
            </a>
          </Button>
        </div>
        <div className='flex gap-6 items-center justify-between w-full lg:w-auto'>
          <LocaleMenu />
          <Separator orientation='vertical' className='hidden lg:block' />
          <SocialIcons />
        </div>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-primary -z-[1]'>
        <Image priority fill src='/abstract.svg' alt='abstract' className='object-cover opacity-20' />
      </div>
    </div>
  )
}

export default SubNavbar
