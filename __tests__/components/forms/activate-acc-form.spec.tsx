import { activateUser } from '@/actions/user/activate-user'
import ActivateAccForm from '@/components/forms/activate-acc-form'
import { useToast } from '@/hooks/use-toast'
import { AppRoutes } from '@/routes'
import userEvent from '@testing-library/user-event'
import { mockedRouter } from '@tests/mocks/mocked-router'
import { render, screen, waitFor } from '@tests/test-utils'
import { useRouter, useParams } from 'next/navigation'

jest.mock('@/actions/user/activate-user')
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

describe('ActivateAccForm', () => {
  const setup = () => {
    const utils = render(<ActivateAccForm />)
    const passInput = utils.getByLabelText('Password')
    const confirmPassInput = utils.getByLabelText(/Confirm Password/i)
    const activateAccBtn = utils.getByRole('button', { name: /Activate Account/i })
    return { passInput, confirmPassInput, activateAccBtn, ...utils }
  }

  jest.mocked(useRouter).mockReturnValue(mockedRouter)
  jest.mocked(useParams).mockReturnValue({ params: ['userId', 'activationToken'] })
  jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form fields and submit button', () => {
    const { passInput, confirmPassInput, activateAccBtn } = setup()

    expect(passInput).toBeInTheDocument()
    expect(confirmPassInput).toBeInTheDocument()
    expect(activateAccBtn).toBeInTheDocument()
  })

  test('validates form fields', async () => {
    const { passInput, confirmPassInput, activateAccBtn } = setup()

    await userEvent.type(passInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'differentpassword')

    await userEvent.click(activateAccBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please provide matching passwords/i)).toBeInTheDocument()
    })
  })

  test('submits form successfully', async () => {
    const mockToast = useToast().toast as jest.Mock
    const mockPush = useRouter().push as jest.Mock

    const { passInput, confirmPassInput, activateAccBtn } = setup()

    await userEvent.type(passInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(activateAccBtn)

    await waitFor(() => {
      expect(activateUser).toHaveBeenCalledWith(
        { password: 'newpassword', confirmPassword: 'newpassword' },
        'userId',
        'activationToken'
      )
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Your account has been successfully activated',
        description: 'You can now log in with your password',
        variant: 'success',
      })
      expect(mockPush).toHaveBeenCalledWith(AppRoutes.LOGIN)
    })
  })

  test('handles form submission error', async () => {
    const mockToast = useToast().toast as jest.Mock
    jest.mocked(activateUser).mockResolvedValue({ error: 'Error activating account' })

    const { passInput, confirmPassInput, activateAccBtn } = setup()

    await userEvent.type(passInput, 'newpassword')
    await userEvent.type(confirmPassInput, 'newpassword')

    await userEvent.click(activateAccBtn)

    await waitFor(() => {
      expect(activateUser).toHaveBeenCalledWith(
        { password: 'newpassword', confirmPassword: 'newpassword' },
        'userId',
        'activationToken'
      )
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error activating account',
        variant: 'destructive',
      })
    })
  })
})
