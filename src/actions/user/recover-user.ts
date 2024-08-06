'use server'

import { captchaValidation } from '@/lib/captcha'
import { storefrontClient } from '@/lib/shopify'
import { CustomerRecoverMutation } from '@/lib/shopify/storefront/mutations/customer'
import { getErrorMessage } from '@/lib/utils'
import { ResetPasswordFormType, resetPasswordFormSchema } from '@/validation'

export const recoverUser = async (values: ResetPasswordFormType, captchaToken: string) => {
  try {
    if (!captchaToken) {
      throw new Error('Captcha token is missing')
    }

    await captchaValidation(captchaToken)

    const validatedFields = resetPasswordFormSchema.safeParse(values)

    if (!validatedFields.success) {
      const { errors } = validatedFields.error
      return { error: errors }
    }

    const { email } = validatedFields.data

    const { customerRecover } = await storefrontClient.request(CustomerRecoverMutation, {
      email,
    })

    if (customerRecover?.customerUserErrors.length) {
      throw new Error(customerRecover.customerUserErrors[0].message)
    }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
