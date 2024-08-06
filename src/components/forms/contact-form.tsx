'use client'

import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ContactFormSchemaType, contactFormSchema } from '@/validation'
import { useTranslations } from 'next-intl'
import FormInput from './elements/form-input'
import FormPhoneInput from './elements/form-phone-input'
import FormTextarea from './elements/form-textarea'
import { useToast } from '@/hooks/use-toast'

const ContactForm = () => {
  const form = useForm<ContactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting
  const t = useTranslations()
  const { toast } = useToast()

  const onSubmit = async (data: ContactFormSchemaType) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    form.reset()

    toast({
      title: 'Your question has been submitted successfully. We will get back to you as soon as possible.',
      variant: 'success',
    })
  }

  return (
    <div className='w-full'>
      <div className='space-y-2 mb-8'>
        <h2>{t('contact.title')}</h2>
        <p className='text-neutral-500'>{t('contact.desc')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
          <div className='grid lg:grid-cols-2 gap-5'>
            <FormInput
              control={form.control}
              name='firstName'
              label='First Name'
              placeholder='Enter First Name'
              disabled={isSubmitting}
              required
            />

            <FormInput
              control={form.control}
              name='lastName'
              label='Last Name'
              placeholder='Enter Last Name'
              disabled={isSubmitting}
              required
            />
            <FormPhoneInput
              control={form.control}
              name='phone'
              label='Phone Number'
              placeholder='Enter phone number'
              disabled={isSubmitting}
            />
            <FormInput
              control={form.control}
              name='email'
              type='email'
              label='Email Address'
              placeholder='Enter email'
              disabled={isSubmitting}
              required
            />
          </div>

          <FormTextarea
            control={form.control}
            name='message'
            label='Message'
            placeholder='Enter your message ...'
            disabled={isSubmitting}
            required
          />

          <Button className='px-6' type='submit' isLoading={isSubmitting}>
            {t('buttons.submit')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm
