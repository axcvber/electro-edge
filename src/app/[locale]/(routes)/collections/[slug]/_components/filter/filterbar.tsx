'use client'

import React from 'react'
import FilterList from './filter-list'

const FilterBar = () => {
  return (
    <aside className='w-full hidden lg:block lg:max-w-[300px] border rounded-md p-4 py-0 space-y-5 lg:sticky top-[150px]'>
      <FilterList />
    </aside>
  )
}

export default FilterBar
