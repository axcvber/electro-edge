import useQueryParams from '@/hooks/use-query-params'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSearchParams as useNextSearchParams } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

jest.useFakeTimers()

describe('useQueryParams', () => {
  const mockReplaceState = jest.fn()
  const originalReplaceState = window.history.replaceState

  beforeAll(() => {
    window.history.replaceState = mockReplaceState
  })

  afterAll(() => {
    window.history.replaceState = originalReplaceState
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update search parameters correctly', () => {
    ;(useNextSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('foo=bar'))

    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.updateSearchParam({ foo: 'baz', newParam: 'newValue' })
    })

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${window.location.pathname}?foo=baz&newParam=newValue`
    )
  })

  it('should delete specified search parameters correctly', () => {
    ;(useNextSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('foo=bar&baz=qux'))

    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.deleteSearchParams({ foo: undefined })
    })

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      `${window.location.origin}${window.location.pathname}?baz=qux`
    )
  })

  it('should toggle search parameter correctly', () => {
    ;(useNextSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('foo=bar'))

    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.toggleSearchParam('foo', 'bar')
    })

    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `${window.location.origin}${window.location.pathname}`)
  })

  it('should clear all search parameters correctly', () => {
    ;(useNextSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('foo=bar&baz=qux'))

    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.clearAllParams()
    })

    expect(mockReplaceState).toHaveBeenCalledWith(null, '', `${window.location.origin}${window.location.pathname}`)
  })

  it('should check for the existence of a search parameter correctly', () => {
    ;(useNextSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('foo=bar&baz=qux'))

    const { result } = renderHook(() => useQueryParams())

    expect(result.current.hasParam('foo')).toBe(true)
    expect(result.current.hasParam('nonexistent')).toBe(false)
    expect(result.current.hasParam('baz', 'qux')).toBe(true)
    expect(result.current.hasParam('baz', 'nonexistent')).toBe(false)
  })
})
