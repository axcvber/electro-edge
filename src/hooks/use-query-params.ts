import { useSearchParams as useNextSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type SearchParamsUpdates = Record<string, string | string[] | undefined>

const useQueryParams = () => {
  const searchParams = useNextSearchParams()
  const searchParamsEntries = searchParams ? Array.from(searchParams.entries()) : []

  const updateSearchParam = useCallback(
    (updates: SearchParamsUpdates) => {
      const currentParams = new URLSearchParams(searchParamsEntries)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          currentParams.delete(key)
        } else if (Array.isArray(value)) {
          currentParams.delete(key)
          value.forEach((v) => currentParams.append(key, v))
        } else {
          currentParams.set(key, value)
        }
      })

      const newSearchParams = currentParams.toString()
      const queryString = newSearchParams ? `?${newSearchParams}` : ''
      const newUrl = `${window.location.origin}${window.location.pathname}${queryString}`

      window.history.replaceState(null, '', newUrl)
    },
    [searchParamsEntries]
  )

  const deleteSearchParams = useCallback(
    (keyValuePairs: Record<string, string | string[] | undefined>) => {
      const currentParams = new URLSearchParams(searchParamsEntries)

      Object.entries(keyValuePairs).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          currentParams.delete(key)
        } else if (Array.isArray(value)) {
          const existingValues = currentParams.getAll(key)
          const updatedValues = existingValues.filter((v) => !value.includes(v))
          currentParams.delete(key)
          updatedValues.forEach((v) => currentParams.append(key, v))
        } else {
          const existingValues = currentParams.getAll(key)
          const updatedValues = existingValues.filter((v) => v !== value)
          currentParams.delete(key)
          updatedValues.forEach((v) => currentParams.append(key, v))
        }
      })

      const newSearchParams = currentParams.toString()
      const queryString = newSearchParams ? `?${newSearchParams}` : ''
      const newUrl = `${window.location.origin}${window.location.pathname}${queryString}`

      window.history.replaceState(null, '', newUrl)
    },
    [searchParamsEntries]
  )

  const toggleSearchParam = useCallback(
    (key: string, value?: string) => {
      const currentParams = new URLSearchParams(searchParamsEntries)
      const existingValues = currentParams.getAll(key)

      if (existingValues.includes(value || '')) {
        const updatedValues = existingValues.filter((v) => v !== value)
        currentParams.delete(key)
        updatedValues.forEach((v) => currentParams.append(key, v))
      } else {
        currentParams.append(key, value || '')
      }

      const newSearchParams = currentParams.toString()
      const queryString = newSearchParams ? `?${newSearchParams}` : ''
      const newUrl = `${window.location.origin}${window.location.pathname}${queryString}`

      window.history.replaceState(null, '', newUrl)
    },
    [searchParamsEntries]
  )

  const clearAllParams = useCallback(() => {
    const newUrl = `${window.location.origin}${window.location.pathname}`
    window.history.replaceState(null, '', newUrl)
  }, [])

  const hasParam = useCallback(
    (key: string, value?: string) => {
      const currentParams = new URLSearchParams(searchParamsEntries)
      const existingValues = currentParams.getAll(key)

      if (value === undefined) {
        return existingValues.length > 0
      } else {
        return existingValues.includes(value)
      }
    },
    [searchParamsEntries]
  )

  return {
    searchParams,
    updateSearchParam,
    deleteSearchParams,
    toggleSearchParam,
    clearAllParams,
    hasParam,
  }
}

export default useQueryParams
