import React from 'react'
import { getPolicyPage } from '@/actions/pages/get-policy-page'
import { notFound } from 'next/navigation'
import Markdown from '@/components/markdown'

const PolicyPage = async ({ params }: { params: { slug: string } }) => {
  const data = await getPolicyPage(params.slug)

  if (!data) {
    notFound()
  }

  return (
    <div className='container max-w-screen-lg my-12 space-y-8'>
      <div className='flex justify-center'>
        <h1 className='h3'>{data.title}</h1>
      </div>
      <Markdown content={data.body} parseRichText={false} />
    </div>
  )
}

export default PolicyPage
