'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ResetPasswordFormType, resetPasswordFormSchema } from '@/validation'
import { AppRoutes } from '@/routes'
import { useToast } from '../../hooks/use-toast'
import AuthCard from '../cards/auth-card'
import { useRouter } from 'next/navigation'
import { recoverUser } from '@/actions/user/recover-user'
import { setFormErrors } from '@/lib/utils'
import { Captcha } from '../common/captcha'
import type ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useTransition } from 'react'

interface IResetPasswordForm {
  signInCallback?: () => void
}

const ResetPasswordForm: React.FC<IResetPasswordForm> = ({ signInCallback }) => {
  const router = useRouter()

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const captchaRef = useRef<ReCAPTCHA>(null)

  const handleSignInClick = () => {
    if (signInCallback) {
      signInCallback()
      return
    }
    router.push(AppRoutes.LOGIN)
  }

  const onSubmit = () => captchaRef.current?.execute()

  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      return false
    }

    const values = form.getValues()

    startTransition(() => {
      recoverUser(values, token)
        .then((data) => {
          if (data?.error) {
            if (Array.isArray(data.error)) {
              setFormErrors(data.error, form.setError)
              return false
            }

            toast({
              title: data.error,
              variant: 'destructive',
            })
          } else {
            form.reset()
            toast({
              title: 'Reset email sent!',
              description: 'Check your email for a confirmation link.',
              variant: 'success',
            })
          }
        })
        .finally(() => captchaRef.current?.reset())
    })
  }

  return (
    <AuthCard title={'Reset Password'} desc={'Enter the registered E-mail'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5 mb-3'>
          <Captcha ref={captchaRef} onChange={onCaptchaChange} />
          <FormField
            control={form.control}
            name='email'
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>{'Email Address'}</FormLabel>
                <FormControl>
                  <Input error={!!error} placeholder={'Enter email'} type='email' disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='w-full' type='submit' isLoading={isPending}>
            {'Submit'}
          </Button>

          <div className='flex items-center justify-center gap-1 w-full'>
            <span className='text-sm font-medium text-neutral-500'>{`Remember the password?`}</span>
            <Button variant={'link'} className='underline' onClick={handleSignInClick}>
              {'Back to Login'}
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  )
}

export default ResetPasswordForm
