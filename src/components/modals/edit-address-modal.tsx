import useModalStore from '@/store/use-modal-store'
import React from 'react'
import { Modal } from '../ui/modal'
import AddressForm from '../forms/address-form'
import { AddressSchemaType } from '@/validation'
import { AddressFragment } from '@/gql/storefront/graphql'
import { useToast } from '../../hooks/use-toast'
import { updateUserAddress } from '@/actions/address/update-user-address'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export interface EditAddressModalProps {
  addressData: AddressFragment
  defaultAddressId: string
}

const EditAddressModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)
  const { addressData, defaultAddressId } = useModalStore((s) => s.data) as EditAddressModalProps
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('address')

  const handleEditAddress = async (data: AddressSchemaType) => {
    const result = await updateUserAddress(data, addressData.id)
    if (result?.error) {
      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      router.refresh()
      toast({
        title: `You've successfully updated your address`,
        variant: 'success',
      })
      hideModal()
    }
  }

  return (
    <Modal
      title={t('edit_address_title')}
      desc={t('edit_address_desc')}
      isOpen={isOpen}
      onClose={hideModal}
      className='sm:max-w-4xl items-center p-0'
      openAutoFocus={false}
    >
      <AddressForm
        type='edit'
        address={addressData}
        defaultAddressId={defaultAddressId}
        onSubmitForm={handleEditAddress}
      />
    </Modal>
  )
}

export default EditAddressModal
