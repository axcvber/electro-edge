import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  // clearMocks: true,
  // preset: 'ts-jest',
  // collectCoverage: true,
  coverageProvider: 'v8',
  // ci: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  // testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.spec.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@/auth': '<rootDir>/__tests__/mocks/auth.ts',
    '@/session': '<rootDir>/__tests__/mocks/next-auth-react-mock.ts',
    'next-auth/providers/credentials': '<rootDir>/__tests__/mocks/next-auth-providers-credentials.ts',
    'next-auth': '<rootDir>/__tests__/mocks/next-auth.ts',
  },
}

export default createJestConfig(config)
