import BackgroundImage from '@/components/ui/bg-image'
import { Maybe, Metafield } from '@/gql/storefront/graphql'
import React from 'react'

interface IHeading {
  title?: string
  description?: string
  metafield?: Maybe<Metafield>
}

const Heading: React.FC<IHeading> = ({ title, description, metafield }) => {
  const bgFile = metafield?.reference

  if (!bgFile) {
    return null
  }

  return (
    <div className='w-full p-8 h-[330px] md:h-[400px] lg:h-[450px] relative flex justify-center items-center text-center text-white'>
      <div className='space-y-2'>
        <h1 className='uppercase'>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {bgFile?.__typename === 'MediaImage' && <BackgroundImage img={bgFile.image?.url} />}
    </div>
  )
}

export default Heading
