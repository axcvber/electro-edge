'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { ModalTypeEnum } from '@/providers/modal-provider'
import useModalStore from '@/store/use-modal-store'
import { Plus } from 'lucide-react'
import React from 'react'

interface IAddAddressButton {
  size?: ButtonProps['size']
  label: string
}

const AddAddressButton: React.FC<IAddAddressButton> = ({ size, label }) => {
  const showModal = useModalStore((s) => s.showModal)

  const showAddAddressModal = () => {
    showModal(ModalTypeEnum.ADD_ADDRESS)
  }

  return (
    <Button size={size} onClick={showAddAddressModal}>
      <Plus />
      {label}
    </Button>
  )
}

export default AddAddressButton
