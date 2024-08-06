import { ShieldCheck, Truck, Wallet } from 'lucide-react'
import React, { ReactNode } from 'react'

const data = [
  {
    icon: <Truck />,
    title: 'Shipping',
    text: 'Enjoy free shipping on all orders over $1000.',
  },
  {
    icon: <Wallet />,
    title: 'Payment',
    text: 'Visa, Mastercard, Apple Pay, PayPal etc.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Warranty',
    text: `12 months official manufacturer's warranty.`,
  },
]

const AdditionalInfo = () => {
  return (
    <div className='space-y-4'>
      {data.map((item, inx) => (
        <InfoItem key={inx} icon={item.icon} title={item.title} text={item.text} />
      ))}
    </div>
  )
}

interface InfoItemProps {
  icon: ReactNode
  title: string
  text: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text, title }) => {
  return (
    <div className='flex items-center gap-2 p-4 border rounded-md '>
      <div className='[&_svg]:w-6 [&_svg]:h-6'>{icon}</div>

      <p className='text-sm text-neutral-500 '>
        <span className='font-semibold text-foreground mr-1'>{title}.</span>
        {text}
      </p>
    </div>
  )
}

export default AdditionalInfo
