'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { UserInfoFormSchemaType, userInfoFormSchema } from '@/validation'
import { useToast } from '../../hooks/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { updateUserInfo } from '@/actions/user/update-user-info'
import { setFormErrors } from '@/lib/utils'
import FormInput from './elements/form-input'
import FormPhoneInput from './elements/form-phone-input'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

const UserInfoForm = () => {
  const user = useCurrentUser()
  const { toast } = useToast()
  const { update } = useSession()
  const t = useTranslations('buttons')

  const form = useForm<UserInfoFormSchemaType>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const isDirty = form.formState.isDirty
  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (data: UserInfoFormSchemaType) => {
    const result = await updateUserInfo(data)
    if (result?.error) {
      if (Array.isArray(result.error)) {
        setFormErrors(result.error, form.setError)
        return false
      }

      form.reset()
      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      await update()
      form.reset(data)
      toast({
        title: 'Your data was successfully updated.',
        variant: 'success',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
            required
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

        <div className='flex justify-end gap-3'>
          <Button size={'sm'} variant={'outline'} disabled={!isDirty || isSubmitting} onClick={() => form.reset()}>
            {t('cancel')}
          </Button>
          <Button
            size={'sm'}
            type='submit'
            disabled={!isDirty || isSubmitting}
            loadingText='Saving...'
            isLoading={isSubmitting}
          >
            {t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserInfoForm
