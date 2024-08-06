import React from 'react'

interface MapFields {
  embed_url: string
}

const Map: React.FC<MapFields> = ({ embed_url }) => {
  return (
    <section className='container my-12'>
      <iframe
        width='100%'
        src={embed_url}
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        className='rounded-md bg-accent border h-[400px] lg:h-[500px]'
      />
    </section>
  )
}

export default Map
