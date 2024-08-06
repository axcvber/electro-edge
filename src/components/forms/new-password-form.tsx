'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { NewPassSchemaType, newPassSchema } from '@/validation'
import { useToast } from '../../hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { resetUser } from '@/actions/user/reset-user'
import { setFormErrors } from '@/lib/utils'
import { AppRoutes } from '@/routes'
import FormInputPass from './elements/form-input-pass'

const NewPasswordForm = () => {
  const { params } = useParams()
  const router = useRouter()

  const userId = params[0]
  const resetToken = params[1]

  const { toast } = useToast()

  const form = useForm<NewPassSchemaType>({
    resolver: zodResolver(newPassSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (data: NewPassSchemaType) => {
    const result = await resetUser(data, userId, resetToken)
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
        title: 'Your password has been successfully reset',
        description: 'You can now log in with your new password',
        variant: 'success',
      })
      router.push(AppRoutes.LOGIN)
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

        <Button className='w-full' type='submit' isLoading={isSubmitting}>
          {'Reset Password'}
        </Button>
      </form>
    </Form>
  )
}

export default NewPasswordForm
