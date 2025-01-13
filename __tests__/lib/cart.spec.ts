import {
  createCart,
  addToCart,
  removeFromCart,
  updateCart,
  updateBuyerIdentity,
  saveUserCart,
  setCartCookies,
} from '@/lib/cart'
import { setMetafields } from '@/actions/set-metafields'
import { storefrontClient } from '@/lib/shopify'
import { cookies } from 'next/headers'
import { CookieName } from '@/lib/constants'
import { auth } from '@/auth'

jest.mock('@/actions/set-metafields')
jest.mock('@/lib/shopify')
jest.mock('next/headers')
jest.mock('@/auth')

describe('Cart Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createCart', () => {
    test('successfully creates a cart', async () => {
      const mockSession = {
        accessToken: 'token',
        user: { email: 'test@example.com', phone: '1234567890', id: 'userId' },
      }
      const mockCartCreate = { cart: { id: 'cartId' }, userErrors: [] }

      ;(auth as jest.Mock).mockResolvedValue(mockSession)
      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartCreate: mockCartCreate })
      ;(cookies as jest.Mock).mockReturnValue({ set: jest.fn() })

      const result = await createCart()

      expect(result).toBe('cartId')
      expect(storefrontClient.request).toHaveBeenCalledWith(expect.anything(), expect.anything())
      expect(cookies().set).toHaveBeenCalledWith(CookieName.CART_ID, 'cartId', { maxAge: 30 * 24 * 60 * 60 })
    })

    test('throws an error if there are user errors during cart creation', async () => {
      const mockSession = {
        accessToken: 'token',
        user: { email: 'test@example.com', phone: '1234567890', id: 'userId' },
      }
      const mockCartCreate = { cart: null, userErrors: [{ message: 'Error' }] }

      ;(auth as jest.Mock).mockResolvedValue(mockSession)
      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartCreate: mockCartCreate })

      await expect(createCart()).rejects.toThrow('Error')
    })

    test('throws an error if cart creation fails', async () => {
      const mockSession = {
        accessToken: 'token',
        user: { email: 'test@example.com', phone: '1234567890', id: 'userId' },
      }
      const mockCartCreate = { cart: null, userErrors: [] }

      ;(auth as jest.Mock).mockResolvedValue(mockSession)
      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartCreate: mockCartCreate })

      await expect(createCart()).rejects.toThrow('Failed to create cart')
    })
  })

  describe('addToCart', () => {
    test('successfully adds item to cart', async () => {
      const mockCartLinesAdd = { cart: { id: 'cartId' }, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesAdd: mockCartLinesAdd })

      await addToCart({ cartId: 'cartId', lines: [{ merchandiseId: 'variantId', quantity: 1 }] })

      expect(storefrontClient.request).toHaveBeenCalledWith(expect.anything(), expect.anything())
    })

    test('throws an error if there are user errors during adding to cart', async () => {
      const mockCartLinesAdd = { cart: null, userErrors: [{ message: 'Error' }] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesAdd: mockCartLinesAdd })

      await expect(
        addToCart({ cartId: 'cartId', lines: [{ merchandiseId: 'variantId', quantity: 1 }] })
      ).rejects.toThrow('Error')
    })

    test('throws an error if adding to cart fails', async () => {
      const mockCartLinesAdd = { cart: null, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesAdd: mockCartLinesAdd })

      await expect(
        addToCart({ cartId: 'cartId', lines: [{ merchandiseId: 'variantId', quantity: 1 }] })
      ).rejects.toThrow('Failed to add item to cart')
    })
  })

  describe('removeFromCart', () => {
    test('successfully removes item from cart', async () => {
      const mockCartLinesRemove = { cart: { id: 'cartId' }, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesRemove: mockCartLinesRemove })

      await removeFromCart({ cartId: 'cartId', lineIds: ['lineId'] })

      expect(storefrontClient.request).toHaveBeenCalledWith(expect.anything(), expect.anything())
    })

    test('throws an error if there are user errors during removing from cart', async () => {
      const mockCartLinesRemove = { cart: null, userErrors: [{ message: 'Error' }] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesRemove: mockCartLinesRemove })

      await expect(removeFromCart({ cartId: 'cartId', lineIds: ['lineId'] })).rejects.toThrow('Error')
    })

    test('throws an error if removing from cart fails', async () => {
      const mockCartLinesRemove = { cart: null, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesRemove: mockCartLinesRemove })

      await expect(removeFromCart({ cartId: 'cartId', lineIds: ['lineId'] })).rejects.toThrow(
        'Failed to remove a cart item'
      )
    })
  })

  describe('updateCart', () => {
    test('successfully updates cart', async () => {
      const mockCartLinesUpdate = { cart: { id: 'cartId' }, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesUpdate: mockCartLinesUpdate })

      await updateCart({ cartId: 'cartId', lines: [{ id: 'lineId', quantity: 2 }] })

      expect(storefrontClient.request).toHaveBeenCalledWith(expect.anything(), expect.anything())
    })

    test('throws an error if there are user errors during updating cart', async () => {
      const mockCartLinesUpdate = { cart: null, userErrors: [{ message: 'Error' }] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesUpdate: mockCartLinesUpdate })

      await expect(updateCart({ cartId: 'cartId', lines: [{ id: 'lineId', quantity: 2 }] })).rejects.toThrow('Error')
    })

    test('throws an error if updating cart fails', async () => {
      const mockCartLinesUpdate = { cart: null, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({ cartLinesUpdate: mockCartLinesUpdate })

      await expect(updateCart({ cartId: 'cartId', lines: [{ id: 'lineId', quantity: 2 }] })).rejects.toThrow(
        'Failed to update item quantity'
      )
    })
  })

  describe('updateBuyerIdentity', () => {
    test('successfully updates buyer identity', async () => {
      const mockCartBuyerIdentityUpdate = { cart: { id: 'cartId' }, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({
        cartBuyerIdentityUpdate: mockCartBuyerIdentityUpdate,
      })

      await updateBuyerIdentity({ cartId: 'cartId', buyerIdentity: { email: 'test@example.com' } })

      expect(storefrontClient.request).toHaveBeenCalledWith(expect.anything(), expect.anything())
    })

    test('throws an error if there are user errors during updating buyer identity', async () => {
      const mockCartBuyerIdentityUpdate = { cart: null, userErrors: [{ message: 'Error' }] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({
        cartBuyerIdentityUpdate: mockCartBuyerIdentityUpdate,
      })

      await expect(
        updateBuyerIdentity({ cartId: 'cartId', buyerIdentity: { email: 'test@example.com' } })
      ).rejects.toThrow('Error')
    })

    test('throws an error if updating buyer identity fails', async () => {
      const mockCartBuyerIdentityUpdate = { cart: null, userErrors: [] }

      ;(storefrontClient.request as jest.Mock).mockResolvedValue({
        cartBuyerIdentityUpdate: mockCartBuyerIdentityUpdate,
      })

      await expect(
        updateBuyerIdentity({ cartId: 'cartId', buyerIdentity: { email: 'test@example.com' } })
      ).rejects.toThrow('Failed to update buyer identity')
    })
  })

  describe('saveUserCart', () => {
    test('successfully saves user cart', async () => {
      await saveUserCart({ userId: 'userId', cartId: 'cartId' })

      expect(setMetafields).toHaveBeenCalledWith({
        metafields: {
          key: 'cart_id',
          ownerId: 'userId',
          value: 'cartId',
          namespace: 'custom',
          type: 'single_line_text_field',
        },
      })
    })
  })

  describe('setCartCookies', () => {
    test('successfully sets cart cookies', async () => {
      ;(cookies as jest.Mock).mockReturnValue({ set: jest.fn() })

      await setCartCookies('cartId')

      expect(cookies().set).toHaveBeenCalledWith(CookieName.CART_ID, 'cartId', { maxAge: 30 * 24 * 60 * 60 })
    })
  })
})
