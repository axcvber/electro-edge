'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RegisterSchemaType, registerFormSchema } from '@/validation'
import { useToast } from '@/hooks/use-toast'
import { AppRoutes } from '@/routes'
import { useRef, useTransition } from 'react'
import { Separator } from '../ui/separator'
import AuthCard from '../cards/auth-card'
import { useRouter } from 'next/navigation'
import FormCheckbox from './elements/form-checkbox'
import FormInput from './elements/form-input'
import FormPhoneInput from './elements/form-phone-input'
import FormInputPass from './elements/form-input-pass'
import { registerUser } from '@/actions/user/register-user'
import type ReCAPTCHA from 'react-google-recaptcha'
import { Captcha } from '../common/captcha'
import { loginUser } from '@/actions/user/login-user'

interface IRegisterForm {
  signInCallback?: () => void
}

const RegisterForm: React.FC<IRegisterForm> = ({ signInCallback }) => {
  const router = useRouter()
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      acceptsMarketing: false,
    },
  })
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const captchaRef = useRef<ReCAPTCHA>(null)

  const handleSignInClick = () => {
    if (signInCallback) {
      signInCallback()
      return
    }
    router.push(AppRoutes.LOGIN)
  }

  const handleRegistration = async (values: RegisterSchemaType, token: string) => {
    const registrationData = await registerUser(values, token)

    if (registrationData?.error) {
      toast({
        title: registrationData.error,
        variant: 'destructive',
      })
      return
    }

    const loginData = await loginUser(values)
    if (loginData?.error) {
      window.location.replace(AppRoutes.LOGIN)
      toast({
        title: loginData.error,
        variant: 'destructive',
      })
      return
    }
    form.reset()
    toast({
      title: "You've successfully registered your account",
      variant: 'success',
    })
  }

  const onSubmit = () => captchaRef.current?.execute()

  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      return false
    }

    const values = form.getValues()

    startTransition(() => {
      handleRegistration(values, token).finally(() => captchaRef.current?.reset())
    })
  }

  return (
    <AuthCard
      title={'Registration'}
      desc={'Create your profile and get first access to the very best of Future Tech contents.'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-5'>
          <Captcha ref={captchaRef} onChange={onCaptchaChange} />
          <div className='space-y-4'>
            <FormInput
              control={form.control}
              name='firstName'
              label='First Name'
              placeholder='Enter First Name'
              disabled={isPending}
              required
            />
            <FormInput
              control={form.control}
              name='lastName'
              label='Last Name'
              placeholder='Enter Last Name'
              disabled={isPending}
              required
            />
            <FormPhoneInput
              control={form.control}
              name='phone'
              label='Phone Number'
              placeholder='Enter phone number'
              disabled={isPending}
              required
            />
            <FormInput
              control={form.control}
              name='email'
              type='email'
              label='Email Address'
              placeholder='Enter email'
              disabled={isPending}
              required
            />
            <FormInputPass
              control={form.control}
              name='password'
              label='Password'
              placeholder='Enter password'
              disabled={isPending}
            />
            <FormCheckbox
              control={form.control}
              name='acceptsMarketing'
              label='Receive updates from Tech Bud on new products and promotions.'
              disabled={isPending}
            />
          </div>

          <Button className='w-full' type='submit' isLoading={isPending} loadingText={'Registering...'}>
            {'Sign Up'}
          </Button>

          <div className='flex items-center justify-center gap-1'>
            <span className='text-sm font-medium text-neutral-500'>{`Already have an account?`}</span>
            <Button variant={'link'} className='underline' onClick={handleSignInClick}>
              {'Log In'}
            </Button>
          </div>

          <Separator />

          <p className='text-xs text-center text-neutral-400 leading-5'>
            By creating an account, you agree to Tech Bud{' '}
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

export default RegisterForm
