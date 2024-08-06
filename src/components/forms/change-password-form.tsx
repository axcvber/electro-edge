'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { NewPassSchemaType, newPassSchema } from '@/validation'
import { useToast } from '../../hooks/use-toast'
import { changePassword } from '@/actions/user/change-password'
import { setFormErrors } from '@/lib/utils'
import FormInputPass from './elements/form-input-pass'
import { useTranslations } from 'next-intl'

const ChangePasswordForm = () => {
  const form = useForm<NewPassSchemaType>({
    resolver: zodResolver(newPassSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { toast } = useToast()
  const isDirty = form.formState.isDirty
  const isSubmitting = form.formState.isSubmitting
  const t = useTranslations('buttons')

  const onSubmit = async (data: NewPassSchemaType) => {
    const result = await changePassword(data)
    if (result?.error) {
      if (Array.isArray(result.error)) {
        setFormErrors(result.error, form.setError)
        return false
      }

      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      form.reset()
      toast({
        title: 'Your password was successfully changed',
        variant: 'success',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
        <div className='space-y-4'>
          <FormInputPass
            control={form.control}
            name='password'
            label='New Password'
            placeholder='******'
            disabled={isSubmitting}
            required
          />
          <FormInputPass
            control={form.control}
            name='confirmPassword'
            label='Confirm Password'
            placeholder={'******'}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className='flex flex-col gap-6'>
          <Button type='submit' disabled={!isDirty || isSubmitting} isLoading={isSubmitting}>
            {t('change_password')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangePasswordForm
