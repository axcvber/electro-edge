import React from 'react'
import { Modal } from '../ui/modal'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import RegisterForm from '../forms/register-form'

const RegisterModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const showModal = useModalStore((s) => s.showModal)
  const hideModal = useModalStore((s) => s.hideModal)

  const showLoginModal = () => {
    showModal(ModalTypeEnum.LOGIN)
  }

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-md items-center'>
      <RegisterForm signInCallback={showLoginModal} />
    </Modal>
  )
}

export default RegisterModal
