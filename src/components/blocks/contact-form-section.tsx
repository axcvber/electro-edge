import React from 'react'
import ContactForm from '@/components/forms/contact-form'
import ContactWidget from '../contacts/contact-widget'

export interface ContactFormSectionFields {
  title?: string
  description?: string
  opening_hours?: string
}

const ContactFormSection: React.FC<ContactFormSectionFields> = (data) => {
  return (
    <section className='container my-12 flex flex-col-reverse md:flex-row items-start gap-12'>
      <ContactForm />
      <ContactWidget {...data} />
    </section>
  )
}

export default ContactFormSection
