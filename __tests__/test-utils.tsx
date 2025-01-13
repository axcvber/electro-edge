import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from '@/components/ui/toaster'
// import { SessionProvider } from 'next-auth/react'

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// const messages = (await import(`@/../messages/en.json`)).default

const mockSession = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  expires: '2023-12-31T23:59:59.999Z',
}

const AllTheProviders = ({
  children,
  locale = 'en',
  queryClient,
}: {
  children: React.ReactNode
  locale?: string
  queryClient?: QueryClient
}) => {
  const messages = require(`@/../messages/${locale}.json`)
  return (
    <QueryClientProvider client={queryClient || defaultQueryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <Toaster />
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { locale?: string; queryClient?: QueryClient }
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={options?.queryClient} locale={options?.locale}>
        {children}
      </AllTheProviders>
    ),
    ...options,
  })

export * from '@testing-library/react'
export { customRender as render }
