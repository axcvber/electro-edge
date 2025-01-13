import { updateUserInfo } from '@/actions/user/update-user-info'
import UserInfoForm from '@/components/forms/user-info-form'
import { render, screen, waitFor } from '@tests/test-utils'
import { useToast } from '@/hooks/use-toast'
import userEvent from '@testing-library/user-event'

jest.mock('@/actions/user/update-user-info')
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react')
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: {
      username: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    },
  }
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated', update: jest.fn() }
    }),
  }
})

describe('UserInfoForm', () => {
  const setup = () => {
    const utils = render(<UserInfoForm />)
    const firstNameInput = utils.getByLabelText(/First Name/i)
    const lastNameInput = utils.getByLabelText(/Last Name/i)
    const phoneInput = utils.getByLabelText(/Phone Number/i)
    const emailInput = utils.getByLabelText(/Email Address/i)
    const saveButton = utils.getByText(/save/i)
    const cancelButton = utils.getByText(/cancel/i)
    return { firstNameInput, lastNameInput, phoneInput, emailInput, saveButton, cancelButton, ...utils }
  }

  const mockUser = {
    username: 'admin',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  }
  beforeEach(() => {
    jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })
  })

  it('renders all form fields', () => {
    const { firstNameInput, lastNameInput, phoneInput, emailInput, saveButton, cancelButton } = setup()

    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(phoneInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(saveButton).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
  })

  it('submits the form with correct data', async () => {
    const mockToast = useToast().toast as jest.Mock
    const { firstNameInput, lastNameInput, phoneInput, emailInput, saveButton } = setup()

    await userEvent.clear(firstNameInput)
    await userEvent.clear(lastNameInput)
    await userEvent.clear(phoneInput)
    await userEvent.clear(emailInput)

    await userEvent.type(firstNameInput, 'Jane')
    await userEvent.type(lastNameInput, 'Smith')
    await userEvent.type(phoneInput, '+0987654321')
    await userEvent.type(emailInput, 'jane.smith@example.com')

    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(updateUserInfo).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
        email: 'jane.smith@example.com',
      })
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Your data was successfully updated.',
        variant: 'success',
      })
    })
  })

  it('handles a failing request', async () => {
    const mockToast = useToast().toast as jest.Mock
    jest.mocked(updateUserInfo).mockResolvedValue({ error: 'Update failed' })
    const { firstNameInput, lastNameInput, phoneInput, emailInput, saveButton } = setup()

    await userEvent.clear(firstNameInput)
    await userEvent.clear(lastNameInput)
    await userEvent.clear(phoneInput)
    await userEvent.clear(emailInput)

    await userEvent.type(firstNameInput, 'Jane')
    await userEvent.type(lastNameInput, 'Smith')
    await userEvent.type(phoneInput, '+0987654321')
    await userEvent.type(emailInput, 'jane.smith@example.com')

    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(updateUserInfo).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
        email: 'jane.smith@example.com',
      })
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Update failed',
        variant: 'destructive',
      })
    })
  })

  it('validates form inputs', async () => {
    const { firstNameInput, lastNameInput, phoneInput, emailInput, saveButton } = setup()

    await userEvent.clear(firstNameInput)
    await userEvent.clear(lastNameInput)
    await userEvent.clear(phoneInput)
    await userEvent.clear(emailInput)

    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter a phone number/i)).toBeInTheDocument()
      expect(screen.getByText(/Please enter an email address/i)).toBeInTheDocument()
    })
  })

  it('resets the form when cancel button is clicked', async () => {
    const { firstNameInput, lastNameInput, cancelButton } = setup()

    await userEvent.type(firstNameInput, 'Jane')
    await userEvent.type(lastNameInput, 'Smith')

    await userEvent.click(cancelButton)

    expect(firstNameInput).toHaveValue(mockUser.firstName)
    expect(lastNameInput).toHaveValue(mockUser.lastName)
  })
})
