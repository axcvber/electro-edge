import { cn, generatePathnameRegex, getErrorMessage } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toEqual('bg-red-500 text-white')
    })
  })

  // describe('generatePathnameRegex', () => {
  //   it('should generate a correct pathname regex', () => {
  //     const routes = ['/', '/about', '/products/:id']
  //     const regex = generatePathnameRegex(routes)
  //     expect(regex.test('/en/about')).toBe(true)
  //     expect(regex.test('/fr/products/123')).toBe(true)
  //     expect(regex.test('/products/123')).toBe(true)
  //     expect(regex.test('/random-page')).toBe(false)
  //   })
  // })

  describe('getErrorMessage', () => {
    it('should return the correct error message', () => {
      expect(getErrorMessage(new Error('Something went wrong'))).toEqual('Something went wrong')
      expect(getErrorMessage({ message: 'An error occurred' })).toEqual('An error occurred')
      expect(getErrorMessage('Error occurred')).toEqual('Error occurred')
      expect(getErrorMessage(42)).toEqual('Something went wrong')
    })
  })

  // Add more tests for the other utility functions...
})
