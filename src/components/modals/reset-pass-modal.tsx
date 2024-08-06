import React from 'react'
import { Modal } from '../ui/modal'
import useModalStore from '@/store/use-modal-store'
import { ModalTypeEnum } from '@/providers/modal-provider'
import ResetPasswordForm from '../forms/reset-password-form'

const ResetPassModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const showModal = useModalStore((s) => s.showModal)
  const hideModal = useModalStore((s) => s.hideModal)

  const showLoginModal = () => {
    showModal(ModalTypeEnum.LOGIN)
  }

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-md items-center'>
      <ResetPasswordForm signInCallback={showLoginModal} />
    </Modal>
  )
}

export default ResetPassModal
