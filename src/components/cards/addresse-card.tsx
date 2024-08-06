'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import { deleteUserAddress } from '@/actions/address/delete-user-address'
import { useToast } from '../../hooks/use-toast'
import { useRouter } from 'next/navigation'
import { AddressFragment } from '@/gql/storefront/graphql'
import { useTranslations } from 'next-intl'

interface IAddressCard {
  title: string
  data: AddressFragment
  defaultAddressId: string
}

const AddressCard: React.FC<IAddressCard> = ({ title, data, defaultAddressId }) => {
  const showModal = useModalStore((s) => s.showModal)
  const t = useTranslations('buttons')
  const { toast } = useToast()
  const router = useRouter()

  const showEditAddressModal = () => {
    showModal(ModalTypeEnum.EDIT_ADDRESS, { addressData: data, defaultAddressId })
  }

  const handleDeleteAddress = async () => {
    const result = await deleteUserAddress(data.id)
    if (result?.error) {
      toast({
        title: result.error,
        variant: 'destructive',
      })
    } else {
      router.refresh()
      toast({
        title: 'Your address was successfully deleted',
        variant: 'success',
      })
    }
  }

  const showConfirmModal = () => {
    showModal(ModalTypeEnum.CONFIRMATION, {
      title: 'Are you absolutely sure?',
      description: 'This action cannot be undone. This will permanently delete your address.',
      onConfirm: handleDeleteAddress,
    })
  }

  return (
    <div className='p-6 border rounded-md flex items-start justify-between gap-5'>
      <div className='space-y-1'>
        <h6>{title}</h6>
        <div className='text-neutral-500 text-sm leading-6'>
          <p>{data.name}</p>
          {data?.formatted ? data.formatted.map((line, inx) => <p key={line + inx}>{line}</p>) : <></>}
          <p>{data.phone}</p>
        </div>
      </div>

      <div className='flex justify-end flex-wrap gap-2'>
        <Button size={'sm'} variant={'outline'} onClick={showEditAddressModal}>
          <Pencil />
          {t('edit')}
        </Button>

        <Button size={'sm'} variant={'destructive'} onClick={showConfirmModal}>
          <Trash2 />
          {t('delete')}
        </Button>
      </div>
    </div>
  )
}

export default AddressCard
