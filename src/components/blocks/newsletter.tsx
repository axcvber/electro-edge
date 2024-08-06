'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import BackgroundImage from '@/components/ui/bg-image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { ResetPasswordFormType, resetPasswordFormSchema } from '@/validation'
import { Image } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'
import FormInput from '@/components/forms/elements/form-input'
import { useToast } from '@/hooks/use-toast'
import { subscribeUser } from '@/actions/user/subscribe-user'

interface NewsletterFields {
  newsletter_reference: NormalizedNewsletterReference
}
interface NormalizedNewsletterReference {
  fields: {
    title: string
    description: string
    image: Image
  }
}

const Newsletter: React.FC<NewsletterFields> = ({ newsletter_reference }) => {
  const t = useTranslations()
  const { toast } = useToast()

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async ({ email }: ResetPasswordFormType) => {
    const result = await subscribeUser(email)
    if (result?.error) {
      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      form.reset()
      toast({
        title: 'You have successfully subscribed 🎉',
        variant: 'success',
      })
    }
  }

  return (
    <div className='container my-12'>
      <div className='relative w-full flex items-center justify-end min-h-[400px] border overflow-hidden rounded-md px-10 md:px-16 py-16'>
        <div className='max-w-sm space-y-5'>
          <h2 className='text-4xl'>{newsletter_reference.fields.title}</h2>
          <p>{newsletter_reference.fields.description}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
              <FormInput
                control={form.control}
                name='email'
                type='email'
                placeholder={t('placeholders.enter_email')}
                disabled={isSubmitting}
              />

              <Button type='submit' isLoading={isSubmitting}>
                {t('buttons.subscribe')}
              </Button>
            </form>
          </Form>
        </div>
        <BackgroundImage gradientPlacement='right' img={newsletter_reference.fields.image.url} />
      </div>
    </div>
  )
}

export default Newsletter
