'use client'

import { devtools } from 'zustand/middleware'
import { Filter } from '@/gql/storefront/graphql'
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

interface FilterProps {
  data: Filter[]
  defaultPriceRange: string
}

interface FilterState extends FilterProps {
  setFilters: (data: Filter[]) => void
}

type FilterStore = ReturnType<typeof createFilterStore>

const createFilterStore = (initProps?: Partial<FilterProps>) => {
  const DEFAULT_PROPS: FilterProps = {
    data: [],
    defaultPriceRange: '',
  }

  return createStore<FilterState>()(
    devtools(
      (set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        setFilters: (data) => set({ data }),
      }),
      { name: 'filter-storage' }
    )
  )
}

const FilterContext = createContext<FilterStore | null>(null)

type FilterProviderProps = React.PropsWithChildren<FilterProps>

function FilterProvider({ children, ...props }: FilterProviderProps) {
  const storeRef = useRef<FilterStore>()
  if (!storeRef.current) {
    storeRef.current = createFilterStore(props)
  }
  return <FilterContext.Provider value={storeRef.current}>{children}</FilterContext.Provider>
}

function useFilterStore<T>(selector: (state: FilterState) => T): T {
  const store = useContext(FilterContext)
  if (!store) throw new Error('Missing FilterContext.Provider in the tree')
  return useStore(store, selector)
}

export { FilterProvider, useFilterStore }
