'use client'

import React from 'react'
import InfoBox from './info-box'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'

interface IErrorSection {
  errorMessage: string
  resetCallback: () => void
}

const ErrorSection: React.FC<IErrorSection> = ({ errorMessage, resetCallback }) => {
  return (
    <InfoBox
      icon={<AlertTriangle />}
      title='An error occurred!'
      desc={errorMessage}
      button={
        <Button className='px-6' size={'sm'} variant={'secondary'} onClick={resetCallback}>
          Try again
        </Button>
      }
    />
  )
}

export default ErrorSection
