'use client'

import ErrorSection from '@/components/common/error-section'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className='w-full h-full'>
        <ErrorSection errorMessage={error.message} resetCallback={reset} />
      </body>
    </html>
  )
}
