import '@tests/mocks/mocked-captcha'

import ResetPasswordForm from '@/components/forms/reset-password-form'
import { recoverUser } from '@/actions/user/recover-user'
import { useToast } from '@/hooks/use-toast'
import { render, screen, waitFor } from '@tests/test-utils'
import userEvent from '@testing-library/user-event'
import { mockedRouter } from '@tests/mocks/mocked-router'
import { useRouter } from 'next/navigation'

jest.mock('@/actions/user/recover-user')

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('ResetPasswordForm', () => {
  const setup = () => {
    const utils = render(<ResetPasswordForm />)
    const emailInput = utils.getByLabelText(/Email Address/i)
    const submitBtn = utils.getByRole('button', { name: /Submit/i })
    return { emailInput, submitBtn, ...utils }
  }

  jest.mocked(useRouter).mockReturnValue(mockedRouter)
  jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form fields and submit button', () => {
    const { emailInput, submitBtn } = setup()

    expect(emailInput).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
  })

  test('validates form fields', async () => {
    const { emailInput, submitBtn } = setup()

    await userEvent.type(emailInput, 'invalid-email@g')

    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  test('submits form successfully', async () => {
    const mockToast = useToast().toast as jest.Mock
    const { emailInput, submitBtn } = setup()
    jest.mocked(recoverUser).mockResolvedValue({ error: '' })

    await userEvent.type(emailInput, 'john.doe@example.com')

    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(recoverUser).toHaveBeenCalledWith({ email: 'john.doe@example.com' }, expect.any(String))
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Reset email sent!',
        description: 'Check your email for a confirmation link.',
        variant: 'success',
      })
    })
  })

  test('handles form submission error', async () => {
    const mockToast = useToast().toast as jest.Mock
    jest.mocked(recoverUser).mockResolvedValue({ error: 'Error sending reset email' })

    const { emailInput, submitBtn } = setup()

    await userEvent.type(emailInput, 'john.doe@example.com')

    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(recoverUser).toHaveBeenCalledWith({ email: 'john.doe@example.com' }, expect.any(String))
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error sending reset email',
        variant: 'destructive',
      })
    })
  })
})
