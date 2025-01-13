import { renderHook, waitFor } from '@testing-library/react'
import { getInitialData } from '@/actions/app/get-initial-data'
import { useInitialData } from '@/hooks/use-initial-data'
import { useQuery } from '@tanstack/react-query'

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('@/actions/app/get-initial-data', () => ({
  getInitialData: jest.fn(),
}))

describe('useInitialData', () => {
  it('should return globalData and contacts when data is fetched successfully', async () => {
    const mockData = {
      globalData: { key: 'value' },
      contacts: [{ id: 1, name: 'John Doe' }],
    }

    ;(useQuery as jest.Mock).mockReturnValue({
      data: mockData,
    })
    ;(getInitialData as jest.Mock).mockResolvedValue(mockData)

    const { result } = renderHook(() => useInitialData())

    await waitFor(() => result.current.globalData !== undefined)

    expect(result.current.globalData).toEqual(mockData.globalData)
    expect(result.current.contacts).toEqual(mockData.contacts)
  })

  it('should return undefined for globalData and contacts when data fetch fails', async () => {
    ;(useQuery as jest.Mock).mockReturnValue({
      data: null,
    })
    ;(getInitialData as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

    const { result } = renderHook(() => useInitialData())

    await waitFor(() => result.current.globalData === undefined)

    expect(result.current.globalData).toBeUndefined()
    expect(result.current.contacts).toBeUndefined()
  })
})
