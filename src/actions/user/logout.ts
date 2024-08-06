'use server'

import { signOut } from '@/auth'
import { CookieName } from '@/lib/constants'
import { cookies } from 'next/headers'

export const logout = async () => {
  cookies().delete(CookieName.CART_ID)
  await signOut({ redirectTo: '/' })
}
