'use client'

import React, { useEffect } from 'react'
import { Spinner } from './ui/spinner'
import { useInView } from 'react-intersection-observer'
import { FetchNextPageOptions } from '@tanstack/react-query'

interface InfiniteScrollProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => void
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ hasNextPage, isFetchingNextPage, fetchNextPage }) => {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, inView, fetchNextPage])

  return (
    <div ref={ref} className='flex justify-center mt-8'>
      {isFetchingNextPage && <Spinner size={'sm'} />}
    </div>
  )
}

export default InfiniteScroll
