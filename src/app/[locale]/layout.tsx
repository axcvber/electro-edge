import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Poppins, Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { Toaster } from '@/components/ui/toaster'
import ModalProvider from '@/providers/modal-provider'
import ReactQueryProvider from '@/providers/react-query-provider'
import { getSeoMetaData } from '@/actions/app/get-seo-metadata'
import { NextIntlClientProvider } from 'next-intl'
import { loadTranslations } from '@/lib/translations'
import NextTopLoader from 'nextjs-toploader'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

type LocaleParams = {
  params: { locale: string }
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = params.locale
  const data = await getSeoMetaData()

  return {
    title: data?.fields.meta_title,
    description: data?.fields.meta_description,
    icons: {
      icon: data?.fields.site_icon?.url,
    },
    openGraph: {
      title: data?.fields.meta_title,
      description: data?.fields.meta_description,
      images: data?.fields.meta_image?.url,
      locale,
      type: 'website',
    },
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = await loadTranslations(locale)
  } catch (error) {
    console.error('Failed to load translations', error)
  }

  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang={locale}>
        <body className={cn('antialiased', poppins.variable, montserrat.variable)}>
          <NextTopLoader color='#F1FE5D' showSpinner={false} />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ReactQueryProvider>
              {children}
              <Toaster />
              <ModalProvider />
            </ReactQueryProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
