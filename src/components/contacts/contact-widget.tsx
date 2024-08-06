import React from 'react'
import Contacts from './contacts'
import { ContactFormSectionFields } from '../blocks/contact-form-section'
import Markdown from '../markdown'
import { useTranslations } from 'next-intl'

const ContactWidget: React.FC<ContactFormSectionFields> = ({ title, description, opening_hours }) => {
  const t = useTranslations('headings')
  return (
    <div className='w-full md:max-w-[400px] bg-accent p-6 rounded-md space-y-5 border'>
      <div className='space-y-2'>
        <h3>{title}</h3>
        <p className='text-neutral-500 text-sm'>{description}</p>
      </div>

      <Contacts />

      <div>
        <h4 className='mb-3 inline-block pb-2 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'>
          {t('opening_hours')}
        </h4>
        <Markdown content={opening_hours} />
      </div>
    </div>
  )
}

export default ContactWidget
