import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, privateRoutes } from '@/routes'
import createIntlMiddleware from 'next-intl/middleware'
import { localePrefix, locales } from '@/navigation'
import { generatePathnameRegex } from '@/lib/utils'
import { auth } from './auth'

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix,
  defaultLocale: locales[0],
})

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

  const authPathnameRegex = generatePathnameRegex(authRoutes)
  const privatePathnameRegex = generatePathnameRegex(privateRoutes)
  const isPrivateRoute = privatePathnameRegex.test(req.nextUrl.pathname)
  const isAuthRoute = authPathnameRegex.test(req.nextUrl.pathname)

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return intlMiddleware(req)
  }

  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
