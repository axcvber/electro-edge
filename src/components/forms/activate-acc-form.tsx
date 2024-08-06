'use client'

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useToast } from '../../hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPassSchemaType, newPassSchema } from '@/validation'
import { Form } from '../ui/form'
import FormInputPass from './elements/form-input-pass'
import { Button } from '../ui/button'
import { AppRoutes } from '@/routes'
import { setFormErrors } from '@/lib/utils'
import { activateUser } from '@/actions/user/activate-user'

const ActivateAccForm = () => {
  const { params } = useParams()
  const router = useRouter()
  const userId = params[0]
  const activationToken = params[1]
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
    const result = await activateUser(data, userId, activationToken)
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
        title: 'Your account has been successfully activated',
        description: 'You can now log in with your password',
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
            label='Password'
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
          {'Activate Account'}
        </Button>
      </form>
    </Form>
  )
}

export default ActivateAccForm
