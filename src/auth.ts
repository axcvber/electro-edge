import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { saveUserCart, setCartCookies, updateBuyerIdentity } from '@/lib/cart'
import { AppRoutes } from '@/routes'
import { getCart } from '@/actions/cart/get-cart'
import { getUser } from '@/actions/user/get-user'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: AppRoutes.LOGIN,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize({ accessToken }: { accessToken?: string }) {
        if (!accessToken) return null

        const user = await getUser(accessToken)

        if (!user?.id) {
          return null
        }

        const cart = await getCart()
        const cartId = cart?.id

        if (!user.cartId?.value && cartId) {
          await updateBuyerIdentity({
            cartId,
            buyerIdentity: {
              customerAccessToken: accessToken,
              email: user.email,
            },
          })

          await saveUserCart({
            cartId: cartId,
            userId: user.id,
          })
        } else if (user.cartId?.value) {
          await setCartCookies(user.cartId.value)
        }

        return {
          ...user,
          cartId: user.cartId?.value,
          defaultAddressId: user.defaultAddress?.id,
          wishlistId: user.wishlistId?.value,
          accessToken,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          user: {
            id: session?.user?.id ?? token.user.id,
            firstName: session?.user?.firstName ?? token.user.firstName,
            lastName: session?.user?.lastName ?? token.user.lastName,
            email: session?.user?.email ?? token.user.email,
            phone: session?.user?.phone ?? token.user.phone,
            acceptsMarketing: session?.user?.acceptsMarketing ?? token.user.acceptsMarketing,
            cartId: token.user.cartId,
            defaultAddressId: token.user.defaultAddressId,
          },
          accessToken: session?.accessToken ?? token.accessToken,
        }
      }

      if (user) {
        return {
          ...token,
          user: user,
          accessToken: user.accessToken,
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        return {
          ...session,
          user: token.user,
          accessToken: token.accessToken,
        }
      }
      return session
    },
  },
})
