import { ReturnReason } from '@/gql/admin/graphql'
import { z } from 'zod'

export type ContactFormSchemaType = z.infer<typeof contactFormSchema>

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First Name is required' })
    .max(30, { message: 'Please enter a valid First Name' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Last Name is required' })
    .max(30, { message: 'Please enter a valid Last Name' }),
  phone: z.string(),
  email: z
    .string()
    .min(1, { message: 'Please enter an email address' })
    .max(30, { message: 'Please enter a valid email address' })
    .email({ message: 'Please enter a valid email address' }),
  message: z.string().trim().min(3, { message: 'Please enter a message' }).max(300, { message: 'Max 300 symbols' }),
})

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter an email address' })
    .max(30, { message: 'Please enter a valid email address' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export type RegisterSchemaType = z.infer<typeof registerFormSchema>

export const registerFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First Name is required' })
    .max(30, { message: 'Please enter a valid First Name' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Last Name is required' })
    .max(30, { message: 'Please enter a valid Last Name' }),
  phone: z.string().min(5, { message: 'Please enter a phone number' }),
  email: z
    .string()
    .min(1, { message: 'Please enter an email address' })
    .max(30, { message: 'Please enter a valid email address' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  acceptsMarketing: z.boolean().optional(),
})

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>

export const resetPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter an email address' })
    .max(30, { message: 'Please enter a valid email address' })
    .email({ message: 'Please enter a valid email address' }),
})

export type NewPassSchemaType = z.infer<typeof newPassSchema>

export const newPassSchema = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Please provide matching passwords',
    path: ['confirmPassword'],
  })

export type UserInfoFormSchemaType = z.infer<typeof userInfoFormSchema>

export const userInfoFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First Name is required' })
    .max(30, { message: 'Please enter a valid First Name' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Last Name is required' })
    .max(30, { message: 'Please enter a valid Last Name' }),
  email: z
    .string()
    .min(1, { message: 'Please enter an email address' })
    .max(30, { message: 'Please enter a valid email address' })
    .email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(5, { message: 'Please enter a phone number' }),
})

export type CommentFormType = z.infer<typeof commentFormSchema>

export const commentFormSchema = z.object({
  message: z.string().trim().min(1).max(300),
})

export type AddressSchemaType = z.infer<typeof addressSchema>

export const addressSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'First Name is required' })
    .max(30, { message: 'Please enter a valid First Name' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Last Name is required' })
    .max(30, { message: 'Please enter a valid Last Name' }),
  company: z.string().trim(),
  phone: z.string(),
  address1: z.string().trim().min(1, { message: 'Address 1 is required' }),
  address2: z.string().trim().min(1, { message: 'Address 2 is required' }),
  city: z.string().trim().min(3, { message: 'City is required' }),
  country: z.string().trim().min(3, { message: 'Country is required' }),
  province: z.string().trim(),
  zip: z.string().trim().min(3, { message: 'Zip Code is required' }),
  defaultAddress: z.boolean().optional(),
})

const baseReturnLineItemSchema = z.object({
  fulfillmentLineItemId: z.string(),
  title: z.string(),
  variantTitle: z.string().optional(),
  image: z
    .object({
      url: z.custom(),
      altText: z.custom(),
    })
    .optional(),
  price: z.object({
    amount: z.custom(),
    currencyCode: z.custom(),
  }),
  initialQuantity: z.number(),
  quantity: z.number(),
  customerNote: z.string().optional(),
})

const returnLineItemSchemaSelected = baseReturnLineItemSchema.extend({
  quantity: z.union([z.number().int().positive({ message: 'Enter a quantity greater than or equal to 1' }), z.nan()]),
  returnReason: z.nativeEnum(ReturnReason, { required_error: 'Return reason required' }),
  selected: z.literal<boolean>(true),
})

const returnLineItemSchemaUnselected = baseReturnLineItemSchema.extend({
  returnReason: z.nativeEnum(ReturnReason).optional(),
  selected: z.literal<boolean>(false),
})

const returnLineItemSchema = z
  .discriminatedUnion('selected', [returnLineItemSchemaSelected, returnLineItemSchemaUnselected])
  .superRefine((data, ctx) => {
    if (data.selected) {
      if (data.quantity > data.initialQuantity) {
        ctx.addIssue({
          code: 'too_big',
          type: 'number',
          maximum: data.initialQuantity,
          inclusive: true,
          message: `Enter a quantity less than or equal to ${data.initialQuantity}`,
          path: ['quantity'],
        })
      }
    }
  })

export type ReturnOrderFormSchemaType = z.infer<typeof returnOrderFormSchema>

export const returnOrderFormSchema = z.object({
  lineItems: z
    .array(returnLineItemSchema)
    .refine((lineItems) => lineItems.some((item) => item.selected), 'At least one line item must be selected'),
})
