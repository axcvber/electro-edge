import '@tests/mocks/mocked-captcha'

import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/forms/login-form'
import { render, screen } from 'test-utils'
import { loginUser } from '@/actions/user/login-user'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

jest.mock('@/actions/user/login-user', () => ({
  loginUser: jest.fn(),
}))

describe('LoginForm', () => {
  const setup = () => {
    const utils = render(<LoginForm />)
    const emailInput = utils.getByLabelText(/Email Address/i)
    const passwordInput = utils.getByLabelText(/Password/i)
    const submitButton = utils.getByRole('button', { name: /Sign In/i })
    return {
      emailInput,
      passwordInput,
      submitButton,
      ...utils,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the login form correctly', () => {
    const { emailInput, passwordInput, submitButton } = setup()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  describe('form validation', () => {
    it('shows validation errors for empty fields', async () => {
      const { submitButton } = setup()
      await userEvent.click(submitButton)
      expect(await screen.findByText('Please enter an email address')).toBeInTheDocument()
      expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument()
      expect(loginUser).not.toHaveBeenCalled()
    })

    it.each([
      ['Invalid Email', 'invalid-email@g', 'password123', 'Please enter a valid email address'],
      ['Short Password', 'short-pass@example.com', 'short', 'Password must be at least 6 characters'],
    ])('shows validation error for %s', async (_, email, password, expectedError) => {
      const { emailInput, passwordInput, submitButton } = setup()
      await userEvent.type(emailInput, email)
      await userEvent.type(passwordInput, password)
      await userEvent.click(submitButton)
      expect(await screen.findByText(expectedError)).toBeInTheDocument()
      expect(loginUser).not.toHaveBeenCalled()
    })
  })

  describe('form submission', () => {
    it('calls loginUser with valid form data and captcha token', async () => {
      const { emailInput, passwordInput, submitButton } = setup()
      await userEvent.type(emailInput, 'test@example.com')
      await userEvent.type(passwordInput, 'password123')
      await userEvent.click(submitButton)
      expect(loginUser).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        'test-v2-token',
        undefined
      )
      expect(loginUser).toHaveBeenCalledTimes(1)
    })

    it('displays an error message if the login fails', async () => {
      jest.mocked(loginUser).mockResolvedValue({ error: 'Invalid credentials' })
      const { emailInput, passwordInput, submitButton } = setup()
      await userEvent.type(emailInput, 'invalid@example.com')
      await userEvent.type(passwordInput, 'wrongpassword')
      await userEvent.click(submitButton)
      expect(loginUser).toHaveBeenCalledWith(
        { email: 'invalid@example.com', password: 'wrongpassword' },
        'test-v2-token',
        undefined
      )
      expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
