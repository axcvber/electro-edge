import userEvent from '@testing-library/user-event'
import { changePassword } from '@/actions/user/change-password'
import ChangePasswordForm from '@/components/forms/change-password-form'
import { render, screen, waitFor } from '@tests/test-utils'
import { useToast } from '@/hooks/use-toast'

jest.mock('@/actions/user/change-password')
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

describe('ChangePasswordForm', () => {
  const setup = () => {
    const utils = render(<ChangePasswordForm />)
    const newPassInput = utils.getByLabelText(/New Password/i)
    const confirmPassInput = utils.getByLabelText(/Confirm Password/i)
    const changePassBtn = utils.getByRole('button', { name: /Change Password/i })
    return { newPassInput, confirmPassInput, changePassBtn, ...utils }
  }

  beforeEach(() => {
    jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })
  })

  test('renders form fields and submit button', () => {
    const { newPassInput, confirmPassInput, changePassBtn } = setup()
    expect(newPassInput).toBeInTheDocument()
    expect(confirmPassInput).toBeInTheDocument()
    expect(changePassBtn).toBeInTheDocument()
  })

  test('validates form fields', async () => {
    const { newPassInput, confirmPassInput, changePassBtn } = setup()

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'differentpassword')

    await userEvent.click(changePassBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please provide matching passwords/i)).toBeInTheDocument()
    })
  })

  test('submits form successfully', async () => {
    const { newPassInput, confirmPassInput, changePassBtn } = setup()
    const mockToast = useToast().toast as jest.Mock

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(changePassBtn)

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({ password: 'newpassword', confirmPassword: 'newpassword' })
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Your password was successfully changed',
        variant: 'success',
      })
    })
  })

  test('handles form submission error', async () => {
    const { newPassInput, confirmPassInput, changePassBtn } = setup()

    jest.mocked(changePassword).mockResolvedValue({ error: 'Error changing password' })
    const mockToast = useToast().toast as jest.Mock

    render(<ChangePasswordForm />)

    await userEvent.type(newPassInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(changePassBtn)

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({ password: 'newpassword', confirmPassword: 'newpassword' })
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error changing password',
        variant: 'destructive',
      })
    })
  })
})
