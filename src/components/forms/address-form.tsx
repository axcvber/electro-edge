'use client'

import React, { useState } from 'react'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AddressSchemaType, addressSchema } from '@/validation'
import { DialogFooter } from '../ui/dialog'
import FormInput from './elements/form-input'
import FormPhoneInput from './elements/form-phone-input'
import FormVirtualizedSelect from './elements/form-virtualized-select'
import FormCheckbox from './elements/form-checkbox'
import { useQuery } from '@tanstack/react-query'
import { getCountries } from '@/actions/shop/get-countries'
import { getCountryProvinces } from '@/actions/shop/get-county-provinces'
import { STORE_COUNTRY, STORE_COUNTRY_ID } from '@/lib/constants'
import { AddressFragment } from '@/gql/storefront/graphql'
import { SelectOption } from '@/types'
import { useTranslations } from 'next-intl'

interface AddressForm {
  address?: AddressFragment
  defaultAddressId?: string
  type?: 'add' | 'edit'
  onSubmitForm: (formData: AddressSchemaType) => Promise<void>
}

const AddressForm: React.FC<AddressForm> = ({ address, defaultAddressId, type = 'add', onSubmitForm }) => {
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => await getCountries(),
    staleTime: Infinity,
  })
  const t = useTranslations()

  const defaultCountryId = countries?.find((item) => item.label === address?.country)?.value || STORE_COUNTRY_ID
  const [selectedCountryId, setSelectedCountryId] = useState(defaultCountryId)
  const isDefaultAddress = address?.id && defaultAddressId === address.id

  const form = useForm<AddressSchemaType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      phone: address?.phone || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      city: address?.city || '',
      country: address?.country || STORE_COUNTRY,
      province: address?.province || '',
      zip: address?.zip || '',
      defaultAddress: !!isDefaultAddress,
    },
  })

  const { data: provinces, isPending } = useQuery({
    enabled: !!selectedCountryId,
    queryKey: ['provinces', selectedCountryId],
    queryFn: async () => await getCountryProvinces(selectedCountryId),
    staleTime: Infinity,
  })

  const defaultProvinceId = provinces?.find((item) => item.label === address?.province)?.value || ''

  const isSubmitting = form.formState.isSubmitting
  const isProvinceExist = provinces && provinces.length > 0

  const handleSelectCountry = ({ label, value }: SelectOption) => {
    setSelectedCountryId(value)
    form.setValue('country', label, { shouldValidate: true })
  }

  const handleSelectProvince = ({ label }: SelectOption) => {
    form.setValue('province', label, { shouldValidate: true })
  }

  const onSubmit = async (data: AddressSchemaType) => {
    await onSubmitForm(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='grid md:grid-cols-2 gap-5 p-6'>
          <FormInput
            control={form.control}
            name='firstName'
            label='First Name'
            placeholder='Enter First Name'
            disabled={isSubmitting}
            required
          />
          <FormInput
            control={form.control}
            name='lastName'
            label='Last Name'
            placeholder='Enter Last Name'
            disabled={isSubmitting}
            required
          />
          <FormInput
            control={form.control}
            name='company'
            label='Company'
            placeholder='Enter Company'
            disabled={isSubmitting}
          />
          <FormPhoneInput
            control={form.control}
            name='phone'
            label='Phone Number'
            placeholder='Enter phone number'
            disabled={isSubmitting}
          />
          <FormInput
            control={form.control}
            name='address1'
            label='Address 1'
            placeholder='Enter Address 1'
            disabled={isSubmitting}
            required
          />
          <FormInput
            control={form.control}
            name='address2'
            label='Address 2'
            placeholder='Enter Address 2'
            disabled={isSubmitting}
            required
          />

          <div className='grid md:grid-cols-2 gap-3'>
            <FormVirtualizedSelect
              control={form.control}
              name='country'
              label='Country'
              placeholder='Select Country'
              searchPlaceholder='Search country'
              defaultValue={defaultCountryId}
              options={countries || []}
              onSelectValue={handleSelectCountry}
              disabled={isSubmitting}
              className={'col-span-1'}
              required
            />
            <FormVirtualizedSelect
              control={form.control}
              name='province'
              label='Province'
              placeholder='Select Province'
              searchPlaceholder='Search province'
              defaultValue={defaultProvinceId}
              options={provinces || []}
              onSelectValue={handleSelectProvince}
              loading={isPending}
              disabled={isSubmitting || !isProvinceExist}
              className={'col-span-1'}
            />
          </div>
          <div className='grid md:grid-cols-2 gap-3'>
            <FormInput
              control={form.control}
              name='city'
              label='City'
              placeholder='Enter City'
              disabled={isSubmitting}
              required
            />
            <FormInput
              control={form.control}
              name='zip'
              label='Zip Code'
              placeholder='Enter Zip Code'
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
        <DialogFooter className='mt-4 gap-5'>
          <FormCheckbox
            control={form.control}
            name='defaultAddress'
            label={t('labels.set_as_default_address')}
            disabled={isSubmitting}
            checkboxClassName='bg-white border-neutral-500'
            labelClassName='text-sm text-foreground'
          />
          <Button type='submit' isLoading={isSubmitting}>
            {type === 'add' ? t('buttons.add_new_address') : t('buttons.edit_address')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default AddressForm
