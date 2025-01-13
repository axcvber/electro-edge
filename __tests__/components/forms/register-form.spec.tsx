import '@tests/mocks/mocked-captcha'

import userEvent from '@testing-library/user-event'
import RegisterForm from '@/components/forms/register-form'
import { render, screen, waitFor } from '@tests/test-utils'
import { registerUser } from '@/actions/user/register-user'
import { loginUser } from '@/actions/user/login-user'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/actions/user/register-user', () => ({
  registerUser: jest.fn(),
}))

jest.mock('@/actions/user/login-user', () => ({
  loginUser: jest.fn(),
}))

describe('RegisterForm', () => {
  const setup = () => {
    const utils = render(<RegisterForm />)
    const firstNameInput = utils.getByLabelText(/First Name/i)
    const lastNameInput = utils.getByLabelText(/Last Name/i)
    const phoneInput = utils.getByLabelText(/Phone Number/i)
    const emailInput = utils.getByLabelText(/Email Address/i)
    const passwordInput = utils.getByLabelText(/Password/i)
    const marketingCheckbox = utils.getByLabelText(/Receive updates/i)
    const submitButton = utils.getByRole('button', { name: /Sign Up/i })
    return {
      ...utils,
      firstNameInput,
      lastNameInput,
      phoneInput,
      emailInput,
      passwordInput,
      marketingCheckbox,
      submitButton,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders all form fields and buttons', () => {
    const { firstNameInput, lastNameInput, phoneInput, emailInput, passwordInput, marketingCheckbox, submitButton } =
      setup()
    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(phoneInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(marketingCheckbox).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(screen.getByText(/Log In/i)).toBeInTheDocument()
  })

  test('displays validation errors for empty required fields', async () => {
    const { submitButton } = setup()
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter a phone number/i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter an email address/i)).toBeInTheDocument()
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument()
    })

    expect(registerUser).not.toHaveBeenCalled()
  })

  test('submits form with valid data', async () => {
    const { firstNameInput, lastNameInput, phoneInput, emailInput, passwordInput, submitButton } = setup()
    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(phoneInput, '+1234567890')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')

    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          email: 'john@example.com',
          password: 'password123',
          acceptsMarketing: false,
        }),
        expect.any(String)
      )
      expect(loginUser).toHaveBeenCalled()
      expect(screen.getByText(`You've successfully registered your account`)).toBeInTheDocument()
    })
  })

  test('handles registration error', async () => {
    jest.mocked(registerUser).mockResolvedValue({ error: 'Registration failed' })

    const { firstNameInput, lastNameInput, phoneInput, emailInput, passwordInput, submitButton } = setup()
    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(phoneInput, '+1234567890')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(loginUser).not.toHaveBeenCalled()
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
    })
  })
})
