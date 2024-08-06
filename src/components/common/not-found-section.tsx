import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const NotFoundSection = () => {
  return (
    <section className='container flex justify-center items-center min-h-[500px] h-full'>
      <div className='max-w-80 text-center '>
        <h1 className='h3'>Page Not Found</h1>
        <p className='text-sm mt-1'>Could not find requested resource</p>
        <Button asChild variant={'secondary'} className='mt-3'>
          <Link href='/'>Return Home</Link>
        </Button>
      </div>
    </section>
  )
}

export default NotFoundSection
