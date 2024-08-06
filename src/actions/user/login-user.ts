'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { LoginFormSchemaType, loginFormSchema } from '@/validation'
import { captchaValidation } from '@/lib/captcha'
import { getErrorMessage } from '@/lib/utils'
import { storefrontClient } from '@/lib/shopify'
import { customerAccessTokenCreateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { isRedirectError } from 'next/dist/client/components/redirect'

export const loginUser = async (values: LoginFormSchemaType, captchaToken?: string, callbackUrl?: string | null) => {
  try {
    if (captchaToken) {
      await captchaValidation(captchaToken)
    }

    const validatedFields = loginFormSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      throw new Error(errors[0].message)
    }

    const { email, password } = validatedFields.data

    const { customerAccessTokenCreate } = await storefrontClient.request(customerAccessTokenCreateMutation, {
      input: {
        email,
        password,
      },
    })

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      const errorMessage = customerAccessTokenCreate?.customerUserErrors[0].message
      const result = errorMessage === 'Unidentified customer' ? 'Incorrect email or password' : errorMessage
      throw new Error(result)
    }

    const { customerAccessToken } = customerAccessTokenCreate

    if (!customerAccessToken.accessToken) {
      throw new Error('Cannot generate token')
    }

    await signIn('credentials', {
      accessToken: customerAccessToken.accessToken,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    console.error('Error during log in:', error)

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid token' }
        default:
          return { error: getErrorMessage(error.cause?.err) }
      }
    }

    if (isRedirectError(error)) {
      throw error
    }

    return { error: getErrorMessage(error) }
  }
}
