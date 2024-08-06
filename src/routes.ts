export enum AppRoutes {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  RESET_PASSWORD = '/auth/reset-password',
  NEW_PASSWORD = '/auth/new-password',

  CART = '/cart',
  ACCOUNT = '/account',
  ACCOUNT_ADDRESSES = '/account/addresses',
  ACCOUNT_ORDERS = '/account/orders',
  ACCOUNT_ORDERS_RETURNS = '/account/orders/returns',
  ACCOUNT_ORDERS_RETURNABLE_FULFILLMENT = '/account/orders/returnable-fulfillment',
  ACCOUNT_WISHLIST = '/account/wishlist',

  ACCOUNT_SETTINGS = '/account/settings',

  CONTACT = '/contact',

  REFUND_POLICY = '/refund-policy',
}


export const privateRoutes = [AppRoutes.ACCOUNT, `${AppRoutes.ACCOUNT}/(.*)`]

export const authRoutes = [AppRoutes.LOGIN, AppRoutes.REGISTER, AppRoutes.RESET_PASSWORD, AppRoutes.NEW_PASSWORD]

export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = AppRoutes.ACCOUNT
