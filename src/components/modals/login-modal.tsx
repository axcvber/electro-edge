import React from 'react'
import { Modal } from '../ui/modal'
import useModalStore from '@/store/use-modal-store'
import LoginForm from '../forms/login-form'
import { ModalTypeEnum } from '@/providers/modal-provider'

const LoginModal = () => {
  const isOpen = useModalStore((s) => s.isOpen)
  const showModal = useModalStore((s) => s.showModal)
  const hideModal = useModalStore((s) => s.hideModal)

  const showRegisterModal = () => {
    showModal(ModalTypeEnum.REGISTER)
  }

  const showResetPassModal = () => {
    showModal(ModalTypeEnum.RESET_PASS)
  }

  return (
    <Modal isOpen={isOpen} onClose={hideModal} className='sm:max-w-md items-center'>
      <LoginForm signUpCallback={showRegisterModal} resetPassCallback={showResetPassModal} />
    </Modal>
  )
}

export default LoginModal
