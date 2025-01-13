import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export const mockedRouter: AppRouterInstance = {
  back: jest.fn(),
  forward: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
}
