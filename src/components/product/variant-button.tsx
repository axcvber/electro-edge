import React from 'react'
import { Button } from '../ui/button'
import { Check } from 'lucide-react'

interface IVariantButton {
  label: string
  isSelected?: boolean
  onClick: () => void
}

const VariantButton: React.FC<IVariantButton> = ({ label, isSelected, onClick }) => {
  return (
    <Button variant={'outline'} onClick={onClick}>
      {isSelected && <Check className='text-primary' />}
      {label}
    </Button>
  )
}

export default VariantButton
