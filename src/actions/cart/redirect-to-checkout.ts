'use server'

import { redirect } from 'next/navigation'

export async function redirectToCheckout(formData: FormData) {
  const url = formData.get('url') as string
  redirect(url)
}
