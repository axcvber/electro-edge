import userEvent from '@testing-library/user-event'
import { resetUser } from '@/actions/user/reset-user'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { mockedRouter } from '@tests/mocks/mocked-router'
import { render, screen, waitFor } from '@tests/test-utils'
import NewPasswordForm from '@/components/forms/new-password-form'
import { AppRoutes } from '@/routes'

jest.mock('@/actions/user/reset-user')
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

describe('NewPasswordForm', () => {
  const setup = () => {
    const utils = render(<NewPasswordForm />)
    const newPassInput = utils.getByLabelText(/New Password/i)
    const confirmPassInput = utils.getByLabelText(/Confirm Password/i)
    const resetPassBtn = utils.getByRole('button', { name: /Reset Password/i })
    return { newPassInput, confirmPassInput, resetPassBtn, ...utils }
  }

  jest.mocked(useRouter).mockReturnValue(mockedRouter)
  jest.mocked(useParams).mockReturnValue({ params: ['userId', 'resetToken'] })
  jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form fields and submit button', () => {
    const { newPassInput, confirmPassInput, resetPassBtn } = setup()

    expect(newPassInput).toBeInTheDocument()
    expect(confirmPassInput).toBeInTheDocument()
    expect(resetPassBtn).toBeInTheDocument()
  })

  test('validates form fields', async () => {
    const { newPassInput, confirmPassInput, resetPassBtn } = setup()

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'differentpassword')

    await userEvent.click(resetPassBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please provide matching passwords/i)).toBeInTheDocument()
    })
  })

  test('submits form successfully', async () => {
    const mockToast = useToast().toast as jest.Mock
    const mockPush = useRouter().push as jest.Mock

    const { newPassInput, confirmPassInput, resetPassBtn } = setup()

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(resetPassBtn)

    await waitFor(() => {
      expect(resetUser).toHaveBeenCalledWith(
        { password: 'newpassword', confirmPassword: 'newpassword' },
        'userId',
        'resetToken'
      )
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Your password has been successfully reset',
        description: 'You can now log in with your new password',
        variant: 'success',
      })
      expect(mockPush).toHaveBeenCalledWith(AppRoutes.LOGIN)
    })
  })

  test('handles form submission error', async () => {
    const mockToast = useToast().toast as jest.Mock
    jest.mocked(resetUser).mockResolvedValue({ error: 'Error resetting password' })

    const { newPassInput, confirmPassInput, resetPassBtn } = setup()

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(resetPassBtn)

    await waitFor(() => {
      expect(resetUser).toHaveBeenCalledWith(
        { password: 'newpassword', confirmPassword: 'newpassword' },
        'userId',
        'resetToken'
      )
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error resetting password',
        variant: 'destructive',
      })
    })
  })
})
