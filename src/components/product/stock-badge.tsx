import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

interface IStockBadge {
  isEnds: boolean
  isAvailable: boolean
}

const StockBadge: React.FC<IStockBadge> = ({ isEnds, isAvailable }) => {
  const t = useTranslations('labels')
  if (isEnds) {
    return (
      <Badge variant='default' className='bg-yellow-500'>
        {t('ends')}
      </Badge>
    )
  }

  if (!isAvailable) {
    return <Badge variant='destructive'>{t('out_of_stock')}</Badge>
  }

  return (
    <Badge variant='default' className='bg-green-500'>
      {t('in_stock')}
    </Badge>
  )
}

export default StockBadge
