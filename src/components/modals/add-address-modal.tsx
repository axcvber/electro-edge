import useModalStore from '@/store/use-modal-store'
import React from 'react'
import { Modal } from '../ui/modal'
import AddressForm from '../forms/address-form'
import { AddressSchemaType } from '@/validation'
import { addUserAddress } from '@/actions/address/add-user-address'
import { useToast } from '../../hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const AddAddressModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const hideModal = useModalStore((s) => s.hideModal)
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('address')

  const handleCreateAddress = async (data: AddressSchemaType) => {
    const result = await addUserAddress(data)
    if (result?.error) {
      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      router.refresh()
      toast({
        title: `You've successfully added your address`,
        variant: 'success',
      })
      hideModal()
    }
  }

  return (
    <Modal
      title={t('add_address_title')}
      desc={t('add_address_desc')}
      isOpen={isOpen}
      onClose={hideModal}
      className='sm:max-w-4xl items-center p-0'
    >
      <AddressForm onSubmitForm={handleCreateAddress} />
    </Modal>
  )
}

export default AddAddressModal
