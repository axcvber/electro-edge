import React from 'react'
import AddAddressButton from './_components/add-address-button'
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getCountries } from '@/actions/shop/get-countries'
import { getUserAddresses } from '@/actions/address/get-user-addresses'
import AddressList from './_components/address-list'
import { getCountryProvinces } from '@/actions/shop/get-county-provinces'
import { STORE_COUNTRY_ID } from '@/lib/constants'
import { getTranslations } from 'next-intl/server'

const AddressesPage = async () => {
  const { defaultAddress, addresses } = await getUserAddresses()
  const queryClient = new QueryClient()
  const t = await getTranslations('address')

  await queryClient.prefetchQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })

  await queryClient.prefetchQuery({
    queryKey: ['provinces', STORE_COUNTRY_ID],
    queryFn: async () => await getCountryProvinces(STORE_COUNTRY_ID),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='space-y-4 mb-6'>
        <h1 className='h3'>{t('title')}</h1>
        {!!addresses.length && <AddAddressButton label={t('add_address_title')} />}
      </div>

      <AddressList defaultAddress={defaultAddress} addresses={addresses} />
    </HydrationBoundary>
  )
}

export default AddressesPage
