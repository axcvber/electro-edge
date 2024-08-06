'use client'

import React, { useEffect, useState } from 'react'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)
  const t = useTranslations('countdown')

  return (
    <div className='flex items-start text-center gap-4'>
      <DateTimeDisplay value={days} type={t('days')} isDanger={false} />
      <p className='text-4xl text-primary font-medium'>:</p>
      <DateTimeDisplay value={hours} type={t('hours')} isDanger={false} />
      <p className='text-4xl text-primary font-medium'>:</p>
      <DateTimeDisplay value={minutes} type={t('mins')} isDanger={false} />
      <p className='text-4xl text-primary font-medium'>:</p>
      <DateTimeDisplay value={seconds} type={t('seconds')} isDanger={false} />
    </div>
  )
}

interface IDateTimeDisplay {
  value: string
  type: string
  isDanger: boolean
}

const DateTimeDisplay: React.FC<IDateTimeDisplay> = ({ value, type, isDanger }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className={'flex flex-col gap-2 items-center'}>
      <div
        className={cn(
          `bg-white border w-12 h-12 flex items-center justify-center rounded-lg`,
          isDanger ? 'text-destructive' : 'text-primary'
        )}
      >
        <p className='text-2xl font-semibold '>{isClient ? value : '00'}</p>
      </div>

      <span className='text-sm'>{type}</span>
    </div>
  )
}

export { CountdownTimer }
