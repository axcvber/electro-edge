import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRemoveCartItem } from '@/hooks/cart/use-remove-cart-item'
import { useUpdateCartItemQuantity } from '@/hooks/cart/use-update-cart-item-quantity'
import CartItem from '@/components/cart/cart-item'
import { BaseCartLine } from '@/gql/storefront/graphql'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

jest.mock('@/hooks/cart/use-remove-cart-item')
jest.mock('@/hooks/cart/use-update-cart-item-quantity')

const mockRemoveCartItem = jest.fn()
const mockUpdateQuantity = jest.fn()

beforeEach(() => {
  jest.mocked(useRemoveCartItem).mockReturnValue({ isRemoving: false, removeCartItem: mockRemoveCartItem })
  jest.mocked(useUpdateCartItemQuantity).mockReturnValue({ isUpdating: false, updateQuantity: mockUpdateQuantity })
})

const mockProps = {
  id: 'lineId',
  merchandise: {
    title: 'Product Title',
    image: { url: 'image-url', altText: 'image-alt' },
    price: { amount: 100, currencyCode: 'USD' },
    product: { handle: 'product-handle', title: 'Product Title' },
    id: 'variantId',
  },
  quantity: 1,
  cost: { subtotalAmount: { amount: 100, currencyCode: 'USD' } },
} as BaseCartLine

test('renders CartItem component', () => {
  render(<CartItem {...mockProps} />)

  expect(screen.getByRole('heading', { name: 'Product Title' })).toBeInTheDocument()
  expect(screen.getByAltText('image-alt')).toBeInTheDocument()
  expect(screen.getAllByText('$100.00')).toHaveLength(2)
})

test('increments quantity', async () => {
  const user = userEvent.setup()
  render(<CartItem {...mockProps} />)

  await user.click(screen.getByLabelText('Increment quantity'))
  expect(mockUpdateQuantity).toHaveBeenCalledWith({ lineId: 'lineId', quantity: 2, variantId: 'variantId' })
})

test('decrements quantity', async () => {
  const user = userEvent.setup()
  render(<CartItem {...mockProps} />)

  await user.click(screen.getByLabelText('Decrement quantity'))
  expect(mockUpdateQuantity).toHaveBeenCalledWith({ lineId: 'lineId', quantity: 0, variantId: 'variantId' })
})

test('removes cart item', async () => {
  const user = userEvent.setup()
  render(<CartItem {...mockProps} />)

  await user.click(screen.getByRole('button', { name: /remove/i }))
  expect(mockRemoveCartItem).toHaveBeenCalledWith('lineId')
})
