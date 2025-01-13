'use client'

import { LoginFormSchemaType, loginFormSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '../../hooks/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppRoutes } from '@/routes'
import { Separator } from '../ui/separator'
import AuthCard from '../cards/auth-card'
import FormInput from './elements/form-input'
import type ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useTransition } from 'react'
import { loginUser } from '@/actions/user/login-user'
import { Captcha } from '@/components/common/captcha'

interface ILoginForm {
  resetPassCallback?: () => void
  signUpCallback?: () => void
}

const LoginForm: React.FC<ILoginForm> = ({ signUpCallback, resetPassCallback }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const callbackUrl = searchParams.get('callbackUrl')
  const [isPending, startTransition] = useTransition()
  const captchaRef = useRef<ReCAPTCHA>(null)

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignUpClick = () => {
    if (signUpCallback) {
      signUpCallback()
      return
    }
    router.push(AppRoutes.REGISTER)
  }

  const handleForgotPassClick = () => {
    if (resetPassCallback) {
      resetPassCallback()
      return
    }
    router.push(AppRoutes.RESET_PASSWORD)
  }

  const handleLogin = async (values: LoginFormSchemaType, token: string) => {
    const loginData = await loginUser(values, token, callbackUrl)
    if (loginData?.error) {
      toast({
        title: loginData.error,
        variant: 'destructive',
      })
      return
    }
  }

  const onSubmit = () => captchaRef.current?.execute()

  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      return false
    }

    const values = form.getValues()

    startTransition(() => {
      handleLogin(values, token).finally(() => captchaRef.current?.reset())
    })
  }

  return (
    <AuthCard title={'Log In'} desc={'Please enter your e-mail and password'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
          <Captcha ref={captchaRef} onChange={onCaptchaChange} />
          <div className='space-y-4'>
            <FormInput
              control={form.control}
              name='email'
              type='email'
              label='Email Address'
              placeholder='Enter email'
              disabled={isPending}
              required
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel required>{'Password'}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        aria-label='Password'
                        error={!!error}
                        className='pr-32'
                        placeholder={'Enter password'}
                        type='password'
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        variant='link'
                        className='text-xs absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400'
                        onClick={handleForgotPassClick}
                      >
                        {'Forgot password?'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='w-full' type='submit' isLoading={isPending} loadingText={'Authorizing...'}>
            Sign In
          </Button>
          <div className='flex items-center justify-center gap-1'>
            <span className='text-sm font-medium text-neutral-500'>{`Don't have an account?`}</span>
            <Button variant={'link'} className='underline' onClick={handleSignUpClick}>
              {'Join Us'}
            </Button>
          </div>

          <Separator />

          <p className='text-xs text-center text-neutral-400 leading-5'>
            By logging in, you agree to Tech Bud{' '}
            <Button asChild variant={'link'} className=' text-xs'>
              <Link href={'/'}>{'Privacy Policy'}</Link>
            </Button>{' '}
            and{' '}
            <Button asChild variant={'link'} className=' text-xs'>
              <Link href={'/'}>{'Terms of Use'}</Link>
            </Button>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}

export default LoginForm
