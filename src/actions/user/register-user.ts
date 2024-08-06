'use server'

import { captchaValidation } from '@/lib/captcha'
import { storefrontClient } from '@/lib/shopify'
import { customerCreateMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { RegisterSchemaType, registerFormSchema } from '@/validation'

export const registerUser = async (values: RegisterSchemaType, captchaToken: string) => {
  try {
    if (!captchaToken) {
      throw new Error('Captcha token is missing')
    }

    await captchaValidation(captchaToken)

    const validatedFields = registerFormSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      throw new Error(errors[0].message)
    }

    const { customerCreate } = await storefrontClient.request(customerCreateMutation, {
      input: validatedFields.data,
    })

    if (customerCreate?.customerUserErrors?.length) {
      throw new Error(customerCreate?.customerUserErrors[0].message)
    }

    if (!customerCreate?.customer?.id) {
      throw new Error('Could not create client, try again later')
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return { error: getErrorMessage(error) }
  }
}
