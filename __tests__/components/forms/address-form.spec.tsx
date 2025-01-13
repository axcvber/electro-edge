import { getCountries } from '@/actions/shop/get-countries'
import { getCountryProvinces } from '@/actions/shop/get-county-provinces'
import AddressForm from '@/components/forms/address-form'
import { AddressFragment } from '@/gql/storefront/graphql'
import { QueryClient } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@tests/test-utils'

jest.mock('@/actions/shop/get-countries')
jest.mock('@/actions/shop/get-county-provinces')

describe('AddressForm', () => {
  let queryClient: QueryClient
  const mockOnSubmitForm = jest.fn()

  const defaultProps = {
    onSubmitForm: mockOnSubmitForm,
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    jest.clearAllMocks()
    jest.mocked(getCountries).mockResolvedValue([
      { value: '1', label: 'United States', code: '21312' },
      { value: '2', label: 'Canada', code: '33443' },
    ])
    jest.mocked(getCountryProvinces).mockResolvedValue([
      { value: '1', label: 'California' },
      { value: '2', label: 'Ontario' },
    ])

    Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: jest.fn(() => {
        return {
          width: 120,
          height: 120,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        }
      }),
    })
  })

  afterEach(() => {
    queryClient.clear()
  })

  const renderAddressForm = (props = {}) => {
    const utils = render(<AddressForm {...defaultProps} {...props} />, { queryClient })
    const getFormElement = (label: string) => screen.getByLabelText(new RegExp(label, 'i'))
    const fillFormField = async (element: HTMLElement, value: string) => {
      await userEvent.type(element, value)
    }
    return {
      getFormElement,
      fillFormField,
      firstName: getFormElement('First Name'),
      lastName: getFormElement('Last Name'),
      company: getFormElement('Company'),
      phone: getFormElement('Phone Number'),
      address1: getFormElement('Address 1'),
      address2: getFormElement('Address 2'),
      city: getFormElement('City'),
      country: getFormElement('Country'),
      province: getFormElement('Province'),
      zipCode: getFormElement('Zip Code'),
      defaultAddress: getFormElement('Set as default address'),
      ...utils,
    }
  }

  it('renders all form fields', async () => {
    const {
      firstName,
      lastName,
      company,
      phone,
      address1,
      address2,
      city,
      country,
      province,
      zipCode,
      defaultAddress,
    } = renderAddressForm()

    const addAddressButton = screen.getByRole('button', { name: /Add a new address/i })

    await waitFor(() => {
      expect(firstName).toBeInTheDocument()
      expect(lastName).toBeInTheDocument()
      expect(company).toBeInTheDocument()
      expect(phone).toBeInTheDocument()
      expect(address1).toBeInTheDocument()
      expect(address2).toBeInTheDocument()
      expect(city).toBeInTheDocument()
      expect(country).toBeInTheDocument()
      expect(province).toBeInTheDocument()
      expect(zipCode).toBeInTheDocument()
      expect(defaultAddress).toBeInTheDocument()
      expect(addAddressButton).toBeInTheDocument()
    })
  })

  it('displays validation errors for empty required fields', async () => {
    renderAddressForm()

    const addAddressButton = screen.getByRole('button', { name: /Add a new address/i })
    await userEvent.click(addAddressButton)

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Address 1 is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Address 2 is required/i)).toBeInTheDocument()
      expect(screen.getByText(/City is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Zip Code is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const { fillFormField, country, province, firstName, lastName, company, phone, address1, address2, city, zipCode } =
      renderAddressForm()

    await fillFormField(firstName, 'John')
    await fillFormField(lastName, 'Doe')
    await fillFormField(company, 'ACME Inc.')
    await fillFormField(phone, '+1234567890')
    await fillFormField(address1, '123 Main St')
    await fillFormField(address2, 'Apt 4B')
    await fillFormField(city, 'Springfield')
    await fillFormField(zipCode, '12345')

    await userEvent.click(country)
    await userEvent.click(await screen.findByText('United States'))

    await userEvent.click(province)
    await userEvent.click(await screen.findByText('California'))

    const addAddressButton = screen.getByRole('button', { name: /Add a new address/i })
    await userEvent.click(addAddressButton)

    await waitFor(() => {
      expect(mockOnSubmitForm).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        company: 'ACME Inc.',
        phone: '+1234567890',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'Springfield',
        country: 'United States',
        province: 'California',
        zip: '12345',
        defaultAddress: false,
      })
    })
  })

  it('pre-fills form fields when address is provided', async () => {
    const address = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      company: 'Tech Corp',
      phone: '+9876543210',
      address1: '456 Elm St',
      address2: 'Suite 789',
      city: 'Metropolis',
      country: 'Canada',
      province: 'Ontario',
      zip: '67890',
    } as AddressFragment

    const { firstName, lastName, company, phone, address1, address2, city, zipCode, defaultAddress } =
      renderAddressForm({ address, defaultAddressId: '1', type: 'edit' })

    await waitFor(() => {
      expect(firstName).toHaveValue('Jane')
      expect(lastName).toHaveValue('Doe')
      expect(company).toHaveValue('Tech Corp')
      expect(phone).toHaveValue('+98 765 432 10')
      expect(address1).toHaveValue('456 Elm St')
      expect(address2).toHaveValue('Suite 789')
      expect(city).toHaveValue('Metropolis')
      expect(zipCode).toHaveValue('67890')
      expect(defaultAddress).toBeChecked()
      expect(screen.getByText('Canada')).toBeInTheDocument()
      expect(screen.getByText('Ontario')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Edit an address/i })).toBeInTheDocument()
    })
  })

  it('disables province select when no provinces are available', async () => {
    jest.mocked(getCountryProvinces).mockResolvedValue([])
    const { country, province } = renderAddressForm()

    await userEvent.click(country)
    await userEvent.click(await screen.findByText('United States'))

    await waitFor(() => {
      expect(province).toBeDisabled()
    })
  })

  it('changes available provinces when country is changed', async () => {
    const { country } = renderAddressForm()

    await userEvent.click(country)
    await userEvent.click(await screen.findByText('Canada'))

    await waitFor(() => {
      expect(getCountryProvinces).toHaveBeenCalledWith('2')
    })
  })
})
