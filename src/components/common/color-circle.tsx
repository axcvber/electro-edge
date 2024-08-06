import React from 'react'
import { cn } from '@/lib/utils'

interface ColorCircleProps {
  color?: string
  isSelected?: boolean
  isLarge?: boolean
  onClick?: () => void
}

const ColorCircle: React.FC<ColorCircleProps> = ({ color, isSelected, isLarge = false, onClick }) => {
  return (
    <div
      className={cn(
        `w-5 h-5 rounded-full ring-1 ring-transparent ring-offset-1 cursor-pointer border border-neutral-300`,
        isLarge && 'w-6 h-6 ring-2',
        isSelected && 'ring-primary'
      )}
      style={{ background: color }}
      onClick={onClick}
    />
  )
}

export default ColorCircle
