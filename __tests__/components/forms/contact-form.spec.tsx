import userEvent from '@testing-library/user-event'
import ContactForm from '@/components/forms/contact-form'
import { render, screen, waitFor } from '@tests/test-utils'
import { useToast } from '@/hooks/use-toast'

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}))

describe('ContactForm', () => {
  const setup = () => {
    const utils = render(<ContactForm />)
    const firstNameInput = utils.getByLabelText(/First Name/i)
    const lastNameInput = utils.getByLabelText(/Last Name/i)
    const phoneInput = utils.getByLabelText(/Phone Number/i)
    const emailInput = utils.getByLabelText(/Email Address/i)
    const messageInput = utils.getByLabelText(/Message/i)

    const submitBtn = utils.getByRole('button', { name: /Submit/i })

    return { firstNameInput, lastNameInput, phoneInput, emailInput, messageInput, submitBtn, ...utils }
  }

  jest.mocked(useToast).mockReturnValue({ toast: jest.fn(), dismiss: jest.fn(), toasts: [] })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form fields and submit button', () => {
    const { firstNameInput, lastNameInput, phoneInput, emailInput, messageInput, submitBtn } = setup()

    expect(firstNameInput).toBeInTheDocument()
    expect(lastNameInput).toBeInTheDocument()
    expect(phoneInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(messageInput).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
  })

  test('validates form fields', async () => {
    const { firstNameInput, lastNameInput, emailInput, messageInput, submitBtn } = setup()

    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(emailInput, 'invalid-email@g')
    await userEvent.type(messageInput, 'Hello')

    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  test('submits form successfully', async () => {
    const mockToast = useToast().toast as jest.Mock
    const { firstNameInput, lastNameInput, phoneInput, emailInput, messageInput, submitBtn } = setup()

    await userEvent.type(firstNameInput, 'John')
    await userEvent.type(lastNameInput, 'Doe')
    await userEvent.type(phoneInput, '+1234567890')
    await userEvent.type(emailInput, 'john.doe@example.com')
    await userEvent.type(messageInput, 'Hello')

    await userEvent.click(submitBtn)

    await waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Your question has been submitted successfully. We will get back to you as soon as possible.',
          variant: 'success',
        })
      },
      { timeout: 3400 }
    )
  })
})
