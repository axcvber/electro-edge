'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'

interface IBackButton {
  label?: string
  path?: string
}

const BackButton: React.FC<IBackButton> = ({ label = 'Back', path }) => {
  const router = useRouter()

  const handleBackClick = () => {
    if (path) {
      router.replace(path)
    } else {
      router.back()
    }
  }

  return (
    <Button variant={'outline'} size={'sm'} onClick={handleBackClick}>
      <ArrowLeft />
      {label}
    </Button>
  )
}

export default BackButton
