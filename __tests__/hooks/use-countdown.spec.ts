import { useCountdown } from '@/hooks/use-countdown'
import { renderHook, act } from '@testing-library/react'

jest.useFakeTimers()

describe('useCountdown', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('should initialize countdown correctly for a future date', () => {
    const targetDate = new Date().getTime() + 10000 // 10 seconds in the future
    const { result } = renderHook(() => useCountdown(targetDate))

    expect(result.current).toEqual(['00', '00', '00', '10'])
  })

  it('should update countdown every second', () => {
    const targetDate = new Date().getTime() + 10000 // 10 seconds in the future
    const { result } = renderHook(() => useCountdown(targetDate))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current).toEqual(['00', '00', '00', '09'])

    act(() => {
      jest.advanceTimersByTime(9000)
    })

    expect(result.current).toEqual(['00', '00', '00', '00'])
  })

  it('should handle past target date by setting countdown to 00:00:00:00', () => {
    const targetDate = new Date().getTime() - 10000 // 10 seconds in the past
    const { result } = renderHook(() => useCountdown(targetDate))

    expect(result.current).toEqual(['00', '00', '00', '00'])
  })
})
