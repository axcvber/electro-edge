import AddressCard from '@/components/cards/addresse-card'
import InfoBox from '@/components/common/info-box'
import { AddressFragment } from '@/gql/storefront/graphql'
import { BookUser } from 'lucide-react'
import React from 'react'
import AddAddressButton from './add-address-button'
import { useTranslations } from 'next-intl'

interface IAddressList {
  defaultAddress: AddressFragment
  addresses: AddressFragment[]
}

const AddressList: React.FC<IAddressList> = ({ defaultAddress, addresses }) => {
  const t = useTranslations('address')

  if (addresses.length === 0) {
    return (
      <InfoBox
        icon={<BookUser />}
        title='You have no billing addresses'
        desc="It looks like you haven't added any billing addresses yet. Let's get that sorted. Add a billing address now."
        button={<AddAddressButton size={'sm'} label='Add an address' />}
      />
    )
  }

  return (
    <div className='gap-5 grid lg:grid-cols-2'>
      {addresses
        .sort((a, b) =>
          a.id === defaultAddress.id ? -1 : b.id === defaultAddress.id ? 1 : Number(a.id) - Number(b.id)
        )
        .map((item, index) => (
          <AddressCard
            key={item.id}
            title={item.id === defaultAddress.id ? t('default_address') : `${t('address')} ${index + 1}`}
            data={item}
            defaultAddressId={defaultAddress.id}
          />
        ))}
    </div>
  )
}

export default AddressList
