import NextAuth from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import { Customer } from '@/gql/graphql'

export interface ExtendedUser {
  id?: string
  firstName?: string | null | undefined
  lastName?: string | null | undefined
  acceptsMarketing?: boolean
  email?: string | null | undefined
  phone?: string | null | undefined
  accessToken?: string
  cartId?: string
  wishlistId?: string
  defaultAddressId?: string
}

declare module 'next-auth' {
  interface User extends ExtendedUser {}

  interface Session {
    user: ExtendedUser
    accessToken?: string
    error?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: ExtendedUser
    accessToken?: string
  }
}
