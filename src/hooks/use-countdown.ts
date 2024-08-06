import { useEffect, useState } from 'react'

const useCountdown = (targetDate: number) => {
  const [countDown, setCountDown] = useState(0)

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      let countDownDate = new Date(targetDate).getTime()

      // If the target date is in the past, set it to today at 00:00:00
      if (countDownDate < now.getTime()) {
        countDownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      }

      const difference = countDownDate - now.getTime()
      setCountDown(difference > 0 ? difference : 0)
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return getReturnValues(countDown)
}

const padWithZero = (value: number) => {
  const formattedNumber = String(value).padStart(2, '0')
  return formattedNumber
}

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = padWithZero(Math.floor(countDown / (1000 * 60 * 60 * 24)))
  const hours = padWithZero(Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes = padWithZero(Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = padWithZero(Math.floor((countDown % (1000 * 60)) / 1000))

  return [days, hours, minutes, seconds]
}

export { useCountdown }
